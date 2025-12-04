import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Estatisticas.css';

interface Stats {
  totalLivrosLidos: number;
  totalPaginasLidas: number;
  generosLidos: Record<string, number>;
}

export function EstatisticasPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get<Stats>('http://localhost:5000/api/stats/my-stats', config);
        setStats(data);
      } catch (err) {
        setError('Não foi possível carregar suas estatísticas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) return <div className="stats-page-container"><p>Carregando estatísticas...</p></div>;
  if (error) return <div className="stats-page-container"><p className="error-message">{error}</p></div>;

  const generosOrdenados = stats ? Object.entries(stats.generosLidos).sort(([, a], [, b]) => b - a) : [];

  return (
    <div className="stats-page-container">
      <main className="stats-main-content">
        <header className="stats-header">
          <h1>Minhas Estatísticas</h1>
          <p>Seu progresso e hábitos de leitura em um só lugar.</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon">📚</div>
            <div className="value">{stats?.totalLivrosLidos || 0}</div>
            <div className="label">Livros Lidos</div>
          </div>
          <div className="stat-card">
            <div className="icon">📖</div>
            <div className="value">
              {stats?.totalPaginasLidas.toLocaleString('pt-BR') || 0}
            </div>
            <div className="label">Páginas Lidas</div>
          </div>
          <div className="stat-card">
            <div className="icon">🏆</div>
            <div className="value">
              {generosOrdenados.length > 0 ? generosOrdenados[0][0] : '-'}
            </div>
            <div className="label">Gênero Favorito</div>
          </div>
        </div>

        <section>
          <h2 className="section-title">Gêneros Lidos</h2>
          {generosOrdenados.length > 0 ? (
            <ul className="genres-list">
              {generosOrdenados.map(([genero, quantidade]) => (
                <li key={genero} className="genre-item">
                  <span className="genre-name">{genero}</span>
                  <span className="genre-count">{quantidade} {quantidade > 1 ? 'livros' : 'livro'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não marcou nenhum livro como lido. Comece a ler para ver seus gêneros favoritos aqui!</p>
          )}
        </section>
      </main>
    </div>
  );
}