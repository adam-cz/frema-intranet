export default function prepocetMaterial(operace) {
  //Pomocná proměnná
  const materialHelper = [];
  //Iteruje výkazy operací a pokud nenalezne materiálový výkaz v pomocné prom., připraví ho
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
      //Uloží výkaz z aktuálního výkazu do proměnné
      const material = materialHelper.find(
        (matHelper) => matHelper.nomenklatura === materialVykaz.nomenklatura
      );
      //Vloží data do výkazu
      material.operace.push({
        autor: materialVykaz.autor,
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        pozadovano: materialVykaz.pozadovano,
        vydano: materialVykaz.vydano,
        MJ: materialVykaz.merna_jednotka.trim(),
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
  });
  return materialHelper;
}
