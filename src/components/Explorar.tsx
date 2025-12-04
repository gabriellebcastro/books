import { useState, useEffect } from 'react';
import axios from 'axios';
import './MinhaBiblioteca.css'; // Reutilizando o CSS da biblioteca para consistência

type Book = {
  _id: string;
  title: string;
  author: string;
  cover: string;
  synopsis: string;
  pages?: number;
  genre?: string;
  averageRating?: number;
};

type UserBook = {
  book: { _id: string };
};

export function ExplorarPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [myBookIds, setMyBookIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const { data } = await axios.get<Book[]>('http://localhost:5000/api/books');
        setAllBooks(data);
      } catch (err) {
        setError('Não foi possível carregar o catálogo de livros.');
        console.error(err);
      }
    };

    const fetchMyBooks = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get<UserBook[]>('http://localhost:5000/api/users/mybooks', config);
        setMyBookIds(new Set(data.map(ub => ub.book._id)));
      } catch (err) {
        console.error("Não foi possível carregar a sua biblioteca pessoal.", err);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAllBooks(), fetchMyBooks()]);
      setLoading(false);
    };

    loadData();
  }, [token]);

  const handleAddBook = async (bookId: string) => {
    if (!token) {
      alert('Você precisa estar logado para adicionar um livro.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/users/mybooks', { bookId }, config);
      alert('Livro adicionado à sua estante!');
      setMyBookIds(prev => new Set(prev).add(bookId));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(`Erro: ${err.response.data.message || 'Tente novamente.'}`);
      } else {
        alert('Erro ao adicionar livro.');
      }
    }
  };

  if (loading) return <div className="biblioteca-main-content"><p>Carregando catálogo...</p></div>;
  if (error) return <div className="biblioteca-main-content"><p className="error-message">{error}</p></div>;

  return (
    <div className="biblioteca-container">
      <main className="main-content">
        <header className="clubes-header">
          <h1>Explorar Livros</h1>
          <p>Navegue por todo o nosso catálogo de livros.</p>
        </header>

        <div className="books-grid">
          {allBooks.map(book => (
            <div key={book._id} className="book-card">
              <img src={book.cover} alt={book.title} onClick={() => setSelectedBook(book)} />
              <div className="book-card-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                {book.averageRating !== undefined && (
                  <div className="book-average-rating">
                    ★ {book.averageRating.toFixed(1)}
                  </div>
                )}
                {token && (
                  isBookInLibrary(book._id) ? (
                    <button className="btn-action" disabled>Na sua estante</button>
                  ) : (
                    <button className="btn-action" onClick={() => handleAddBook(book._id)}>+ Adicionar</button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedBook && (
          <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedBook(null)}>&times;</button>
              
              <div className="modal-body-redesigned">
                <div className="modal-left-column">
                  <img src={selectedBook.cover} alt={selectedBook.title} className="modal-book-cover-redesigned" />
                </div>

                <div className="modal-right-column">
                  <div className="modal-book-header">
                    <h2>{selectedBook.title}</h2>
                    <h3>por {selectedBook.author}</h3>
                  </div>

                  {selectedBook.averageRating !== undefined && (
                    <div className="community-rating-section">
                      <div className="rating-stars-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= (selectedBook.averageRating || 0) ? 'filled' : ''}`}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">{selectedBook.averageRating.toFixed(1)} de 5 (Nota da comunidade)</span>
                    </div>
                  )}

                  <div className="modal-book-info">
                    {selectedBook.genre && <p><strong>Gênero:</strong> {selectedBook.genre}</p>}
                    {selectedBook.pages && <p><strong>Páginas:</strong> {selectedBook.pages}</p>}
                  </div>

                  <div className="modal-book-synopsis-redesigned">
                    <h4>Sinopse</h4>
                    <p>{selectedBook.synopsis}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  function isBookInLibrary(bookId: string) {
    return myBookIds.has(bookId);
  }
}