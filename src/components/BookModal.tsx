import React, { useState, useEffect } from 'react';
import './BookModal.css';

// Definindo a interface aqui para ser usada pelo componente
interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  synopsis?: string;
  rating?: number;
  favorite?: boolean;
  status?: 'lido' | 'lendo' | 'quero ler' | 'emprestado' | string;
}

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onSave: (book: Book) => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, onClose, onSave }) => {
  const [editedBook, setEditedBook] = useState<Book | null>(book);

  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  if (!editedBook) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    let newValue: string | number | boolean = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    
    if (name === 'rating') {
      newValue = Number(value);
    }

    setEditedBook({ ...editedBook, [name]: newValue });
  };

  const handleSave = () => {
    if (editedBook) {
      onSave(editedBook);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{editedBook.title}</h2>
        <div className="modal-body">
          <img src={editedBook.cover} alt={editedBook.title} className="modal-cover" />
          <div className="modal-details">
            <p>
              <strong>Autor:</strong> {editedBook.author}
            </p>
            <p>
              <strong>Gênero:</strong> {editedBook.genre}
            </p>
            <p>
              <strong>Sinopse:</strong>
            </p>
            <textarea
              name="synopsis"
              value={editedBook.synopsis || ''}
              onChange={handleInputChange}
              rows={4}
            />
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={editedBook.status || 'quero ler'}
                onChange={handleInputChange}
              >
                <option value="quero ler">Quero Ler</option>
                <option value="lendo">Lendo</option>
                <option value="lido">Lido</option>
                <option value="emprestado">Emprestado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Favorito:</label>
              <input
                type="checkbox"
                name="favorite"
                checked={editedBook.favorite || false}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Nota:</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${editedBook.rating && editedBook.rating >= star ? 'filled' : ''}`}
                    onClick={() => setEditedBook({ ...editedBook, rating: star })}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};