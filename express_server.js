const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Random ID Generator
function generateRandomString() {
  let result = '';
  let length = 6;
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = length; i > 0; --i)
  result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
// user info lookup
function userLookup (objectOne, info, check) {
  for (const objectTwo in objectOne) { 
      if (objectOne[objectTwo][info] === check) {
        return true;
    }  
  } return false;
};
// URL Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// usersDatabase
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
// Random user ID

const userID = `user${generateRandomString()}ID`;

const bodyParser = require("body-parser");
const { escapeXML } = require("ejs");

app.use(bodyParser.urlencoded({extended: true}));

// * POST requests * 
// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls/");         // Redirect client to URLS page
});

// Change URL
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls/");         // Redirect client to URLS page
});

// Add new URL key:value pair
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);         
});

// Set cookie from login form
app.post("/login", (req, res) => {
  if (!userLookup(users, "email", req.body.email)) {
    res.status(403).send("A user with that email can not be found");
  } if (userLookup(users, "email", req.body.email) && !userLookup(users, "password", req.body.password)) {
    res.status(403).send("Entered email and password do not match");
  } if (userLookup(users, "email", req.body.email) && userLookup(users, "password", req.body.password)) {
      res.cookie("user_id", users[userID]["id"])
      res.redirect("/urls")
    console.log(users) // Updated User check
  }
});

// Clear user_id cookie
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls")
});

// Registration page post request
app.post("/register", (req, res) => {
      if (req.body.email === "" || req.body.password === "") {
        return res.status(400).send("Please enter a valid email and password");
     } if (userLookup(users, "email", req.body.email)) {
       return res.status(400).send("A user with this email already exists");
      } else {
    users[userID] = {id: userID,
      email: req.body.email,
      password: req.body.password
      };
      console.log(users)
      res.cookie("user_id", userID)
      res.redirect("/urls")
      }
});

// * GET requests *

// Long URL redirect 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// Homepage 
app.get("/", (req,res) => {
  res.send("hello!")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</></body></html>\n");
});

// URLS pages
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user_id]};
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
  shortURL: req.params.shortURL, 
  longURL: urlDatabase[req.params.shortURL],
  user: users[req.cookies.user_id] };
  res.render("urls_show", templateVars);
});

// Registration page get request
app.get("/register", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_register", templateVars);
});

// Login page get requests
app.get("/login", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});