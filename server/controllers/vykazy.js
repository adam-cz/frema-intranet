import Proces from '../models/proces.js';
import uniqid from 'uniqid';

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
    //Seřadí a iteruje záznamy každého procesu, jednotlivé výkazy za daný proces ukládá do pomocné proměnné
    procesy.forEach((proces) => {
      let _vykazy = [];
      proces.zaznamy
        ?.sort((a, b) => a.cas.getTime() - b.cas.getTime())
        .forEach((zaznam) => {
          //Pokud zaměstnanec neexistuje, vytvoří ho.
          if (
            !zamestnanci.find(
              (zamestnanec) => zaznam.operator_id === zamestnanec.id
            )
          )
            zamestnanci.push({
              title: zaznam.operator_jmeno,
              id: zaznam.operator_id,
              mzda: 10,
            });
          //Hledá související neukončený výkaz
          const vykazExist = _vykazy.find(
            (_vykaz) =>
              _vykaz.group === zaznam.operator_id &&
              _vykaz.stroj === zaznam.stroj &&
              !_vykaz.end_time
          );
          //Pokud existuje, ukončí ho a dopočítá trvání
          if (vykazExist) {
            vykazExist.end_time = zaznam.cas.valueOf();
            vykazExist.end_time_id = zaznam._id;
            vykazExist.ukonceno = true;
            vykazExist.trvani = zaznam.cas - vykazExist.start_time;
          }
          //Pokud neexistuje, vytvoří ho
          if (!vykazExist) {
            _vykazy.push({
              id: uniqid(),
              group: zaznam.operator_id,
              jmeno: zaznam.operator_jmeno,
              zdroj: proces.stredisko,
              start_time: zaznam.cas.valueOf(),
              start_time_id: zaznam._id,
              proces_id: proces._id,
              stroj: zaznam.stroj,
              objednavka: proces.objednavka,
              opv: proces.opv,
              operace: proces.polozka,
              nazev: proces.popis,
              plan_cas: proces.minut_nor * 60 * 1000,
              ukonceno: false,
            });
          }
        });
      //Do seznamu výkazů doplní výkazy z daného procesu
      vykazy.push(..._vykazy);
    });

    res.status(200).json({ vykazy, zamestnanci });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

export const smazatVykazy = async (req, res) => {
  try {
    console.log(req.body);
    const proces = await Proces.findOne({ _id: req.body.procesId });
    await proces.zaznamy.pull({ _id: req.body.startId });
    await proces.zaznamy.pull({ _id: req.body.stopId });
    await proces.save();
    console.log('smazano');
    res.status(204).json({ status: 'success', message: 'Výkaz byl smazán' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};
