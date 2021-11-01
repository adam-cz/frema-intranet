import moment from 'moment';

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

      const trvani = vykaz.stop
        ? moment(vykaz.stop).valueOf() - moment(vykaz.start).valueOf()
        : moment().valueOf() - moment(vykaz.start).valueOf();

      stroj.vykazy.push({
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        vykazal: vykaz.operator_jmeno,
        start: vykaz.start,
        stop: vykaz.stop,
        trvaniMin: trvani / 1000 / 60,
        naklady: stroj.sazba * (trvani / 1000 / 60 / 60),
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
