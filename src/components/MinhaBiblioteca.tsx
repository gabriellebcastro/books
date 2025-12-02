import { useState, useEffect, useCallback } from "react";
import "./MinhaBiblioteca.css";
import "./BookModal.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

type Book = {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  pages: number;
  cover: string;
  synopsis: string;
};

type UserBook = {
  book: Book;
  status: string;
  favorite: boolean;
  rating: number;
  _id: string;
};

export function MinhaBibliotecaPage() {
  const [myBooks, setMyBooks] = useState<UserBook[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("title-asc");
  const [hoverRating, setHoverRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { filter } = useParams<{ filter?: string }>();

  useEffect(() => {
    const filterMap: { [key: string]: string } = {
      'todos': 'all',
      'favoritos': 'favorites',
      'lido': 'lido',
      'lendo': 'lendo',
      'quero-ler': 'quero ler',
    };
    setActiveFilter(filterMap[filter || 'todos'] || 'all');
  }, [filter]);

  const fetchMyBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get<UserBook[]>('http://localhost:5000/api/users/mybooks', config);
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
      const { data } = await axios.get('http://localhost:5000/api/books', config);
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
      setMyBooks(myBooks.filter(userBook => userBook.book._id !== bookId));
      alert('Livro removido da sua estante.');
      if (selectedBook && selectedBook.book._id === bookId) {
        handleCloseModal();
      }
    } catch (err) {
      alert("Erro ao remover livro. Tente novamente.");
      console.error(err);
    }
  };

  const handleUpdateBookDetails = async (bookId: string, details: { status?: string; favorite?: boolean; rating?: number }) => {
    const originalBooks = [...myBooks];
    const updatedBooks = myBooks.map(ub =>
      ub.book._id === bookId ? { ...ub, ...details } : ub
    );
    setMyBooks(updatedBooks);
    setSelectedBook(prev => prev && prev.book._id === bookId ? { ...prev, ...details } : prev);

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:5000/api/users/mybooks/${bookId}`, details, config);
    } catch {
        alert('Falha ao atualizar o livro.');
        setMyBooks(originalBooks); // Revert on error
        setSelectedBook(originalBooks.find(ub => ub.book._id === bookId) || null);
    }
  };

  const handleOpenModal = (userBook: UserBook) => {
    setSelectedBook(userBook);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const isBookInLibrary = (bookId: string) => {
    return myBooks.some(userBook => userBook.book._id === bookId);
  }

  const genres = [...new Set(myBooks.map(userBook => userBook.book.genre))];

  const filteredAndSortedBooks = myBooks
    .filter(userBook => {
      const statusFilterMatch =
        activeFilter === 'all' ? true :
        activeFilter === 'favorites' ? userBook.favorite :
        userBook.status === activeFilter;

      const genreFilterMatch = selectedGenre ? userBook.book.genre === selectedGenre : true;

      return statusFilterMatch && genreFilterMatch;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'title-asc':
          return a.book.title.localeCompare(b.book.title);
        case 'title-desc':
          return b.book.title.localeCompare(a.book.title);
        case 'author-asc':
          return a.book.author.localeCompare(b.book.author);
        case 'author-desc':
          return b.book.author.localeCompare(a.book.author);
        default:
          return 0;
      }
    });

  return (
    <div className="biblioteca-container">
      <main className="biblioteca-main-content">
        <div className="biblioteca-hero">
          <h1>Minha biblioteca</h1>
          <p className="subheading">
            Pesquise livros no catálogo ou visualize sua biblioteca.
          </p>
        </div>

        <div className="filtros-container">
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
            <div className="filtros-selecao">
              <select className="filter-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="">Todos os Gêneros</option>
                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
              </select>
              <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
                <option value="author-asc">Autor (A-Z)</option>
                <option value="author-desc">Autor (Z-A)</option>
              </select>
              <button className="btn-add-livro" onClick={() => navigate('/cadastrar-livro')}>
                + Adicionar Livro
              </button>
            </div>
          </div>

          {loading && <p>Carregando...</p>}
          {error && <p className="error-message">{error}</p>}

          {searchResults.length > 0 && (
            <div className="search-results">
              <h2>Resultados da Busca</h2>
              <div className="books-grid">
                {searchResults.map(book => (
                  <div key={book._id} className="book-card">
                    <img src={book.cover} alt={book.title} />
                    <div className="book-card-info">
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      {isBookInLibrary(book._id) ? (
                        <button className="btn-action" disabled>Na sua estante</button>
                      ) : (
                        <button className="btn-action" onClick={() => handleAddBook(book._id)}>Adicionar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="books-grid">
            {filteredAndSortedBooks.map(userBook => (
              <div key={userBook.book._id} className="book-card">
                <img src={userBook.book.cover} alt={userBook.book.title} onClick={() => handleOpenModal(userBook)} />
                <div className={`favorite-icon ${userBook.favorite ? 'favorited' : ''}`} onClick={() => handleUpdateBookDetails(userBook.book._id, { favorite: !userBook.favorite })}>
                  &#9733;
                </div>
                {userBook.status && (
                  <div className="book-status" data-status={userBook.status}>
                    {userBook.status}
                  </div>
                )}
                <div className="book-card-info">
                  <h3>{userBook.book.title}</h3>
                  <p>{userBook.book.author}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedBook && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>
                
                <div className="modal-body-redesigned">
                  {/* Coluna da Esquerda: Capa do Livro */}
                  <div className="modal-left-column">
                    <img src={selectedBook.book.cover} alt={selectedBook.book.title} className="modal-book-cover-redesigned" />
                  </div>

                  {/* Coluna da Direita: Detalhes e Ações */}
                  <div className="modal-right-column">
                    <div className="modal-book-header">
                      <h2>{selectedBook.book.title}</h2>
                      <h3>por {selectedBook.book.author}</h3>
                    </div>

                    <div className="modal-book-info">
                      <p><strong>Gênero:</strong> {selectedBook.book.genre}</p>
                      <p><strong>Páginas:</strong> {selectedBook.book.pages}</p>
                      <p><strong>ISBN:</strong> {selectedBook.book.isbn}</p>
                    </div>

                    <div className="modal-book-synopsis-redesigned">
                      <h4>Sinopse</h4>
                      <p>{selectedBook.book.synopsis}</p>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Sua Avaliação</h4>
                      <div className="rating-stars-redesigned">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= (hoverRating || selectedBook.rating) ? 'filled' : ''}`}
                            onClick={() => {
                              const newRating = star === selectedBook.rating ? 0 : star;
                              handleUpdateBookDetails(selectedBook.book._id, { rating: newRating });
                            }}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Status da Leitura</h4>
                      <div className="status-update-redesigned">
                        <button onClick={() => handleUpdateBookDetails(selectedBook.book._id, { status: 'quero ler' })} className={selectedBook.status === 'quero ler' ? 'active' : ''}>Quero Ler</button>
                        <button onClick={() => handleUpdateBookDetails(selectedBook.book._id, { status: 'lendo' })} className={selectedBook.status === 'lendo' ? 'active' : ''}>Lendo</button>
                        <button onClick={() => handleUpdateBookDetails(selectedBook.book._id, { status: 'lido' })} className={selectedBook.status === 'lido' ? 'active' : ''}>Lido</button>
                      </div>
                    </div>

                    <div className="modal-footer-redesigned">
                      <button className="btn-secondary" onClick={() => handleUpdateBookDetails(selectedBook.book._id, { favorite: !selectedBook.favorite })}>
                        {selectedBook.favorite ? '★ Desfavoritar' : '☆ Favoritar'}
                      </button>
                      <button className="btn-danger" onClick={() => { handleRemoveBook(selectedBook.book._id); handleCloseModal(); }}>
                        Remover da Estante
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
}