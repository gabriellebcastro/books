import { useState } from 'react';
import { Navbar } from './Navbar';
import './CadastrarLivro.css';

export function CadastrarLivroPage() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genero, setGenero] = useState('');
  const [numPaginas, setNumPaginas] = useState('');
  const [capaUrl, setCapaUrl] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // For now, we'll just log the data to the console
    console.log({
      titulo,
      autor,
      isbn,
      genero,
      numPaginas,
      capaUrl,
    });
    alert('Livro cadastrado com sucesso! (Verifique o console)');
  };

  return (
    <>
      <Navbar />
      <div className="cadastrar-livro-container">
        <div className="form-wrapper">
          <h1>Cadastrar Novo Livro</h1>
          <p>Preencha as informações abaixo para adicionar um novo livro à sua biblioteca.</p>
          <form onSubmit={handleSubmit} className="livro-form">
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="autor">Autor</label>
              <input
                type="text"
                id="autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="genero">Gênero</label>
              <input
                type="text"
                id="genero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numPaginas">Número de Páginas</label>
              <input
                type="number"
                id="numPaginas"
                value={numPaginas}
                onChange={(e) => setNumPaginas(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="capaUrl">URL da Capa</label>
              <input
                type="text"
                id="capaUrl"
                value={capaUrl}
                onChange={(e) => setCapaUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">Cadastrar Livro</button>
          </form>
        </div>
      </div>
    </>
  );
}