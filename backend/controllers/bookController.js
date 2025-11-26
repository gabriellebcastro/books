import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

// Função auxiliar para migrar os dados de livros do usuário para o novo formato
const ensureNewBookFormat = async (user) => {
  // A verificação robusta: se a matriz de livros não estiver vazia e o primeiro elemento não tiver a propriedade 'book',
  // assumimos que está no formato antigo (array de ObjectIds) e precisa de migração.
  if (user && user.books && user.books.length > 0 && user.books[0] && user.books[0].book === undefined) {
    try {
      // Filtra apenas os ObjectIds válidos para evitar erros durante a migração
      const validBookIds = user.books.filter(id => id && mongoose.Types.ObjectId.isValid(id));
      
      user.books = validBookIds.map(bookId => ({
        book: bookId,
        status: 'quero ler',
        favorite: false,
        rating: 0,
      }));
      
      await user.save();
    } catch (error) {
      console.error('Falha ao migrar os livros do usuário:', error);
      // Lança um erro para que o asyncHandler possa capturá-lo e enviar uma resposta 500.
      throw new Error('Falha ao atualizar o formato dos dados da sua biblioteca. Por favor, tente novamente.');
    }
  }
};

// @desc    Fetch all books or search by keyword
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const books = await Book.find({ ...keyword });
  res.json(books);
});

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Livro não encontrado');
  }
});


// @desc    Add a new book to the global catalog
// @route   POST /api/books/catalog
// @access  Private
const addBookToCatalog = asyncHandler(async (req, res) => {
  const { title, author, isbn, genre, pages, cover, synopsis } = req.body;

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
    synopsis,
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
  let user = await User.findById(req.user._id);

  if (user) {
    await ensureNewBookFormat(user);

    const populatedUser = await User.findById(req.user._id).populate('books.book');
    
    if (populatedUser) {
      // Filtra quaisquer entradas onde a referência do livro seja nula (por exemplo, livro excluído)
      const validBooks = populatedUser.books.filter(b => b && b.book);
      res.json(validBooks);
    } else {
      res.status(404);
      throw new Error('Usuário não encontrado após a atualização.');
    }
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
    await ensureNewBookFormat(user);

    const alreadyAdded = user.books.find(
      (b) => b.book && b.book.toString() === bookId
    );

    if (alreadyAdded) {
      res.status(400);
      throw new Error('Este livro já está na sua estante.');
      return;
    }

    user.books.push({ book: bookId });
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
    await ensureNewBookFormat(user);

    user.books = user.books.filter(
      (b) => b.book && b.book.toString() !== req.params.id
    );

    await user.save();
    res.json({ message: 'Livro removido da sua estante.' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Update book status, rating, or favorite in user's library
// @route   PUT /api/users/mybooks/:id
// @access  Private
const updateUserBookDetails = asyncHandler(async (req, res) => {
  const { status, favorite, rating } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    await ensureNewBookFormat(user);

    const bookToUpdate = user.books.find(
      (b) => b.book && b.book.toString() === req.params.id
    );

    if (bookToUpdate) {
      if (status) bookToUpdate.status = status;
      if (rating !== undefined) bookToUpdate.rating = rating;
      if (favorite !== undefined) bookToUpdate.favorite = favorite;

      await user.save();
      
      // Repopula para retornar o objeto completo
      const populatedUser = await User.findById(req.user._id).populate('books.book');
      const updatedBookEntry = populatedUser.books.find(b => b.book && b.book._id.toString() === req.params.id);

      res.json(updatedBookEntry);
    } else {
      res.status(404);
      throw new Error('Livro não encontrado na sua estante.');
    }
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

export {
  getBooks,
  getBookById,
  addBookToCatalog,
  getUserBooks,
  addBookToUserLibrary,
  removeBookFromUserLibrary,
  updateUserBookDetails,
};