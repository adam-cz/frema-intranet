import Proces from '../models/proces.js';
import User from '../models/user.js';
import moment from 'moment';

const _overPrunik = (start, stop, filtrStart, filtrStop) =>
  (!stop && start?.valueOf() < filtrStop) ||
  (stop?.valueOf() > filtrStart && stop?.valueOf() < filtrStop) ||
  (start?.valueOf() > filtrStart && start?.valueOf() < filtrStop) ||
  (start?.valueOf() < filtrStart && stop?.valueOf() > filtrStop);

export const fetchVykazy = async (req, res) => {
  const datumOd = moment(req.body.datumOd).valueOf();
  const datumDo = moment(req.body.datumDo).valueOf();
  // req.body.uzivatelId
  try {
    const vykazy = [];
    const zamestnanci = [];
    //Načte všechny procesy z vybraného období
    const procesy = await Proces.find({
      zaznamy: {
        $elemMatch: {
          $or: [
            { stop: { $gte: datumOd, $lte: datumDo } },
            { start: { $gte: datumOd, $lte: datumDo } },
            {
              $and: [{ start: { $lte: datumOd } }, { stop: { $gte: datumDo } }],
            },
            {
              $and: [
                { stop: { $exists: false } },
                { start: { $lte: datumDo } },
              ],
            },
          ],
        },
      },
    });

    procesy.forEach((proces) => {
      proces.zaznamy
        //Filtruje vykazy
        .filter((zaznam) =>
          _overPrunik(zaznam.start, zaznam.stop, datumOd, datumDo)
        )
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
          //Přepočet dat na základě výběru a ukončení výkazu
          const start_time =
            zaznam.start.valueOf() < datumOd ? datumOd : zaznam.start.valueOf();
          const zaznam_stop = zaznam.stop
            ? zaznam.stop.valueOf()
            : moment().valueOf();
          const end_time = zaznam_stop > datumDo ? datumDo : zaznam_stop;
          const pomerFiltr =
            (end_time - start_time) / (zaznam_stop - zaznam.start.valueOf());
          const plan_cas = pomerFiltr * proces.minut_nor * 60 * 1000;
          const vicestroj =
            vykazy.length > 0 &&
            vykazy.filter((vykaz) =>
              _overPrunik(vykaz.start, vykaz.stop, zaznam.start, zaznam.stop)
            );
          console.log(vicestroj);

          //Doplní a vloží výkaz
          vykazy.push({
            group: zaznam.operator_id,
            jmeno: zaznam.operator_jmeno,
            zdroj: proces.stredisko,
            start_time,
            end_time,
            trvani: end_time - start_time,
            proces_id: proces._id,
            id: zaznam._id,
            sazba: zaznam.sazba,
            stroj: zaznam.stroj,
            objednavka: proces.objednavka,
            opv: proces.opv,
            operace: proces.polozka,
            nazev: proces.popis,
            plan_cas,
            ukonceno: zaznam.stop,
          });
        });
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
    await proces.zaznamy.pull({ _id: req.body.zaznamId });
    await proces.save();
    console.log(proces);
    res.status(204).json({ status: 'success', message: 'Výkaz byl smazán' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};

export const ukoncitVykaz = async (req, res) => {
  try {
    const proces = await Proces.findOne({ _id: req.body.procesId });
    const zaznam = proces.zaznamy.find(
      (zaznam) => zaznam._id == req.body.zaznamId
    );
    const user = await User.findOne({ _id: zaznam.operator_id });
    await user.working.pull({
      opv: proces.opv,
      polozka: proces.polozka,
      stroj: zaznam.stroj,
    });
    if (!zaznam.stop) zaznam.stop = moment().valueOf();
    await proces.save();
    await user.save();
    res.status(204).json({ status: 'success', message: 'Výkaz byl smazán' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};
