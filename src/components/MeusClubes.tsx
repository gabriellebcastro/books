import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Clubes.css'; // Reutilizando o CSS para consistência visual

interface Clube {
  _id: string;
  nome: string;
  capa: string;
  descricao: string;
  membros: any[];
}

export function MeusClubesPage() {
  const [meusClubes, setMeusClubes] = useState<Clube[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeusClubes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get<Clube[]>('http://localhost:5000/api/clubes/meus-clubes', config);
        setMeusClubes(data);
      } catch (err) {
        setError('Não foi possível carregar seus clubes.');
        console.error('Erro ao buscar clubes do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeusClubes();
  }, [navigate]);

  if (loading) {
    return <div className="page-container"><p>Carregando seus clubes...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <header className="clubes-header">
          <h1>Meus Clubes</h1>
          <p>Aqui estão todos os clubes dos quais você faz parte.</p>
        </header>

        <section className="section-container">
          {meusClubes.length > 0 ? (
            <div className="clubs-grid">
              {meusClubes.map(clube => (
                <div key={clube._id} className="club-card">
                  <img
                    src={`http://localhost:5000${clube.capa.replace(/\\/g, '/')}`}
                    alt={clube.nome}
                    className="club-card-img"
                  />
                  <div className="club-card-content">
                    <h3>{clube.nome}</h3>
                    <p className="club-card-description">{clube.descricao}</p>
                    <div className="club-card-footer">
                      <span className="club-card-members">
                        {(clube.membros || []).length} membros
                      </span>
                      <Link to={`/clubes/${clube._id}`} className="club-card-button">
                        Acessar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Você ainda não faz parte de nenhum clube. <Link to="/clubes">Explore os clubes</Link> e encontre sua turma!</p>
          )}
        </section>
      </main>
    </div>
  );
}