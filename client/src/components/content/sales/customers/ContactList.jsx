import { List, Input, Table, Space, Button, AutoComplete } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ContactList = ({ record }) => {
  const user = useSelector((state) => state.user);
  const [editPerson, setEditPerson] = useState([]);
  const [person, setPerson] = useState([]);

  useEffect(() => {
    console.log(editPerson);
  }, [editPerson]);

  const allowEdit = (id) => {
    const pos = editPerson.indexOf(id);
    pos < 0
      ? setEditPerson(editPerson.concat([id]))
      : setEditPerson(editPerson.filter((record) => record !== id));
  };

  const columns = [
    {
      title: 'Jméno',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record) =>
        editPerson.includes(record._id) ? (
          <Input defaultValue={record.name} size="small"></Input>
        ) : (
          record.name
        ),
    },
    {
      title: 'Příjmení',
      dataIndex: 'surname',
      key: 'surname',
      width: 100,
      render: (text, record) =>
        editPerson.includes(record._id) ? (
          <Input defaultValue={record.surname} size="small"></Input>
        ) : (
          record.surname
        ),
    },
    {
      title: 'Funkce',
      dataIndex: 'job',
      key: 'job',
      width: 150,
      render: (text, record) =>
        editPerson.includes(record._id) ? (
          <Input defaultValue={record.job} size="small"></Input>
        ) : (
          record.job
        ),
    },
    {
      title: 'Telefon',
      dataIndex: 'tel',
      key: 'tel',
      width: 150,
      render: (text, record) =>
        editPerson.includes(record._id) ? (
          <Input defaultValue={record.tel} size="small"></Input>
        ) : (
          record.tel
        ),
    },
    {
      title: 'Mail',
      dataIndex: 'mail',
      key: 'mail',
      width: 150,
      render: (text, record) =>
        editPerson.includes(record._id) ? (
          <Input defaultValue={record.mail} size="small"></Input>
        ) : (
          record.mail
        ),
    },
    {
      title: 'Akce',
      render: (text, record) => (
        <Space>
          <Button size="small">vytvořit záznam</Button>
          {editPerson.includes(record._id) ? (
            <Button size="small" onClick={() => allowEdit(record._id)}>
              uložit
            </Button>
          ) : (
            <Button size="small" onClick={() => allowEdit(record._id)}>
              upravit
            </Button>
          )}
          <Button size="small" danger>
            Smazat
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table pagination={false} columns={columns} dataSource={record.persons} />
    </div>
  );
};

export default ContactList;
