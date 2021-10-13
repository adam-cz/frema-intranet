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
    const procesy = await Proces.find({
      zaznamy: {
        $elemMatch: { cas: { $gte: req.body.datumOd, $lte: req.body.datumDo } },
      },
    });
    procesy.forEach((proces) => {
      if (proces.zaznamy.length > 0) {
        proces.stroje.forEach((stroj) => {
          const zaznamyStroje = proces.zaznamy
            .filter((zaznam) => zaznam.stroj === stroj.nazev)
            .sort((a, b) => a.cas.getTime() - b.cas.getTime());
          zaznamyStroje?.forEach((zaznam) => {
            if (
              !zamestnanci.find(
                (zamestnanec) => zamestnanec.id === zaznam.operator_id
              )
            )
              zamestnanci.push({
                title: zaznam.operator_jmeno,
                id: zaznam.operator_id,
                stackItems: true,
                mzda: 10,
              });
            const operator = vykazy.find(
              (vykaz) => vykaz.id === zaznam.operator_id
            );
            const poslIndex = vykazy.length - 1;
            if (
              vykazy.length > 0 &&
              !vykazy[poslIndex].end_time &&
              vykazy[poslIndex].group === zaznam.operator_id &&
              vykazy[poslIndex].stroj === zaznam.stroj &&
              vykazy[poslIndex].operace === proces.polozka &&
              vykazy[poslIndex].opv === proces.opv
            )
              vykazy[poslIndex].end_time = zaznam.cas.valueOf();
            else {
              if (vykazy.length > 0 && !vykazy[poslIndex].end_time)
                vykazy[poslIndex].end_time = moment().valueOf();
              vykazy.push({
                id: uniqid(),
                group: zaznam.operator_id,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
                start_time: zaznam.cas.valueOf(),
                stroj: zaznam.stroj,
                objednavka: proces.objednavka,
                opv: proces.opv,
                operace: proces.polozka,
                nazev: proces.popis,
                title: `Operace ${proces.polozka} z OPV ${proces.opv} na stroji ${zaznam.stroj}`,
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

/*

[
  {
    jmneno, 
    id, 
    mzda, 
    vykazy:
      [
        {
          start,
          stop,
          stroj,
          opv,
          proces,
          nazev
        }
      ]
    }
]


*/
