import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Icon = ({ emoji }: { emoji: string }) => <span className="sidebar-icon">{emoji}</span>;

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Use NavLink to automatically get an "active" class for styling the current page link
  const getLink = (to: string, icon: string, text: string) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
      <Icon emoji={icon} /> {text}
    </NavLink>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/home" className="sidebar-logo">Books</Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>{getLink('/home', '🏠', 'Home')}</li>
          
          <li className="sidebar-section-title">Minha Biblioteca</li>
          <li>{getLink('/biblioteca/todos', '📚', 'Todos os livros')}</li>
          <li>{getLink('/biblioteca/favoritos', '⭐', 'Favoritos')}</li>
          <li>{getLink('/biblioteca/lido', '✅', 'Lidos')}</li>
          <li>{getLink('/biblioteca/lendo', '📖', 'Lendo')}</li>
          <li>{getLink('/biblioteca/quero-ler', '🔖', 'Quero Ler')}</li>

          <li className="sidebar-section-title">Clubes do Livro</li>
          <li>{getLink('/clubes', '🌍', 'Explorar Clubes')}</li>
          <li>{getLink('/meus-clubes', '👥', 'Meus Clubes')}</li>
          <li>{getLink('/create-club', '➕', 'Criar Clube')}</li>

          <li className="sidebar-section-title">Leituras e Eventos</li>
          <li>{getLink('/leituras-do-mes', '🗓️', 'Leituras do Mês')}</li>
          <li>{getLink('/eventos', '🎉', 'Próximos Encontros')}</li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <ul>
            <li className="sidebar-section-title">Área do Usuário</li>
            <li>{getLink('/profile', '👤', 'Meu Perfil')}</li>
            <li>{getLink('/estatisticas', '📊', 'Minhas Estatísticas')}</li>
            <li>{getLink('/configuracoes', '⚙️', 'Configurações')}</li>
            <li>
              <button onClick={handleLogout} className="sidebar-logout-btn">
                <Icon emoji="🚪" /> Sair
              </button>
            </li>
        </ul>
      </div>
    </aside>
  );
}