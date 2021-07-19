import { Divider, Space, Button } from 'antd';
import AddCustomer from './AddCustomer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadCustomers } from '../../../../actions/customers';
import TableSearch from '../../ui/TableSearch';
import ContactList from './ContactList';
import { deleteCustomer } from '../../../../api/index';

const Customers = () => {
  const customers = useSelector((state) => state.customers);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [customerCount, setCustomerCount] = useState(customers.data.length);
  const [edit, setEdit] = useState('');

  const deleteHandler = async (id) => {
    await deleteCustomer(id);
    dispatch(loadCustomers());
  };

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
    {
      title: 'Akce',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => setEdit(record)}>Upravit</Button>
          <Button
            disabled={
              user.data.role.includes('admin')
                ? false
                : record.created.by !== user.data._id
            }
            onClick={() => deleteHandler(record._id)}
            danger
          >
            X
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AddCustomer
        setCustomerCount={setCustomerCount}
        customerCount={customerCount}
        edit={edit}
        setEdit={setEdit}
      />
      <Divider orientation="left" plain />
      <TableSearch
        columns={columns}
        dataSource={customers.data}
        loading={customers.loading}
        expandable={{
          expandedRowRender: (record) => (
            <ContactList
              record={record}
              reload={() => dispatch(loadCustomers())}
            />
          ),
        }}
      />
    </div>
  );
};

export default Customers;
