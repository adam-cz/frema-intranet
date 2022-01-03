import Proces from '../models/proces.js';
import User from '../models/user.js';
import sql, { pool } from '../utils/karat.js';
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
          /* 
         const vicestroj =
            vykazy.length > 0 &&
            vykazy.filter((vykaz) =>
              _overPrunik(vykaz.start, vykaz.stop, zaznam.start, zaznam.stop)
            );
          console.log(vicestroj);
            */

          //Doplní a vloží výkaz
          vykazy.push({
            title: `Operace ${proces.polozka} z OPV ${proces.opv} na ${
              zaznam.stroj === 'NULL' ? 'výchozím stroji' : zaznam.stroj
            }`,
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
            mzda: ((end_time - start_time) / 1000 / 60 / 60) * zaznam.sazba,
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
    const proces = await Proces.findOne({ _id: req.body.procesId });
    const zaznam = proces.zaznamy.find(
      (zaznam) => zaznam._id == req.body.zaznamId
    );
    //Pokud není záznam ukončen, odebere z uživatele záznam o aktivitě
    if (!zaznam.stop) {
      const user = await User.findOne({ _id: zaznam.operator_id });
      user.working.splice(
        user.working.findIndex(
          (item) =>
            item.opv === proces.opv &&
            item.polozka === proces.polozka &&
            item.stroj === zaznam.stroj
        ),
        1
      );
      await user.save();
    }
    //Smaže záznam
    await proces.zaznamy.pull({ _id: req.body.zaznamId });
    await proces.save();
    res.status(200).json({ status: 'success', message: 'Výkaz byl smazán' });
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
    //Odebere zaznam o aktivni cinnosti z uzivatele
    user.working.splice(
      user.working.findIndex(
        (item) =>
          item.opv === proces.opv &&
          item.polozka === proces.polozka &&
          item.stroj === zaznam.stroj
      ),
      1
    );
    //Ukonci vykaz
    zaznam.stop = moment().valueOf();
    await user.save();
    await proces.save();

    res.status(200).json({ status: 'success', message: 'Výkaz byl ukončen' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};

export const hledejProces = async (req, res) => {
  const opv = req.body.opv;
  try {
    const procesy = await Proces.find({ opv });
    if (procesy.length === 0)
      return res.status(200).json({
        status: 'danger',
        message: 'Zakázkový postup nenalezen',
        procesy: null,
      });

    const zamestnanci = await User.find(
      { jednicovy: true },
      { name: 1, surname: 1, _id: 1 }
    );
    console.log(zamestnanci);
    res.status(200).json({
      status: 'success',
      message: 'Zakázkový postup nalezen',
      procesy,
      zamestnanci,
    });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};

export const vytvoritVykaz = async (req, res) => {
  const data = req.body.data;
  if (data.do && moment(data.od).valueOf() >= moment(data.do).valueOf())
    return res.status(200).json({
      status: 'error',
      message: 'Počáteční čas nemůže být vyšší než koncový',
    });
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const proces = await Proces.findOne({
      opv: data.opv,
      polozka: data.operace,
    });
    const user = await User.findOne({ _id: data.zamestnanecId });

    /*
      /  Získání hodinové sazby zaměstnance
      /  - Sazba se bere z hodinového průměru za předchozí kvartál
      /  - Pokud aktuální sazba ještě není k dispozici (stává se začátkem kvartálu), počítá se sazbou z minulého měsíce
      /  - Pokud není k dispozici žádný údaj, což by se stalo pouze v případě, že zaměstnanec nebyl ještě naveden do
      /  systému, ale už vykazuje, tak se použije průměrná sazba 150Kč.
      */

    let date = new Date(cas || Date.now()); // Datum pro které získáváme sazbu

    // Funkce pro získání hodinové sazby na základě osobního čísla a data
    const zjistiMzdu = async (date) => {
      return await request.query(
        `SELECT [prd_plati] FROM dba.mzdy WHERE (oscislo = ${
          user.id
        } AND rok = ${date.getFullYear()} AND mesic = ${date.getMonth()});`
      );
    };

    // do proměnné uloží hodinovou sazbu z aktuálního měsíce,
    // v případě, že sazba neexistuje, pokusí se zjistit sazbu z měsíce předchozího
    // pokud neexistuje ani ta, což by se stát nemělo, počítá se se sazbou 150kč.
    const hodinovaMzda = (await zjistiMzdu(date)).recordset[0] ||
      (date.setMonth(date.getMonth() - 1) &&
        (await zjistiMzdu(date)).recordset[0]) || { prd_plati: 150 };

    proces.zaznamy.push({
      operator_id: user._id,
      operator_jmeno: `${user.name} ${user.surname}`,
      stroj: data.stroj,
      sazba: hodinovaMzda.prd_plati,
      start: data.od,
      stop: data.do ? data.do : null,
    });
    await proces.save();
    res.status(200).json({ status: 'success', message: 'Výkaz byl vytvořen' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};

export const upravitCas = async (req, res) => {
  try {
    const proces = await Proces.findOne({ _id: req.body.procesId });
    const zaznam = proces.zaznamy.find(
      (zaznam) => zaznam._id == req.body.zaznamId
    );
    const casOd = req.body.casy?.od || zaznam.start;
    const casDo = req.body.casy?.do || zaznam.stop;

    //Ověřuje jestli není počáteční čas výkazu vyšší než koncový
    if (moment(casOd).valueOf() >= moment(casDo).valueOf())
      return res.status(200).json({
        status: 'error',
        message: 'Počáteční čas nemůže být vyšší než koncový',
      });

    zaznam.start = moment(casOd).valueOf();
    //Ověřuje, jestli není ukončen, případně změní jen start
    if (zaznam.stop) zaznam.stop = moment(casDo).valueOf();
    await proces.save();
    res.status(200).json({ status: 'success', message: 'Čas byl upraven' });
  } catch (err) {
    res.json({ status: 'error', message: err }).status(404);
  }
};
