import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';
import { Divider, Tabs } from 'antd';
import PlanGraf from './PlanGraf';
import PlanTable from './PlanTable';
import Operace from './Operace';
import PorovnaniGraf from './PorovnaniGraf';

const { TabPane } = Tabs;

const OrderDetail = ({ order }) => {
  const [proceses, setProceses] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const count = [];
      procedures.map((zp) =>
        zp.operace.map((op) =>
          count.push({
            ...op,
            barcode: `${op.opv}_${op.polozka}_${op.stroj}`,
            objednavka: order,
          })
        )
      );
      setProceses(count);
    }
  }, [loading, procedures, order]);

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
      <div id="charts">
        <div id="leftChart">
          <h3>Plánované náklady</h3>
          {procedures ? <PlanGraf procedures={procedures} /> : ''}
        </div>
        <div id="rightChart">
          <h3>Porovnání plánu se skutečností</h3>
          {proceses ? (
            <PorovnaniGraf procedures={procedures} proceses={proceses} />
          ) : (
            ''
          )}
        </div>
      </div>
      <Divider>Plánovaná kalkulace zakázky</Divider>
      <PlanTable procedures={procedures} loading={loading} />

      <Divider>Rozpis zakázky dle operací</Divider>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Operace" key="1">
          <Operace
            procedures={procedures}
            proceses={proceses}
            loading={loading}
          />
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
