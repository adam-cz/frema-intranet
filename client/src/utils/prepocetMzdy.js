export default function prepocetMzdy(operace) {
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
          sazba: vykaz.hodinovaMzda,
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
          opv: op.opv,
          polozka: op.polozka,
          zdroj: op.zdroj,
          popis: op.popis,
          vykazy: [],
        });
      }
      //Vytvoří pomocnou prom. pro stroj/operaci
      const stroj = zamestnanec.operace.find(
        (operace) => operace.stroj === vykaz.stroj
      );
      //V případě, že je výkaz první nebo je ten poslední ukončen, vytvoří nový záznam
      if (
        stroj.vykazy.length === 0 ||
        stroj.vykazy[stroj.vykazy.length - 1].stop
      )
        stroj.vykazy.push({ start: vykaz.cas });
      //NEBO v případě, že předchozí výkaz neni ukončen, ukončí ho a dopočítá trvání výkazu
      else {
        stroj.vykazy[stroj.vykazy.length - 1].stop = vykaz.cas;
        stroj.vykazy[stroj.vykazy.length - 1].trvaniMin =
          (new Date(stroj.vykazy[stroj.vykazy.length - 1].stop) -
            new Date(stroj.vykazy[stroj.vykazy.length - 1].start)) /
          1000 /
          60;
        stroj.vykazy[stroj.vykazy.length - 1].mzda =
          (vykaz.hodinovaMzda *
            stroj.vykazy[stroj.vykazy.length - 1].trvaniMin) /
          60;
      }
    });
  });
  //Doplní celkové mzdy
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
      stroj.cinnost = stroj.vykazy?.find((vykaz) => !vykaz.stop) || false;
    });
    vykaz.mzda = vykaz.operace.reduce(
      (total, current) => total + current.mzda,
      0
    );
    vykaz.vykazano = vykaz.operace.reduce(
      (total, current) => total + current.vykazano,
      0
    );
    vykaz.cinnost = vykaz.operace.filter((stroj) => stroj.cinnost).length;
  });

  return vykazyHelper;
}
