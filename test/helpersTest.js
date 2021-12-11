const { assert } = require("chai");

const { urlsForUser, userLookup } = require("../helpers.js");

// urlDatabase
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ481W",
  },
  i3BoGd: {
    longURL: "https://www.tsn.com",
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
// For urlsForUser
describe("urlsForUser", function () {
  it("should return the url entries that match a users id", () => {
    const user = urlsForUser(urlDatabase, "aJ481W");
    const expectedUserID = {
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ481W",
      },
    };
    assert.deepEqual(user, expectedUserID);
  });
  it("should return {} if no URLs match the ID", () => {
    const user = urlsForUser(urlDatabase, "aJ423W");
    const expectedUserID = {};
    assert.deepEqual(user, expectedUserID);
  });
});
// For userLookuo
describe("userLookup", function () {
  it("should return true if the user exists in the users object", () => {
    const user = userLookup(users, "id", "user2RandomID");
    const expectedUserID = true;
    assert.deepEqual(user, expectedUserID);
  });
  it("should return false if the user does not exists in the users object", () => {
    const user = userLookup(users, "id", "user5RandomID");
    const expectedUserID = false;
    assert.deepEqual(user, expectedUserID);
  });
});
