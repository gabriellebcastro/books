import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ClubeDoLivro.css";

// Interfaces para tipagem dos dados
interface Member {
  _id: string;
  name: string;
  username: string;
}

interface Club {
  _id: string;
  nome: string;
  descricao: string;
  capa: string;
  genero: string[];
  membros: Member[];
  administradores: Member[];
}

// Componente placeholder para a imagem do livro e avatares
const placeholderAvatar = "https://via.placeholder.com/150";

export function ClubeDoLivro() {
  const { id } = useParams();
  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulação de ID do usuário logado
  const currentUserId = "6685d9457c477f225282b54a"; // Substitua pelo ID real do usuário logado

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clubes/${id}`);
        if (!response.ok) {
          throw new Error("Clube não encontrado");
        }
        const data = await response.json();
        setClubInfo(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Ocorreu um erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClubInfo();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!clubInfo) {
    return <div>Clube não encontrado.</div>;
  }

  // Verifica se o usuário atual é membro ou administrador
  const isMember =
    clubInfo.membros.some((member) => member._id === currentUserId) ||
    clubInfo.administradores.some((admin) => admin._id === currentUserId);

  // Verifica se o usuário atual é moderador (administrador)
  const isModerator = clubInfo.administradores.some(
    (admin) => admin._id === currentUserId
  );

  // Dados placeholder para Leitura do Mês e Próximos Encontros
  const leituraDoMes = {
    titulo: "A Sociedade do Anel",
    autor: "J.R.R. Tolkien",
    capa: "https://via.placeholder.com/100x150",
  };

  const proximosEncontros = [
    { data: "25/07", horario: "19:00", local: "Online (Discord)" },
    { data: "08/08", horario: "19:00", local: "Online (Discord)" },
  ];

  const pendingRequests = [
    { id: 1, name: "Carlos" },
    { id: 2, name: "Mariana" },
  ];

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
        {!isMember && (
          <button className="clube-join-btn">Entrar no Clube</button>
        )}
      </header>

      <main className="clube-main-content">
        <div className="clube-left-column">
          <section className="clube-section card">
            <h2>Leitura do Mês</h2>
            <div className="leitura-mes">
              <img src={leituraDoMes.capa} alt={leituraDoMes.titulo} className="leitura-mes-cover" />
              <div className="leitura-mes-details">
                <h3>{leituraDoMes.titulo}</h3>
                <p className="author">{leituraDoMes.autor}</p>
              </div>
            </div>
          </section>

          <section className="clube-section card">
            <h2>Próximos Encontros</h2>
            <ul className="encontros-list">
              {proximosEncontros.map((encontro, index) => (
                <li key={index} className="encontro-item">
                  <span>{encontro.data} às {encontro.horario} - {encontro.local}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="clube-right-column">
          <section className="clube-section card info-clube">
            <h2>Informações do Clube</h2>
            <p>
              <strong>Membros:</strong> {clubInfo.membros?.length || 0}
            </p>
          </section>

          <section className="clube-section card">
            <h2>Membros</h2>
            <div className="members-list">
              {clubInfo.membros && clubInfo.membros.map((member) => {
                const isAdmin = clubInfo.administradores.some(
                  (admin) => admin._id === member._id
                );
                return (
                  <div key={member._id} className="member-item">
                    <img
                      src={placeholderAvatar}
                      alt={member.name}
                      className="member-avatar"
                    />
                    <span className="member-name">{member.name}</span>
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
                  {pendingRequests.map((request) => (
                    <li key={request.id} className="solicitacao-item">
                      <span>{request.name}</span>
                      <div className="solicitacao-actions">
                        <button className="clube-accept-btn">Aprovar</button>
                        <button className="clube-reject-btn">Rejeitar</button>
                      </div>
                    </li>
                  ))}
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