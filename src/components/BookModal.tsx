// BookModal.tsx
import React, { useEffect, useState } from "react";
import "./BookModal.css";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre?: string;
  cover?: string;
  synopsis?: string;
  rating?: number;
  favorite?: boolean;
  status?: 'lido' | 'lendo' | 'quero ler' | 'emprestado' | string;
}

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  /**
   * onSave recebe o livro editado (espera ao menos status/favorite/rating)
   * Ex.: onSave({ _id, status, favorite, rating })
   */
  onSave: (edited: Book) => Promise<void> | void;
  /**
   * onRemove optional: chamado quando usuário remove o livro da estante
   */
  onRemove?: (bookId: string) => Promise<void> | void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, onClose, onSave, onRemove }) => {
  const [edited, setEdited] = useState<Book | null>(book);
  const [saving, setSaving] = useState(false);
  const [togglingLoan, setTogglingLoan] = useState(false);

  useEffect(() => {
    setEdited(book ? { ...book } : null);
  }, [book]);

  if (!edited) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    if (name === "rating") newValue = Number(value);
    setEdited({ ...edited, [name]: newValue });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(edited);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!edited) return;
    if (!confirm("Tem certeza que deseja remover este livro da sua estante?")) return;
    if (onRemove) {
      await onRemove(edited._id);
    }
  };

  const handleToggleLoan = async () => {
    if (!edited) return;
    setTogglingLoan(true);
    try {
      const newStatus = edited.status === "emprestado" ? "quero ler" : "emprestado";
      const updated = { ...edited, status: newStatus };
      setEdited(updated);
      await onSave(updated);
    } finally {
      setTogglingLoan(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Detalhes do livro ${edited.title}`}>
      <div className="modal-content book-modal">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="book-modal-header">
          <div className="book-header-left">
            <img src={edited.cover || "/assets/placeholder.jpg"} alt={edited.title} className="modal-cover" />
          </div>
          <div className="book-header-right">
            <h2 className="modal-title">{edited.title}</h2>
            <h3 className="modal-author">{edited.author}</h3>
            {edited.genre && <p className="modal-genre"><strong>Gênero:</strong> {edited.genre}</p>}
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-book-synopsis">
            <p><strong>Sinopse:</strong></p>
            <textarea
              name="synopsis"
              value={edited.synopsis || ""}
              onChange={handleChange}
              rows={4}
              aria-label="Sinopse do livro"
            />
          </div>

          <div className="modal-controls">
            <div className="form-group">
              <label htmlFor="status-select">Status</label>
              <select id="status-select" name="status" value={edited.status || "quero ler"} onChange={handleChange}>
                <option value="quero ler">Quero Ler</option>
                <option value="lendo">Lendo</option>
                <option value="lido">Lido</option>
                <option value="emprestado">Emprestado</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="favorite">Favorito</label>
              <input id="favorite" type="checkbox" name="favorite" checked={!!edited.favorite} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Nota</label>
              <div className="stars-inline" role="radiogroup" aria-label="Avaliação do livro">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`star-btn ${edited.rating && edited.rating >= s ? 'selected' : ''}`}
                    onClick={() => setEdited({ ...edited, rating: s })}
                    aria-pressed={!!(edited.rating && edited.rating >= s)}
                    title={`Dar ${s} estrelas`}
                  >
                    ★
                  </button>
                ))}
                <button type="button" className="clear-rating" onClick={() => setEdited({ ...edited, rating: 0 })} title="Remover avaliação">Remover</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-left">
            {/* Botão de empréstimo (destacado) */}
            <button
              type="button"
              className="emprestado-button"
              onClick={handleToggleLoan}
              disabled={togglingLoan}
              aria-pressed={edited.status === "emprestado"}
              title={edited.status === "emprestado" ? "Marcar como disponível" : "Marcar como emprestado"}
            >
              {edited.status === "emprestado" ? "Marcado como emprestado" : "Marcar emprestado"}
            </button>
            {/* Botão remover (se onRemove foi fornecido) */}
            {onRemove && (
              <button type="button" className="remove-button-modal" onClick={handleRemove}>
                Remover da Estante
              </button>
            )}
          </div>

          <div className="modal-footer-right">
            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
