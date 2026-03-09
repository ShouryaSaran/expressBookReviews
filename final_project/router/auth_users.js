const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

let validUsers = users.filter((user)=>{
  return user.username === username;
});

if(validUsers.length > 0){
  return true;
}
else{
  return false;
}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let validUsers = users.filter((user)=>{
  return user.username === username && user.password === password;
});

if(validUsers.length > 0){
  return true;
}
else{
  return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username , password} = req.body


  if(!username || !password){
    return res.status(204).send({message:"Username or paassword invalid"})
  }

  let authenticatedUser = users.filter(user => {
    return user.username === username && user.password === password;
  });

  if(authenticatedUser.length > 0) {
    let accessToken = jwt.sign({
      username: username
    }, "access",{expiresIn: 60 * 60})
    
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send({message: "User successfully logged in"});
  }
  else {
    return res.status(200).json({message: "Invalid login credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/updated successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if(books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  }

  return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;