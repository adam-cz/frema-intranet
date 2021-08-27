import sql, { pool } from '../utils/karat.js';

export const fetchOrders = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset } = await request.query(
      'SELECT TOP (600) [doklad], [poznamka], [zkraceny_nazev], [dat_por], [dat_dodani], [dat_expedice] FROM dba.op_zahlavi ORDER BY dat_por DESC;'
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

    const { recordset: opvFinals } = await request.query(
      `SELECT [opv] FROM dba.v_opv WHERE objednavka = '${req.params.order}' ORDER BY opv;`
    );

    const procedures = await Promise.all(
      opvFinals.map(async (opvFinal) => {
        const { recordset: polotovar } = await request.query(
          `SELECT [opv], 
          [opvfinal],
          [popis], 
          [planvyroba], 
          [vevyrobe], 
          [odvedeno], 
          [jedn_mzdy], 
          [material], 
          [polotovar], 
          [kooper],
          [strnakl], 
          [rn1],
          [cena] FROM dba.v_opvvyrza WHERE opvfinal = '${opvFinal.opv}' ORDER BY opv;`
        );
        return polotovar;
      })
    );

    res.status(200).json(procedures);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
