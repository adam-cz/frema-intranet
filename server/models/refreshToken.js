import mongoose from 'mongoose';

const refreshTokenSchema = mongoose.Schema({
  token: String,
});

export default mongoose.model('RefreshToken', refreshTokenSchema);
