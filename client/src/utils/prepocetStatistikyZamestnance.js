import { forEach } from 'lodash';

export default function prepocetVykazyZamestnance(vykazy, zamestnanci) {
  console.log(vykazy, zamestnanci);

  const data = {};

  zamestnanci.forEach((zamestnanec) => {});
  data.odpracovanyCas = Math.round(
    vykazy.reduce((total, current) => total + current.trvani, 0) /
      zamestnanci.length
  );

  console.log(data);
  return data;
}
