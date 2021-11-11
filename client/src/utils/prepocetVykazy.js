export default function prepocetVykazy({ vykazy }) {
  const vykazyTridene = [];
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
  return vykazyTridene;
}
