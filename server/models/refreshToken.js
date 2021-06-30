import mongoose from 'mongoose';

const refreshTokenSchema = mongoose.Schema({
  token: String,
  expireAt: Date,
});

export default mongoose.model('RefreshToken', refreshTokenSchema);
