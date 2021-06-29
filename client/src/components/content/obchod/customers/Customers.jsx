import { Divider } from 'antd';
import AddCustomer from './AddCustomer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadCustomers } from '../../../../actions/customers';
import TableSearch from '../../ui/TableSearch';
import RecordTextList from './RecordTextList';

const Customers = () => {
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [customerCount, setCustomerCount] = useState(customers.data.length);

  useEffect(() => {
    dispatch(loadCustomers());
  }, [dispatch, customerCount]);

  const columns = [
    {
      title: 'Firma',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      searchIndex: 'name',
    },
    {
      title: 'IČO',
      dataIndex: 'ico',
      key: 'ico',
      width: '20%',
      searchIndex: 'ico',
    },
    {
      title: 'Datum zápisu',
      dataIndex: ['created', 'date'],
      key: 'date',
      sorter: (a, b) => new Date(a.created.date) - new Date(b.created.date),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <AddCustomer
        setCustomerCount={setCustomerCount}
        customerCount={customerCount}
      />
      <Divider orientation="left" plain />
      <TableSearch
        columns={columns}
        dataSource={customers.data}
        loading={customers.loading}
        expandable={{
          expandedRowRender: (record) => <RecordTextList record={record} />,
        }}
      />
    </div>
  );
};

export default Customers;
