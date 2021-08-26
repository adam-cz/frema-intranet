import { useState, useEffect } from 'react';
import * as api from '../../../../api/index';

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

  return <div>{procedures && console.log(procedures)}</div>;
};

export default OrderDetail;
