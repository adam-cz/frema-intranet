import sql, { pool } from '../utils/karat.js';
import Proces from '../models/proces.js';
import { zdroje } from '../config/zdroje.js';
import moment from 'moment';

export const getOrderNumber = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: final } = await request.query(
      `SELECT objednavka
     FROM dba.v_opv WHERE opv = '${req.params.final}';`
    );
    res.status(200).json(final[0].objednavka);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

export const fetchList = async (req, res) => {
  try {
    if (req.path === '/opv') {
      const opvs = await fetchOpvs();
      return res.status(200).json(opvs);
    }
    if (req.path === '/finaly') {
      const finaly = await fetchFinals();
      return res.status(200).json(finaly);
    }
    if (req.path === '/objednavky') {
      const objednavky = await fetchOrders();
      res.status(200).json(objednavky);
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

//Vrací seznam ZP pod danou objednávkou
export const fetchOpvList = async (req, res) => {
  try {
    const opvList = [];
    const finals = await fetchFinals(req.params.objednavka);
    await Promise.all(
      finals.map(async (final) => {
        const opvs = await fetchOpvs(final.opv);
        opvs.map((opv) => opvList.push(opv));
      })
    );
    res.status(200).json(opvList);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

//Vrací seznam objednávek
const fetchOrders = async () => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: objednavky } = await request.query(
      `SELECT TOP (500) [doklad], 
      [poznamka], 
      [zkraceny_nazev], 
      [dat_por], 
      [dat_dodani], 
      [dat_expedice] FROM dba.op_zahlavi WHERE denik = 'OP' ORDER BY dat_por DESC;`
    );
    return objednavky;
  } catch (err) {
    console.log(err);
  }
};

const fetchFinals = async (objednavka) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: finaly } = await request.query(
      `SELECT TOP (500) TRIM(opv) AS "opv",
      objednavka,
      nazev,
      da_vy_op AS "datum_vytvoreni",
      planvyroba FROM dba.v_opv ${
        objednavka && `WHERE objednavka = '${objednavka}'`
      } ORDER BY da_vy_op DESC;`
    );
    return finaly;
  } catch (err) {
    console.log(err);
  }
};

const fetchOpvs = async (final) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const { recordset: opvs } = await request.query(
      `SELECT TOP 500 TRIM(opv) AS "opv", 
      TRIM (opvfinal) AS "opvfinal",
      da_vy_op AS "datum_vzniku",
      popis, 
      planvyroba, 
      vevyrobe, 
      odvedeno, 
      jedn_mzdy, 
      material, 
      polotovar, 
      kooper,
      strnakl, 
      rn1,
      cena FROM dba.v_opvvyrza ${
        final && `WHERE opvfinal = '${final}'`
      } ORDER BY datum_vzniku DESC;`
    );
    return opvs;
  } catch (err) {
    console.log(err);
  }
};

