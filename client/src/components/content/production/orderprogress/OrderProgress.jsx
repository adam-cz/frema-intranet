import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import { Breadcrumb } from 'antd';
import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';

const OrderProgress = () => {
  const [order, setOrder] = useState(null);
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

  return (
    <div>
      {order && (
        <>
          <Breadcrumb>
            <Breadcrumb.Item
              style={{ cursor: 'pointer' }}
              onClick={() => setOrder(null)}
            >
              Zakázky
            </Breadcrumb.Item>
            <Breadcrumb.Item>{order}</Breadcrumb.Item>
          </Breadcrumb>
        </>
      )}

      {order ? (
        <OrderDetail order={order} />
      ) : (
        <OrderList setOrder={setOrder} loading={loading} orders={orders} />
      )}
    </div>
  );
};

export default OrderProgress;
