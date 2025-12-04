import Statistics from '../models/statisticsModel.js';
import User from '../models/userModel.js';
import Book from '../models/bookModel.js';

/**
 * Recalcula e atualiza as estatísticas de um usuário com base em sua estante.
 * @param {string} userId - O ID do usuário.
 */
export const recalculateUserStats = async (userId) => {
  try {
    const user = await User.findById(userId).populate('books.book');

    if (!user) {
      console.log(`Usuário ${userId} não encontrado para cálculo de estatísticas.`);
      return;
    }

    const livrosLidos = user.books.filter(b => b.status === 'lido' && b.book);

    const totalLivrosLidos = livrosLidos.length;
    const totalPaginasLidas = livrosLidos.reduce((sum, userBook) => sum + (userBook.book.pages || 0), 0);

    const generosLidos = new Map();
    livrosLidos.forEach(userBook => {
      const genre = userBook.book.genre || 'Desconhecido';
      generosLidos.set(genre, (generosLidos.get(genre) || 0) + 1);
    });

    // Converte o Map para um objeto para salvar no MongoDB
    const generosLidosObj = Object.fromEntries(generosLidos);

    // Atualiza ou cria o documento de estatísticas
    await Statistics.findOneAndUpdate(
      { user: userId },
      {
        totalLivrosLidos,
        totalPaginasLidas,
        generosLidos: generosLidosObj,
      },
      {
        upsert: true, // Cria o documento se ele não existir
        new: true,    // Retorna o documento atualizado
      }
    );

  } catch (error) {
    console.error(`Erro ao recalcular estatísticas para o usuário ${userId}:`, error);
  }
};

/**
 * Recalcula a nota média de um livro.
 * @param {string} bookId - O ID do livro.
 */
export const recalculateBookAverageRating = async (bookId) => {
  try {
    // Encontra todos os usuários que avaliaram este livro (nota > 0)
    const usersWhoRated = await User.find({ 'books.book': bookId, 'books.rating': { $gt: 0 } });

    if (usersWhoRated.length === 0) {
      // Se ninguém avaliou, reseta a nota do livro
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        ratingCount: 0,
      });
      return;
    }

    let totalRating = 0;
    let ratingCount = 0;

    usersWhoRated.forEach(user => {
      const userBook = user.books.find(b => b.book.toString() === bookId);
      if (userBook && userBook.rating > 0) {
        totalRating += userBook.rating;
        ratingCount++;
      }
    });

    const averageRating = totalRating / ratingCount;

    await Book.findByIdAndUpdate(bookId, {
      averageRating: averageRating.toFixed(1), // Salva com uma casa decimal
      ratingCount: ratingCount,
    });
  } catch (error) {
    console.error(`Erro ao recalcular a nota média para o livro ${bookId}:`, error);
  }
};