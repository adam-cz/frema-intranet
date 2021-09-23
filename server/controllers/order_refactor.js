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
const nactiOperace = async (objednavka = '21OPT40100000039') => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    const operace = [];

    //Vyhledá finální zakázkové postupy objednávky
    const { recordset: zakazkovePostupyFinaly } = await request.query(
      `SELECT TRIM(opv) AS "opv" FROM dba.v_opv WHERE objednavka = '${objednavka}' ORDER BY opv;`
    );
    //Vyhledá podřízené zakázkové postupy finálů
    await Promise.all(
      zakazkovePostupyFinaly.map(async (final) => {
        const { recordset: zakazkovePostupy } = await request.query(
          `SELECT TRIM(opv) AS "opv", 
          TRIM(opvfinal) AS "opvfinal",
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
            nakl_stn AS nakl_stn_plan, 
            nakl_mzd AS "mzdy_plan",
            nakl_r1 AS "nakl_r1_plan" FROM dba.v_opvoper WHERE opv = '${zakazkovyPostup.opv}' ORDER BY 'polozka';`
            );
            //Všechny operace a jejich základní data postupně ukládá do proměnné "operace"
            operaceKarat.map((op) =>
              operace.push({
                ...op,
                //V případě kooperace nepřiřazuje náklad na zdroj do strojních nákladů
                nakl_stn_plan: op.zdroj === '500' ? 0 : op.nakl_stn_plan,
                //V případě kooperace řadí náklady na zdroj do správné proměnné
                kooperace_plan: op.zdroj === '500' ? op.nakl_stn_plan : 0,
                objednavka,
              })
            );
          })
        );
      })
    );

    return operace;
  } catch (err) {
    console.log(err);
  }
};

const doplnVykazyStroje = async (operaceBezVykazu) => {
  try {
    await Promise.all(
      //Iteruje operace a dohledává existující záznamy výkazů a strojních sazeb v databázi
      operaceBezVykazu.map(async (operace, index, array) => {
        const proces = await Proces.findOne({
          opv: operace.opv,
          polozka: operace.polozka,
        });
        array[index].vykazy =
          proces?.zaznamy.length > 0 ? proces.zaznamy : null;
        array[index].stroje = proces?.stroje.length > 0 ? proces.stroje : null;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const doplnMaterial = async (operaceBezMaterialu) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    await Promise.all(
      //Iteruje operace a dohledává plán a skutečné zatížení materiálem
      operaceBezMaterialu.map(async (operace, index, array) => {
        const { recordset: material } = await request.query(
          `SELECT popis AS "nazev", 
          pozadovano, 
          vydano, 
          mj AS "merna_jednotka", 
          cena FROM dba.v_opvmat WHERE opv = '${operace.opv}' AND polozka = ${operace.polozka};`
        );

        array[index].material_data = material || null;
        array[index].material_plan = material.reduce(
          (total, currentValue) =>
            total + currentValue.pozadovano * currentValue.cena,
          0
        );
        array[index].material = material.reduce(
          (total, currentValue) =>
            total + currentValue.vydano * currentValue.cena,
          0
        );
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const doplnKooperace = async (operaceBezKooper) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    await Promise.all(
      //Iteruje operace a v případě kooperace doplní data
      operaceBezKooper.map(async (operace, index, array) => {
        if (operace.zdroj === '500') {
          const { recordset: pozadavek } = await request.query(
            `SELECT id_poz FROM dba.zdr_poz WHERE doklad = '${operace.opv}' AND polozka = ${operace.polozka};`
          );
          const { recordset: kooperace } = await request.query(
            `SELECT nazev, 
            mnozstvi_poz AS "mnozstvi", 
            doklad,
            cena_na_doklade AS "cena" FROM dba.zdr_koo_pol WHERE id_poz = ${pozadavek[0].id_poz};`
          );
          const { recordset: doklad } =
            kooperace.length > 0 &&
            (await request.query(
              `SELECT zkraceny_nazev AS "nazev" FROM dba.zdr_koo_dkl WHERE doklad = '${kooperace[0].doklad}';`
            ));

          console.log(kooperace?.length, doklad?.length);

          if (doklad?.length > 0) {
            array[index].kooperace_data = {
              nazev: kooperace[0].nazev,
              dodavatel: doklad[0].nazev,
            };
          } else array[index].kooperace_data = null;
          array[index].kooperace =
            doklad?.length > 0 ? kooperace[0].mnozstvi * kooperace[0].cena : 0;
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const fetchData = async (req, res) => {
  try {
    let operace = await nactiOperace(req.params.order);
    await doplnVykazyStroje(operace);
    await doplnMaterial(operace);
    await doplnKooperace(operace);
    res.status(200).json(operace);
  } catch (err) {
    console.log(err);
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
