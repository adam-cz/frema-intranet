import Proces from '../models/proces.js';
import User from '../models/user.js';
import { zdroje } from '../config/zdroje.js';

export const verifyCardId = async (req, res) => {
  try {
    const user = await User.findOne({ rfid: req.params.id });
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'Uživatel neexistuje' });
    const employee = {
      id: user._id,
      jmeno: `${user.name} ${user.surname}`,
    };
    return res.status(200).json(employee);
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

export const setProces = async (req, res) => {
  try {
    const barcode = req.body.barcode.split('_');
    const proces = await Proces.findOne({
      opv: barcode[0],
      polozka: barcode[1],
    });
    if (!proces)
      return res.status(200).json({
        status: 'error',
        message: 'Operace neexistuje',
        proces: 'neexistuje',
      });

    //Sudý záznam - vždy načten
    if (proces.zaznamy.length % 2 === 0) {
      proces.zaznamy.push({
        cas: Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
        stroj: barcode[2],
      });
      proces.aktivni = true;
      await proces.save();
      return res.status(200).json({
        status: 'success',
        message: `Operace ${
          proces.polozka
        } na zakázkovém postupu ${proces.opv.trim()} ${
          barcode[2] && 'na stroji ' + barcode[2]
        } načtena`,
        proces,
      });
    }

    //lichý záznam
    if (proces.zaznamy.length % 2 !== 0) {
      //pokud už vykonávám jinou operaci a nejedná se o vícestrojovku

      //poslední lichý který vykonává někdo jiný
      if (
        proces.zaznamy[proces.zaznamy.length - 1].operator_id !=
        req.body.user.id
      )
        return res.status(200).json({
          status: 'error',
          message: `Operaci ${
            proces.operace
          } postupu ${proces.opv.trim()} již vykonává ${
            proces.zaznamy[proces.zaznamy.length - 1].operator_jmeno
          }!`,
          proces,
        });

      //jinak ukonči proces
      proces.zaznamy.push({
        cas: Date.now(),
        operator_id: req.body.user.id,
        operator_jmeno: req.body.user.jmeno,
      });
      proces.aktivni = false;
      await proces.save();
      return res.status(200).json({
        status: 'warning',
        message: `Operace ${proces.operace} z postupu ${proces.opv.trim()} ${
          barcode[2] && 'na stroji ' + barcode[2]
        } dokončena nebo pozastavena`,
        proces,
      });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
