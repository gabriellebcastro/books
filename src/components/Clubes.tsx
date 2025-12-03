import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Clubes.css';

interface Clube {
    _id: string;
    nome: string;
    capa: string;
    descricao: string;
    membros: any[];
}

export function Clubes() {
    const [clubes, setClubes] = useState<Clube[]>([]);
    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => {
        const fetchClubes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/clubes');
                if (response.ok) {
                    const data = await response.json();
                    setClubes(data);
                } else {
                    console.error('Erro ao buscar clubes:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar clubes:', error);
            }
        };
        fetchClubes();
    }, []);

    const clubesAleatorios = useMemo(() => {
        return [...clubes].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [clubes]);

    const clubesFiltrados = useMemo(() => {
        return clubes.filter(clube =>
            clube.nome.toLowerCase().includes(termoBusca.toLowerCase())
        );
    }, [termoBusca, clubes]);

    const clubesParaExibir = termoBusca ? clubesFiltrados : clubesAleatorios;

    return (
        <div className="page-container">
            <main className="main-content">

                {/* HEADER PADRONIZADO */}
                <header className="clubes-header">
                    <h1>Clubes do Livro</h1>
                    <p>
                        Conecte-se com outros leitores, participe de discussões e descubra novas aventuras literárias.
                    </p>
                </header>

                {/* EXPLORAR CLUBES */}
                <section className="section-container">
                    <h2 className="section-title">Explore Clubes</h2>

                    <div className="filtros-container">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Pesquisar clubes por nome..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                            <button className="search-icon" type="button">🔍</button>
                        </div>
                    </div>

                    {/* GRID DE CLUBES */}
                    <div className="clubs-grid">
                        {clubesParaExibir.map(clube => (
                            <div key={clube._id} className="club-card">
                                <img
                                    src={`http://localhost:5000${clube.capa.replace(/\\/g, '/')}`}
                                    alt={clube.nome}
                                    className="club-card-img"
                                />

                                <div className="club-card-body">
                                    <h3 className="club-card-title">{clube.nome}</h3>
                                    <p className="club-card-description">{clube.descricao}</p>

                                    <div className="club-card-footer">
                                        <span className="club-card-members">
                                            {(clube.membros || []).length} membros
                                        </span>

                                        <Link to={`/clubes/${clube._id}`} className="btn btn-secondary">
                                            Ver Mais
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* CARD DE CRIAR CLUBE */}
                        <div className="club-card create-club-card">
                            <Link to="/create-club" className="create-club-link">
                                <span className="create-club-icon">+</span>
                                <span className="create-club-text">Criar Novo Clube</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CLUBE DO MÊS */}
                <section className="section-container">
                    <h2 className="section-title">Clube do Mês</h2>

                    <div className="featured-club-card">
                        <div className="featured-badge">Destaque</div>

                        <img
                            src="/path/to/clube-mes-image.jpg"
                            alt="Clube do Mês"
                            className="featured-club-img"
                        />

                        <div className="featured-club-body">
                            <h3 className="featured-club-title">A Sociedade dos Leitores Noturnos</h3>
                            <p className="featured-club-author">Livro do mês: "O Conto da Aia"</p>
                            <p>
                                Este mês, estamos lendo "O Conto da Aia" de Margaret Atwood.
                                Junte-se a nós para uma discussão profunda sobre temas de poder, gênero e resistência.
                            </p>

                            <Link
                                to="/clubes/sociedade-leitores-noturnos"
                                className="btn btn-primary"
                            >
                                Saiba Mais
                            </Link>
                        </div>
                    </div>
                </section>

                {/* EVENTOS */}
                <section className="section-container">
                    <h2 className="section-title">Próximos Eventos</h2>

                    <div className="events-grid">
                        <div className="event-card">
                            <h3 className="event-card-title">Discussão de "Duna"</h3>
                            <p className="event-card-date">25 de Julho de 2024</p>
                            <p className="event-card-description">
                                Prepare-se para uma jornada épica por Arrakis. Traga suas anotações e teorias!
                            </p>
                            <div className="event-card-footer">
                                <span className="btn-secondary">Viajantes da Ficção Científica</span>
                            </div>
                        </div>

                        <div className="event-card">
                            <h3 className="event-card-title">Encontro de Poesia</h3>
                            <p className="event-card-date">02 de Agosto de 2024</p>
                            <p className="event-card-description">
                                Uma noite para compartilhar seus poemas favoritos ou originais.
                            </p>
                            <div className="event-card-footer">
                                <span className="btn-secondary">Versos e Vinhos</span>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
