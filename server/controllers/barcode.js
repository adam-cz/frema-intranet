import sql, { pool } from '../utils/dochazka.js';

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
