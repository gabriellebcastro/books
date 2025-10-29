import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

type Notificacao = {
  _id: string;
  mensagem: string;
  tipo: string;
};

type Usuario = {
  _id: string;
  foto?: string;
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchNotificacoes();
    fetchUsuario();
  }, []);

  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar usuário");
      const data = await res.json();
      setUsuario(data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
  };

  const fetchNotificacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/notificacoes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar notificações");
      const data = await res.json();
      setNotificacoes(data);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
  };

  const handleBellClick = async () => {
    const novoEstado = !mostrarNotificacoes;
    setMostrarNotificacoes(novoEstado);

    if (novoEstado) {
      await fetchNotificacoes();
    }
  };

  const aceitarSolicitacao = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/notificacoes/${id}/aceitar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Solicitação aceita com sucesso.");
        await fetchNotificacoes();
      } else {
        alert(data.message || "Erro ao aceitar solicitação.");
      }
    } catch (err) {
      console.error("Erro ao aceitar solicitação:", err);
    }
  };

  const negarSolicitacao = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/notificacoes/${id}/negar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Solicitação negada com sucesso.");
        await fetchNotificacoes();
      } else {
        alert(data.message || "Erro ao negar solicitação.");
      }
    } catch (err) {
      console.error("Erro ao negar solicitação:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Books</div>
      </div>

      <ul className="navbar-links">
        <li><Link to="/home">Início</Link></li>
        <li><Link to="/clubes">Minha biblioteca</Link></li>
        <li><Link to="/eventos">Perfil</Link></li>
      </ul>

      <div className="navbar-right">
        <div className="notificacoes-wrapper">
          <button className="bell" onClick={handleBellClick}>🔔</button>
          {mostrarNotificacoes && (
            <div className="notificacoes-dropdown">
              {notificacoes.length === 0 ? (
                <p className="sem-notificacao">Sem notificações</p>
              ) : (
                notificacoes.map((n) => (
                  <div key={n._id} className="notificacao-item">
                    <span>{n.mensagem}</span>
                    {n.tipo === "solicitacao_entrada" && (
                      <>
                        <button
                          className="btn-aceitar"
                          onClick={() => aceitarSolicitacao(n._id)}
                          title="Aceitar solicitação"
                        >
                          ✔️
                        </button>
                        <button
                          className="btn-negar"
                          onClick={() => negarSolicitacao(n._id)}
                          title="Negar solicitação"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="avatar-wrapper" onClick={toggleMenu}>
          <img
            className="avatar"
            src={usuario?.foto || "/assets/placeholder.jpg"}
            alt="Perfil do usuário"
          />
          {menuOpen && (
            <div className="navbar-dropdown-menu" onMouseLeave={closeMenu}>
              <Link to="/profile">Perfil</Link>
              <Link to="/create">Criar Club</Link>
              <Link to="/estatisticas">Minhas Estatísticas</Link>
              <Link to="/configuracoes">Configurações</Link>
              <button onClick={handleLogout} className="dropdown-item">Sair</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}