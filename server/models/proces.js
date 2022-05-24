import mongoose from 'mongoose';

const procesSchema = mongoose.Schema({
  objednavka: String,
  opv: String,
  vykres: String,
  popis: String,
  stredisko: Number,
  stroje: [{ nazev: String, sazba: Number }],
  polozka: String,
  planvyroba: Number,
  minut_nor: Number,
  zaznamy: [
    {
      start: Date,
      stop: Date,
      operator_id: String,
      operator_jmeno: String,
      sazba: Number,
      stroj: String,
      soubezne_procesy: [String],
    },
  ],
  prvniVykaz: Date,
  posledniVykaz: Date,
  aktivni: { type: Boolean, default: true },
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;
