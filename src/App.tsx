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
import { Sidebar } from "./components/Sidebar";
import "./App.css";

// Layout com a Sidebar
const AppLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
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
        <Route path="/biblioteca/:filter?" element={<MinhaBibliotecaPage />} />
        <Route path="/cadastrar-livro" element={<CadastrarLivro />} />
        <Route path="/clubes/:id" element={<ClubeDoLivro />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/create-club" element={<CreateClub />} />
        
        {/* Placeholder routes for new sidebar links */}
        <Route path="/meus-clubes" element={<div>Página de Meus Clubes</div>} />
        <Route path="/leituras-do-mes" element={<div>Página de Leituras do Mês</div>} />
        <Route path="/eventos" element={<div>Página de Próximos Encontros</div>} />
        <Route path="/profile" element={<div>Página de Meu Perfil</div>} />
        <Route path="/estatisticas" element={<div>Página de Minhas Estatísticas</div>} />
        <Route path="/configuracoes" element={<div>Página de Configurações</div>} />
      </Route>
    </Routes>
  );
}

export default App;