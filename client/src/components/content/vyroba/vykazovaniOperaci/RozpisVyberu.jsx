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

const RozpisVyberu = ({ data, loading }) => {
  const [vykazy, setVykazy] = useState(null);
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={vykazy} loading={loading} />
    </div>
  );
};

export default RozpisVyberu;
