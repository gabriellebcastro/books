import { useState } from 'react';
import './CadastrarLivro.css';
import axios from 'axios'; // Importe o axios

export function CadastrarLivro() { 
  const [title, setTitle] = useState(''); 
  const [author, setAuthor] = useState(''); 
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState(''); 
  const [pages, setPages] = useState(''); 
  const [cover, setCover] = useState(''); 
  const [synopsis, setSynopsis] = useState('');
  const [message, setMessage] = useState(''); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Você precisa estar logado para cadastrar um livro.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/books/catalog',
        {
          title,
          author,
          isbn,
          genre,
          pages: Number(pages),
          cover,
          synopsis,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage('Livro cadastrado com sucesso!');
        // Limpar o formulário
        setTitle('');
        setAuthor('');
        setIsbn('');
        setGenre('');
        setPages('');
        setCover('');
        setSynopsis('');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Erro: ${error.response.data.message}`);
      } else {
        setMessage('Ocorreu um erro ao cadastrar o livro.');
      }
      console.error('Erro ao cadastrar livro:', error);
    }
  };

  return (
    <>
      <div className="cadastrar-livro-container">
        <div className="form-wrapper">
          <h1>Cadastrar Novo Livro</h1>
          <p>Preencha as informações abaixo para adicionar um novo livro à sua biblioteca.</p>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit} className="livro-form">
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="autor">Autor</label>
              <input
                type="text"
                id="autor"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
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
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numPaginas">Número de Páginas</label>
              <input
                type="number"
                id="numPaginas"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="capaUrl">URL da Capa</label>
              <input
                type="text"
                id="capaUrl"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sinopse">Sinopse</label>
              <textarea
                id="sinopse"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-submit">Cadastrar Livro</button>
          </form>
        </div>
      </div>
    </>
  );
}