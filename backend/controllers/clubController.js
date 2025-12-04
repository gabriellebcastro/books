import Club from '../models/clubModel.js';
import Book from '../models/bookModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Criar um novo clube
// @route   POST /api/clubes
// @access  Private
export const criarClube = asyncHandler(async (req, res) => {
  const { nome, descricao, genero, tipo, limite, regras } = req.body;
  const capa = req.file ? `/uploads/${req.file.filename}` : null;

  // Processa os gêneros: transforma a string separada por vírgulas em um array
  const generosArray = genero ? genero.split(',').map(g => g.trim()).filter(g => g) : [];

  const novoClube = new Club({
    nome,
    descricao,
    genero: generosArray,
    tipo,
    limite,
    regras,
    capa,
    administradores: [req.user._id],
    membros: [req.user._id],
  });

  const clubeCriado = await novoClube.save();
  // Adiciona o clube à lista de clubes do usuário criador
  await User.findByIdAndUpdate(req.user._id, { $push: { clubes: clubeCriado._id } });

  res.status(201).json(clubeCriado);
});

// @desc    Listar todos os clubes
// @route   GET /api/clubes
// @access  Public
export const getClubes = asyncHandler(async (req, res) => {
  const clubes = await Club.find({}).populate('administradores', 'name username avatar');
  res.json(clubes);
});

// @desc    Obter detalhes de um clube
// @route   GET /api/clubes/:id
// @access  Public
export const getClubeById = asyncHandler(async (req, res) => {
  let clube = await Club.findById(req.params.id);

  if (clube) {
    // Popula os campos de referência de forma segura
    clube = await clube.populate([
      { path: 'administradores', select: 'name username avatar' },
      { path: 'membros', select: 'name username avatar' },
      { path: 'pendentes', select: 'name username avatar' },
      { path: 'leituraAtual' }
    ]);
  }

  if (clube) {
    res.json(clube);
  } else {
    res.status(404);
    throw new Error('Clube não encontrado');
  }
});

// @desc    Atualizar informações de um clube
// @route   PUT /api/clubes/:id
// @access  Private (Admin)
export const updateClube = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const isAdmin = clube.administradores.some(id => id.toString() === req.user._id.toString());
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada. Apenas administradores podem editar o clube.');
  }

  clube.nome = req.body.nome || clube.nome;
  clube.descricao = req.body.descricao || clube.descricao;
  clube.tipo = req.body.tipo || clube.tipo;
  clube.limite = req.body.limite || clube.limite;
  clube.regras = req.body.regras || clube.regras;

  if (req.body.genero) {
    clube.genero = req.body.genero.split(',').map(g => g.trim()).filter(g => g);
  }
  if (req.file) {
    clube.capa = `/uploads/${req.file.filename}`;
  }

  const clubeAtualizado = await clube.save();
  res.json(clubeAtualizado);
});

// @desc    Deletar um clube
// @route   DELETE /api/clubes/:id
// @access  Private (Admin)
export const deleteClube = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  // Verifica se o usuário é administrador
  const isAdmin = clube.administradores.some(id => id.toString() === req.user._id.toString());
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada. Apenas administradores podem excluir o clube.');
  }

  // Coleta todos os IDs de membros e administradores para limpar a referência nos seus perfis
  const allMemberIds = [...clube.membros, ...clube.administradores];

  // Remove a referência do clube de todos os usuários que faziam parte dele
  await User.updateMany(
    { _id: { $in: allMemberIds } },
    { $pull: { clubes: clube._id } }
  );

  // Finalmente, remove o clube
  await Club.deleteOne({ _id: req.params.id });

  res.json({ message: 'Clube excluído com sucesso.' });
});

// @desc    Entrar em um clube ou solicitar entrada
// @route   POST /api/clubes/:id/entrar
// @access  Private
export const entrarNoClube = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const userId = req.user._id.toString();

  const isMember = clube.membros.some(id => id.toString() === userId);
  const isAdmin = clube.administradores.some(id => id.toString() === userId);
  const isPending = clube.pendentes.some(id => id.toString() === userId);

  if (isMember || isAdmin) {
    res.status(400);
    throw new Error('Você já faz parte deste clube');
  }

  if (clube.tipo === 'Público') {
    clube.membros.push(userId);
    await clube.save();
    res.json({ message: 'Você entrou no clube com sucesso!' });
    return;
  }

  if (isPending) {
    res.status(400);
    throw new Error('Você já solicitou a entrada neste clube');
  }

  clube.pendentes.push(userId);
  await clube.save();

  res.json({ message: 'Sua solicitação para entrar no clube foi enviada' });
});

