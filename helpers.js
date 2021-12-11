/* This also means that the /urls page will need to filter the entire
list in the urlDatabase by comparing the userID with the logged-in user's ID.
This filtering process should happen before the data is sent to the template for rendering. 

Create a function named urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user.
*/

// urlID lookup
function urlsForUser(database, userid) {
  newObj = {};
  for (let id in database) {
    if (database[id]["userID"] === userid) {
      newObj[id] = (database[id]);
    }
  } return newObj;
};

// user info lookup
function userLookup (objectOne, info, check) {
  for (const objectTwo in objectOne) { 
      if (objectOne[objectTwo][info] === check) {
        return true;
    }  
  } return false;
};


module.exports = { urlsForUser, userLookup }