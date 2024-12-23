const fetchBooks = require("../utils/helperFunctions").fetchBooks;
const books = require("../booksdb");

// Get all books at once
const getBooks = async (req, res) => {
    try {
        const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
        return res.status(200).json(booksFromAPI); // Return books as a response
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch books' });
    }
}

// Get only book by id
const getBookById = async function (req, res) {
    let { isbn } = req.params;
    const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
    // let choosenBook = books[isbn];
    return res.status(201).json(booksFromAPI[isbn]);
}


// Get only book by author name
const getBookByAuthor = async function (req, res) {
    let { author } = req.params;
    const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
    const chosenBooks = Object.values(booksFromAPI).filter(book => 
        book.author && book.author.includes(author)
    );
    return res.status(201).json(chosenBooks);
}

// Get only book by it's title
const getBookByTitle = async function (req, res) {
    let title = req.params.title.toLowerCase();
    const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
    const matchedBooks = Object.values(booksFromAPI).filter(book =>
        book.title && book.title.toLowerCase().includes(title)
    );
    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: `No books found matching the title: "${req.params.title}"` });
    }
    return res.status(201).json(matchedBooks);
}

// Get book review by book id
const getBookReview = function (req, res) {
    const { isbn } = req.params;
    // Validate if the book exists in the object
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
    // Extract reviews or return an empty array if reviews are undefined
    const chosenBookReviews = book.reviews || [];
    return res.status(200).json(chosenBookReviews);
};



module.exports = { getBooks, getBookById, getBookByAuthor, getBookByTitle, getBookReview }