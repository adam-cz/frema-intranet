import mongoose from 'mongoose';

const procesSchema = mongoose.Schema({
  barcode: String,
  opv: String,
  popis: String,
  stredisko: Number,
  operace: Number,
  zaznamy: [{ cas: Date, operator_id: String, operator_jmeno: String }],
  aktivni: Boolean,
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;
