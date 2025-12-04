import { useState, useEffect } from 'react';
import axios from 'axios';
import './MinhaBiblioteca.css'; // Reutilizando o CSS da biblioteca para consistência

type Book = {
  _id: string;
  title: string;
  author: string;
  cover: string;
  synopsis: string;
};

type UserBook = {
  book: { _id: string };
};

export function ExplorarPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [myBookIds, setMyBookIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
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
      <main className="biblioteca-main-content">
        <div className="biblioteca-hero">
          <h1>Explorar Livros</h1>
          <p className="subheading">Navegue por todo o nosso catálogo de livros.</p>
        </div>

        <div className="books-grid">
          {allBooks.map(book => (
            <div key={book._id} className="book-card">
              <img src={book.cover} alt={book.title} />
              <div className="book-card-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
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
      </main>
    </div>
  );

  function isBookInLibrary(bookId: string) {
    return myBookIds.has(bookId);
  }
}