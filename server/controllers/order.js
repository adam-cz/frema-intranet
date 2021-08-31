import sql, { pool } from '../utils/karat.js';

export const fetchOrders = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset } = await request.query(
      `SELECT TOP (500) [doklad], 
      [poznamka], 
      [zkraceny_nazev], 
      [dat_por], 
      [dat_dodani], 
      [dat_expedice] FROM dba.op_zahlavi WHERE denik = 'OP' ORDER BY dat_por DESC;`
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

    const postupy = [];
    await Promise.all(
      opvFinals.map(async (opvFinal) => {
        const { recordset: polotovary } = await request.query(
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
        await Promise.all(
          polotovary.map(async (polotovar) => {
            const { recordset: operace } = await request.query(
              `SELECT [opv],
            [polozka],
            [planvyroba],
            [vevyrobe],
            [odvedeno],
            [popis],
            [zdroj],          
            [minut_nor],
            [naklady],
            [nakl_stn],
            [nakl_mzd],
            [nakl_r1] FROM dba.v_opvoper WHERE opv = '${polotovar.opv}' ORDER BY 'polozka';`
            );
            polotovar.operace = operace;
            postupy.push(polotovar);
          })
        );
      })
    );
    res.status(200).json(postupy);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
