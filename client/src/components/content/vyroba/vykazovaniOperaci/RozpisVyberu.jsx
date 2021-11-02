import { Table } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import prepocetVykazy from '../../../../utils/prepocetVykazy';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import TableSearch from '../../ui/TableSearch';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const RozpisVyberu = ({ data, loading }) => {
  const [vykazy, setVykazy] = useState(null);
  useEffect(() => {
    setVykazy(prepocetVykazy(data));
  }, [data]);

  const columns = [
    {
      title: 'Zaměstnanec',
      dataIndex: 'jmeno',
      key: 'jmeno',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.jmeno.localeCompare(b.jmeno),
    },
    {
      title: 'Objednávka',
      dataIndex: 'objednavka',
      key: 'objednavka',
      searchIndex: 'objednavka',
      sorter: (a, b) => a.objednavka.localeCompare(b.objednavka),
      render: (value) => <a href={'/vyroba/zakazky/' + value}>{value}</a>,
    },
    {
      title: 'OPV',
      dataIndex: 'opv',
      key: 'opv',
      searchIndex: 'opv',
      sorter: (a, b) => a.opv.localeCompare(b.opv),
    },
    {
      title: 'Operace',
      dataIndex: 'operace',
      key: 'operace',
      sorter: (a, b) => a.operace.localeCompare(b.operace),
    },
    {
      title: 'Délka výkazu',
      dataIndex: 'trvani',
      key: 'trvani',
      sorter: (a, b) => a.trvani - b.trvani,
      render: (value) => moment.duration(value).format('DD:HH:mm'),
    },
    {
      title: 'Plánovná délka',
      dataIndex: 'plan_cas',
      key: 'plan_cas',
      sorter: (a, b) => a.plan_cas - b.plan_cas,
      render: (value) => moment.duration(value).format('DD:HH:mm'),
    },
    {
      title: 'Produktivita',
      sorter: (a, b) => a.plan_cas / a.trvani - b.plan_cas / b.trvani,
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
      key: 'mzda',
      sorter: (a, b) => a.mzda - b.mzda,
      render: (value) => formatter.format(value),
    },
  ];

  return (
    <div>
      <TableSearch
        rowKey="id"
        columns={columns}
        dataSource={vykazy}
        loading={loading}
      />
    </div>
  );
};

export default RozpisVyberu;
