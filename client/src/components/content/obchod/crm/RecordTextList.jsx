import { List } from 'antd';
import { useSelector } from 'react-redux';

const RecordTextList = ({ record }) => {
  const employees = useSelector((state) => state.employees);
  return (
    <List
      itemLayout="horizontal"
      dataSource={record}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <span>
                {
                  employees.find((employee) => employee._id === item.created.id)
                    .Jmeno
                }{' '}
                {
                  employees.find((employee) => employee._id === item.created.id)
                    .Prijmeni
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
