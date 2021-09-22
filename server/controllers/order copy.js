import sql, { pool } from '../utils/karat.js';
import Proces from '../models/proces.js';
import { zdroje } from '../config/zdroje.js';

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

const fetchOperace = async (objednavka) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    //Vyhledá zakázkové postupy objednávky
    const { recordset: opvFinals } = await request.query(
      `SELECT [opv] FROM dba.v_opv WHERE objednavka = '${req.params.order}' ORDER BY opv;`
    );
    const {}

  } catch (err) {
    console.log(err);
  }
};

export const fetchProcedures = async (req, res) => {
  try {
    res.status(200).json(postupy);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const createProcedure = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: sazby } = await request.query(
      `SELECT [operace], [nazev], [sazba] FROM dba.zdr_ope ORDER BY operace;`
    );
    const results = [];
    await Promise.all(
      req.body.map(async (operace) => {
        const found = await Proces.findOne({
          opv: operace.opv.trim(),
          polozka: operace.polozka,
        });
        console.log(found);
        if (found) results.push(found);
        if (!found) {
          const zdroj = zdroje.find((zdroj) => zdroj.zdroj === operace.zdroj);
          const result = await Proces.create({
            opv: operace.opv.trim(),
            objednavka: operace.objednavka,
            polozka: operace.polozka,
            planvyroba: operace.planvyroba,
            minut_nor: operace.minut_nor,
            popis: operace.popis.trim(),
            stredisko: operace.zdroj,
            stroje: zdroj
              ? zdroj.stroje
              : [
                  {
                    nazev: null,
                    sazba: sazby.find(
                      (sazba) => sazba.operace === operace.stredisko
                    ).sazba,
                  },
                ],
          });
          results.push(result);
        }
      })
    );
    res.status(200).json({
      type: 'success',
      message: `Čárové kódy vygenerovány`,
      payload: results,
    });
  } catch (err) {
    res.status(404).json({ type: 'error', message: err.message });
  }
};
