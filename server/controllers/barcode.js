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
      res.status(404).json({ status: 'error', message: 'Operace neexistuje' });
    console.log('hello');
    if (proces.casy.length === 1 || proces.casy.length % 2 === 1) {
      proces.casy.push(new Date.now());
      await proces.save();
      res.status(200).json({
        status: 'warning',
        message: `Operace ${operace.polozka} z postupu ${operace.opv} dokončena nebo pozastavena`,
      });
    }
    proces.casy.push(new Date.now());
    await proces.save();
    res.status(200).json({
      status: 'success',
      message: `Operace ${operace.operace} na zakázkovém postupu ${operace.opv} načtena`,
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

// 01C48ADD00000000
// 3011064000_10
