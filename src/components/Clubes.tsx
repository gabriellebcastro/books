import { Navbar } from './Navbar';
import './Clubes.css';

export function Clubes() {
    return (
        <div>
            <Navbar />
            <div className="page-container">
                {/* Esta div envolve todo o conteúdo central */}
                <main className="main-content">
                    
                    {/* =================================== */}
                    {/* Seção Meus Clubes */}
                    {/* =================================== */}
                    <section className="section-container">
                        <h2 className="section-title">Meus Clubes</h2>
                        <div className="clubs-grid">
                            {/* Card de Clube (Exemplo 1) */}
                            {/* DADOS DINÂMICOS: Repetir este bloco para cada clube do usuário */}
                            <div className="club-card">
                                <img src="https://via.placeholder.com/400x200/E0E0E0/808080?text=Clube+Aventura" alt="Imagem do Clube" className="club-card-img" />
                                <div className="club-card-body">
                                    <h3 className="club-card-title">Clube Aventura Literária</h3>
                                    <p className="club-card-description">Explorando mundos fantásticos e heróis inesquecíveis.</p>
                                    <div className="club-card-footer">
                                        <span className="club-card-members">128 membros</span>
                                        <a href="#" className="btn btn-primary">Ver Clube</a>
                                    </div>
                                </div>
                            </div>
                            {/* Fim do Card de Clube */}

                            {/* Card de Clube (Exemplo 2) */}
                            <div className="club-card">
                                <img src="https://via.placeholder.com/400x200/D0D0D0/808080?text=Clube+Suspense" alt="Imagem do Clube" className="club-card-img" />
                                <div className="club-card-body">
                                    <h3 className="club-card-title">Mestres do Suspense</h3>
                                    <p className="club-card-description">Para quem não dispensa uma boa dose de mistério e tensão.</p>
                                    <div className="club-card-footer">
                                        <span className="club-card-members">75 membros</span>
                                        <a href="#" className="btn btn-primary">Ver Clube</a>
                                    </div>
                                </div>
                            </div>

                            {/* Card para Criar um Novo Clube */}
                            <div className="club-card create-club-card">
                                <a href="#" className="create-club-link">
                                    <div className="create-club-icon">+</div>
                                    <span className="create-club-text">Criar Novo Clube</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* =================================== */}
                    {/* Seção Clube do Mês */}
                    {/* =================================== */}
                    <section className="section-container">
                        <h2 className="section-title">Clube do Mês</h2>
                        {/* DADOS DINÂMICOS: Substituir as informações do clube em destaque */}
                        <div className="featured-club-card">
                            <div className="featured-badge">Destaque</div>
                            <img src="https://via.placeholder.com/150x220/C0C0C0/808080?text=Livro+Destaque" alt="Capa do Livro" className="featured-club-img" />
                            <div className="featured-club-body">
                                <h3 className="featured-club-title">Clássicos Atemporais</h3>
                                <p className="featured-club-author">Leitura atual: "Orgulho e Preconceito" de Jane Austen</p>
                                <p className="featured-club-description">
                                    Um clube dedicado a revisitar as obras que moldaram a literatura mundial. Ideal para quem busca discussões profundas e uma nova apreciação pelos clássicos.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =================================== */}
                    {/* Seção Eventos e Encontros */}
                    {/* =================================== */}
                    <section className="section-container">
                        <h2 className="section-title">Próximos Eventos e Encontros</h2>
                        <div className="events-grid">
                            {/* Card de Evento (Exemplo 1) */}
                            {/* DADOS DINÂMICOS: Repetir este bloco para cada evento */}
                            <div className="event-card">
                                <h3 className="event-card-title">Debate sobre "Duna"</h3>
                                <p className="event-card-date">28 de Agosto de 2024 - 19:30</p>
                                <p className="event-card-description">Análise sobre as adaptações e o impacto cultural da obra de Frank Herbert.</p>
                                <div className="event-card-footer">
                                    <a href="#" className="btn btn-secondary">Ver Detalhes</a>
                                </div>
                            </div>
                            {/* Fim do Card de Evento */}

                            {/* Card de Evento (Exemplo 2) */}
                            <div className="event-card">
                                <h3 className="event-card-title">Encontro Virtual: Poesia Moderna</h3>
                                <p className="event-card-date">05 de Setembro de 2024 - 20:00</p>
                                <p className="event-card-description">Leitura e discussão de poemas contemporâneos. Traga seus favoritos!</p>
                                <div className="event-card-footer">
                                    <a href="#" className="btn btn-secondary">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}