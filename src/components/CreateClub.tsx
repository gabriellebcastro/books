import { useState } from 'react';
import { Navbar } from './Navbar';
import './CreateClub.css';

export function CreateClub() {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [memberLimit, setMemberLimit] = useState('');
  const [rules, setRules] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName || !description) {
      setError('Nome do Clube e Descrição são campos obrigatórios.');
      return;
    }
    setError('');

    // DADOS PARA O BACKEND:
    // Aqui você coletaria os dados do estado e enviaria para a sua API
    const clubData = {
      name: clubName,
      description,
      genres: genres.split(',').map(g => g.trim()),
      visibility,
      memberLimit: memberLimit ? parseInt(memberLimit, 10) : null,
      rules,
      // A imagem precisaria ser tratada como FormData para upload
    };

    console.log('Dados do clube para enviar:', clubData);
    // Exemplo de chamada de API (comentado):
    /*
    fetch('/api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clubData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Clube criado com sucesso:', data);
      // Redirecionar ou mostrar mensagem de sucesso
    })
    .catch(err => {
      console.error('Erro ao criar clube:', err);
      setError('Ocorreu um erro ao criar o clube.');
    });
    */
  };

  return (
    <div>
      <Navbar />
      <div className="create-club-container">
        <div className="create-club-card">
          <h1 className="create-club-title">Criar Novo Clube do Livro</h1>
          <p className="create-club-subtitle">Preencha os detalhes abaixo para começar uma nova comunidade.</p>
          
          <form onSubmit={handleSubmit} className="create-club-form">
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label htmlFor="clubName">Nome do Clube *</label>
              <input
                type="text"
                id="clubName"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Gêneros / Tags (separados por vírgula)</label>
              <input
                type="text"
                id="genres"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Visibilidade</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Público
                </label>
                <label>
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Privado
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Imagem de Capa</label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Pré-visualização da capa" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="memberLimit">Limite de Membros (opcional)</label>
              <input
                type="number"
                id="memberLimit"
                value={memberLimit}
                onChange={(e) => setMemberLimit(e.target.value)}
                min="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rules">Regras do Clube (opcional)</label>
              <textarea
                id="rules"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Criar Clube</button>
              <button type="button" className="btn btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}