import mongoose from 'mongoose';

const procesSchema = mongoose.Schema({
  operator_id: String,
  operator_jmeno: String,
  opv: String,
  popis: String,
  stredisko: Number,
  operace: Number,
  casy: [Date],
  aktivni: Boolean,
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;
