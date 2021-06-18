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
} from 'antd';
import { useSelector } from 'react-redux';

const { Panel } = Collapse;
const { TextArea, Search } = Input;

const CRM = () => {
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <Collapse>
      <Panel header="Přidat nový záznam" key="1">
        <Form
          name="add-crm-record"
          onFinish={onFinish}
          //labelCol={{ span: 8 }}
          //wrapperCol={{ span: 18 }}
          //layout="horizontal"
          //onValuesChange={onFormLayoutChange}
        >
          <Divider orientation="left" plain>
            Informace o firmě
          </Divider>
          <Row>
            <Space size="large" wrap>
              <Form.Item label="IČO" name="ico">
                <Search
                  className="crm-input-ico"
                  type="number"
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
          <Row>
            <Space size="large" wrap>
              <Form.Item label="Jméno" name="jmenoKontaktu">
                <Input className="crm-input" />
              </Form.Item>

              <Form.Item label="Tel. číslo" name="cisloKontaktu">
                <Input className="crm-input" type="tel" />
              </Form.Item>

              <Form.Item label="Email" name="emailKontaktu">
                <Input className="crm-input" type="email" />
              </Form.Item>
            </Space>
          </Row>
          <Divider orientation="left" plain>
            Detail záznamu
          </Divider>
          <Row justify="space-between" align="top">
            <Space size="large" className="space-crm-detail" wrap>
              <Col>
                <Form.Item label="Předmět nabídky" name="predmetNabidky">
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

                <Form.Item name="order" valuePropName="checked">
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
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default CRM;
