import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  Jmeno: String,
  Prijmeni: String,
  Email: String,
  Heslo: String,
  Pritomen: Boolean,
  DatumCasOperace: Date,
  RC: Number,
});

const User = mongoose.model('User', userSchema);

export default User;
