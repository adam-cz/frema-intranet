import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';
import { Divider, Tabs } from 'antd';
import PlanGraf from './PlanGraf';
import PlanTable from './PlanTable';
import Operace from './Operace';

const { TabPane } = Tabs;

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

      <Divider>Rozpis zakázky dle operací</Divider>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Operace" key="1">
          <Operace procedures={procedures} loading={loading} />
        </TabPane>
        <TabPane tab="Mzdy" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Materiál" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Kooperace" key="4">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Celkové náklady" key="5">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderDetail;
