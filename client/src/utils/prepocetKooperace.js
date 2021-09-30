export default function prepocetKooperace(operace) {
  //Pomocná proměnná
  const kooperaceHelper = [];
  //Iteruje výkazy operací a pokud nenalezne kooperační výkaz v pomocné prom., připraví ho
  operace.forEach((op) => {
    op.kooperace_data?.forEach((koopVykaz) => {
      if (
        !kooperaceHelper.find(
          (koopHelper) => koopHelper.dodavatel === koopVykaz.dodavatel
        )
      ) {
        kooperaceHelper.push({
          dodavatel: koopVykaz.dodavatel,
          operace: [],
        });
      }
      //Uloží výkaz z aktuálního výkazu do proměnné
      const kooperace = kooperaceHelper.find(
        (koopHelper) => koopHelper.dodavatel === koopVykaz.dodavatel
      );
      //Vloží data do výkazu
      kooperace.operace.push({
        opv: op.opv,
        polozka: op.polozka,
        popis: op.popis,
        mnozstvi: koopVykaz.mnozstvi,
        cena: koopVykaz.cena,
      });
    });
  });
  //Proiteruje výslednou pomocnou prom. a doplní součty do vyšších úrovní proměnné
  kooperaceHelper.forEach((kooperace) => {
    kooperace.cena = kooperace.operace.reduce(
      (total, current) => total + current.cena,
      0
    );
  });
  console.log(kooperaceHelper);
  return kooperaceHelper;
}
