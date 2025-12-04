import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginForm } from "./components/Login";
import { Home } from "./components/Home";
import { RegisterForm } from "./components/Register";
import { RecoverPassword } from "./components/RecoverPassword";
import { MinhaBibliotecaPage } from "./components/MinhaBiblioteca";
import { CadastrarLivro } from "./components/CadastrarLivro";
import { ClubeDoLivro } from "./components/ClubeDoLivro";
import { Clubes } from "./components/Clubes";
import { CreateClub } from "./components/CreateClub";
import { ExplorarPage } from "./components/Explorar";
import { MeuPerfilPage } from "./components/MeuPerfil";
import { ConfiguracoesPage } from "./components/ConfiguracoesPage"; // This path is correct, the file needs to be in this location.
import { MeusClubesPage } from "./components/MeusClubes";
import { LeiturasDoMesPage } from "./components/LeiturasDoMes";
import { EventosPage } from "./components/EventosPage"; // Keep this as is
import { EstatisticasPage } from "./EstatisticasPage";
import { Sidebar } from "./components/Sidebar";
import "./App.css";

// Layout com a Sidebar
const AppLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="page-wrapper">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Rotas sem sidebar */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/recover" element={<RecoverPassword />} />

      {/* Rotas com sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explorar" element={<ExplorarPage />} />
        <Route path="/biblioteca/:filter?" element={<MinhaBibliotecaPage />} />
        <Route path="/cadastrar-livro" element={<CadastrarLivro />} />
        <Route path="/clubes/:id" element={<ClubeDoLivro />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/create-club" element={<CreateClub />} />
        
        {/* Placeholder routes for new sidebar links */}
        <Route path="/meus-clubes" element={<MeusClubesPage />} />
        <Route path="/leituras-do-mes" element={<LeiturasDoMesPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/profile" element={<MeuPerfilPage />} />
        <Route 
          path="/estatisticas" 
          element={<EstatisticasPage />} 
        />
        <Route 
          path="/configuracoes" 
          element={<ConfiguracoesPage />} 
        />
      </Route>
    </Routes>
  );
}

export default App;