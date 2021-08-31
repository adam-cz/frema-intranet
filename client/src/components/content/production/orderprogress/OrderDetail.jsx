import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';
import { Divider, Table } from 'antd';
import PlanGraf from './PlanGraf';
import PlanTable from './PlanTable';

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
      <PlanTable procedures={procedures} loading={loading} />

      <Divider>Skutečný průběh zakázky</Divider>
    </div>
  );
};

export default OrderDetail;
