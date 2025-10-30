import asyncHandler from 'express-async-handler';
import Book from '../models/bookModel.js';

// @desc    Fetch all books
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user._id });
  res.json(books);
});

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book && book.user.toString() === req.user._id.toString()) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, genre, pages, cover } = req.body;

  const book = new Book({
    title,
    author,
    isbn,
    genre,
    pages,
    cover,
    user: req.user._id,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, genre, pages, cover } = req.body;

  const book = await Book.findById(req.params.id);

  if (book && book.user.toString() === req.user._id.toString()) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.genre = genre || book.genre;
    book.pages = pages || book.pages;
    book.cover = cover || book.cover;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book && book.user.toString() === req.user._id.toString()) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

export { getBooks, getBookById, createBook, updateBook, deleteBook };