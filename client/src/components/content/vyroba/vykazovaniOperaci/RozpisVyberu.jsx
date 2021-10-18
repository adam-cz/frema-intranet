import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { uniq } from 'lodash';

const columns = [
  {
    title: 'Objednávka',
    dataIndex: 'objednavka',
    key: 'objednavka',
  },
  {
    title: 'OPV',
    dataIndex: 'opv',
    key: 'opv',
  },
  {
    title: 'Operace',
    dataIndex: 'operace',
    key: 'operace',
  },
  {
    title: 'Délka výkazu',
    dataIndex: 'delka_vykazu',
    key: 'delka_vykazu',
  },
  {
    title: 'Mzda',
    dataIndex: 'mzda',
    key: 'opv',
  },
];

const RozpisVyberu = ({ dataFiltered }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      console.log(dataFiltered);
      //let seznamOperaci = dataFiltered.vykazy.map((vykaz) => {

      const vykazy = [];
      dataFiltered.vykazy.forEach((vykaz, index, array) => {
        if (
          !vykazy.find(
            (vykazHelper) =>
              vykazHelper.opv === vykaz.opv &&
              vykazHelper.operace === vykaz.operace
          )
        )
          vykazy.push({ opv: vykaz.opv, operace: vykaz.operace });
      });
      console.log(vykazy);
      //setData(vykazy);
      setLoading(false);
    }
  }, [dataFiltered, loading]);
  return (
    <div>
      {dataFiltered.zamestnanci[0].title}
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default RozpisVyberu;
