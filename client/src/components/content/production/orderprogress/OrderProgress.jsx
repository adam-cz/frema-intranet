import OrderList from './OrderList';
import { Link, Route } from 'react-router-dom';
import { Breadcrumb, Divider } from 'antd';
import { useState } from 'react';

const OrderProgress = () => {
  const [order, setOrder] = useState(null);
  return (
    <div>
      <Route
        path="/:order"
        component={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="zakazky">Zakázky</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{order}</Breadcrumb.Item>
          </Breadcrumb>
        }
      />

      <Divider />
      <OrderList setOrder={setOrder} />
    </div>
  );
};

export default OrderProgress;
