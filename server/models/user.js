import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  rfid: String,
  jednicovy: Boolean,
  working: [{ opv: String, polozka: String, stroj: String, zdroj: String }],
  isPresent: Boolean,
  lastOperation: Date,
  role: [{ type: String }],
  _id: Number,
});

const User = mongoose.model('User', userSchema);

export default User;
