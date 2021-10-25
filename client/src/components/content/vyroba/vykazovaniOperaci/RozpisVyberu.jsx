import { Table } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import prepocetVykazy from '../../../../utils/prepocetVykazy';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'Zaměstnanec',
    dataIndex: 'jmeno',
    key: 'jmeno',
  },
  {
    title: 'Objednávka',
    dataIndex: 'objednavka',
    key: 'objednavka',
    render: (value) => <a href={'/vyroba/zakazky/' + value}>{value}</a>,
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
    render: (value) => moment.utc(value).format('HH:mm'),
  },
  {
    title: 'Plánovná délka',
    dataIndex: 'plan_cas',
    key: 'plan_cas',
    render: (value) => moment.utc(value).format('HH:mm'),
  },
  {
    title: 'Produktivita',
    key: 'produktivita',
    render: (value, vykaz) => {
      const procenta = Math.round((vykaz.plan_cas / vykaz.trvani) * 100);
      return procenta < 100 ? (
        <div style={{ color: 'red' }}>
          <CaretDownOutlined /> {procenta + '%'}
        </div>
      ) : (
        <div style={{ color: 'green' }}>
          <CaretUpOutlined />
          {procenta + '%'}
        </div>
      );
    },
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
    setVykazy(prepocetVykazy(data));
  }, [data]);

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={vykazy}
        loading={loading}
      />
    </div>
  );
};

export default RozpisVyberu;
