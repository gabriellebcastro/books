import { useState } from "react";
import "./Clubes.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

// Definindo os tipos para Livro e Modal
type Livro = {
  id: number;
  titulo: string;
  autor: string;
  sinopse: string;
  capaUrl: string;
};

// Dados de exemplo (mock)
const mockLivros: Livro[] = [
  {
    id: 1,
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    sinopse: "Uma jornada épica para destruir um anel mágico e salvar a Terra-média da escuridão.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/71ZLavB-8NL.jpg",
  },
  {
    id: 2,
    titulo: "Duna",
    autor: "Frank Herbert",
    sinopse: "A história de Paul Atreides, herdeiro de uma nobre família em um futuro distante, que deve liderar seu povo no perigoso planeta desértico de Arrakis.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/A1u+2fY5yTL.jpg",
  },
  {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    sinopse: "Um romance distópico que explora os perigos do totalitarismo, da vigilância em massa e da repressão da liberdade individual.",
    capaUrl: "https://m.media-amazon.com/images/I/819js3EQwbL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    titulo: "A Revolução dos Bichos",
    autor: "George Orwell",
    sinopse: "Uma fábula satírica sobre um grupo de animais que se rebelam contra seus donos humanos, apenas para cair sob uma tirania ainda mais brutal.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/912i3kG+tIL.jpg",
  },
  {
    id: 5,
    titulo: "O Guia do Mochileiro das Galáxias",
    autor: "Douglas Adams",
    sinopse: "A cômica aventura de Arthur Dent, um humano que é salvo da destruição da Terra por seu amigo alienígena, Ford Prefect.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/81Jj4s4pGjL.jpg",
  },
  {
    id: 6,
    titulo: "Cem Anos de Solidão",
    autor: "Gabriel García Márquez",
    sinopse: "A história da família Buendía na cidade fictícia de Macondo, ao longo de sete gerações.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/81+U+4o4+jL.jpg",
  },
  {
    id: 7,
    titulo: "O Apanhador no Campo de Centeio",
    autor: "J.D. Salinger",
    sinopse: "A história de Holden Caulfield, um jovem que lida com a alienação e a angústia da adolescência.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/812gCMvJ6qL.jpg",
  },
  {
    id: 8,
    titulo: "Fahrenheit 451",
    autor: "Ray Bradbury",
    sinopse: "Em um futuro onde os livros são proibidos, um bombeiro começa a questionar seu papel na sociedade.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/71OFqSR+s+L.jpg",
  },
  {
    id: 9,
    titulo: "O Sol é para Todos",
    autor: "Harper Lee",
    sinopse: "Uma história sobre injustiça racial em uma pequena cidade do sul dos Estados Unidos, vista pelos olhos de uma criança.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/91MMt6A2u3L.jpg",
  },
  {
    id: 10,
    titulo: "O Grande Gatsby",
    autor: "F. Scott Fitzgerald",
    sinopse: "Um retrato da Era do Jazz na América, explorando temas de riqueza, amor e o sonho americano.",
    capaUrl: "https://images-na.ssl-images-amazon.com/images/I/81Qu3hQ3d4L.jpg",
  },
];

export function ClubesPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState(tabParam || "meus-livros");
  const [showEncontrosDropdown, setShowEncontrosDropdown] = useState(false);
  
  // Estado para os livros e para o modal
  const [livros] = useState<Livro[]>(mockLivros);
  const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);
  const navigate = useNavigate();

  const handleOpenModal = (livro: Livro) => {
    setSelectedLivro(livro);
  };

  const handleCloseModal = () => {
    setSelectedLivro(null);
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
            className={tab === "meus-livros" ? "active" : ""}
            onClick={() => setTab("meus-livros")}
          >
            Meus livros
          </button>
          <button
            className={tab === "amigos" ? "active" : ""}
            onClick={() => setTab("amigos")}
          >
            Meus amigos
          </button>
        </div>
      </div>

      <div className="clubes-page">
        <div className="filtros-container">
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
          <button className="btn-add-livro" onClick={() => navigate('/cadastrar-livro')}>+ Cadastrar Livro</button>
        </div>

        <div className="livros-grid">
          {livros.map((livro) => (
            <div
              className="livro-card"
              key={livro.id}
              onClick={() => handleOpenModal(livro)}
            >
              <img src={livro.capaUrl} alt={`Capa do livro ${livro.titulo}`} />
            </div>
          ))}
        </div>
      </div>

      {selectedLivro && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-body">
              <img className="modal-capa" src={selectedLivro.capaUrl} alt={`Capa de ${selectedLivro.titulo}`} />
              <div className="modal-details">
                <h2>{selectedLivro.titulo}</h2>
                <h3>{selectedLivro.autor}</h3>
                <p>{selectedLivro.sinopse}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}