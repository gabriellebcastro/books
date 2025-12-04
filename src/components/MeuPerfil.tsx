import { useState, useEffect } from 'react';
import axios from 'axios';
import './MeuPerfil.css';
import { EditarPerfilModal } from '../EditarPerfilModal.tsx';

type Usuario = {
  _id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  avatar: string;
};

export function MeuPerfilPage() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get<Usuario>('http://localhost:5000/api/users/profile', config);
        setUser(data);
      } catch (err) {
        setError('Não foi possível carregar os dados do perfil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <main className="main-content"><p>Carregando perfil...</p></main>;
  }

  if (error) {
    return <main className="main-content"><p className="error-message">{error}</p></main>;
  }

  const handleSaveProfile = (updatedUser: Usuario) => {
    setUser(updatedUser);
  };

  return (
    <main className="main-content">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={`https://api.dicebear.com/8.x/${user?.avatar || 'initials'}/svg?seed=${user?.username}`} 
            alt="Avatar" 
            className="profile-avatar"
          />
          <div className="profile-header-info">
            <h1>{user?.name}</h1>
            <p>@{user?.username}</p>
          </div>
          <button className="btn-edit-profile" onClick={() => setIsEditModalOpen(true)}>
            Editar Perfil
          </button>
        </div>

        <div className="profile-details">
          <h2>Informações da Conta</h2>
          <div className="info-item">
            <strong>Email:</strong>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <strong>Membro desde:</strong>
            <span>{user ? new Date(user.createdAt).toLocaleDateString('pt-BR') : ''}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-action-secondary">Alterar Senha</button>
        </div>
      </div>

      {isEditModalOpen && user && (
        <EditarPerfilModal 
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </main>
  );
}