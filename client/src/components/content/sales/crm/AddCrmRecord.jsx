import {
  Collapse,
  Divider,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Button,
  Space,
  Select,
} from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addCrmRecord } from '../../../../api/index';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const CRM = (props) => {
  const [customer, setCustomer] = useState('');
  const [form] = Form.useForm();
  const customers = useSelector((state) => state.customers);

  const onFinish = async (values) => {
    await addCrmRecord(values);
    form.resetFields();
    props.setRefresh(!props.refresh);
  };
  return (
    <Collapse>
      <Panel header="Přidat nový záznam" key="1">
        <Form
          form={form}
          name="add-crm-record"
          onFinish={onFinish}
          fields={[
            {
              name: ['ico'],
              value: customer.ico,
            },
          ]}
        >
          <Divider orientation="left" plain>
            Informace o firmě
          </Divider>
          <Row>
            <Space size="large" wrap>
              <Form.Item
                label="Vyberte firmu"
                name="company"
                rules={[{ required: true, message: 'Zadejte firmu' }]}
              >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Vyberte firmu"
                  optionFilterProp="value"
                  onChange={(value) =>
                    setCustomer(
                      customers.data.find((customer) => customer._id === value)
                    )
                  }
                  filterOption={(input, option) =>
                    customers.data
                      .find((el) => el._id === option.value)
                      .name.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {customers.data &&
                    customers.data.map((element) => (
                      <Option key={element._id} value={element._id}>
                        {element.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="IČO" name="ico">
                <Input disabled className="crm-input-ico" type="number" />
              </Form.Item>

              <Form.Item
                label="Vyberte kontaktní osobu"
                name="contact"
                rules={[{ required: true, message: 'Vyberte kontaktní osobu' }]}
              >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Vyberte kontakt"
                  optionFilterProp="value"
                  filterOption={(input, option) =>
                    customer.persons
                      .find((el) => el._id === option.value)
                      .name.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {customer.persons &&
                    customer.persons.map((element) => (
                      <Option
                        key={element._id}
                        value={element._id}
                      >{`${element.name} ${element.surname}`}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Space>
          </Row>
          <Divider orientation="left" plain>
            Detail záznamu
          </Divider>
          <Row justify="space-between" align="top">
            <Space size="large" className="space-crm-detail" wrap>
              <Col>
                <Form.Item
                  label="Předmět nabídky"
                  name="predmetNabidky"
                  rules={[{ required: true, message: 'Vyplňte předmět' }]}
                >
                  <Input className="crm-input" />
                </Form.Item>
                <Form.Item label="Hodnota zakázky" name="hodnotaZakazky">
                  <Input
                    className="crm-input-value"
                    type="number"
                    placeholder="Možno vyplnit později"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="recordText">
                  <TextArea
                    className="crm-textarea"
                    placeholder="Zadejte doplňující informace"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="comsPhone"
                  className="crm-checkbox"
                  valuePropName="checked"
                >
                  <Checkbox>Telefonický kontakt</Checkbox>
                </Form.Item>

                <Form.Item
                  name="comsEmail"
                  className="crm-checkbox"
                  valuePropName="checked"
                >
                  <Checkbox>Mailová komunikace</Checkbox>
                </Form.Item>

                <Form.Item
                  name="comsVisit"
                  className="crm-checkbox"
                  valuePropName="checked"
                >
                  <Checkbox>Proběhla schůzka</Checkbox>
                </Form.Item>

                <Form.Item name="comsOrder" valuePropName="checked">
                  <Checkbox>Zákazník objednal</Checkbox>
                </Form.Item>
              </Col>
            </Space>
          </Row>
          <Divider orientation="left" plain />

          <Row>
            <Button type="primary" htmlType="submit">
              Uložit záznam
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => {
                form.resetFields();
              }}
            >
              Smazat zadání
            </Button>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default CRM;
