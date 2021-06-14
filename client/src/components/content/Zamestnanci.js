import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Table, Tag } from 'antd';

//import actions
import { getEmployees } from '../../actions/employees';

const columns = [
  {
    title: 'Jméno',
    dataIndex: 'Jmeno',
    key: 'Jmeno',
  },
  {
    title: 'Příjmení',
    dataIndex: 'Prijmeni',
    key: 'Prijmeni',
  },
  {
    title: 'Čas poslední operace',
    dataIndex: 'DatumCasOperace',
    key: 'DatumCasOperace',
  },
  {
    title: 'Přítomnost',
    key: 'Pritomen',
    dataIndex: 'Pritomen',
    render: (Pritomen) => (
      <Tag color={Pritomen ? 'green' : 'volcano'} key={Pritomen}>
        {Pritomen ? 'V práci' : 'Nepřítomen'}
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
      dataSource={employees.map((el) => ({ ...el, key: el._id }))}
    />
  );
};

export default Zamestnanci;
