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
import { useState } from 'react';

const { Panel } = Collapse;
const { TextArea, Search } = Input;
const client = { client: { ico: '', person_id: '' }, records: [] };

const submitHandler = (event) => {
  event.preventDefault();
};

const CRM = () => {
  const [formData, setFormData] = useState(client);

  return (
    <Collapse>
      <Panel header="Přidat nový záznam" key="1">
        <Form
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
                  value={formData.client.ico}
                  //onSearch={onSearch}
                  enterButton
                  onChange={(event) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      client: { ico: event.target.value },
                    }));
                  }}
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
            <Space size="large" wrap>
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
                <TextArea
                  className="crm-textarea"
                  placeholder="Zadejte doplňující informace"
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Col>
              <Col>
                <Form.Item name="coms">
                  <Row>
                    <Checkbox
                      value="phone"
                      style={{
                        lineHeight: '32px',
                      }}
                    >
                      Telefonický kontakt
                    </Checkbox>
                  </Row>
                  <Row>
                    <Checkbox
                      value="email"
                      style={{
                        lineHeight: '32px',
                      }}
                    >
                      Mailová komunikace
                    </Checkbox>
                  </Row>
                  <Row>
                    <Checkbox
                      value="visit"
                      style={{
                        lineHeight: '32px',
                      }}
                    >
                      Proběhla schůzka
                    </Checkbox>
                  </Row>
                  <Row>
                    <Checkbox
                      value="order"
                      style={{
                        lineHeight: '32px',
                      }}
                    >
                      Zákazník objednal
                    </Checkbox>
                  </Row>
                </Form.Item>
              </Col>
            </Space>
          </Row>
          <Divider orientation="left" plain />

          <Row>
            <Button type="primary" onClick={submitHandler}>
              Uložit záznam
            </Button>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default CRM;
