import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LeiturasDoMes.css'; // Reutilizando o CSS

interface Encontro {
  _id: string;
  data: string;
  descricao: string;
  link?: string;
}

interface Clube {
  _id: string;
  nome: string;
  capa: string;
  encontros?: Encontro[];
}

interface EncontroAgregado extends Encontro {
  clube: {
    _id: string;
    nome: string;
    capa: string;
  };
}

export function EventosPage() {
  const [eventos, setEventos] = useState<EncontroAgregado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data: clubes } = await axios.get<Clube[]>('http://localhost:5000/api/clubes/meus-clubes', config);

        const todosEventos = clubes.flatMap(clube =>
          (clube.encontros || []).map(encontro => ({
            ...encontro,
            clube: { _id: clube._id, nome: clube.nome, capa: clube.capa },
          }))
        );

        // Filtra eventos futuros e ordena por data
        const eventosFuturos = todosEventos
          .filter(e => new Date(e.data) >= new Date())
          .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        setEventos(eventosFuturos);
      } catch (err) {
        setError('Não foi possível carregar os eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [navigate]);

  if (loading) return <div className="page-container"><p>Carregando próximos eventos...</p></div>;
  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="page-container leituras-page-container">
      <main className="main-content">
        <header className="clubes-header">
          <h1>Próximos Encontros</h1>
          <p>Todos os eventos dos seus clubes, organizados por data.</p>
        </header>

        <section className="section-container">
          {eventos.length > 0 ? (
            <div className="leituras-grid">
              {eventos.map(evento => (
                <div key={evento._id} className="leitura-card">
                  <div className="leitura-card-info" style={{ width: '100%' }}>
                    <h3>{new Date(evento.data).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</h3>
                    <p className="author">{evento.descricao}</p>
                    <Link to={`/clubes/${evento.clube._id}`} className="leitura-card-clube-link">
                      <img src={evento.clube.capa ? `http://localhost:5000${evento.clube.capa.replace(/\\/g, '/')}` : "/assets/placeholder.jpg"} alt={evento.clube.nome} className="clube-avatar-small" />
                      <span>{evento.clube.nome}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum encontro agendado nos seus clubes.</p>
          )}
        </section>
      </main>
    </div>
  );
}