import { useState } from 'react';
import axios from 'axios';
import '../EditarPerfilModal.css'; // Reutilizando o CSS do modal de perfil

interface Club {
  _id: string;
  encontros?: any[];
}

interface AdicionarEncontroModalProps {
  clubId: string;
  onClose: () => void;
  onSave: (clubeAtualizado: Club) => void;
}

export function AdicionarEncontroModal({ clubId, onClose, onSave }: AdicionarEncontroModalProps) {
  const [formData, setFormData] = useState({
    data: '',
    descricao: '',
    link: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    if (!formData.data || !formData.descricao) {
      setError('Data e Descrição são obrigatórios.');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/clubes/${clubId}/encontros`,
        formData,
        config
      );
      onSave(data);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erro ao adicionar encontro.');
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <h2>Adicionar Novo Encontro</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="data">Data e Hora</label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              placeholder="Ex: Discussão do Capítulo 5"
              value={formData.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Link (Opcional)</label>
            <input
              type="url"
              id="link"
              name="link"
              placeholder="https://discord.gg/seu-link"
              value={formData.link}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Adicionar Encontro</button>
          </div>
        </form>
      </div>
    </div>
  );
}