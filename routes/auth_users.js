const express = require('express');
const router = express.Router();
const authController = require("../controller/auth_users.controller");
const isAuth = require("../middleware/isAuth");

// only registered users can login
router.post("/login", authController.login);

// sign up new users
router.post("/register", authController.register);

// Add a book review
router.put("/auth/review/:isbn", isAuth, authController.addBookReview);

// Delete a book review
router.delete("/auth/review/:isbn", isAuth, authController.deleteBookReview);

module.exports = router;