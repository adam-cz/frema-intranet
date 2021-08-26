import { Table, Button } from 'antd';

import { DateTime } from 'luxon';

const OrderList = ({ setOrder, orders, loading }) => {
  const columns = [
    {
      title: 'Objednávka',
      dataIndex: 'doklad',
      key: 'doklad',
      render: (value) => (
        <Button type="link" onClick={() => setOrder(value)}>
          {value}
        </Button>
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
