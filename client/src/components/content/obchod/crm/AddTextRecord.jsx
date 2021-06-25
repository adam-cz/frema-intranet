import { Button, Space, Input, Checkbox, Row, Col, Form } from 'antd';
import { addCrmText } from '../../../../api/index';

const { TextArea } = Input;

const AddTextRecord = (props) => {
  const coms = props.record.coms;

  const onFinish = async (values) => {
    const data = { ...values, id: props.record._id };
    await addCrmText(data);
    props.setRefresh(!props.refresh);
  };

  return (
    <div>
      <Form name="add-text-record" onFinish={onFinish}>
        <Row>
          <Space direction="horizontal" size="large">
            <Col>
              <Form.Item
                name="text"
                rules={[
                  { required: true, message: 'Vyplňte záznam z jednání' },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  style={{ width: 400 }}
                  placeholder="Napište záznam z jednání..."
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                name="phone"
                className="crm-checkbox"
                valuePropName="checked"
                initialValue={coms.phone.done}
              >
                <Checkbox disabled={coms.phone.done}>
                  Telefonický kontakt
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="email"
                className="crm-checkbox"
                valuePropName="checked"
                initialValue={coms.email.done}
              >
                <Checkbox disabled={coms.email.done}>
                  Mailová komunikace
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="visit"
                className="crm-checkbox"
                valuePropName="checked"
                initialValue={coms.visit.done}
              >
                <Checkbox disabled={coms.visit.done}>Proběhla schůzka</Checkbox>
              </Form.Item>
              <Form.Item
                name="order"
                valuePropName="checked"
                initialValue={coms.order.done}
              >
                <Checkbox disabled={coms.order.done}>
                  Zákazník objednal
                </Checkbox>
              </Form.Item>
            </Col>
          </Space>
        </Row>
        <Button type="primary" htmlType="submit">
          Uložit záznam
        </Button>
      </Form>
    </div>
  );
};

export default AddTextRecord;
