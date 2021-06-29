import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  isPresent: Boolean,
  lastOperation: Date,
  _id: Number,
});

const User = mongoose.model('User', userSchema);

export default User;
