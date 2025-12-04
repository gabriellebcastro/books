import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MeusClubes.css'; // Usando o novo CSS dedicado

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
    <div className="meus-clubes-container">
      <main className="main-content">
        <header className="clubes-header">
          <h1>Meus Clubes</h1>
          <p>Aqui estão todos os clubes dos quais você faz parte.</p>
        </header>

        {meusClubes.length > 0 ? (
          <div className="meus-clubes-grid">
            {meusClubes.map(clube => (
              <Link to={`/clubes/${clube._id}`} key={clube._id} className="meu-clube-card">
                <div
                  className="meu-clube-card-banner"
                  style={{ backgroundImage: `url(${clube.capa ? `http://localhost:5000${clube.capa.replace(/\\/g, '/')}` : "/assets/placeholder.jpg"})` }}
                ></div>
                <div className="meu-clube-card-body">
                  <h3>{clube.nome}</h3>
                  <p>{clube.descricao}</p>
                  <div className="meu-clube-card-footer">
                    <span>{(clube.membros || []).length} membros</span>
                    <span>Acessar →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-clubes-container">
            <div className="icon">👥</div>
            <h2>Você ainda não faz parte de nenhum clube.</h2>
            <p>Explore os clubes existentes ou crie o seu próprio para começar!</p>
            <Link to="/clubes" className="btn">Explorar Clubes</Link>
          </div>
        )}
      </main>
    </div>
  );
}