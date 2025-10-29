import { useState, useEffect } from "react";
import "./Clubes.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

type Clube = {
  _id: string;
  nome: string;
  tipo: string;
  genero: string;
  capa?: string;
  membros?: string[];
  ehMembro?: boolean;
  ehModerador?: boolean;
};

export function ClubesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState(tabParam || "encontrar");
  const [showEncontrosDropdown, setShowEncontrosDropdown] = useState(false);
  const [clubes, setClubes] = useState<Clube[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchClubes = async () => {
      try {
        const endpoint =
          tab === "meus"
            ? "http://localhost:4000/api/clubes/moderados"
            : "http://localhost:4000/api/clubes";

        const res = await fetch(endpoint, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        console.log(`📥 Dados (${tab}):`, data);
        setClubes(data);
      } catch (err) {
        console.error("Erro ao buscar clubes:", err);
      }
    };

    fetchClubes();
  }, [tab]);

  const solicitarEntrada = async (clubeId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/clubes/${clubeId}/solicitar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Solicitação enviada ao moderador!");
      } else {
        alert(data.message || "Erro ao solicitar entrada.");
      }
    } catch (error) {
      console.error("Erro ao solicitar entrada:", error);
      alert("Erro ao solicitar entrada.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="clubes-hero">
        <h1>Minha biblioteca</h1>
        <p className="subheading">
          Visualize sua biblioteca e cadastre novos livros.
        </p>

        <div className="tabs">
          <button
            className={tab === "encontrar" ? "active" : ""}
            onClick={() => setTab("encontrar")}
          >
            Meus livros
          </button>
          <button
            className={tab === "meus" ? "active" : ""}
            onClick={() => setTab("meus")}
          >
            Meus amigos
          </button>
        </div>
      </div>

      <div className="clubes-page">
        <div className="filtros">
          <div className="search-bar">
            <input type="text" placeholder="Pesquise seus livros" />
            <button className="search-icon">🔍</button>
          </div>

          <div className="filtros-rapidos">
            <span className="filtros-label">Filtros rápidos:</span>
            <button> Gênero Literário </button>
            <button> Autor </button>
            <div className="dropdown-wrapper">
              <button
                className="dropdown-toggle"
                onClick={() => setShowEncontrosDropdown(!showEncontrosDropdown)}
              >
                Status
              </button>
              {showEncontrosDropdown && (
                <div className="club-dropdown-menu">
                  <button>Quero ler</button>
                  <button>Lendo</button>
                  <button>Lido</button>
                </div>
              )}
            </div>
            <button>Favoritos</button>
            <button>Emprestei</button>
          </div>
        </div>

        <div className="clubes-grid">
          {clubes.map((club, index) => {
            const baseURL = "http://localhost:4000/uploads/";
            return (
              <div className="clube-card" key={index}>
                <img
                  src={
                    club.capa
                      ? baseURL + club.capa
                      : "https://via.placeholder.com/150x100"
                  }
                  alt={`Imagem do clube ${club.nome}`}
                  className="clube-img"
                />
                <span className="tipo">{club.tipo}</span>
                <h3>{club.nome}</h3>
                <button
                  className="entrar"
                  onClick={() => {
                    if (
                      club.ehModerador ||
                      club.ehMembro ||
                      club.tipo === "Público"
                    ) {
                      navigate(`/clube/${club._id}`);
                    } else {
                      if (
                        window.confirm(
                          "Este clube é privado. Deseja solicitar entrada?"
                        )
                      ) {
                        solicitarEntrada(club._id);
                      }
                    }
                  }}
                >
                  Entrar
                </button>
                <p className="genero">📚 {club.genero}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
