// ClubeDoLivro.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ClubeDoLivro.css";

interface Member {
  _id: string;
  name: string;
  username?: string;
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
  pendentes?: Array<string>;
}

const placeholderAvatar = "https://via.placeholder.com/150";

export function ClubeDoLivro() {
  const { id } = useParams<{ id: string }>();
  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        setClubInfo(prev => prev ? { ...prev, pendentes: [...(prev.pendentes || []), String(currentUserId)] } : prev);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro desconhecido");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="clube-container">
      <header className="clube-header card">
        <img
          src={`http://localhost:5000${clubInfo.capa.replace(/\\/g, "/")}`}
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
            <div className="leitura-mes">
              <img src={"https://via.placeholder.com/100x150"} alt="Leitura do Mês" className="leitura-mes-cover" />
              <div className="leitura-mes-details">
                <h3>A Sociedade do Anel</h3>
                <p className="author">J.R.R. Tolkien</p>
              </div>
            </div>
          </section>

          <section className="clube-section card">
            <h2>Próximos Encontros</h2>
            <ul className="encontros-list">
              <li className="encontro-item"><span>25/07 às 19:00 - Online (Discord)</span></li>
              <li className="encontro-item"><span>08/08 às 19:00 - Online (Discord)</span></li>
            </ul>
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
                const isAdmin = (clubInfo.administradores || []).some(a => (typeof a === "string" ? a : a._id) === mid);
                return (
                  <div key={mid} className="member-item">
                    <img src={placeholderAvatar} alt={String(name)} className="member-avatar" />
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
                <ul className="solicitacoes-list">
                  <li className="solicitacao-item">
                    <span>Carlos</span>
                    <div className="solicitacao-actions">
                      <button className="clube-accept-btn">Aprovar</button>
                      <button className="clube-reject-btn">Rejeitar</button>
                    </div>
                  </li>
                </ul>
              </section>

              <section className="clube-section card">
                <h2>Configurações do Clube</h2>
                <button>Editar Informações</button>
                <button>Gerenciar Membros</button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}