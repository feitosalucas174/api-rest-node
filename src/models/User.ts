import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface TypeScript que define os campos do documento de usuário.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  // Método para comparar senhas
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schema Mongoose do modelo de usuário.
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
      trim: true,
      minlength: [2, 'O nome deve ter pelo menos 2 caracteres.'],
      maxlength: [100, 'O nome deve ter no máximo 100 caracteres.'],
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de e-mail inválido.'],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'],
      // Não retornar a senha nas consultas por padrão
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'O papel deve ser "user" ou "admin".',
      },
      default: 'user',
    },
  },
  {
    // Adiciona automaticamente os campos createdAt e updatedAt
    timestamps: true,
    // Remove __v das respostas
    versionKey: false,
  }
);

/**
 * Hook "pre-save": faz o hash da senha antes de salvar no banco.
 * Só executa se o campo "password" foi modificado.
 */
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Método de instância para comparar a senha informada com o hash salvo.
 * @param candidatePassword - Senha em texto puro para comparar
 * @returns true se as senhas coincidem, false caso contrário
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove o campo "password" ao serializar o objeto para JSON.
 */
UserSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
