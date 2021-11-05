import moment from 'moment';

export default function prepocetMzdy(operace) {
  //Pomocná proměnná
  const vykazyHelper = [];
  //Iteruje operace a následně jejich výkazy
  operace.forEach((op) => {
    op.vykazy?.forEach((vykaz) => {
      //Pokud v pomocné prom. nenalezne zaměstnance, vytvoří ho a připraví si pole pro stroje/operace se kterými pracoval
      if (
        !vykazyHelper.find(
          (vykazHelper) => vykazHelper.id === vykaz.operator_id
        )
      )
        vykazyHelper.push({
          id: vykaz.operator_id,
          jmeno: vykaz.operator_jmeno,
          sazba: vykaz.sazba,
          operace: [],
        });
      //Uloží si zaměstnance z aktuálního výkazu do proměnné
      const zamestnanec = vykazyHelper.find(
        (vykazHelper) => vykazHelper.id === vykaz.operator_id
      );
      //Pokud stroj/operace neexistuje, vytvoří si ho a připraví pole pro výkazy daného stroje a zaměstnance
      if (
        !zamestnanec.operace.find((operace) => operace.stroj === vykaz.stroj)
      ) {
        zamestnanec.operace.push({
          stroj: vykaz.stroj,
          zdroj: op.zdroj,
          zdroj_nazev: op.zdroj_nazev,
          vykazy: [],
        });
      }
      //Vytvoří pomocnou prom. pro stroj/operaci
      const stroj = zamestnanec.operace.find(
        (operace) => operace.stroj === vykaz.stroj
      );
      const trvani = vykaz.stop
        ? moment(vykaz.stop).valueOf() - moment(vykaz.start).valueOf()
        : moment().valueOf() - moment(vykaz.start).valueOf();

      stroj.vykazy.push({
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        start: vykaz.start,
        stop: vykaz.stop,
        trvaniMin: trvani / 1000 / 60,
        mzda: vykaz.sazba * (trvani / 1000 / 60 / 60),
        r1:
          (op.nakl_r1_plan / op.mzdy_plan) *
          (vykaz.sazba * (trvani / 1000 / 60 / 60)),
      });

      //NEBO v případě, že předchozí výkaz neni ukončen, ukončí ho a dopočítá trvání výkazu
    });
  });
  //Iteruje pomocnou proměnnou a dopňuje součty výsledků do vyšších úrovní proměnné.
  vykazyHelper.forEach((vykaz) => {
    vykaz.operace.forEach((stroj) => {
      stroj.vykazano = stroj.vykazy.reduce(
        (total, current) => total + (current?.trvaniMin || 0),
        0
      );
      stroj.mzda = stroj.vykazy.reduce(
        (total, current) => total + (current?.mzda || 0),
        0
      );
      stroj.r1 = stroj.vykazy.reduce(
        (total, current) => total + (current?.r1 || 0),
        0
      );
      stroj.cinnost = stroj.vykazy?.find((vykaz) => !vykaz.stop) || false;
    });
    vykaz.mzda = vykaz.operace.reduce(
      (total, current) => total + current.mzda,
      0
    );
    vykaz.r1 = vykaz.operace.reduce((total, current) => total + current.r1, 0);
    vykaz.vykazano = vykaz.operace.reduce(
      (total, current) => total + current.vykazano,
      0
    );
    vykaz.cinnost = vykaz.operace.filter((stroj) => stroj.cinnost).length;
  });
  return vykazyHelper;
}
