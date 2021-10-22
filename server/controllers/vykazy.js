import Proces from '../models/proces.js';
import uniqid from 'uniqid';
import moment from 'moment';

export const fetchVykazy = async (req, res) => {
  // req.body.datumOd
  // req.body.datumDo
  // req.body.uzivatelId
  try {
    const vykazy = [];
    const zamestnanci = [];
    //Načte všechny procesy z vybraného období
    const procesy = await Proces.find({
      zaznamy: {
        $elemMatch: { cas: { $gte: req.body.datumOd, $lte: req.body.datumDo } },
      },
    });
    procesy.forEach((proces) => {
      if (proces.zaznamy.length > 0) {
        proces.stroje.forEach((stroj) => {
          //Vypreparuje záznamy na jednotlivé stroje a kvůli konzistenci seřadí dle data
          const zaznamyStroje = proces.zaznamy
            .filter((zaznam) => zaznam.stroj === stroj.nazev)
            .sort((a, b) => a.cas.getTime() - b.cas.getTime());
          zaznamyStroje?.forEach((zaznam) => {
            //Vytvoří zvlášť seznam zaměstnanců, kteří v daném období vykazovali
            if (
              !zamestnanci.find(
                (zamestnanec) => zamestnanec.id === zaznam.operator_id
              )
            )
              zamestnanci.push({
                title: zaznam.operator_jmeno,
                id: zaznam.operator_id,
                mzda: 10,
              });

            //Ověří jeslti poslední záznam není ukončený
            const pIndex = vykazy.length - 1;
            if (vykazy.length > 0 && !vykazy[pIndex].end_time) {
              //Pokud není ukončený a je související, je ukončen a dopočteno trvání
              if (
                vykazy[pIndex].group === zaznam.operator_id &&
                vykazy[pIndex].stroj === zaznam.stroj &&
                vykazy[pIndex].operace === proces.polozka &&
                vykazy[pIndex].opv === proces.opv
              ) {
                vykazy[pIndex].end_time = zaznam.cas.valueOf();
                vykazy[pIndex].trvani = zaznam.cas - vykazy[pIndex].start_time;
                //pokud není ani související, doplní se aktuální datum, pro účely zobrazení. Ve skutečnosti ale výkaz stále není ukončen
              } else vykazy[pIndex].end_time = moment().valueOf();
              //pokud je předchozí výkaz ukončen, vytvoří se nový
            } else {
              vykazy.push({
                id: uniqid(),
                group: zaznam.operator_id,
                jmeno: zaznam.operator_jmeno,
                zdroj: proces.stredisko,
                start_time: zaznam.cas.valueOf(),
                stroj: zaznam.stroj,
                objednavka: proces.objednavka,
                opv: proces.opv,
                operace: proces.polozka,
                nazev: proces.popis,
                plan_cas: proces.minut_nor,
              });
            }
          });
        });
      }
    });

    res.status(200).json({ vykazy, zamestnanci });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};
