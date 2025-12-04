import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LeiturasDoMes.css'; // Criaremos este arquivo a seguir

interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
}

interface Clube {
  _id: string;
  nome: string;
  capa: string;
  leituraAtual?: Book;
}

export function LeiturasDoMesPage() {
  const [clubesComLeitura, setClubesComLeitura] = useState<Clube[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeituras = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // A rota 'meus-clubes' agora precisa popular a 'leituraAtual'
        const { data } = await axios.get<Clube[]>('http://localhost:5000/api/clubes/meus-clubes', config);
        
        // Filtramos para mostrar apenas clubes que têm uma leitura definida
        const clubesFiltrados = data.filter(clube => clube.leituraAtual);
        setClubesComLeitura(clubesFiltrados);

      } catch (err) {
        setError('Não foi possível carregar as leituras do mês.');
        console.error('Erro ao buscar leituras:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeituras();
  }, [navigate]);

  if (loading) {
    return <div className="page-container"><p>Carregando leituras...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="page-container leituras-page-container">
      <main className="main-content">
        <header className="clubes-header">
          <h1>Leituras do Mês</h1>
          <p>Seu resumo de todas as leituras atuais dos seus clubes.</p>
        </header>

        <section className="section-container">
          {clubesComLeitura.length > 0 ? (
            <div className="leituras-grid">
              {clubesComLeitura.map(clube => (
                <div key={clube._id} className="leitura-card">
                  <div className="leitura-card-book-cover">
                    <img src={clube.leituraAtual!.cover} alt={clube.leituraAtual!.title} />
                  </div>
                  <div className="leitura-card-info">
                    <h3>{clube.leituraAtual!.title}</h3>
                    <p className="author">de {clube.leituraAtual!.author}</p>
                    <Link to={`/clubes/${clube._id}`} className="leitura-card-clube-link">
                      <img src={clube.capa ? `http://localhost:5000${clube.capa.replace(/\\/g, '/')}` : "/assets/placeholder.jpg"} alt={clube.nome} className="clube-avatar-small" />
                      <span>{clube.nome}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum dos seus clubes definiu uma leitura para este mês ainda.</p>
          )}
        </section>
      </main>
    </div>
  );
}