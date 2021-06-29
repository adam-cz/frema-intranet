import { List } from 'antd';
import { useSelector } from 'react-redux';

const RecordTextList = ({ record }) => {
  const employees = useSelector((state) => state.employees);
  return (
    <List
      itemLayout="horizontal"
      dataSource={record}
      rowKey="_id"
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <span>
                {
                  employees.data.find(
                    (employee) => employee._id === item.created.id
                  ).name
                }{' '}
                {
                  employees.data.find(
                    (employee) => employee._id === item.created.id
                  ).surname
                }{' '}
                - <i>{new Date(item.created.date).toLocaleString()}</i>
              </span>
            }
            description={item.text}
          />
        </List.Item>
      )}
    />
  );
};

export default RecordTextList;
