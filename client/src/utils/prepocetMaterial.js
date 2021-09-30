export default function prepocetMaterial(operace) {
  //Pomocná proměnná
  console.log('tu');
  const materialHelper = [];
  //Iteruje výkazy operací a pokud nenalezne stroj v pomocné prom., připraví ho
  operace.forEach((op) => {
    op.material_data?.forEach((materialVykaz) => {
      if (
        !materialHelper.find(
          (matHelper) => matHelper.nomenklatura === materialVykaz.nomenklatura
        )
      ) {
        materialHelper.push({
          nazev: materialVykaz.nazev,
          nomenklatura: materialVykaz.nomenklatura,
          MJ: materialVykaz.merna_jednotka.trim(),
          cena_mj: materialVykaz.cena,
          operace: [],
        });
      }
      //Uloží stroj z aktuálního výkazu do proměnné
      const material = materialHelper.find(
        (matHelper) => matHelper.nomenklatura === materialVykaz.nomenklatura
      );
      //V případě, že je výkaz první nebo je ten předchozí ukončen, vytvoří nový

      material.operace.push({
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        pozadovano: materialVykaz.pozadovano,
        vydano: materialVykaz.vydano,
        cena_mj: materialVykaz.cena,
        cena: materialVykaz.cena * materialVykaz.vydano,
      });
    });
  });
  //Proiteruje výslednou pomocnou prom. a doplní součty do vyšších úrovní proměnné
  materialHelper.forEach((material) => {
    material.pozadovano = material.operace.reduce(
      (total, current) => total + current.pozadovano,
      0
    );
    material.vydano = material.operace.reduce(
      (total, current) => total + current.vydano,
      0
    );
    material.cena = material.operace.reduce(
      (total, current) => total + current.cena,
      0
    );
    material.cinnost = material.vykazy?.find(
      (mat) => mat.vydano < mat.pozadovano
    )
      ? true
      : false;
  });
  console.log(materialHelper);
  return materialHelper;
}
