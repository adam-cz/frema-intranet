import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Table, Tag } from 'antd';

//import actions
import { getEmployees } from '../../../actions/employees';

const columns = [
  {
    title: 'Jméno',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
  },
  {
    title: 'Příjmení',
    dataIndex: 'surname',
    key: 'surname',
    width: '10%',
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Čas poslední operace',
    dataIndex: 'lastOperation',
    key: 'lastOperation',
    render: (date) => new Date(date).toLocaleString(),
  },
  {
    title: 'Přítomnost',
    key: 'isPresent',
    dataIndex: 'isPresent',
    render: (isPresent) => (
      <Tag color={isPresent ? 'green' : 'volcano'} key={isPresent}>
        {isPresent ? 'V práci' : 'Nepřítomen'}
      </Tag>
    ),
  },
];

const Zamestnanci = () => {
  const employees = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <Table
      columns={columns}
      dataSource={employees.data.map((el) => ({ ...el, key: el._id }))}
      loading={employees.loading}
    />
  );
};

export default Zamestnanci;
