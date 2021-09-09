import mongoose from 'mongoose';

const procesSchema = mongoose.Schema({
  barcode: String,
  objednavka: String,
  opv: String,
  popis: String,
  stredisko: Number,
  stroj: { type: Number, default: 0 },
  operace: Number,
  zaznamy: [{ cas: Date, operator_id: String, operator_jmeno: String }],
  prvniVykaz: Date,
  posledniVykaz: Date,
  aktivni: Boolean,
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;
