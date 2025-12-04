import { useState } from 'react';
import axios from 'axios';
import './DefinirLeituraModal.css';

interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
}

interface Club {
  _id: string;
  leituraAtual?: Book;
}

interface DefinirLeituraModalProps {
  clubId: string;
  onClose: () => void;
  onSave: (clubeAtualizado: Club) => void;
}

export function DefinirLeituraModal({ clubId, onClose, onSave }: DefinirLeituraModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/books', {
        params: { keyword: searchTerm },
      });
      setSearchResults(data);
    } catch (err) {
      setError('Erro ao buscar livros.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = async (bookId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você não está autenticado.');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/clubes/${clubId}/leitura`,
        { bookId },
        config
      );
      onSave(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erro ao definir o livro.');
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="leitura-modal-header">
          <h2>Definir Leitura do Mês</h2>
          <div className="leitura-modal-search">
            <input
              type="text"
              placeholder="Buscar livro por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="search-results-list">
          {searchResults.length > 0 ? (
            searchResults.map((book) => (
              <div
                key={book._id}
                className="search-result-item"
                onClick={() => handleSelectBook(book._id)}
              >
                <img src={book.cover} alt={book.title} />
                <div className="search-result-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                </div>
              </div>
            ))
          ) : (
            !loading && <p style={{ textAlign: 'center', padding: '20px' }}>Nenhum livro encontrado. Faça uma busca.</p>
          )}
        </div>
      </div>
    </div>
  );
}