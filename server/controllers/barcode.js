import Proces from '../models/proces.js';
import User from '../models/user.js';

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
    const barcode = req.body.barcode.split('_');
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

    //filtruje pouze záznamy na daný stroj.
    //Pokud je stroj výchozí (null), vrací všechny záznamy.
    const zaznamy = proces.zaznamy.filter(
      (zaznam) => zaznam.stroj === barcode[2]
    );

    //pokud už vykonávám jinou operaci a nejedná se o vícestrojovku
    //TODO

    //Sudý záznam - vždy načten
    if (zaznamy.length % 2 === 0) {
      proces.zaznamy.push({
        cas: Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
        stroj: barcode[2],
      });
      user.working.push({
        opv: proces.opv,
        polozka: proces.polozka,
        stroj: barcode[2],
      });
      await proces.save();
      await user.save();
      return res.status(200).json({
        status: 'success',
        message: `Operace ${proces.polozka} na zakázkovém postupu ${proces.opv} načtena`,
        proces,
      });
    }

    //lichý záznam
    if (zaznamy.length % 2 !== 0) {
      //poslední lichý který vykonává někdo jiný
      if (zaznamy[zaznamy.length - 1].operator_id != req.body.user.id)
        return res.status(200).json({
          status: 'error',
          message: `Operaci ${proces.polozka} postupu ${
            proces.opv
          } již vykonává ${zaznamy[zaznamy.length - 1].operator_jmeno}!`,
          proces,
        });

      //jinak ukonči proces
      proces.zaznamy.push({
        cas: Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
        stroj: barcode[2],
      });
      user.working.splice(
        user.working.findIndex(
          (item) =>
            item.opv === barcode[0] &&
            item.polozka === barcode[1] &&
            item.stroj === barcode[2]
        ),
        1
      );
      await proces.save();
      await user.save();
      return res.status(200).json({
        status: 'warning',
        message: `Operace ${proces.polozka} z postupu ${proces.opv} dokončena nebo pozastavena`,
        proces,
      });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
