import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/Login";
import { Home } from "./components/Home";
import { RegisterForm } from "./components/Register";
import { RecoverPassword } from "./components/RecoverPassword";
import { ClubesPage } from "./components/Clubes";
import { CadastrarLivroPage } from "./components/CadastrarLivro";
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
      <Route path="/clubes" element={<ClubesPage />} />
      
      {/* Rota para Cadastrar Livro */}
      <Route path="/cadastrar-livro" element={<CadastrarLivroPage />} />
    </Routes>
  );
}

export default App;