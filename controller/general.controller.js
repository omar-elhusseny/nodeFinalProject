const fetchBooks = require("../utils/helperFunctions").fetchBooks;

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
    let choosenBook;
    Object.values(booksFromAPI).filter(book => {
        if (book.author.includes(author)) {
            choosenBook = book;
        }
    });
    return res.status(201).json(choosenBook);
}

// Get only book by it's title
const getBookByTitle = async function (req, res) {
    let title = req.params.title.toLowerCase();
    const booksFromAPI = await fetchBooks(); // Fetch books asynchronously
    const matchedBooks = Object.values(booksFromAPI).filter(book =>
        book.title.toLowerCase().includes(title)
    );
    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: `No books found matching the title: "${req.params.title}"` });
    }
    return res.status(201).json(matchedBooks);
}

// Get book review by book id
const getBookReview = function (req, res) {
    let { isbn } = req.params;
    let choosenBookReviews;
    for (const [key, value] of Object.entries(books)) {
        if (key === isbn) {
            choosenBookReviews = value.reviews;
        }
    }
    return res.status(201).json(choosenBookReviews);
}


module.exports = { getBooks, getBookById, getBookByAuthor, getBookByTitle, getBookReview }