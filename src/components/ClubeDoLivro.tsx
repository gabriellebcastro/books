import './ClubeDoLivro.css';

// Componente placeholder para a imagem do livro e avatares
const placeholderAvatar = "https://via.placeholder.com/150";
const placeholderBookCover = "https://via.placeholder.com/150x220";

export function ClubeDoLivro() {
  // Simulação de estado - substitua com dados reais
  const isModerator = true; // Mude para false para ver a visão de membro
  const clubInfo = {
    name: "Clube do Livro: Exploradores de Gêneros",
    description: "Um clube para quem ama viajar por diferentes gêneros literários, do clássico à ficção científica.",
    visibility: "Público",
    memberCount: 42,
    tags: ["Ficção", "Clássicos", "Fantasia", "Suspense"],
  };
  const currentReading = {
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    description: "A história de Kvothe, um herói e vilão de sua própria lenda.",
    cover: placeholderBookCover,
  };
  const upcomingMeetings = [
    { date: "25/08/2024", time: "19:00", location: "Discord (Link)" },
    { date: "15/09/2024", time: "19:00", location: "Google Meet (Link)" },
  ];
  const members = [
    { name: "Ana Silva", role: "Moderador", avatar: placeholderAvatar },
    { name: "Carlos Souza", role: "Membro", avatar: placeholderAvatar },
    { name: "Beatriz Lima", role: "Membro", avatar: placeholderAvatar },
  ];
  const pendingRequests = [
    { name: "Mariana Costa", avatar: placeholderAvatar },
  ];

  return (
    <div>
      <div className="clube-container">
        <header className="clube-header">
          <h1>{clubInfo.name}</h1>
          <p>{clubInfo.description}</p>
          <button className="clube-join-btn">Entrar no Clube</button>
        </header>

        <main className="clube-main-content">
          <div className="clube-left-column">
            {/* Seção de Leitura do Mês */}
            <section className="clube-section card">
              <h2>Leitura do Mês</h2>
              <div className="leitura-mes">
                <img src={currentReading.cover} alt={`Capa de ${currentReading.title}`} className="leitura-mes-cover" />
                <div className="leitura-mes-details">
                  <h3>{currentReading.title}</h3>
                  <p className="author">por {currentReading.author}</p>
                  <p>{currentReading.description}</p>
                  <button className="clube-action-btn">Avaliar / Marcar como lido</button>
                </div>
              </div>
            </section>

            {/* Seção de Próximos Encontros */}
            <section className="clube-section card">
              <h2>Próximos Encontros</h2>
              <ul className="encontros-list">
                {upcomingMeetings.map((meeting, index) => (
                  <li key={index} className="encontro-item">
                    <span>{meeting.date} às {meeting.time} - {meeting.location}</span>
                    <button className="clube-details-btn">Ver detalhes</button>
                  </li>
                ))}
              </ul>
              {isModerator && (
                <button className="clube-add-btn">Adicionar Encontro</button>
              )}
            </section>

            {/* Seção de Solicitações Pendentes (Apenas Moderador) */}
            {isModerator && (
              <section className="clube-section card">
                <h2>Solicitações Pendentes</h2>
                <ul className="solicitacoes-list">
                  {pendingRequests.map((request, index) => (
                    <li key={index} className="solicitacao-item">
                      <img src={request.avatar} alt={request.name} className="member-avatar-small" />
                      <span>{request.name}</span>
                      <div className="solicitacao-actions">
                        <button className="clube-accept-btn">Aceitar</button>
                        <button className="clube-reject-btn">Recusar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="clube-right-column">
            {/* Seção de Informações do Clube */}
            <section className="clube-section card">
              <h2>Informações do Clube</h2>
              <div className="info-clube">
                <p><strong>Visibilidade:</strong> {clubInfo.visibility}</p>
                <p><strong>Membros:</strong> {clubInfo.memberCount}</p>
                <div className="tags-container">
                  <strong>Tags:</strong>
                  <div className="tags">
                    {clubInfo.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
              </div>
              {isModerator && (
                  <button className="clube-add-btn">Adicionar Leitura do Mês</button>
              )}
            </section>

            {/* Seção de Membros */}
            <section className="clube-section card">
              <h2>Membros</h2>
              <ul className="members-list">
                {members.map((member, index) => (
                  <li key={index} className="member-item">
                    <img src={member.avatar} alt={member.name} className="member-avatar" />
                    <div>
                      <p className="member-name">{member.name}</p>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}