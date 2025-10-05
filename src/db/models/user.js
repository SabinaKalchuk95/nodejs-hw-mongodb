import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Метод для порівняння паролів (використовується в loginUser)
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Експортуємо з правильною назвою
export const UsersCollection = model('User', userSchema); 
