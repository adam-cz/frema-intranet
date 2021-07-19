import { useEffect } from 'react';
import * as api from '../../../../api/index';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse, Divider, Row, Form, Input, Button, Space } from 'antd';

const { Panel } = Collapse;

const Zakaznici = (props) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    props.edit
      ? await api.editCustomer({ ...values, _id: props.edit._id })
      : await api.addCustomer(values);
    form.resetFields();
    props.setActiveKey('');
    props.setCustomerCount(props.customerCount + 1);
  };

  useEffect(() => {
    if (props.edit) {
      form.setFieldsValue({
        ico: props.edit.ico,
        name: props.edit.name,
        persons: props.edit.persons,
      });
    }
  }, [props.edit, form]);

  return (
    <Collapse
      activeKey={props.activeKey}
      onChange={(key) => props.setActiveKey(key)}
    >
      <Panel
        header={props.edit ? 'Upravit zákazníka' : 'Přidat zákazníka'}
        key="1"
        onClick={() => props.setActiveKey(!props.activeKey)}
      >
        <Form form={form} name="add-customer" onFinish={onFinish}>
          <Divider orientation="left" plain>
            Informace o firmě
          </Divider>
          <Row>
            <Space size="large" wrap>
              <Form.Item
                label="IČO"
                name="ico"
                rules={[{ required: true, message: 'Zadejte IČO' }]}
              >
                <Input className="crm-input-ico" type="number" />
              </Form.Item>

              <Form.Item label="Jméno firmy" name="name">
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
                      name={[name, 'name']}
                      fieldKey={[fieldKey, 'name']}
                      rules={[{ required: true, message: 'Vyplňte jméno' }]}
                    >
                      <Input placeholder="Jméno" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'surname']}
                      fieldKey={[fieldKey, 'surname']}
                      rules={[{ required: true, message: 'Vyplňte příjmení' }]}
                    >
                      <Input placeholder="Příjmení" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'job']}
                      fieldKey={[fieldKey, 'job']}
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

          <Button type="primary" htmlType="submit">
            {props.edit ? 'Upravit záznam' : 'Uložit záznam'}
          </Button>

          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => {
              form.resetFields();
              props.setEdit('');
              props.setActiveKey('');
            }}
          >
            Storno
          </Button>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Zakaznici;
