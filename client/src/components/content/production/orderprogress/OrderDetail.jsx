import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';
import { Divider, Table } from 'antd';
import PlanGraf from './PlanGraf';

const columns = [
  { title: 'OPV', dataIndex: 'opv', key: 'opv' },
  {
    title: 'Popis',
    dataIndex: 'popis',
    key: 'popis',
    render: (value, record) =>
      record.opv === record.opvfinal ? <b>{value}</b> : value,
  },
  { title: 'Plán výroba', dataIndex: 'planvyroba', key: 'planvyroba' },
  { title: 'Ve výrobě', dataIndex: 'vevyrobe', key: 'vevyrobe' },
  { title: 'Odvedeno', dataIndex: 'odvedeno', key: 'odvedeno' },
  {
    title: 'Mzdy',
    dataIndex: 'jedn_mzdy',
    key: 'jedn_mzdy',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Soc./Zdrav.',
    dataIndex: 'rn1',
    key: 'rn1',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Materiál',
    dataIndex: 'material',
    key: 'material',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Polotovary',
    dataIndex: 'polotovar',
    key: 'polotovar',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Kooperace',
    dataIndex: 'kooper',
    key: 'kooper',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Strojní náklady',
    dataIndex: 'strnakl',
    key: 'strnakl',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Cena',
    dataIndex: 'cena',
    key: 'cena',
    render: (value) => Math.round(value * 100) / 100,
  },
];

const OrderDetail = ({ order }) => {
  const [procedures, setProcedures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await api.fetchProcedures(order);
      setProcedures(data);
      setLoading(false);
    };
    if (loading) loadOrders();
  }, [loading, order]);

  return (
    <div>
      <Divider>Detail zakázky</Divider>
      <div id="leftChart">
        <h3>Plánované náklady</h3>
        {procedures ? <PlanGraf procedures={procedures} /> : 'Nic'}
      </div>
      <Divider>Plánovaná kalkulace zakázky</Divider>
      <Table
        dataSource={procedures}
        columns={columns}
        loading={loading}
        rowKey="opv"
      />
    </div>
  );
};

export default OrderDetail;
