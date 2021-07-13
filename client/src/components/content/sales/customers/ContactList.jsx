import { List, Input, Space, Button } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ContactList = ({ record }) => {
  const user = useSelector((state) => state.user);
  const [edit, setEdit] = useState(false);

  const saveHandle = () => {
    setEdit(!edit);
  };

  return (
    <List
      id="contact-list"
      itemLayout="horizontal"
      dataSource={record.persons}
      rowKey="_id"
      renderItem={(item) => (
        <List.Item id="contact-list-items">
          {edit ? (
            <Input disabled={!edit} defaultValue={item.name} />
          ) : (
            <div className="contact-list-item">{item.name}</div>
          )}
          {edit ? (
            <Input disabled={!edit} defaultValue={item.surname} />
          ) : (
            <div className="contact-list-item">{item.surname}</div>
          )}
          {edit ? (
            <Input disabled={!edit} defaultValue={item.job} />
          ) : (
            <div className="contact-list-item">{item.job}</div>
          )}
          {edit ? (
            <Input disabled={!edit} defaultValue={item.tel} />
          ) : (
            <div className="contact-list-item">{item.tel}</div>
          )}
          {edit ? (
            <Input disabled={!edit} defaultValue={item.mail} />
          ) : (
            <div className="contact-list-item">{item.mail}</div>
          )}
          <span>
            {!edit ? (
              <Button onClick={() => setEdit(!edit)}>Upravit</Button>
            ) : (
              <Button onClick={saveHandle}>Ulozit</Button>
            )}
            <Button danger>Smazat</Button>
          </span>
        </List.Item>
      )}
    />
  );
};

export default ContactList;
