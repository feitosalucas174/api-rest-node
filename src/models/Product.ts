import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Interface TypeScript que define os campos do documento de produto.
 */
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema Mongoose do modelo de produto.
 */
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório.'],
      trim: true,
      minlength: [2, 'O nome deve ter pelo menos 2 caracteres.'],
      maxlength: [200, 'O nome deve ter no máximo 200 caracteres.'],
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
      trim: true,
      maxlength: [1000, 'A descrição deve ter no máximo 1000 caracteres.'],
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório.'],
      min: [0, 'O preço não pode ser negativo.'],
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória.'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'O estoque é obrigatório.'],
      min: [0, 'O estoque não pode ser negativo.'],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Referência ao usuário que criou o produto
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para melhorar performance das consultas mais comuns
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ active: 1 });
ProductSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
