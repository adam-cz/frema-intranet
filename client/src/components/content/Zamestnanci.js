import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Table, Tag, Space } from 'antd';

//import actions
import { getEmployees } from '../../actions/zamestnanci';

const columns = [
  {
    title: 'Jméno',
    dataIndex: 'Jmeno',
    key: 'Jmeno',
    render: (text) => <a>{text}</a>,
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
  const employees = useSelector((state) => state.zamestnanci);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return <Table columns={columns} dataSource={employees} />;
};

export default Zamestnanci;
