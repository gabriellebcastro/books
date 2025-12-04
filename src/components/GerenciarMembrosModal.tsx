import { useState } from 'react';
import axios from 'axios';
import '../EditarPerfilModal.css'; // Reutilizando o CSS
import './ClubeDoLivro.css'; // Para estilos de membros

interface Member {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
}

interface Club {
  _id: string;
  membros: Array<Member | string>;
  administradores: Array<Member | string>;
}

interface GerenciarMembrosModalProps {
  clube: Club;
  onClose: () => void;
  onMembersUpdate: (updatedClub: Club) => void;
}

export function GerenciarMembrosModal({ clube, onClose, onMembersUpdate }: GerenciarMembrosModalProps) {
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem("userId");

  const allMembers = [
    ...clube.administradores.map(a => ({ ...(typeof a === 'string' ? { _id: a, name: 'Admin' } : a), isAdmin: true })),
    ...clube.membros.filter(m => !clube.administradores.some(a => (typeof a === 'string' ? a : a._id) === (typeof m === 'string' ? m : m._id)))
                   .map(m => ({ ...(typeof m === 'string' ? { _id: m, name: 'Membro' } : m), isAdmin: false }))
  ];

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm("Tem certeza que deseja remover este membro do clube?")) return;

    setError('');
    const token = localStorage.getItem('token');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.delete(
        `http://localhost:5000/api/clubes/${clube._id}/membros/${memberId}`,
        config
      );
      onMembersUpdate(data); // Atualiza o estado no componente pai
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erro ao remover membro.');
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="edit-profile-form">
          <h2>Gerenciar Membros</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="members-list" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
            {allMembers.map((member) => {
              const username = member.username || member.name;
              const avatarStyle = member.avatar || 'initials';
              
              return (
                <div key={member._id} className="member-item">
                  <img 
                    src={`https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${username}`} 
                    alt={`Avatar de ${member.name}`} 
                    className="member-avatar" 
                  />
                  <span className="member-name">{member.name}</span>
                  {member.isAdmin && <span className="member-role">Admin</span>}

                  {/* O admin não pode remover a si mesmo */}
                  {member._id !== currentUserId && (
                    <button 
                      className="delete-encontro-btn" 
                      style={{ marginLeft: 'auto' }}
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}