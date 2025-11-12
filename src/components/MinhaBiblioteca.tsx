import { useState, useEffect, useCallback } from "react";
import "./MinhaBiblioteca.css";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import axios from 'axios';

// Tipo 'Book' atualizado para corresponder ao modelo do backend
type Book = {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  pages: number;
  cover: string;
};

export function MinhaBibliotecaPage() {
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Busca os livros do usuário ao carregar o componente
  const fetchMyBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/users/mybooks', config);
      setMyBooks(data);
    } catch (err) {
      setError("Não foi possível carregar seus livros. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyBooks();
  }, [navigate, token, fetchMyBooks]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { keyword: searchQuery },
      };
      const { data } = await axios.get('http://localhost:5000/api/books/search', config);
      setSearchResults(data);
    } catch (err) {
      setError("Erro ao buscar livros.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:5000/api/users/mybooks', { bookId }, config);
      alert('Livro adicionado à sua estante!');
      // Atualiza a lista de livros e limpa a busca
      fetchMyBooks();
      setSearchResults([]);
      setSearchQuery("");
      if (selectedBook) handleCloseModal();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(`Erro ao adicionar livro: ${err.response.data.message || 'Tente novamente.'}`);
      } else {
        alert('Erro ao adicionar livro. Tente novamente.');
      }
      console.error(err);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    if (!window.confirm("Tem certeza que deseja remover este livro da sua estante?")) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/users/mybooks/${bookId}`, config);
      setMyBooks(myBooks.filter(book => book._id !== bookId));
      alert('Livro removido da sua estante.');
      if (selectedBook && selectedBook._id === bookId) {
        handleCloseModal();
      }
    } catch (err) {
      alert("Erro ao remover livro. Tente novamente.");
      console.error(err);
    }
  };

  const handleOpenModal = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const isBookInLibrary = (bookId: string) => {
    return myBooks.some(book => book._id === bookId);
  }

  return (
    <>
      <Navbar />
      <div className="clubes-hero">
        <h1>Minha biblioteca</h1>
        <p className="subheading">
          Pesquise livros no catálogo ou visualize sua biblioteca.
        </p>
      </div>

      <div className="clubes-page">
        <div className="filtros-container">
          <div className="filtros">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Pesquise por título, autor ou ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-icon" onClick={handleSearch}>🔍</button>
            </div>
          </div>
          <button className="btn-add-livro" onClick={() => navigate('/cadastrar-livro')}>+ Cadastrar Novo Livro</button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p>Carregando...</p>}

        {/* Resultados da Busca */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Resultados da Busca</h2>
            <div className="livros-grid">
              {searchResults.map((book) => (
                <div className="livro-card-container" key={book._id}>
                  <div
                    className="livro-card"
                    onClick={() => handleOpenModal(book)}
                  >
                    <img src={book.cover} alt={`Capa do livro ${book.title}`} />
                  </div>
                  {!isBookInLibrary(book._id) ? (
                    <button className="btn-add-to-library" onClick={() => handleAddBook(book._id)}>
                      Adicionar à Estante
                    </button>
                  ) : (
                    <p className="in-library-text">Na sua estante</p>
                  )}
                </div>
              ))}
            </div>
            <hr />
          </div>
        )}

        {/* Estante do Usuário */}
        <h2>Minha Estante</h2>
        {myBooks.length === 0 && !loading && (
          <p>Sua estante está vazia. Busque um livro e adicione-o!</p>
        )}
        <div className="livros-grid">
          {myBooks.map((book) => (
            <div
              className="livro-card"
              key={book._id}
              onClick={() => handleOpenModal(book)}
            >
              <img src={book.cover} alt={`Capa do livro ${book.title}`} />
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-body">
              <img className="modal-capa" src={selectedBook.cover} alt={`Capa de ${selectedBook.title}`} />
              <div className="modal-details">
                <h2>{selectedBook.title}</h2>
                <h3>por {selectedBook.author}</h3>
                <p><strong>Gênero:</strong> {selectedBook.genre}</p>
                <p><strong>Páginas:</strong> {selectedBook.pages}</p>
                <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                {isBookInLibrary(selectedBook._id) ? (
                   <button className="btn-remove-from-library" onClick={() => handleRemoveBook(selectedBook._id)}>
                     Remover da Estante
                   </button>
                ) : (
                   <button className="btn-add-to-library-modal" onClick={() => handleAddBook(selectedBook._id)}>
                     Adicionar à Estante
                   </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}