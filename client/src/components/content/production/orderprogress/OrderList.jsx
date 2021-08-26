import { useEffect, useState } from 'react';
import { Table } from 'antd';
import * as api from '../../../../api/index';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

const OrderList = ({ setOrder }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState('');
  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await api.fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    if (loading) loadOrders();
  }, [loading]);

  const columns = [
    {
      title: 'Objednávka',
      dataIndex: 'doklad',
      key: 'doklad',
      render: (value) => (
        <Link to={'zakazky/' + value} onClick={setOrder(value)}>
          {value}
        </Link>
      ),
    },
    {
      title: 'Poznámka',
      dataIndex: 'poznamka',
      key: 'poznamka',
    },
    {
      title: 'Partner',
      dataIndex: 'zkraceny_nazev',
      key: 'zkraceny_nazev',
    },
    {
      title: 'Datum pořízení',
      dataIndex: 'dat_por',
      key: 'dat_por',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
    {
      title: 'Datum expedice',
      dataIndex: 'dat_expedice',
      key: 'dat_expedice',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
    {
      title: 'Datum dodání',
      dataIndex: 'dat_dodani',
      key: 'dat_dodani',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
  ];

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="doklad"
      />
    </div>
  );
};

export default OrderList;
