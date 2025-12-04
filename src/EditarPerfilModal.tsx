import { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarPerfilModal.css';

type Usuario = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
};

interface EditarPerfilModalProps {
  user: Usuario;
  onClose: () => void;
  onSave: (updatedUser: Usuario) => void;
}

const avatarOptions = ['initials', 'bottts', 'adventurer'];

export function EditarPerfilModal({ user, onClose, onSave }: EditarPerfilModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (avatarStyle: string) => {
    setFormData({ ...formData, avatar: avatarStyle });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
      onSave(data);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erro ao atualizar perfil.');
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
          <h2>Editar Perfil</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <div className="avatar-selection">
              {avatarOptions.map(style => (
                <div 
                  key={style} 
                  className={`avatar-option ${formData.avatar === style ? 'selected' : ''}`}
                  onClick={() => handleAvatarChange(style)}
                >
                  <img 
                    src={`https://api.dicebear.com/8.x/${style}/svg?seed=${user.username}`} 
                    alt={`Avatar estilo ${style}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}