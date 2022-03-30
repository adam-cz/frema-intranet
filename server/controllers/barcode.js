import Proces from '../models/proces.js';
import User from '../models/user.js';
import sql, { pool } from '../utils/karat.js';
import { najdiSoubezneProcesy } from '../utils/helper.js';
import { zdroje } from '../config/zdroje.js';

// Funkce, kterou client ověřuje, zda-li je server již k dispozici
export const ping = (req, res) => {
  try {
    return res.status(200).json({ status: 'operational' });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ error: err });
  }
};

// Ověřuje existenci uživatele v databázi
// - V případě, že uživatel neexistuje, vrací status error a message pro zobrazení na frontendu
// - Jinak vrací status success, message a objekt s uživatelskými daty
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
      procesy: user.working, // user.working obsahuje aktivní operace uživatele
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

/*
/  Funkce obstarává ověření čárového kódu a ověření a přiřazování operací
/  - Nejdříve ověřuje existenci operace z načteného čárového kódu v databázi
/  - Následuje ověření existence názvu stroje z ČK (stává se, že bývá chybně načten čtečkou)
/  - Pokračuje ověření, zda-li na stroji již neběží jiná operace. Toto se vztahuje jen na stroje 
/    definované zvlášť v ./config/zdroje.js, nikoliv na defaultni stroje zdroje (označení NULL),
/    těch totiž může být na daný zdroj k dispozici více.
/  - Dále ověřuje, zda-li zaměstnanec nepracuje již na jiné operaci. Toto platí pouze pokud je operace
/    prováděna na výchozím stroji (NULL), stroje z ./config/zdroje.js jsou při tomto ověření ignorovány,
/    protože se jedná o CNC, na kterých je potřeba umožnit vícestrojovku (TODO: přidat parametr pro vícestrojovku a ověřovat na základě něj)
/  - Pokud všechna ověření proběhnou v pořádku tak se operace u daného uživatele buď ukončí nebo započne.
*/

export const setProces = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    const barcode = req.body.barcode.split('_'); // Rozdělí ČK na OPV, číslo operace a stroj
    const cas = req.body.cas;
    const user = await User.findOne({ _id: req.body.user.id });
    const proces = await Proces.findOne({
      opv: barcode[0],
      polozka: barcode[1],
    });

    //Pokud v databázi neexistuje proces z ČK, ukončí.
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

    // Vytvoří seznam strojů vhodných pro danou operaci
    const stroje = ['NULL'];
    zdroje.forEach((zdroj) =>
      zdroj.stroje.forEach((stroj) => stroje.push(stroj.nazev))
    );

    // Kontroluje zda-li seznam strojů obsahuje stroj z ČK, jinak ukončí
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
    //vicestrojovka povolena pro zdroj 170, TODO: vyhodnocovat seznam povolenych zdroju pro vicestroj
    console.log(user);
    const aktivniPrace = user.working.find(
      (prace) => prace.stroj === 'NULL' && prace.zdroj !== '170'
    );
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
      /*
      /  Získání hodinové sazby zaměstnance
      /  - Sazba se bere z hodinového průměru za předchozí kvartál
      /  - Pokud aktuální sazba ještě není k dispozici (stává se začátkem kvartálu), počítá se se sazbou z minulého měsíce
      /  - Pokud není k dispozici žádný údaj, což by se stalo pouze v případě, že zaměstnanec nebyl ještě naveden do
      /  systému nebo neexistuje (automat), ale už vykazuje, tak se použije průměrná sazba 0 Kč.
      */

      let date = new Date(cas || Date.now()); // Datum pro které získáváme sazbu

      // Funkce pro získání hodinové sazby na základě osobního čísla a data
      const zjistiMzdu = async (date) => {
        return await request.query(
          `SELECT [prd_plati] FROM dba.mzdy WHERE (oscislo = ${
            req.body.user.id
          } AND rok = ${date.getFullYear()} AND mesic = ${date.getMonth()});`
        );
      };

      // do proměnné uloží hodinovou sazbu z aktuálního měsíce,
      // v případě, že sazba neexistuje, pokusí se zjistit sazbu z měsíce předchozího
      // pokud neexistuje ani ta, což by se stát nemělo, počítá se se sazbou 0 kč.
      const hodinovaMzda = (await zjistiMzdu(date)).recordset[0] ||
        (date.setMonth(date.getMonth() - 1) &&
          (await zjistiMzdu(date)).recordset[0]) || { prd_plati: 0 };

      // ověří zda-li nemá pracovník aktivní jiný souběžný proces a případně vloží do
      // pole soubezne_procesy pro usnadnění výpočtu vícestrojové práce
      //console.log(najdiSoubezneProcesy());

      proces.zaznamy.push({
        start: cas || Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
        stroj: barcode[2],
        sazba: hodinovaMzda.prd_plati,
      });
      //a přiřadí uživateli aktivní proces
      user.working.push({
        opv: proces.opv,
        polozka: proces.polozka,
        stroj: barcode[2],
        zdroj: proces.stredisko,
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
    console.log(err);
    res.status(404).json({ error: err });
  }
};