// @desc    Aprovar entrada de usuário em clube privado
// @route   POST /api/clubes/:id/aprovar/:userId
// @access  Private (Admin)
export const aprovarEntrada = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const adminId = req.user._id.toString();
  const userId = req.params.userId.toString();

  const isAdmin = clube.administradores.some(id => id.toString() === adminId);

  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada');
  }

  const isPending = clube.pendentes.some(id => id.toString() === userId);

  if (!isPending) {
    res.status(400);
    throw new Error('Usuário não está na lista de pendentes');
  }

  clube.pendentes = clube.pendentes.filter(id => id.toString() !== userId);
  clube.membros.push(userId);

  await clube.save();

  res.json({ message: 'Usuário aprovado com sucesso!' });
});

// @desc    Promover um membro a administrador
// @route   POST /api/clubes/:id/promover/:userId
// @access  Private (Admin)
export const promoverAdmin = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const adminId = req.user._id.toString();
  const userId = req.params.userId.toString();

  const isAdmin = clube.administradores.some(id => id.toString() === adminId);

  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada');
  }

  const isMember = clube.membros.some(id => id.toString() === userId);

  if (!isMember) {
    res.status(400);
    throw new Error('Usuário não é membro deste clube');
  }

  clube.membros = clube.membros.filter(id => id.toString() !== userId);
  clube.administradores.push(userId);

  await clube.save();

  res.json({ message: 'Membro promovido a administrador com sucesso!' });
});

// @desc    Definir o livro do mês para um clube
// @route   PUT /api/clubes/:id/leitura
// @access  Private (Admin)
export const setLeituraAtual = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  // Verifica se o usuário é administrador
  const isAdmin = clube.administradores.some(id => id.toString() === req.user._id.toString());
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada. Apenas administradores podem definir a leitura.');
  }

  // Verifica se o livro existe
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Livro não encontrado no catálogo.');
  }

  clube.leituraAtual = bookId;
  await clube.save();

  // Popula o livro antes de retornar para o frontend ter os dados completos
  const clubeAtualizado = await Club.findById(clube._id).populate('leituraAtual');

  res.json(clubeAtualizado);
});

// @desc    Remover um membro de um clube
// @route   DELETE /api/clubes/:id/membros/:memberId
// @access  Private (Admin)
export const removeMembro = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const adminId = req.user._id.toString();
  const memberIdToRemove = req.params.memberId;

  const isAdmin = clube.administradores.some(id => id.toString() === adminId);
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada.');
  }

  // Impede que o último administrador se remova ou seja removido
  if (clube.administradores.length === 1 && clube.administradores[0].toString() === memberIdToRemove) {
    res.status(400);
    throw new Error('Não é possível remover o último administrador do clube.');
  }

  // Remove o membro das listas de membros e administradores
  clube.membros.pull(memberIdToRemove);
  clube.administradores.pull(memberIdToRemove);

  // Remove a referência do clube do perfil do usuário removido
  await User.findByIdAndUpdate(memberIdToRemove, { $pull: { clubes: clube._id } });

  await clube.save();

  // Retorna o clube atualizado com os membros populados
  const clubeAtualizado = await Club.findById(clube._id).populate('membros administradores', 'name username avatar');
  res.json(clubeAtualizado);
});

// @desc    Adicionar um novo encontro ao clube
// @route   POST /api/clubes/:id/encontros
// @access  Private (Admin)
export const addEncontro = asyncHandler(async (req, res) => {
  const { data, descricao, link } = req.body;
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const isAdmin = clube.administradores.some(id => id.toString() === req.user._id.toString());
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada. Apenas administradores podem adicionar encontros.');
  }

  const novoEncontro = { data, descricao, link };
  clube.encontros.push(novoEncontro);
  
  // Ordena os encontros por data
  clube.encontros.sort((a, b) => new Date(a.data) - new Date(b.data));

  await clube.save();
  res.status(201).json(clube);
});

// @desc    Deletar um encontro do clube
// @route   DELETE /api/clubes/:id/encontros/:encontroId
// @access  Private (Admin)
export const deleteEncontro = asyncHandler(async (req, res) => {
  const clube = await Club.findById(req.params.id);

  if (!clube) {
    res.status(404);
    throw new Error('Clube não encontrado');
  }

  const isAdmin = clube.administradores.some(id => id.toString() === req.user._id.toString());
  if (!isAdmin) {
    res.status(403);
    throw new Error('Ação não autorizada.');
  }

  const encontro = clube.encontros.id(req.params.encontroId);
  if (!encontro) {
    res.status(404);
    throw new Error('Encontro não encontrado');
  }

  encontro.deleteOne(); // Mongoose v8+
  await clube.save();

  res.json({ message: 'Encontro removido com sucesso.' });
});

export const getMeusClubes = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const clubes = await Club.find({
    $or: [
      { membros: userId },
      { administradores: userId }
    ]
  });

  // Popula os campos de referência de forma segura para cada clube encontrado
  await Club.populate(clubes, [
    { path: 'administradores', select: 'name username avatar' },
    { path: 'membros', select: 'name username avatar' },
    { path: 'leituraAtual' }
  ]);

  res.json(clubes);
});