const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "user_id",
    keys: ["key1", "key2"],
  })
);

const bcrypt = require("bcryptjs");

// urlID and user info lookup
const { urlsForUser, userLookup } = require("./helpers.js");

// Random ID Generator
const  generateRandomString = function() {
  let result = "";
  let length = 6;
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

// Returns object that matches a check
const userLookupObj = function(objectOne, info, check) {
  for (const objectTwo in objectOne) {
    if (objectOne[objectTwo][info] === check) {
      return objectOne[objectTwo];
    }
  }
  return false;
};

// URL Database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
// usersDatabase
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
// Random user ID

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// * POST requests *
// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]["userID"] === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls/"); // Redirect client to URLS page
    return;
  } else {
    res.status(403).send("Only the owner of this URL can delete this URL.");
  }
});

// Change URL
app.post("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]["userID"] === req.session.user_id) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    res.redirect("/urls/"); // Redirect client to URLS page
    return;
  } else {
    res.status(403).send("Only the owner of this URL can edit this URL.");
  }
});

// Add new URL key:value pair
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${shortURL}`);
});

// Set cookie from login form
app.post("/login", (req, res) => {
  const newObj = userLookupObj(users, "email", req.body.email);
  if (!newObj) {
    return res.status(403).send("A user with that email can not be found");
  }
  const hash = bcrypt.compareSync(req.body.password, newObj["password"]);
  if (hash) {
    req.session.user_id = newObj["id"];
    res.redirect("/urls");
    return;
  }
  res.status(403).send("Entered email and password do not match");
});

// Clear user_id cookie
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

// Registration page post request
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("Please enter a valid email and password");
  }
  if (userLookup(users, "email", req.body.email)) {
    return res.status(400).send("A user with this email already exists");
  }
  if (!userLookup(users, "email", req.body.email)) {
    const userID = `user${generateRandomString()}ID`;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: hashedPassword,
    };
    req.session.user_id = userID;
    res.redirect("/urls");
  }
});

// * GET requests *

// Long URL redirect
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// URLS pages
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    userIDY: urlDatabase[req.params.shortURL]["userID"],
    userOne: req.session.user_id,
    user: users[req.session.user_id],
  };
  res.render("urls_show", templateVars);
});

// Registration page get request
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id],
  };
  res.render("urls_register", templateVars);
});

// Login page get requests
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id],
  };
  res.render("urls_login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
