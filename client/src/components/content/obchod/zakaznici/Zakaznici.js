import { Table, Divider } from 'antd';
import AddCustomer from './AddCustomer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCustomers } from '../../../../actions/customers';

const columns = [
  {
    title: 'Firma',
    dataIndex: 'name',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'IČO',
    dataIndex: 'ico',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.ico - b.ico,
  },
  {
    title: 'Vytvořeno',
    dataIndex: ['created', 'byě'],
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
  },
];

const CRM = () => {
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch, customers]);

  return (
    <div>
      <AddCustomer />
      <Divider orientation="left" plain />
      <Table columns={columns} dataSource={customers} />
    </div>
  );
};

export default CRM;
