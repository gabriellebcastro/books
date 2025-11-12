import asyncHandler from 'express-async-handler';
import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

// @desc    Search for books in the global catalog
// @route   GET /api/books/search
// @access  Private
const searchBooks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
          { isbn: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  // Procura no catálogo global, sem filtrar por usuário
  const books = await Book.find({ ...keyword });
  res.json(books);
});

// @desc    Add a new book to the global catalog
// @route   POST /api/books
// @access  Private
const addBookToCatalog = asyncHandler(async (req, res) => {
  const { title, author, isbn, genre, pages, cover } = req.body;

  const bookExists = await Book.findOne({ isbn });

  if (bookExists) {
    res.status(400);
    throw new Error('Um livro com este ISBN já existe no catálogo.');
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    genre,
    pages,
    cover,
    // O livro no catálogo não pertence a um usuário específico
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Dados inválidos para o livro.');
  }
});

// @desc    Get user's books (from their personal library)
// @route   GET /api/users/mybooks
// @access  Private
const getUserBooks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('books');

  if (user) {
    res.json(user.books);
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Add a book to the user's library
// @route   POST /api/users/mybooks
// @access  Private
const addBookToUserLibrary = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const user = await User.findById(req.user._id);
  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error('Livro não encontrado no catálogo.');
    return;
  }

  if (user) {
    const alreadyAdded = user.books.find(
      (b) => b.toString() === bookId
    );

    if (alreadyAdded) {
      res.status(400);
      throw new Error('Este livro já está na sua estante.');
    }

    user.books.push(bookId);
    await user.save();
    res.status(201).json({ message: 'Livro adicionado à sua estante.' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Remove a book from the user's library
// @route   DELETE /api/users/mybooks/:id
// @access  Private
const removeBookFromUserLibrary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.books = user.books.filter(
      (bookId) => bookId.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Livro removido da sua estante.' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});


export {
  searchBooks,
  addBookToCatalog,
  getUserBooks,
  addBookToUserLibrary,
  removeBookFromUserLibrary,
};