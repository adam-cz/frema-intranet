import { Table } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';

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
    dataIndex: 'trvani',
    key: 'trvani',
    render: (value) => value + ' min',
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

      let vykazy = [];
      dataFiltered.vykazy.forEach((vykaz, index, array) => {
        const vykazExist = vykazy.find(
          (vykazHelper) =>
            vykazHelper.opv === vykaz.opv &&
            vykazHelper.operace === vykaz.operace
        );
        if (!vykazExist && vykaz.end_time)
          vykazy.push({
            objednavka: vykaz.objednavka,
            opv: vykaz.opv,
            operace: vykaz.operace,
            stroj: vykaz.stroj,
            trvani: vykaz.trvani,
          });
        else if (vykazExist && vykaz.end_time)
          vykazExist.trvani += vykaz.trvani;
      });
      console.log(vykazy);
      setData(vykazy);
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
