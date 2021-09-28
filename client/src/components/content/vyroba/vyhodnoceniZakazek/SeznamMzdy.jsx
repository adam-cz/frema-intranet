import { Table } from 'antd';
import { useState, useEffect } from 'react';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const columns = [
  {
    title: 'Jméno zaměstnance',
    dataIndex: 'jmeno',
    key: 'jmeno',
  },
  {
    title: 'Odvedeno',
    dataIndex: 'odvedeno',
    key: 'odevedeno',
  },
  {
    title: 'Trvání plán (min)',
    dataIndex: 'trvani_plan',
    key: 'trvani_plan',
    render: (value) => Math.round(value),
  },
  {
    title: 'Vykázáno (min)',
    dataIndex: 'trvani',
    key: 'trvani',
    render: (value) => Math.round(value),
  },
  {
    title: 'Zdroj',
    dataIndex: 'zdroj',
    key: 'zdroj',
  },
  {
    title: 'Náklady plán',
    dataIndex: 'nakl_celkem_plan',
    key: 'nakl_celkem_plan',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Náklady skutečnost',
    dataIndex: 'nakl_celkem',
    key: 'nakl_celkem',
    render: (value) => formatter.format(value),
  },
];

const SeznamMzdy = ({ operaceFiltr: operace }) => {
  const [loading, setLoading] = useState(true);
  const [vykazy, setVykazy] = useState(null);

  useEffect(() => {
    if (operace) {
      const vykazyHelper = [];

      operace.forEach((op) => {
        op.vykazy?.forEach((vykaz, index, array) => {
          if (
            !vykazyHelper.find(
              (vykazHelper) => vykazHelper.id === vykaz.operator_id
            )
          )
            vykazyHelper.push({
              id: vykaz.operator_id,
              jmeno: vykaz.operator_jmeno,
              operace: [],
            });
          const zamestnanec = vykazyHelper.find(
            (vykazHelper) => vykazHelper.id === vykaz.operator_id
          );

          if (
            !zamestnanec.operace.find(
              (operace) => operace.stroj === vykaz.stroj
            )
          ) {
            zamestnanec.operace.push({
              stroj: vykaz.stroj,
              opv: op.opv,
              polozka: op.polozka,
              popis: op.popis,
              vykazy: [],
            });
          }
          const stroj = zamestnanec.operace.find(
            (operace) => operace.stroj === vykaz.stroj
          );
          console.log(stroj.vykazy);

          if (
            stroj.vykazy.length === 0 ||
            stroj.vykazy[stroj.vykazy.length - 1].stop
          )
            stroj.vykazy.push({ start: vykaz.cas });
          else {
            stroj.vykazy[stroj.vykazy.length - 1].stop = vykaz.cas;
            stroj.vykazy[stroj.vykazy.length - 1].trvaniMin =
              (new Date(stroj.vykazy[stroj.vykazy.length - 1].stop) -
                new Date(stroj.vykazy[stroj.vykazy.length - 1].start)) /
              1000 /
              60;
          }
        });
      });
      setVykazy(vykazyHelper);
      setLoading(false);
    }
  }, [operace]);

  return (
    <div>
      <Table
        dataSource={vykazy}
        columns={columns}
        loading={loading}
        rowKey="barcode"
      />
    </div>
  );
};

export default SeznamMzdy;
