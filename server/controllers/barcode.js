import sql, { pool } from '../utils/dochazka.js';
import Proces from '../models/proces.js';

export const verifyCardId = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: id } = await request.query(
      `SELECT RC FROM PrirazeniKarty WHERE (kodKarty = '${req.params.id}' AND datumVraceni IS NULL);`
    );
    const { recordset: jmeno } = await request.query(
      `SELECT Jmeno, Prijmeni FROM Osoba WHERE RC = ${id[0].RC};`
    );
    const employee = {
      id: id[0].RC,
      jmeno: `${jmeno[0].Jmeno} ${jmeno[0].Prijmeni}`,
    };
    res.status(200).json(employee);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const setProces = async (req, res) => {
  try {
    const proces = await Proces.findOne({ barcode: req.body.barcode });
    if (!proces)
      return res.status(200).json({
        status: 'error',
        message: 'Operace neexistuje',
        proces: 'neexistuje',
      });
    if (proces.operator_id && proces.operator_id !== req.body.user.id)
      return res.status(200).json({
        status: 'error',
        message: `Operaci ${
          proces.operace
        } postupu ${proces.opv.trim()} již vykonává ${proces.operator_jmeno}!`,
        proces,
      });
    if (
      (proces.casy && proces.casy.length === 1) ||
      (proces.casy && proces.casy.length % 2 === 1)
    ) {
      proces.casy.push(Date.now());
      proces.aktivni = false;
      await proces.save();
      return res.status(200).json({
        status: 'warning',
        message: `Operace ${
          proces.operace
        } z postupu ${proces.opv.trim()} dokončena nebo pozastavena`,
        proces,
      });
    }
    if (
      (proces.casy && proces.casy.length === 0) ||
      (proces.casy && proces.casy.length % 2 === 0)
    ) {
      proces.casy.push(Date.now());
      proces.aktivni = true;
      proces.operator_id = req.body.user.id;
      proces.operator_jmeno = req.body.user.jmeno;
      await proces.save();
      return res.status(200).json({
        status: 'success',
        message: `Operace ${
          proces.operace
        } na zakázkovém postupu ${proces.opv.trim()} načtena`,
        proces,
      });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

// 01C48ADD00000000
// 3011058000_10
