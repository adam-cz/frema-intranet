export default function prepocetStrojniNaklady(operace) {
  //Pomocná proměnná
  const strojeHelper = [];
  //Iteruje výkazy operací a pokud nenalezne stroj v pomocné prom., připraví ho
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
      }
      //Uloží stroj z aktuálního výkazu do proměnné
      const stroj = strojeHelper.find(
        (strojHelper) =>
          strojHelper.stroj === vykaz.stroj && strojHelper.zdroj === op.zdroj
      );
      //V případě, že je výkaz první nebo je ten předchozí ukončen, vytvoří nový
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
      //V případě, že předchozí výkaz není ukončen, ukončí a dopočítá data
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
  //Proiteruje výslednou pomocnou prom. a doplní součty do vyšších úrovní proměnné
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
