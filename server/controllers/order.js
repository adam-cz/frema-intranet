import sql, { pool } from '../utils/karat.js';

export const fetchOrders = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset } = await request.query(
      'SELECT TOP (300) [doklad], [poznamka], [zkraceny_nazev], [dat_por], [dat_dodani], [dat_expedice] FROM dba.op_zahlavi ORDER BY dat_por DESC;'
    );
    res.status(200).json(recordset);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
