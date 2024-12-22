const express = require('express');
const router = express.Router();
const generalController = require("../controller/general.controller")

// Get the book list available in the shop
router.get('/', generalController.getBooks);

// Get book details based on ISBN
router.get('/books/:isbn', generalController.getBookById);

// Get book details based on author
router.get('/author/:author', generalController.getBookByAuthor);

// Get all books based on title
router.get('/title/:title', generalController.getBookByTitle);

//  Get book review
router.get('/review/:isbn', generalController.getBookReview);

module.exports = router;
