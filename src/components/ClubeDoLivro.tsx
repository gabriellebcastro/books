import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdicionarEncontroModal } from './AdicionarEncontroModal';
import { EditarClubeModal } from './EditarClubeModal';
import { GerenciarMembrosModal } from './GerenciarMembrosModal';
import { DefinirLeituraModal } from './DefinirLeituraModal';
import "./ClubeDoLivro.css";

interface Member {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
}

interface Encontro {
  _id: string;
  data: string;
  descricao: string;
  link?: string;
}

interface Club {
  _id: string;
  nome: string;
  descricao: string;
  capa: string;
  genero: string[];
  membros: Array<Member | string>;
  administradores: Array<Member | string>;
  tipo?: string;
  leituraAtual?: Book;
  encontros?: Encontro[];
  pendentes?: Array<Member>;
}

export function ClubeDoLivro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLeituraModalOpen, setIsLeituraModalOpen] = useState(false);
  const [isEncontroModalOpen, setIsEncontroModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);

  // TODO: substituir por ID real do usuário (ex: pegar do token / contexto)
  const currentUserId = localStorage.getItem("userId") || "6685d9457c477f225282b54a";

  useEffect(() => {
    const fetchClubInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/clubes/${id}`);
        if (!res.ok) throw new Error("Clube não encontrado");
        const data = await res.json();
        setClubInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClubInfo();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!clubInfo) return <div>Clube não encontrado.</div>;

  // helper para extrair id string (suporta array de strings ou objetos populados)
  const idOf = (item: Member | string) => (typeof item === "string" ? item : item._id);

  const isMember = (clubInfo.membros || []).some((m) => idOf(m) === String(currentUserId))
    || (clubInfo.administradores || []).some((a) => idOf(a) === String(currentUserId));

  const isModerator = (clubInfo.administradores || []).some((a) => idOf(a) === String(currentUserId));

  const handleJoin = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Você precisa estar logado para entrar no clube.");
        setActionLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/clubes/${id}/entrar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erro ao tentar entrar no clube.");
        setActionLoading(false);
        return;
      }

      // resposta OK: se clube é público, atualizamos membros na UI para refletir entrada imediata
      if (clubInfo.tipo && clubInfo.tipo.toLowerCase() === "público" || clubInfo.tipo?.toLowerCase() === "publico") {
        setClubInfo(prev => {
          if (!prev) return prev;
          const novosMembros = [...(prev.membros || []), String(currentUserId)];
          return { ...prev, membros: novosMembros };
        });
        setMessage(data.message || "Você entrou no clube com sucesso!");
      } else {
        // privado: provavelmente resposta diz que solicitação foi enviada
        setMessage(data.message || "Solicitação enviada. Aguarde aprovação.");
        // opcional: adicionar ao pendentes no estado (se quiser)
        setClubInfo(prev => prev ? { ...prev, pendentes: [...(prev.pendentes || []), String(currentUserId) as unknown as Member] } : prev);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeituraDefinida = (clubeAtualizado: Club) => {
    setClubInfo(prev => prev ? { ...prev, leituraAtual: clubeAtualizado.leituraAtual } : prev);
    setMessage('Leitura do mês atualizada com sucesso!');
    setIsLeituraModalOpen(false);
  };

  const handleEncontroAdicionado = (clubeAtualizado: Club) => {
    setClubInfo(prev => prev ? { ...prev, encontros: clubeAtualizado.encontros } : prev);
    setMessage('Encontro adicionado com sucesso!');
    setIsEncontroModalOpen(false);
  };

  const handleClubUpdated = (clubeAtualizado: Club) => {
    setClubInfo(clubeAtualizado);
    setMessage('Informações do clube atualizadas com sucesso!');
    setIsEditModalOpen(false);
  };

  const handleDeleteClube = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este clube? Esta ação é irreversível.")) {
      return;
    }

    setActionLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clubes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao excluir o clube.");

      alert("Clube excluído com sucesso!");
      navigate('/clubes');

    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido ao excluir.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clubes/${id}/aprovar/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao aprovar membro.");

      // Atualiza o estado local para refletir a mudança
      setClubInfo(prev => {
        if (!prev) return null;
        const userToApprove = prev.pendentes?.find(p => p._id === userId);
        return {
          ...prev,
          pendentes: prev.pendentes?.filter(p => p._id !== userId),
          membros: userToApprove ? [...prev.membros, userToApprove] : prev.membros,
        };
      });
      setMessage("Membro aprovado com sucesso!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Tem certeza que deseja rejeitar esta solicitação?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clubes/${id}/rejeitar/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao rejeitar membro.");

      // Atualiza o estado local
      setClubInfo(prev => {
        if (!prev) return null;
        return {
          ...prev,
          pendentes: prev.pendentes?.filter(p => p._id !== userId),
        };
      });
      setMessage("Solicitação rejeitada.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (!window.confirm("Tem certeza que deseja sair deste clube?")) return;

    setActionLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clubes/${id}/sair`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao tentar sair do clube.");
      }

      alert(data.message); // Exibe a mensagem de sucesso/exclusão
      navigate('/meus-clubes'); // Redireciona o usuário

    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEncontro = async (encontroId: string) => {
    if (!window.confirm("Tem certeza que deseja remover este encontro?")) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clubes/${id}/encontros/${encontroId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao remover encontro.");

      setClubInfo(prev => {
        if (!prev) return prev;
        const encontrosAtualizados = prev.encontros?.filter(e => e._id !== encontroId);
        return { ...prev, encontros: encontrosAtualizados };
      });
      setMessage("Encontro removido com sucesso.");

    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="clube-page-container">
      {/* --- CABEÇALHO ESTILO BANNER --- */}
      <header
        className="clube-banner-header"
        style={{ backgroundImage: `url(${clubInfo.capa ? `http://localhost:5000${clubInfo.capa.replace(/\\/g, "/")}` : "/assets/placeholder.jpg"})` }}
      >
        <div className="clube-banner-overlay">
          <div className="clube-banner-content">
            <h1>{clubInfo.nome}</h1>
            <p>{clubInfo.descricao}</p>
            <div className="tags">
              {clubInfo.genero && clubInfo.genero.map((g, index) => (
                <span key={index} className="tag">{g}</span>
              ))}
            </div>
            {/* Botão de Ação Principal */}
            {!isMember ? (
              <button className="clube-join-btn" onClick={handleJoin} disabled={actionLoading}>
                {actionLoading ? "Processando..." : (clubInfo.tipo === 'Privado' ? 'Solicitar Entrada' : 'Entrar no Clube')}
              </button>
            ) : (
              <span className="clube-status-tag">✓ Membro</span>
            )}
          </div>
        </div>
      </header>

      <div className="clube-body-container">
        {message && <div className="clube-message">{message}</div>}

        <main className="clube-main-content">
          {/* --- COLUNA PRINCIPAL (ESQUERDA) --- */}
          <div className="clube-main-column">
            <section className="clube-section card">
              <h2>Leitura do Mês</h2>
              {clubInfo.leituraAtual ? (
                <div className="leitura-mes">
                  <img src={clubInfo.leituraAtual.cover} alt={clubInfo.leituraAtual.title} className="leitura-mes-cover" />
                  <div className="leitura-mes-details">
                    <h3>{clubInfo.leituraAtual.title}</h3>
                    <p className="author">por {clubInfo.leituraAtual.author}</p>
                  </div>
                </div>
              ) : (
                <p>Nenhuma leitura definida para este mês.</p>
              )}
              {isModerator && (
                <button className="clube-action-btn" onClick={() => setIsLeituraModalOpen(true)}>
                  {clubInfo.leituraAtual ? 'Alterar Leitura' : 'Definir Leitura'}
                </button>
              )}
            </section>

            <section className="clube-section card">
              <h2>Próximos Encontros</h2>
              {clubInfo.encontros && clubInfo.encontros.length > 0 ? (
                <ul className="encontros-list">
                  {clubInfo.encontros.map(encontro => (
                    <li key={encontro._id} className="encontro-item">
                      <div className="encontro-info">
                        <span className="encontro-data">{new Date(encontro.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="encontro-desc">{encontro.descricao}</span>
                        {encontro.link && <a href={encontro.link} target="_blank" rel="noopener noreferrer" className="encontro-link">Link</a>}
                      </div>
                      {isModerator && (
                        <button className="delete-encontro-btn" onClick={() => handleDeleteEncontro(encontro._id)} disabled={actionLoading}>
                          &times;
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum encontro agendado.</p>
              )}
              {isModerator && (
                <button className="clube-action-btn" onClick={() => setIsEncontroModalOpen(true)}>+ Adicionar Encontro</button>
              )}
            </section>
          </div>

          {/* --- COLUNA LATERAL (DIREITA) --- */}
          <aside className="clube-sidebar-column">
            <section className="clube-section card">
              <h2>Membros ({clubInfo.membros?.length || 0})</h2>
              <div className="members-list">
                {clubInfo.membros && clubInfo.membros.map((member) => {
                  const mid = typeof member === "string" ? member : member._id;
                  const name = typeof member === "string" ? "..." : member.name;
                  const memberObj = typeof member === 'object' ? member : null;
                  const [avatarStyle, avatarSeed] = memberObj?.avatar?.split(':') || ['initials', name];
                  const isAdmin = (clubInfo.administradores || []).some(a => (typeof a === "string" ? a : a._id) === mid);
                  return (
                    <div key={mid} className="member-item" title={name}>
                      <img 
                        src={`https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${avatarSeed}`} 
                        alt={`Avatar de ${String(name)}`} 
                        className="member-avatar" />
                      <span className="member-name">{name}</span>
                      {isAdmin && <span className="member-role">Admin</span>}
                    </div>
                  );
                })}
              </div>
            </section>

            {isModerator && (
              <section className="clube-section card">
                <h2>Painel do Administrador</h2>
                <div className="admin-panel">
                  {clubInfo.pendentes && clubInfo.pendentes.length > 0 && (
                    <div className="admin-section">
                      <h4>Solicitações Pendentes</h4>
                      <ul className="solicitacoes-list">
                        {clubInfo.pendentes.map(user => (
                          <li key={user._id} className="solicitacao-item">
                            <span>{user.name}</span>
                            <div className="solicitacao-actions">
                              <button className="clube-accept-btn" onClick={() => handleApprove(user._id)} disabled={actionLoading}>✓</button>
                              <button className="clube-reject-btn" onClick={() => handleReject(user._id)} disabled={actionLoading}>×</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button className="clube-action-btn" onClick={() => setIsEditModalOpen(true)}>Editar Informações</button>
                  <button className="clube-action-btn" onClick={() => setIsManageMembersModalOpen(true)}>Gerenciar Membros</button>
                  <button className="clube-delete-btn" onClick={handleDeleteClube} disabled={actionLoading}>Excluir Clube</button>
                </div>
              </section>
            )}

            {isMember && (
              <button className="clube-leave-btn" onClick={handleLeaveClub} disabled={actionLoading}>
                Sair do Clube
              </button>
            )}
          </aside>
        </main>
      </div>

      {isLeituraModalOpen && (
        <DefinirLeituraModal
          clubId={clubInfo._id}
          onClose={() => setIsLeituraModalOpen(false)}
          onSave={handleLeituraDefinida}
        />
      )}

      {isEncontroModalOpen && (
        <AdicionarEncontroModal
          clubId={clubInfo._id}
          onClose={() => setIsEncontroModalOpen(false)}
          onSave={handleEncontroAdicionado}
        />
      )}

      {isEditModalOpen && (
        <EditarClubeModal
          clube={clubInfo}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleClubUpdated}
        />
      )}

      {isManageMembersModalOpen && (
        <GerenciarMembrosModal
          clube={clubInfo}
          onClose={() => setIsManageMembersModalOpen(false)}
          onMembersUpdate={(updatedClub) => setClubInfo(updatedClub)}
        />
      )}
    </div>
  );
}
