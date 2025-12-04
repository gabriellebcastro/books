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
    <div className="clube-container">
      <header className="clube-header card">
        <img
          src={clubInfo.capa ? `http://localhost:5000${clubInfo.capa.replace(/\\/g, "/")}` : "/assets/placeholder.jpg"}
          alt={`Capa do clube ${clubInfo.nome}`}
          className="clube-cover-image"
        />
        <div className="clube-header-info">
          <h1>{clubInfo.nome}</h1>
          <p>{clubInfo.descricao}</p>
          <div className="tags">
            {clubInfo.genero && clubInfo.genero.map((g, index) => (
              <span key={index} className="tag">{g}</span>
            ))}
          </div>
        </div>

        {/* Botão: Entrar / Já sou membro */}
        {!isMember ? (
          <button
            className="clube-join-btn"
            onClick={handleJoin}
            disabled={actionLoading}
            title={actionLoading ? "Aguarde..." : "Entrar no clube"}
          >
            {actionLoading ? "Processando..." : "Entrar no Clube"}
          </button>
        ) : (
          <button className="clube-member-btn" disabled>
            Você já é membro
          </button>
        )}
      </header>

      {message && <div style={{ textAlign: "center", marginBottom: 12, color: "#333" }}>{message}</div>}

      <main className="clube-main-content">
        <div className="clube-left-column">
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
              <button className="btn-definir-leitura" onClick={() => setIsLeituraModalOpen(true)}>
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
                      {encontro.link && <a href={encontro.link} target="_blank" rel="noopener noreferrer">Link</a>}
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
              <button className="btn-adicionar-encontro" onClick={() => setIsEncontroModalOpen(true)}>+ Adicionar Encontro</button>
            )}
          </section>
        </div>

        <div className="clube-right-column">
          <section className="clube-section card info-clube">
            <h2>Informações do Clube</h2>
            <p><strong>Membros:</strong> {clubInfo.membros?.length || 0}</p>
          </section>

          <section className="clube-section card">
            <h2>Membros</h2>
            <div className="members-list">
              {clubInfo.membros && clubInfo.membros.map((member) => {
                const mid = typeof member === "string" ? member : member._id;
                const name = typeof member === "string" ? member : member.name;
                const username = typeof member === "string" ? name : member.username || name;
                const avatarStyle = typeof member === "string" ? 'initials' : member.avatar || 'initials';
                const isAdmin = (clubInfo.administradores || []).some(a => (typeof a === "string" ? a : a._id) === mid);
                return (
                  <div key={mid} className="member-item">
                    <img 
                      src={`https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${username}`} 
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
            <>
              <section className="clube-section card">
                <h2>Solicitações Pendentes</h2>
                {clubInfo.pendentes && clubInfo.pendentes.length > 0 ? (
                  <ul className="solicitacoes-list">
                    {clubInfo.pendentes.map(user => (
                      <li key={user._id} className="solicitacao-item">
                        <span>{user.name}</span>
                        <div className="solicitacao-actions">
                          <button className="clube-accept-btn">Aprovar</button>
                          <button className="clube-reject-btn">Rejeitar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma solicitação pendente no momento.</p>
                )}
              </section>

              <section className="clube-section card">
                <h2>Configurações do Clube</h2>
                <button onClick={() => setIsEditModalOpen(true)}>Editar Informações</button>
                <button onClick={() => setIsManageMembersModalOpen(true)}>Gerenciar Membros</button>
                <button className="clube-delete-btn" onClick={handleDeleteClube} disabled={actionLoading}>Excluir Clube</button>
              </section>
            </>
          )}
        </div>
      </main>

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
