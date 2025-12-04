import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Clubes.css';

interface Clube {
    _id: string;
    nome: string;
    capa: string;
    descricao: string;
    membros: any[];
    leituraAtual?: { title: string };
}

export function Clubes() {
    const [clubes, setClubes] = useState<Clube[]>([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [clubeDoMes, setClubeDoMes] = useState<Clube | null>(null);

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

        const fetchClubeDoMes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/clubes/clube-do-mes');
                if (response.ok) {
                    setClubeDoMes(await response.json());
                }
            } catch (error) {
                console.error('Erro ao buscar clube do mês:', error);
            }
        };
        fetchClubeDoMes();
    }, []);

    const clubesAleatorios = useMemo(() => {
        // Pega 5 clubes aleatórios
        return clubes
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
    }, [clubes]);

    const clubesFiltrados = clubes.filter(clube =>
        clube.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const clubesParaExibir = termoBusca ? clubesFiltrados : clubesAleatorios;


    return (
        <div>
            <main className="main-content">

                <header className="clubes-header">
                    <h1>Clubes do Livro</h1>
                    <p>
                        Conecte-se com outros leitores, participe de discussões e descubra novas aventuras literárias.
                    </p>
                </header>
                
                <section>
                    <h2 className="section-title">Explore Clubes</h2>
                    <div className="filtros-container">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Pesquisar clubes por nome..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    <div className="clubs-grid">
                        {clubesParaExibir.map(clube => (
                            <div key={clube._id} className="club-card">
                                <img
                                    src={clube.capa ? `http://localhost:5000${clube.capa.replace(/\\/g, '/')}` : "/assets/placeholder.jpg"}
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
                    </div>
                </section>

                {/* CLUBES DESTAQUE DO MÊS */}
                {clubeDoMes && (
                    <section className="section-container">
                        <h2 className="section-title">Clube Destaque do Mês</h2>
                        <div className="featured-club-card">
                            <img
                                src={clubeDoMes.capa ? `http://localhost:5000${clubeDoMes.capa.replace(/\\/g, '/')}` : "/assets/placeholder.jpg"}
                                alt={`Capa do ${clubeDoMes.nome}`}
                                className="featured-club-img"
                            />
                            <div className="featured-club-body">
                                <h3>{clubeDoMes.nome}</h3>
                                {clubeDoMes.leituraAtual && (
                                    <p className="featured-club-author">
                                        Livro do mês: "{clubeDoMes.leituraAtual.title}"
                                    </p>
                                )}
                                <p>{clubeDoMes.descricao}</p>
                                <Link to={`/clubes/${clubeDoMes._id}`} className="btn btn-primary">
                                    Ver Clube
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* ENCONTROS RECOMENDADOS */}
                <section className="section-container">
                    <h2 className="section-title">Encontros Recomendados</h2>

                    <div className="events-grid">
                        <div className="event-card">
                            <h3 className="event-card-title">Discussão de "Duna"</h3>
                            <p className="event-card-date">25 de Julho de 2024</p>
                            <p className="event-card-description">
                                Prepare-se para uma jornada épica por Arrakis. Traga suas anotações e teorias!
                            </p>
                        </div>

                        <div className="event-card">
                            <h3 className="event-card-title">Encontro de Poesia</h3>
                            <p className="event-card-date">02 de Agosto de 2024</p>
                            <p className="event-card-description">
                                Uma noite para compartilhar seus poemas favoritos ou originais.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
