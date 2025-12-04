import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    genre: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      required: false,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;