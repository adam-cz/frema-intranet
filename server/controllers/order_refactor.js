import sql, { pool } from '../utils/karat.js';
import Proces from '../models/proces.js';
import { zdroje } from '../config/zdroje.js';

//Vrací seznam objednávek
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

//Vrací všechny operace a jejich základní data pod danou objednávkou
const nactiOperace = async (objednavka = '21OPT30100000198') => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    const operace = [];

    //Vyhledá finální zakázkové postupy objednávky
    const { recordset: zakazkovePostupyFinaly } = await request.query(
      `SELECT [opv] FROM dba.v_opv WHERE objednavka = '${objednavka}' ORDER BY opv;`
    );
    //Vyhledá podřízené zakázkové postupy finálů
    await Promise.all(
      zakazkovePostupyFinaly.map(async (final) => {
        const { recordset: zakazkovePostupy } = await request.query(
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
          [cena] FROM dba.v_opvvyrza WHERE opvfinal = '${final.opv}' ORDER BY opv;`
        );

        //Vyhledá podřízené operace všech zakázkových postupů
        await Promise.all(
          zakazkovePostupy.map(async (zakazkovyPostup) => {
            const { recordset: operaceKarat } = await request.query(
              `SELECT TRIM(opv) AS "opv",
            TRIM(opvfinal) AS "opvfinal",
            polozka,
            planvyroba,
            vevyrobe,
            odvedeno,
            popis,
            zdroj,          
            minut_nor AS "trvani_plan",
            naklady AS nakl_celkem_plan,
            nakl_stn AS nakl_stn_plan, 
            nakl_mzd AS "mzdy_plan",
            nakl_r1 AS "nakl_r1_plan" FROM dba.v_opvoper WHERE opv = '${zakazkovyPostup.opv}' ORDER BY 'polozka';`
            );
            //Všechny operace a jejich základní data postupně ukládá do proměnné "operace"
            operaceKarat.map((op) => operace.push({ ...op, objednavka }));
          })
        );
      })
    );

    return operace;
  } catch (err) {
    console.log(err);
  }
};

const doplnVykazy = (operaceBezVykazu) =>
  operaceBezVykazu.map(async (operace) => {});

export const fetchData = async (req, res) => {
  try {
    const operace = await nactiOperace(req.params.order);

    res.status(200).json(operace);
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
