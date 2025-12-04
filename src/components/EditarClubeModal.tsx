import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateClub.css'; // Reutilizando o CSS de criação de clube

interface Club {
  _id: string;
  nome: string;
  descricao: string;
  genero: string[];
  tipo?: string;
  limite?: number;
  regras?: string;
  capa?: string;
}

interface EditarClubeModalProps {
  clube: Club;
  onClose: () => void;
  onSave: (updatedClub: Club) => void;
}

export function EditarClubeModal({ clube, onClose, onSave }: EditarClubeModalProps) {
  const [nome, setNome] = useState(clube.nome);
  const [descricao, setDescricao] = useState(clube.descricao);
  const [genero, setGenero] = useState(clube.genero.join(', '));
  const [tipo, setTipo] = useState(clube.tipo || 'Público');
  const [limite, setLimite] = useState(clube.limite?.toString() || '');
  const [regras, setRegras] = useState(clube.regras || '');
  const [capa, setCapa] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(clube.capa ? `http://localhost:5000${clube.capa.replace(/\\/g, "/")}` : null);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('genero', genero);
    formData.append('tipo', tipo);
    if (limite) formData.append('limite', limite);
    if (regras) formData.append('regras', regras);
    if (capa) {
      formData.append('capa', capa);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar logado para editar o clube.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/clubes/${clube._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar o clube.');
      }

      onSave(data);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-club-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h1 className="create-club-title">Editar Clube</h1>
        
        <form onSubmit={handleSubmit} className="create-club-form">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="clubName">Nome do Clube *</label>
            <input type="text" id="clubName" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea id="description" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="genres">Gêneros / Tags (separados por vírgula)</label>
            <input type="text" id="genres" value={genero} onChange={(e) => setGenero(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Visibilidade</label>
            <div className="radio-group">
              <label>
                <input type="radio" value="Público" checked={tipo === 'Público'} onChange={(e) => setTipo(e.target.value)} />
                Público
              </label>
              <label>
                <input type="radio" value="Privado" checked={tipo === 'Privado'} onChange={(e) => setTipo(e.target.value)} />
                Privado
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Imagem de Capa</label>
            <input type="file" id="coverImage" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Pré-visualização da capa" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="memberLimit">Limite de Membros (opcional)</label>
            <input type="number" id="memberLimit" value={limite} onChange={(e) => setLimite(e.target.value)} min="2" />
          </div>

          <div className="form-group">
            <label htmlFor="rules">Regras do Clube (opcional)</label>
            <textarea id="rules" value={regras} onChange={(e) => setRegras(e.target.value)} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}