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

export function EditarPerfilModal({ user, onClose, onSave }: EditarPerfilModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar.split(':')[0], // Pega a chave do avatar, ex: "mulher"
  });
  const [error, setError] = useState('');

  const avatarOptions = [
    { key: 'mulher', style: 'lorelei', seed: 'Casper' },
    { key: 'coruja', style: 'shapes', seed: 'owl' },
    { key: 'coelho', style: 'shapes', seed: 'bunny' },
    { key: 'robo', style: 'bottts', seed: user.username },
    { key: 'aventura', style: 'adventurer', seed: user.username },
    { key: 'iniciais', style: 'initials', seed: user.name },
  ];

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

  const handleAvatarChange = (avatarKey: string) => {
    setFormData({ ...formData, avatar: avatarKey });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Encontra o objeto do avatar selecionado para enviar o 'style' e a 'seed' corretos
      const selectedAvatar = avatarOptions.find(opt => opt.key === formData.avatar);
      const dataToSave = {
        ...formData,
        avatar: selectedAvatar ? `${selectedAvatar.style}:${selectedAvatar.seed}` : 'initials:Default',
      };

      const { data } = await axios.put('http://localhost:5000/api/users/profile', dataToSave, config);
      
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
              {avatarOptions.map(option => (
                <div 
                  key={option.key} 
                  className={`avatar-option ${formData.avatar === option.key ? 'selected' : ''}`}
                  onClick={() => handleAvatarChange(option.key)}
                >
                  <img 
                    src={`https://api.dicebear.com/8.x/${option.style}/svg?seed=${option.seed}`} 
                    alt={`Avatar estilo ${option.key}`}
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