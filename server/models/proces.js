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

//3010997000_10_AV 128 H
//3010997000_10_MCFV 1060
//3010997000_20_null

//+éž+řčá+

/*
operace JSON:

objednavka
opv
polozka
popis

trvani_plan
trvani
mzdy_plan
mzdy
material_plan
material
kooperace_plan
kooperace
polotovary_plan
polotovary
nakl_stn_plan
nakl_stn
nakl_r1_plan
nakl_r1
nakl_celkem_plan
nakl_celkem

plan_vyroba
vevyrobe
odvedeno

zdroj
stroje {
	nazev
	sazba
}
vykazy {
	cas
}


*/
