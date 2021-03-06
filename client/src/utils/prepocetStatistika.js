export default function prepocetStatistika({ vykazy }) {
  console.log(vykazy);
  let fondPrace = 0;
  let vykazanyCas = 0;
  let prestavky = 0;
  let celkemMzda = 0;
  let celkemR1 = 0;
  let celkemPlan = 0;

  /*

Jmeno
Celkova odpracovaná mzda
fond práce
z toho vykazano
z toho prestavky
produktivita (vyuziti pracovni doby)
produktivita (cas vykazu vs plan)

*/

  vykazy.forEach((vykaz) => {
    let vykazExist = vykazyTridene.find(
      (_vykaz) =>
        _vykaz.objednavka === vykaz.objednavka &&
        _vykaz.opv === vykaz.opv &&
        _vykaz.operace === vykaz.operace
    );
    if (vykazExist && vykaz.end_time) {
      vykazExist.trvani += vykaz.trvani;
      vykazExist.mzda += vykaz.mzda;
    }
    if (!vykazExist && vykaz.end_time) {
      vykazyTridene.push({
        jmeno: vykaz.jmeno,
        objednavka: vykaz.objednavka,
        opv: vykaz.opv,
        operace: vykaz.operace,
        trvani: vykaz.trvani,
        mzda: vykaz.mzda,
        id: vykaz.id,
        plan_cas: vykaz.plan_cas,
      });
    }
  });
  console.log(vykazyTridene);
  return vykazyTridene;
}
