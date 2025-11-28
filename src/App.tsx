import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/Login";
import { Home } from "./components/Home";
import { RegisterForm } from "./components/Register";
import { RecoverPassword } from "./components/RecoverPassword";
import { MinhaBibliotecaPage } from "./components/MinhaBiblioteca";
import { CadastrarLivro } from "./components/CadastrarLivro";
import { ClubeDoLivro } from "./components/ClubeDoLivro";
import { Clubes } from "./components/Clubes";
import { CreateClub } from "./components/CreateClub"; // Importa o novo componente
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Redireciona a rota raiz para a página de login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota de Login */}
      <Route path="/login" element={<LoginForm />} />

      {/* Rota de Cadastro */}
      <Route path="/register" element={<RegisterForm />} />
      
      {/* Rota de Recuperação de Senha */}
      <Route path="/recover" element={<RecoverPassword />} />
      
      {/* Rota para a Home */}
      <Route path="/home" element={<Home />} />

      {/* Rota para a Minha Biblioteca */}
      <Route path="/minha-biblioteca" element={<MinhaBibliotecaPage />} />
      
      {/* Rota para Cadastrar Livro */}
      <Route path="/cadastrar-livro" element={<CadastrarLivro />} />

      {/* Rota para o Clube do Livro */}
      <Route path="/clube-do-livro" element={<ClubeDoLivro />} />

      {/* Rota para a página de Clubes */}
      <Route path="/clubes" element={<Clubes />} />

      {/* Rota para a página de Criação de Clubes */}
      <Route path="/create-club" element={<CreateClub />} />
    </Routes>
  );
}

export default App;