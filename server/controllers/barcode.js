import Proces from '../models/proces.js';
import User from '../models/user.js';
import sql, { pool } from '../utils/karat.js';
import { zdroje } from '../config/zdroje.js';

export const ping = (req, res) => {
  try {
    return res.status(200).json({ status: 'operational' });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ error: err });
  }
};

export const verifyCardId = async (req, res) => {
  try {
    const user = await User.findOne({ rfid: req.params.id });
    if (!user)
      return res
        .status(200)
        .json({ status: 'error', message: 'Uživatel neexistuje' });
    const employee = {
      id: user._id,
      jmeno: `${user.name} ${user.surname}`,
      procesy: user.working,
    };
    return res.status(200).json({
      status: 'success',
      message: `Uživatel ${user.name} ${user.surname} načten`,
      employee,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ error: err });
  }
};

export const setProces = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    const barcode = req.body.barcode.split('_');
    const cas = req.body.cas;
    const user = await User.findOne({ _id: req.body.user.id });
    const proces = await Proces.findOne({
      opv: barcode[0],
      polozka: barcode[1],
    });

    //Pokud nenajde existující proces, nepokračuje
    if (!proces)
      return res.status(200).json({
        status: 'error',
        message: 'Operace neexistuje',
        proces: 'neexistuje',
      });

    /*
    //ZP je již vyveden a vykazování na danou operaci je uzamčeno
    if (
      (await request.query(
        `SELECT xuzavreno AS "uzavreno",FROM dba.v_opvvyrza WHERE opv = '${barcode[0]}';`
      )[0].uzavreno) === 1
    )
      return res.status(200).json({
        status: 'error',
        message: 'Zakázkový postup je již uzavřen. Vykazování uzamčeno.',
      });
      */

    //Chybně načtený kód
    const stroje = ['NULL'];
    zdroje.forEach((zdroj) =>
      zdroj.stroje.forEach((stroj) => stroje.push(stroj.nazev))
    );
    if (!stroje.includes(barcode[2]))
      return res.status(200).json({
        status: 'error',
        message: 'Kód nebyl rozpoznán, zkuste jej načíst znova',
      });

    //Pokud existuje seznam strojů na daný zdroj a na stroji již běží operace, nastane chyba
    const strojPouzivan = await User.find({
      working: {
        $elemMatch: {
          stroj: barcode[2],
        },
      },
    });
    if (
      proces.stroje.length > 1 &&
      strojPouzivan.length > 0 &&
      !strojPouzivan[0].working.find(
        (aktiv) => aktiv.opv === barcode[0] && aktiv.polozka === barcode[1]
      )
    )
      return res.status(200).json({
        status: 'error',
        message: `Na stroji momentálně pracuje ${strojPouzivan[0].name} ${strojPouzivan[0].surname}`,
      });

    //Pokud již zaměstnanec vykonává činnost na výchozím stroji a chce začít novou, nastane chyba
    const aktivniPrace = user.working.find((prace) => prace.stroj === 'NULL');
    if (
      aktivniPrace &&
      !(aktivniPrace.opv === barcode[0] && aktivniPrace.polozka === barcode[1])
    )
      return res.status(200).json({
        status: 'error',
        message: `Nejdříve ukončete svůj předchozí výkaz`,
      });

    //Hledá odpovídající neukončený výkaz
    const vykazExist = proces.zaznamy.find(
      (zaznam) =>
        zaznam.operator_id === user._id.toString() &&
        zaznam.stroj === barcode[2] &&
        !zaznam.stop
    );
    console.log(typeof req.body.user.id, proces, vykazExist);
    //Pokud nalezne, ukončí ho
    if (vykazExist) {
      vykazExist.stop = cas || Date.now();
      //odebere z uživatele aktivní proces
      user.working.splice(
        user.working.findIndex(
          (item) =>
            item.opv === barcode[0] &&
            item.polozka === barcode[1] &&
            item.stroj === barcode[2]
        ),
        1
      );
      //Uloží změny
      proces.save();
      user.save();
      //Vrací odpověď
      return res.status(200).json({
        status: 'warning',
        message: `Operace ${proces.polozka} z postupu ${proces.opv} dokončena nebo pozastavena`,
        proces,
      });
    }

    //Pokud nenalezne, vytvoří nový výkaz
    if (!vykazExist) {
      const { recordset: hodinovaMzda } = await request.query(
        `SELECT [prd_plati] FROM dba.mzdy WHERE (oscislo = ${
          req.body.user.id
        } AND rok = ${new Date(
          cas || Date.now()
        ).getFullYear()} AND mesic = ${new Date(
          cas || Date.now()
        ).getMonth()});`
      );
      proces.zaznamy.push({
        start: cas || Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
        stroj: barcode[2],
        sazba: hodinovaMzda[0].prd_plati,
      });
      //a přiřadí uživateli aktivní proces
      user.working.push({
        opv: proces.opv,
        polozka: proces.polozka,
        stroj: barcode[2],
      });
      //Uloží změny
      proces.save();
      user.save();
      //Vrací odpověď
      return res.status(200).json({
        status: 'success',
        message: `Operace ${proces.polozka} na zakázkovém postupu ${proces.opv} načtena`,
        proces,
      });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
