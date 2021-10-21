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

const RozpisVyberu = ({ data }) => {
  const [vykazy, setVykazy] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(data, 'vypis dat');
  useEffect(() => {}, [data]);

  return (
    <div>
      {data.zamestnanci[0].title}
      <Table columns={columns} dataSource={vykazy} loading={loading} />
    </div>
  );
};

export default RozpisVyberu;
