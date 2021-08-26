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

export const fetchProcedures = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: procedures } = await request.query(
      `SELECT [opv], [nazev] FROM dba.v_opv WHERE objednavka = '${req.params.order}' ORDER BY opv;`
    );
    if (procedures.length === 0) res.status(200).json(procedures);
    const data = procedures.map((procedure => {
      
    })
    res.status(200).json(procedures);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
