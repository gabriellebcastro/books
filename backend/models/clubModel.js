import mongoose from 'mongoose';

const clubSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    genero: {
      type: [String],
      required: true,
    },
    tipo: {
      type: String,
      enum: ['Público', 'Privado'],
      required: true,
    },
    limite: {
      type: Number,
      required: false,
    },
    regras: {
      type: String,
      required: false,
    },
    capa: {
      type: String,
      required: false,
    },
    administradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    membros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pendentes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model('Club', clubSchema);

export default Club;