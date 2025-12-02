import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Caminho absoluto para a pasta /uploads dentro do backend
const uploadsDir = path.resolve(process.cwd(), 'uploads');

// Garante que a pasta exista
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta /uploads criada automaticamente.');
}

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir); // agora é absoluto e seguro
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Verificação de tipo de arquivo
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb('Apenas imagens (jpg, jpeg, png) são permitidas!');
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;