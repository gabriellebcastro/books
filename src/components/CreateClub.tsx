import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateClub.css';

export function CreateClub() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo, setTipo] = useState('Público');
  const [limite, setLimite] = useState('');
  const [regras, setRegras] = useState('');
  const [capa, setCapa] = useState<File | null>(null);
  const [capaUrl, setCapaUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapa(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadUrl = () => {
    // When loading from URL, clear any selected file and set the preview
    setCapa(null);
    setImagePreview(capaUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao) {
      setError('Nome do Clube e Descrição são campos obrigatórios.');
      return;
    }
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('genero', genero);
    formData.append('tipo', tipo);
    if (limite) formData.append('limite', limite);
    if (regras) formData.append('regras', regras);
    if (capa) {
      formData.append('capa', capa);
    } else if (capaUrl) {
      // Adiciona a URL da capa ao FormData se não houver arquivo
      formData.append('capaUrl', capaUrl);
    }

    const token = localStorage.getItem('token');
    if (!token) {
        setError('Você precisa estar logado para criar um clube.');
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/clubes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // Let the browser set Content-Type
        body: formData,
      });


      if (!response.ok) {
        // Se a resposta não for OK, tentamos ler a mensagem de erro do corpo JSON
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar o clube.');
      }

      // Se a resposta for OK (ex: 201 Created), não precisamos ler o corpo
      setSuccess('Clube criado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/clubes');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="create-club-container">
        <div className="create-club-card">
          <h1 className="create-club-title">Criar Novo Clube do Livro</h1>
          <p className="create-club-subtitle">Preencha os detalhes abaixo para começar uma nova comunidade.</p>
          
          <form onSubmit={handleSubmit} className="create-club-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="form-group">
              <label htmlFor="clubName">Nome do Clube *</label>
              <input
                type="text"
                id="clubName"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição *</label>
              <textarea
                id="description"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Gêneros / Tags (separados por vírgula)</label>
              <input
                type="text"
                id="genres"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Visibilidade</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="Público"
                    checked={tipo === 'Público'}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                  Público
                </label>
                <label>
                  <input
                    type="radio"
                    value="Privado"
                    checked={tipo === 'Privado'}
                    onChange={(e) => setTipo(e.target.value)}
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
              <label htmlFor="coverUrl">Ou URL da Imagem de Capa</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  id="coverUrl"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={capaUrl}
                  onChange={(e) => setCapaUrl(e.target.value)}
                />
                <button type="button" className="btn btn-secondary" onClick={handleLoadUrl}>Carregar</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="memberLimit">Limite de Membros (opcional)</label>
              <input
                type="number"
                id="memberLimit"
                value={limite}
                onChange={(e) => setLimite(e.target.value)}
                min="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rules">Regras do Clube (opcional)</label>
              <textarea
                id="rules"
                value={regras}
                onChange={(e) => setRegras(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Criar Clube</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/clubes')}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}