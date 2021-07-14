import { List, Input, Table, Space, Button, AutoComplete } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ContactList = ({ record }) => {
  const user = useSelector((state) => state.user);
  const [edit, setEdit] = useState(false);
  const [editPerson, setEditPerson] = useState([]);
  const [person, setPerson] = useState({});

  const columns = [
    {
      title: 'Jméno',
      dataIndex: 'name',
      key: 'name',
      width: 150,
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
      width: 150,
      render: (text, record) =>
        editPerson ? (
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
        editPerson ? (
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
        editPerson ? (
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
        editPerson ? (
          <Input defaultValue={record.mail} size="small"></Input>
        ) : (
          record.mail
        ),
    },
    {
      title: 'Akce',
      render: (text, record) => (
        <Space>
          <Button size="small" onClick={() => editPerson.indexOf(record._id) < 0 ?   }>
            upravit
          </Button>
          <Button size="small" danger>
            X
          </Button>
        </Space>
      ),
    },
  ];

  const saveHandle = () => {
    setEdit(!edit);
  };
  return (
    <div>
      <Table pagination={false} columns={columns} dataSource={record.persons} />
    </div>
  );
};

export default ContactList;
