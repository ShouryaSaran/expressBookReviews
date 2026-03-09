const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username , password} = req.body;

if(username && password) {

  if(!isValid(username)){
    users.push({
      username: username,
      password: password
    });

    return res.status(200).json({message:"User registered successfully"})
  }

  else {
    return res.status(201).json({
      message: "User already exists!"
    });
  }
}

  return res.status(204).json({message: "Username or password not provided"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,3));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).send(JSON.stringify(books[isbn] , null , 3));
  }
  else {
    return res.status(404).send({message: "book not found"});
  }
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.values(books).filter(
    book => book.author === author
  );

  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 3));
  } else {
    return res.status(404).send({ message: "Book Not Found" });
  }

});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.values(books).filter(
    (book) => book.title === title
  );

  if(filteredBooks.length > 0){
    return res.status(200).send(JSON.stringify(filteredBooks,null,3))
  }
  else{
    return res.status(404).send({message: "Book not found"})
  }
  
});


// Get book review
public_users.get('/review/:isbn',function (req, res) {
const isbn = req.params.isbn;

  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 3));
});


public_users.get('/async/books', async (req,res) => {

  try {

    const response = await axios.get("http://localhost:5000/");

    return res.status(200).json(response.data);

  }
  catch(error){

    return res.status(500).json({
      message:"Error fetching books"
    });

  }

});





public_users.get('/async/isbn/:isbn', async (req,res) => {

  const isbn = req.params.isbn;

  try{

    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    return res.status(200).json(response.data);

  }
  catch(error){

    return res.status(404).json({
      message:"Book not found"
    });

  }

});





public_users.get('/async/author/:author', async (req,res) => {

  const author = req.params.author;

  try{

    const response = await axios.get(`http://localhost:5000/author/${author}`);

    return res.status(200).json(response.data);

  }
  catch(error){

    return res.status(404).json({
      message:"Books not found"
    });

  }

});



public_users.get('/async/title/:title', async (req,res) => {

  const title = req.params.title;

  try{

    const response = await axios.get(`http://localhost:5000/title/${title}`);

    return res.status(200).json(response.data);

  }
  catch(error){

    return res.status(404).json({
      message:"Book not found"
    });

  }

});


module.exports.general = public_users;