const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.filter((user) => {
    return user.username === username ;
  }).length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  console.log("authenticatedUser users: ",users);
  let isExist = false;
  for (let key in users) {
    if (users[key].username === username && users[key].password === password  ) {
      isExist = true;
      break;
    }
  }
  return isExist;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log("login: ",username, password);
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  let data = books[isbn];
  console.log(data)
  if(data && data.reviews){
    
      data.reviews[username] = review;
      books[isbn] = data;
      return res.status(200).json({ message: `book of ${isbn} update review successfully` });
  } else {
    return res.status(300).json({ message: `no book of ${isbn}` });
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  let data = books[isbn];
  console.log("b4: ",data)
  if(data && data.reviews){
      delete data.reviews[username];
      console.log("after: ",data)
      books[isbn] = data;
      return res.status(200).json({ message: `book of ${isbn} delete review successfully` });
  } else {
    return res.status(300).json({ message: `no book of ${isbn}` });
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;