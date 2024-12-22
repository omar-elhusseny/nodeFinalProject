const jwt = require('jsonwebtoken');
let books = require("../booksdb");

const isValid = require("../utils/helperFunctions").isValid;
const users = require("../utils/helperFunctions").users;
const authenticatedUser = require("../utils/helperFunctions").authenticatedUser;

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username: username }, 'accessBookStoreProject', { expiresIn: "1h" });

        req.session.authorization = { "accessToken": accessToken };
        req.session.username = username;

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
}

const register = (req, res) => {
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
}

const addBookReview = (req, res) => {
    let { isbn } = req.params;
    let { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    if (!review || review.trim() === "") {
        return res.status(400).send("Review content is required.");
    }

    if (books[isbn].reviews[req.session.username]) {
        // Modify the existing review if the user has already posted one
        books[isbn].reviews[req.session.username] = review;
        return res.status(200).send("Your review has been updated.");

    } else {
        // Add a new review if it's the user's first time reviewing this book
        books[isbn].reviews[req.session.username] = review;
        return res.status(201).send("Your review has been posted.");
    }
}

const deleteBookReview = (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session;

    // Ensure the user is logged in
    if (!username) {
        return res.status(401).send("You need to be logged in to delete a review.");
    }

    // Find the book based on ISBN
    const book = books[isbn];

    if (!book) {
        return res.status(404).send("Book not found.");
    }

    // Check if the user has reviewed the book
    if (!book.reviews[username]) {
        return res.status(404).send("You have not reviewed this book.");
    }

    // Delete the review from the book's reviews
    delete book.reviews[username];

    res.status(200).send(`Review for '${book.title}' by ${book.author} has been deleted.`);
}

module.exports = { login, register, addBookReview, deleteBookReview };