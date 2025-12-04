import { useState } from 'react';
import './BookModal.css'; // Reutilizando estilos

interface Book {
  _id: string;
  title: string;
  author: string;
  cover?: string;
}

interface ReviewModalProps {
  book: Book;
  onClose: () => void;
  onSave: (reviewData: { rating: number; review?: string }) => void;
}

export function ReviewModal({ book, onClose, onSave }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (rating === 0) {
      setError('Por favor, dê uma nota de 1 a 5 estrelas.');
      return;
    }
    onSave({ rating, review });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-book-header" style={{ alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <img src={book.cover || "/assets/placeholder.jpg"} alt={book.title} className="modal-cover" style={{ width: '80px', height: '120px' }} />
          <div className="book-header-right">
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', margin: 0 }}>Você concluiu a leitura de:</p>
            <h2 className="modal-title" style={{ fontSize: '1.5rem' }}>{book.title}</h2>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'block' }}>
          {error && <p className="error-message" style={{ marginBottom: '1rem' }}>{error}</p>}

          <div className="modal-section">
            <h4>Qual a sua nota para o livro? *</h4>
            <div className="rating-stars-redesigned">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ fontSize: '2.5rem' }}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h4>Sua análise (opcional)</h4>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              placeholder="O que você achou deste livro?"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                backgroundColor: 'var(--page-bg)',
                color: 'var(--primary-text)'
              }}
            />
          </div>

          <div 
            className="modal-footer" 
            style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '1.5rem', 
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--primary-text)', border: '1px solid var(--border-color)'}}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
            >
              Salvar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}