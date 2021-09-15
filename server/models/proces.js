import mongoose from 'mongoose';

const procesSchema = mongoose.Schema({
  objednavka: String,
  opv: String,
  popis: String,
  stredisko: Number,
  stroje: [{ nazev: String, sazba: Number }],
  polozka: String,
  planvyroba: Number,
  minut_nor: Number,
  zaznamy: [{ cas: Date, operator_id: String, operator_jmeno: String }],
  prvniVykaz: Date,
  posledniVykaz: Date,
  aktivni: Boolean,
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;
