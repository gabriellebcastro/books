import "./Register.css";
import illustration from "../assets/illustration-login.svg";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

export function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/register", {
        email: form.email,
        username: form.username,
        password: form.password,
      });

      setMessage(response.data.message);
      setForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
  if (axios.isAxiosError(err) && err.response) {
    setMessage(err.response.data.message);
  } else {
    setMessage("Erro ao conectar com o servidor.");
  }
}
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <h1>Criar conta</h1>
        <p>Cadastre-se no Club.</p>

        {message && <p className="message">{message}</p>}

        <div className="input-group">
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Usuário
            <input
              type="text"
              name="username"
              placeholder="Crie seu usuário"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Senha
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Crie sua senha"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
        </div>

        <div className="input-group">
          <label>
            Confirmar senha
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repita sua senha"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
        </div>

        <button type="submit">Cadastrar</button>

        <p className="register-link">
          Já tem uma conta? <Link to="/login">Entrar.</Link>
        </p>
      </form>

      <div className="illustration">
        <img src={illustration} alt="Ilustração" />
      </div>
    </div>
  );
}
