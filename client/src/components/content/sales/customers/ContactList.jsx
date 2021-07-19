import { Input, Table, Space, Button } from 'antd';
import { useState } from 'react';
//import { useSelector } from 'react-redux';
import * as api from '../../../../api';

const ContactList = (props) => {
  //const user = useSelector((state) => state.user);
  const [editPerson, setEditPerson] = useState([]);
  const [person, setPerson] = useState('');

  const savePerson = async () => {
    if (person) await api.editPerson(person, props.record._id);
    setPerson('');
    setEditPerson('');
    props.reload();
  };

  const deletePerson = async (personID, recordID) => {
    console.log(personID, recordID);
    await api.deletePerson(personID, recordID);
    props.reload();
  };

  const inputHandler = (event, record, key) => {
    let data = { ...record };
    data[key] = event.target.value;
    setPerson(data);
  };

  const columns = [
    {
      title: 'Jméno',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record) =>
        editPerson === record._id ? (
          <Input
            defaultValue={record.name}
            onChange={(event) => inputHandler(event, record, 'name')}
            size="small"
          ></Input>
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
        editPerson === record._id ? (
          <Input
            defaultValue={record.surname}
            onChange={(event) => inputHandler(event, record, 'surname')}
            size="small"
          ></Input>
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
        editPerson === record._id ? (
          <Input
            defaultValue={record.job}
            onChange={(event) => inputHandler(event, record, 'job')}
            size="small"
          ></Input>
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
        editPerson === record._id ? (
          <Input
            defaultValue={record.tel}
            onChange={(event) => inputHandler(event, record, 'tel')}
            size="small"
          ></Input>
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
        editPerson === record._id ? (
          <Input
            defaultValue={record.mail}
            onChange={(event) => inputHandler(event, record, 'mail')}
            size="small"
          ></Input>
        ) : (
          record.mail
        ),
    },
    {
      title: 'Akce',
      render: (text, record) => (
        <Space>
          <Button size="small">vytvořit záznam</Button>
          {editPerson === record._id ? (
            <Button size="small" onClick={savePerson}>
              uložit
            </Button>
          ) : (
            <Button size="small" onClick={() => setEditPerson(record._id)}>
              upravit
            </Button>
          )}
          <Button
            size="small"
            danger
            onClick={() => deletePerson(record._id, props.record._id)}
          >
            Smazat
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={props.record.persons}
      />
    </div>
  );
};

export default ContactList;
