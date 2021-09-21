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
  zaznamy: [
    { cas: Date, operator_id: String, operator_jmeno: String, stroj: String },
  ],
  prvniVykaz: Date,
  posledniVykaz: Date,
  aktivni: { type: Boolean, default: true },
});

const Proces = mongoose.model('Proces', procesSchema);

export default Proces;

//pro kontrolu tisku:
//21OPT30100000198

//pro kontrolu vykazovani:
//21OPT30100000181

//+éž+řčá+