//Vrací všechny operace a jejich základní data pod danou objednávkou
const nactiOperace = async (objednavka) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    const operace = [];

    //Vyhledá finální zakázkové postupy objednávky
    const zakazkovePostupyFinaly = await fetchFinals(objednavka);

    //Načte názvy zdrojů
    const { recordset: zdroje } = await request.query(
      `SELECT zdroj, nazev FROM dba.zdr_zdr;`
    );

    //Vyhledá podřízené zakázkové postupy finálů
    await Promise.all(
      zakazkovePostupyFinaly.map(async (final) => {
        const zakazkovePostupy = await fetchOpvs(final.opv);

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
                zdroj_nazev: zdroje.find((zdroj) => zdroj.zdroj === op.zdroj)
                  .nazev,
                id: `${op.opv}_${op.polozka}`,
                //Pro získání celkové částky je nutno násobit počtem kusů
                trvani_plan: op.trvani_plan * op.planvyroba,
                mzdy_plan: op.mzdy_plan * op.planvyroba,
                nakl_r1_plan: op.nakl_r1_plan * op.planvyroba,
                //V případě kooperace nepřiřazuje náklad na zdroj do strojních nákladů
                nakl_stn_plan:
                  op.zdroj === '500' ? 0 : op.nakl_stn_plan * op.planvyroba,
                //V případě kooperace řadí náklady na zdroj do správné proměnné
                kooperace_plan:
                  op.zdroj === '500' ? op.nakl_stn_plan * op.planvyroba : 0,
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
        operace.vykazy =
          proces?.zaznamy.length > 0 ? [...proces.zaznamy] : null;
        operace.stroje = proces?.stroje.length > 0 ? proces.stroje : null;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const doplnMaterialAPlan = async (operaceBezMaterialu) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    await Promise.all(
      //Iteruje operace a dohledává plán a skutečné zatížení materiálem
      operaceBezMaterialu.map(async (operace) => {
        const { recordset: material } = await request.query(
          `SELECT popis AS "nazev", 
          nomenklatura,
          pozadovano, 
          vydano, 
          mj AS "merna_jednotka", 
          cena,
          autor FROM dba.v_opvmat WHERE opv = '${operace.opv}' AND polozka = ${operace.polozka};`
        );

        operace.material_data = material.length > 0 ? material : null;
        operace.material_plan = material.reduce(
          (total, currentValue) =>
            total + currentValue.pozadovano * currentValue.cena,
          0
        );
        operace.material = material.reduce(
          (total, currentValue) =>
            total + currentValue.vydano * currentValue.cena,
          0
        );
        //Dopočítá celkové plánované náklady na operaci
        operace.nakl_celkem_plan =
          operace.mzdy_plan +
          operace.nakl_r1_plan +
          operace.nakl_stn_plan +
          operace.material_plan +
          operace.kooperace_plan;
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
      operaceBezKooper.map(async (operace) => {
        if (operace.zdroj === '500') {
          //V případě, že je operace kooperace, vyhledá požadavky na zdroje
          const { recordset: pozadavek } = await request.query(
            `SELECT id_poz FROM dba.zdr_poz WHERE doklad = '${operace.opv}' AND polozka = ${operace.polozka};`
          );
          //Na základě požadavku na zdroj dohledá kooperační objednávky
          if (pozadavek.length > 0) {
            const { recordset: kooperace } = await request.query(
              `SELECT nazev, 
            mnozstvi_poz AS "mnozstvi", 
            doklad,
            cena_na_doklade AS "cena" FROM dba.zdr_koo_pol WHERE id_poz = ${pozadavek[0].id_poz};`
            );
            if (kooperace.length > 0) {
              operace.kooperace_data = [];
              let cenaCelkem = 0;
              await Promise.all(
                kooperace.map(async (koop) => {
                  const { recordset: doklad } = await request.query(
                    `SELECT zkraceny_nazev AS "nazev" FROM dba.zdr_koo_dkl WHERE doklad = '${koop.doklad}';`
                  );
                  operace.kooperace_data.push({
                    nazev: koop.nazev,
                    mnozstvi: koop.mnozstvi,
                    dodavatel: doklad[0].nazev,
                    cena: koop.cena * koop.mnozstvi,
                  });
                  cenaCelkem += koop.cena * koop.mnozstvi;
                })
              );
              operace.kooperace = cenaCelkem;
              return;
            }
          }
        }
        operace.kooperace_data = null;
        operace.kooperace = 0;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const doplnMzdyAZbytek = async (operaceBezMezd) => {
  try {
    //Iteruje operace a dopňuje mzdy, strojní náklady, čas a následně dopočte celkové částky
    operaceBezMezd.map(async (operace) => {
      let vykazanyCas = 0;
      let strojNakl = 0;
      let vykazanaMzda = 0;

      operace.vykazy?.forEach((vykaz) => {
        const strojniSazba = operace.stroje.find(
          (stroj) => stroj.nazev === vykaz.stroj
        ).sazba;
        const trvani = vykaz.stop
          ? vykaz.stop - vykaz.start
          : moment().valueOf() - vykaz.start;
        vykazanyCas += trvani;
        strojNakl += strojniSazba * (trvani / 1000 / 60 / 60);
        vykazanaMzda += vykaz.sazba * (trvani / 1000 / 60 / 60);
      });

      //TODO: Dořešit výpočet mezd a trvání při vícestrojovce!!!
      operace.mzdy = vykazanaMzda;
      operace.trvani = vykazanyCas;

      operace.nakl_stn = strojNakl;
      operace.nakl_r1 = vykazanaMzda * 0.34;
      //Celkový součet reálných nákladů
      operace.nakl_celkem =
        operace.mzdy +
        operace.nakl_r1 +
        operace.nakl_stn +
        operace.material +
        operace.kooperace;
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchData = async (req, res) => {
  try {
    const operace = await nactiOperace(req.params.order);
    await doplnVykazyStroje(operace);
    await doplnMaterialAPlan(operace);
    await doplnKooperace(operace);
    await doplnMzdyAZbytek(operace);
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
        if (found && operace.zdroj !== ('999' || '500')) results.push(found);
        if (!found && operace.zdroj !== ('999' || '500')) {
          const zdroj = zdroje.find((zdroj) => zdroj.zdroj === operace.zdroj);
          const result = await Proces.create({
            opv: operace.opv,
            objednavka: operace.objednavka,
            polozka: operace.polozka,
            planvyroba: operace.planvyroba,
            minut_nor: operace.trvani_plan,
            popis: operace.popis.trim(),
            stredisko: operace.zdroj,
            stroje: zdroj
              ? zdroj.stroje
              : [
                  {
                    nazev: 'NULL',
                    sazba: sazby.find(
                      (sazba) => sazba.operace === operace.zdroj
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
