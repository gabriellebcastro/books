import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userBookSchema = mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  status: {
    type: String,
    enum: ['lido', 'lendo', 'quero ler'],
    default: 'quero ler',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    books: [userBookSchema],
  },
  {
    timestamps: true,
  }
);

// Criptografa a senha antes de salvar o usuário no banco
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar a senha digitada com a senha criptografada no banco
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;