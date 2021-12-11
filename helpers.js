// urlID lookup
const urlsForUser = function(database, userid) {
  const newObj = {};
  for (let id in database) {
    if (database[id]["userID"] === userid) {
      newObj[id] = database[id];
    }
  }
  return newObj;
};

// user info lookup
const userLookup = function(objectOne, info, check) {
  for (const objectTwo in objectOne) {
    if (objectOne[objectTwo][info] === check) {
      return true;
    }
  }
  return false;
};

module.exports = { urlsForUser, userLookup };
