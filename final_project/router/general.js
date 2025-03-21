const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;
// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});
function fetchBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = true;
      if (isSuccess) {
        resolve(books);
      } else {
        reject(new Error('Failed to fetch books'));
      }
    }, 1000);
  });
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // res.send(JSON.stringify(books,null,4));
  fetchBooks()
    .then((booksData) => {
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});
function fetchBookDetailByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = true; 
      if (isSuccess) {
        resolve(books[isbn]);  
      } else {
        reject(new Error('Failed to fetch books'));  
      }
    }, 1000);  
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    //res.send(books[isbn]);
    fetchBookDetailByIsbn(isbn)
    .then((booksData) => {
      res.send(JSON.stringify(booksData, null, 4));  // 成功後發送資料
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });  // 發生錯誤時返回錯誤訊息
    });
 });
  
 function fetchBookDetailByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = true; 
      if (isSuccess) {
        let data = {};
        for (let key in books) {
          if (books[key].author.indexOf(author) >= 0 ) {
            data = books[key];
            break;
          }
        }
        resolve(data);  
      } else {
        reject(new Error('Failed to fetch books'));  
      }
    }, 1000);  
  });
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  fetchBookDetailByAuthor(req.params.author).then((booksData) => {
    res.send(JSON.stringify(booksData, null, 4));
  })
  .catch((error) => {
    res.status(500).send({ message: error.message });
  });
});
function fetchBookDetailByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = true; 
      if (isSuccess) {
        let data = {};
        for (let key in books) {
          if (books[key].title.indexOf(title) >= 0 ) {
            data = books[key];
            break;
          }
        }
        resolve(data);  
      } else {
        reject(new Error('Failed to fetch books'));  
      }
    }, 1000);  
  });
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  fetchBookDetailByTitle(req.params.title).then((booksData) => {
    res.send(JSON.stringify(booksData, null, 4)); 
  })
  .catch((error) => {
    res.status(500).send({ message: error.message }); 
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let data = {};
  console.log("req.params.isbn: ",req.params.isbn)
  
  
  return res.send(JSON.stringify(books[req.params.isbn].reviews,null,4)); 
});

module.exports.general = public_users;
