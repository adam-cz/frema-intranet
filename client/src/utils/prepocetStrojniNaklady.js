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

      stroj.vykazy.push({
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        vykazal: vykaz.operator_jmeno,
        start: vykaz.start,
        stop: vykaz.stop,
        trvaniMin: vykaz.trvani / 1000 / 60,
        naklady: stroj.sazba * (vykaz.trvani / 1000 / 60 / 60),
      });
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
