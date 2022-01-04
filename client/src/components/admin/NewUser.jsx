import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useSelector } from 'react-redux';
import { signUp } from '../../api';

const { Option } = Select;

function onFinish(values) {
  signUp(values);
}

function NewUser() {
  const employees = useSelector((state) => state.employees);
  return (
    <Form
      name="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        style={{ width: 300 }}
        label="Zaměstnanec"
        name="id"
        rules={[{ required: true, message: 'Vyberte zaměstnance' }]}
      >
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Vyberte zaměstnance"
          optionFilterProp="value"
          filterOption={(input, option) =>
            employees.data
              .find((el) => el._id === option.value)
              .surname.toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {employees.data &&
            employees.data.map((element) => (
              <Option key={element._id} value={element._id}>
                {`${element.name} ${element.surname}`}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item style={{ width: 300 }} label="RFID" name="rfid">
        <Input />
      </Form.Item>
      <Form.Item style={{ width: 300 }} label="E-mail" name="email">
        <Input />
      </Form.Item>

      <Form.Item style={{ width: 300 }} label="Heslo" name="password">
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Aktivovat uživatele
        </Button>
      </Form.Item>
    </Form>
  );
}

export default NewUser;
