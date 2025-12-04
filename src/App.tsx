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
import { PlaceholderPage } from "./components/PlaceholderPage";
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
        <Route path="/explorar" element={<ExplorarPage />} />
        <Route path="/biblioteca/:filter?" element={<MinhaBibliotecaPage />} />
        <Route path="/cadastrar-livro" element={<CadastrarLivro />} />
        <Route path="/clubes/:id" element={<ClubeDoLivro />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/create-club" element={<CreateClub />} />
        
        {/* Placeholder routes for new sidebar links */}
        <Route path="/meus-clubes" element={<div>Página de Meus Clubes</div>} />
        <Route path="/leituras-do-mes" element={<div>Página de Leituras do Mês</div>} />
        <Route path="/eventos" element={<div>Página de Próximos Encontros</div>} />
        <Route path="/profile" element={<MeuPerfilPage />} />
        <Route 
          path="/estatisticas" 
          element={<PlaceholderPage title="Minhas Estatísticas" description="Em breve, aqui você verá suas estatísticas de leitura." icon="📊" />} 
        />
        <Route 
          path="/configuracoes" 
          element={<PlaceholderPage title="Configurações" description="Em breve, aqui você poderá configurar suas preferências." icon="⚙️" />} 
        />
      </Route>
    </Routes>
  );
}

export default App;