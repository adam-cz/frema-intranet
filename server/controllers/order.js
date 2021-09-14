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

export const fetchProcedures = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);

    //Vyhledá zakázkové postupy objednávky
    const { recordset: opvFinals } = await request.query(
      `SELECT [opv] FROM dba.v_opv WHERE objednavka = '${req.params.order}' ORDER BY opv;`
    );

    //načte sazebník strojních nákladů
    const { recordset: sazbyStrNak } = await request.query(
      `SELECT [operace], [nazev], [sazba] FROM dba.zdr_ope ORDER BY operace;`
    );
    console.log(opvFinals);

    const postupy = [];

    //Načte zakázkové postupy objednávky
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
        //Načte operace na zakázkových postupech
        await Promise.all(
          polotovary.map(async (polotovar) => {
            const { recordset: rawOperace } = await request.query(
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

            const operace = [];

            //Načteni reálných časů (výkazů) nad operacemi
            await Promise.all(
              rawOperace.map(async (op) => {
                let vykazanyCas = 0;
                let vykazanaMzda = 0;
                const vykazy = await Proces.findOne({
                  barcode: `${op.opv.trim()}_${op.polozka}`,
                });

                //Výpočet délky výkonu a mzdy z časových značek
                if (vykazy && vykazy.zaznamy && vykazy.zaznamy.length >= 2) {
                  //Při více než dvou výkazech (= započetí a ukončení) iteruje
                  await Promise.all(
                    vykazy.zaznamy.map(async (zaznam, index, array) => {
                      //Při každém sudém záznamu ho odečte od následujícího lichého pro zjištění délky úkony, poté zpracuje až další sudý
                      if (index % 2 == 0 && array[index + 1]) {
                        const delkaVykazu =
                          new Date(array[index + 1].cas) -
                          new Date(array[index].cas);
                        //Načte hodinovou mzdu zaměstnance z období výkonu výkazu
                        const { recordset: hodinovaMzda } = await request.query(
                          `SELECT TOP (500) [prd_plati] FROM dba.mzdy WHERE (oscislo = ${
                            zaznam.operator_id
                          } AND rok = ${new Date(
                            zaznam.cas
                          ).getFullYear()} AND mesic = ${new Date(
                            zaznam.cas
                          ).getMonth()});`
                        );
                        //přičítá mzdu k celkové částce za mzdy na operaci a sčítá vykázaný čas
                        vykazanaMzda +=
                          (delkaVykazu / 1000 / 60 / 60) *
                          hodinovaMzda[0].prd_plati;
                        vykazanyCas += delkaVykazu;
                      }
                    })
                  );
                }

                //Přiřazení sazby k operaci
                const sazbaZdroje = sazbyStrNak.find(
                  (sazba) => sazba.operace === op.zdroj
                ).sazba;
                //Do operace pushuje iterované data a součty
                operace.push({
                  ...op,
                  vykazy: vykazy ? vykazy.zaznamy : null,
                  vykazanyCas,
                  vykazanaMzda,
                  sazbaZdroje,
                });
              })
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

export const createProcedure = async (req, res) => {
  try {
    req.body.map(async (operace) => {
      const found = await Proces.findOne({
        opv: operace.opv,
        operace: operace.polozka,
      });
      if (!found) {
        const zdroj = zdroje.find((zdroj) => zdroj.zdroj === operace.zdroj);
        console.log(zdroj);
        await Proces.create({
          opv: operace.opv,
          objednavka: operace.objednavka,
          operace: operace.polozka,
          popis: operace.popis.trim(),
          stredisko: operace.zdroj,
          stroje: zdroj ? zdroj.stroje : [{ stroj: 'výchozí' }],
        });
      }
    });

    res.status(200).json({
      message: `Čárové kódy vygenerovány`,
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
