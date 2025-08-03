import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { // Naya field
    type: String,
    required: true,
    trim: true,
  },
  email: { // Naya field
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;