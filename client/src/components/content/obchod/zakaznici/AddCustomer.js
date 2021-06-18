import * as api from '../../../../api/index';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Collapse, Divider, Row, Form, Input, Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const { Panel } = Collapse;
const { Search } = Input;

const Zakaznici = () => {
  const onFinish = async (values) => {
    const result = await api.addCustomer(values);
    console.log(result);
  };

  return (
    <Collapse>
      <Panel header="Přidat zákazníka" key="1">
        <Form name="add-customer" onFinish={onFinish}>
          <Divider orientation="left" plain>
            Informace o firmě
          </Divider>
          <Row>
            <Space size="large" wrap>
              <Form.Item label="IČO" name="ico">
                <Search
                  rules={[{ required: true, message: 'Zadejte IČO' }]}
                  className="crm-input-ico"
                  type="number"
                  //value={formData.client.ico}
                  //onSearch={onSearch}
                  enterButton
                />
              </Form.Item>

              <Form.Item label="Jméno firmy" name="jmenoFirmy">
                <Input className="crm-input" />
              </Form.Item>
            </Space>
          </Row>

          <Divider orientation="left" plain>
            Kontaktní osoba
          </Divider>

          <Form.List name="persons" className="customer-add-list">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'jmeno']}
                      fieldKey={[fieldKey, 'jmeno']}
                      rules={[{ required: true, message: 'Vyplňte jméno' }]}
                    >
                      <Input placeholder="Jméno" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'prijmeni']}
                      fieldKey={[fieldKey, 'prijmeni']}
                      rules={[{ required: true, message: 'Vyplňte příjmení' }]}
                    >
                      <Input placeholder="Příjmení" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'funkce']}
                      fieldKey={[fieldKey, 'funkce']}
                      rules={[{ required: true, message: 'Vyplňte funkci' }]}
                    >
                      <Input placeholder="Funkce" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'tel']}
                      fieldKey={[fieldKey, 'tel']}
                      rules={[{ required: true, message: 'Vyplňte telefon' }]}
                    >
                      <Input placeholder="Telefon" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'mail']}
                      fieldKey={[fieldKey, 'mail']}
                      rules={[{ required: true, message: 'Vyplňte e-mail' }]}
                    >
                      <Input placeholder="E-mail" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Přidat Kontaktní osobu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left" plain />

          <Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Uložit záznam
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Zakaznici;
