export default function prepocetStrojniNaklady(operace) {
  const strojeHelper = [];
  operace.forEach((op) => {
    op.vykazy?.forEach((vykaz) => {
      if (
        !strojeHelper.find(
          (strojHelper) =>
            strojHelper.stroj === vykaz.stroj && strojHelper.zdroj === op.zdroj
        )
      ) {
        strojeHelper.push({
          stroj: vykaz.stroj,
          zdroj: op.zdroj,
          sazba: op.stroje.find((stroj) => vykaz.stroj === stroj.nazev).sazba,
          vykazy: [],
        });
        console.log(strojeHelper);
      }
      //Uloží stroj z aktuálního výkazu do proměnné
      const stroj = strojeHelper.find(
        (strojHelper) =>
          strojHelper.stroj === vykaz.stroj && strojHelper.zdroj === op.zdroj
      );
      //Dopočítá délky výkazů
      if (
        stroj.vykazy.length === 0 ||
        stroj.vykazy[stroj.vykazy.length - 1].stop
      )
        stroj.vykazy.push({
          opv: op.opv,
          polozka: op.polozka,
          popis: op.popis,
          vykazal: vykaz.operator_jmeno,
          start: vykaz.cas,
        });
      else {
        stroj.vykazy[stroj.vykazy.length - 1].stop = vykaz.cas;
        stroj.vykazy[stroj.vykazy.length - 1].trvaniMin =
          (new Date(stroj.vykazy[stroj.vykazy.length - 1].stop) -
            new Date(stroj.vykazy[stroj.vykazy.length - 1].start)) /
          1000 /
          60;
        stroj.vykazy[stroj.vykazy.length - 1].naklady =
          (stroj.sazba * stroj.vykazy[stroj.vykazy.length - 1].trvaniMin) / 60;
      }
    });
  });
  strojeHelper.forEach((stroj) => {
    stroj.vykazano = stroj.vykazy.reduce(
      (total, current) => total + (current?.trvaniMin || 0),
      0
    );
    stroj.naklady = stroj.vykazy.reduce(
      (total, current) => total + (current?.naklady || 0),
      0
    );
    stroj.cinnost = stroj.vykazy?.find((vykaz) => !vykaz.stop)?.start || false;
  });
  return strojeHelper;
}
