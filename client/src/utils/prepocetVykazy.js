export default function prepocetVykazy({ vykazy }) {
  console.log(vykazy);
  const vykazyTridene = [];
  vykazy.forEach((vykaz) => {
    const vykazExist = vykazyTridene.find(
      (_vykaz) =>
        _vykaz.objednavka === vykaz.objednavka &&
        _vykaz.opv === vykaz.opv &&
        _vykaz.operace === vykaz.operace
    );
    if (vykazExist && vykaz.end_time) {
      vykazExist.trvani += vykaz.trvani;
    }
    if (!vykazExist && vykaz.end_time) {
      vykazyTridene.push({ ...vykaz });
    }
  });
  return vykazyTridene;
}
