import Club from '../models/clubModel.js';
import User from '../models/userModel.js';

// @desc    Criar um novo clube
// @route   POST /api/clubes
// @access  Private
export const criarClube = async (req, res) => {
  const { nome, descricao, genero, tipo, limite, regras } = req.body;
  const capa = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const novoClube = new Club({
      nome,
      descricao,
      genero,
      tipo,
      limite,
      regras,
      capa,
      administradores: [req.user._id],
      membros: [req.user._id],
    });

    const clubeCriado = await novoClube.save();

    const user = await User.findById(req.user._id);
    user.clubes.push(clubeCriado._id);
    await user.save();

    res.status(201).json(clubeCriado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar o clube', error: error.message });
  }
};

// @desc    Listar todos os clubes
// @route   GET /api/clubes
// @access  Public
export const getClubes = async (req, res) => {
  try {
    const clubes = await Club.find({}).populate('administradores', 'name username');
    res.json(clubes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os clubes' });
  }
};

// @desc    Obter detalhes de um clube
// @route   GET /api/clubes/:id
// @access  Public
export const getClubeById = async (req, res) => {
  try {
    const clube = await Club.findById(req.params.id)
      .populate('administradores', 'name username')
      .populate('membros', 'name username')
      .populate('pendentes', 'name username');
      
    if (clube) {
      res.json(clube);
    } else {
      res.status(404).json({ message: 'Clube não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o clube' });
  }
};

// @desc    Entrar em um clube ou solicitar entrada
// @route   POST /api/clubes/:id/entrar
// @access  Private
export const entrarNoClube = async (req, res) => {
  try {
    const clube = await Club.findById(req.params.id);

    if (!clube) {
      return res.status(404).json({ message: 'Clube não encontrado' });
    }

    const userId = req.user._id.toString();

    const isMember = clube.membros.some(id => id.toString() === userId);
    const isAdmin = clube.administradores.some(id => id.toString() === userId);
    const isPending = clube.pendentes.some(id => id.toString() === userId);

    if (isMember || isAdmin) {
      return res.status(400).json({ message: 'Você já faz parte deste clube' });
    }

    if (clube.tipo === 'Público') {
      clube.membros.push(userId);
      await clube.save();
      return res.json({ message: 'Você entrou no clube com sucesso!' });
    }

    if (isPending) {
      return res.status(400).json({ message: 'Você já solicitou a entrada neste clube' });
    }

    clube.pendentes.push(userId);
    await clube.save();

    res.json({ message: 'Sua solicitação para entrar no clube foi enviada' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar a solicitação' });
  }
};

// @desc    Aprovar entrada de usuário em clube privado
// @route   POST /api/clubes/:id/aprovar/:userId
// @access  Private (Admin)
export const aprovarEntrada = async (req, res) => {
  try {
    const clube = await Club.findById(req.params.id);

    if (!clube) {
      return res.status(404).json({ message: 'Clube não encontrado' });
    }

    const adminId = req.user._id.toString();
    const userId = req.params.userId.toString();

    const isAdmin = clube.administradores.some(id => id.toString() === adminId);

    if (!isAdmin) {
      return res.status(403).json({ message: 'Ação não autorizada' });
    }

    const isPending = clube.pendentes.some(id => id.toString() === userId);

    if (!isPending) {
      return res.status(400).json({ message: 'Usuário não está na lista de pendentes' });
    }

    clube.pendentes = clube.pendentes.filter(id => id.toString() !== userId);
    clube.membros.push(userId);

    await clube.save();

    res.json({ message: 'Usuário aprovado com sucesso!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar o usuário' });
  }
};

// @desc    Promover um membro a administrador
// @route   POST /api/clubes/:id/promover/:userId
// @access  Private (Admin)
export const promoverAdmin = async (req, res) => {
  try {
    const clube = await Club.findById(req.params.id);

    if (!clube) {
      return res.status(404).json({ message: 'Clube não encontrado' });
    }

    const adminId = req.user._id.toString();
    const userId = req.params.userId.toString();

    const isAdmin = clube.administradores.some(id => id.toString() === adminId);

    if (!isAdmin) {
      return res.status(403).json({ message: 'Ação não autorizada' });
    }

    const isMember = clube.membros.some(id => id.toString() === userId);

    if (!isMember) {
      return res.status(400).json({ message: 'Usuário não é membro deste clube' });
    }

    clube.membros = clube.membros.filter(id => id.toString() !== userId);
    clube.administradores.push(userId);

    await clube.save();

    res.json({ message: 'Membro promovido a administrador com sucesso!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao promover membro' });
  }
};