import { List, Input } from 'antd';
import { useSelector } from 'react-redux';

const PersonsList = ({ record }) => {
  const employees = useSelector((state) => state.employees);
  return (
    <List
      itemLayout="horizontal"
      dataSource={record.persons}
      rowKey="_id"
      renderItem={(item) => (
        <List.Item>
          <Input defaultValue={item.name} />
          <Input defaultValue={item.surname} />
          <Input defaultValue={item.job} />
          <Input defaultValue={item.tel} />
          <Input defaultValue={item.mail} />
        </List.Item>
      )}
    />
  );
};

export default PersonsList;
