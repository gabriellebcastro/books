import "./RecoverPassword.css";
import illustration from "../assets/illustration-login.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setMessage("Link de recuperação enviado com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar o link. Verifique o email informado.");
    }
  };

  return (
    <div className="recover-container">
      <form className="recover-box" onSubmit={handleSubmit}>
        <h1>Recuperar senha</h1>
        <p>
          Digite seu email cadastrado para enviarmos o link de recuperação de
          senha.
        </p>

        {message && <p className="message">{message}</p>}

        <div className="input-group">
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Enviar</button>

        <p className="resend-link">
          Não recebeu o link? <Link to="/recover">Reenviar email.</Link>
        </p>
      </form>

      <div className="illustration">
        <img src={illustration} alt="Ilustração" />
      </div>
    </div>
  );
}
