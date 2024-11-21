const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

async function fetchBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Resolves the books data after simulating an async delay
    }, 1000); // Simulate a 2-second delay
  });
}


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(400).json({ message: "User already exists!" });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
    return res.status(200).json(booksFromAPI); // Return books as a response
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let { isbn } = req.params;
  const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
  // let choosenBook = books[isbn];
  return res.status(201).json(booksFromAPI[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let { author } = req.params;
  const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
  let choosenBook;
  Object.values(booksFromAPI).filter(book => {
    if (book.author.includes(author)) {
      choosenBook = book;
    }
  });
  return res.status(201).json(choosenBook);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title.toLowerCase();
  const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
  const matchedBooks = Object.values(booksFromAPI).filter(book =>
    book.title.toLowerCase().includes(title)
  );
  if (matchedBooks.length === 0) {
    return res.status(404).json({ message: `No books found matching the title: "${req.params.title}"` });
  } 
  return res.status(201).json(matchedBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let { isbn } = req.params;
  let choosenBookReviews;
  for (const [key, value] of Object.entries(books)) {
    if (key === isbn) {
      choosenBookReviews = value.reviews;
    }
  }
  return res.status(201).json(choosenBookReviews);
});

module.exports.general = public_users;
