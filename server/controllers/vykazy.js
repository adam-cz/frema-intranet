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
      const _vykazy = [];
      proces.zaznamy
        ?.sort((a, b) => a.cas.getTime() - b.cas.getTime())
        .forEach((zaznam, index) => {
          if (!zamestnanci.find((zamestnanec) => zaznam.operator_id))
            zamestnanci.push({
              title: zaznam.operator_jmeno,
              id: zaznam.operator_id,
              mzda: 10,
            });
          const vykazExist = _vykazy.find(
            (_vykaz) =>
              _vykaz.group === zaznam.operator_id &&
              _vykaz.stroj === zaznam.stroj &&
              !_vykaz.end_time
          );
          if (vykazExist) {
            vykazExist.end_time = zaznam.cas.valueOf();
            vykazExist.trvani = zaznam.cas - vykazExist.start_time;
          }
          if (!vykazExist) {
            _vykazy.push({
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
              plan_cas: proces.minut_nor * 60 * 1000,
            });
          }
        });
      vykazy.push(..._vykazy);
    });

    res.status(200).json({ vykazy, zamestnanci });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};
