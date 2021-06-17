import { Collapse, Divider, Row, Col, Form, Input, Button } from 'antd';
import { useSelector } from 'react-redux';

const { Panel } = Collapse;

const CRM = () => {
  return (
    <Collapse>
      <Panel header="Přidat nový záznam" key="1">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          layout="vhorizontal"
          //onValuesChange={onFormLayoutChange}
        >
          <Divider orientation="left" plain>
            Informace o firmě
          </Divider>
          <Row>
            <Form.Item label="IČO" name="ico">
              <Input />
            </Form.Item>

            <Form.Item label="Jméno firmy" name="jmenoFirmy">
              <Input />
            </Form.Item>
          </Row>
          <Divider orientation="left" plain>
            Kontaktní osoba
          </Divider>
          <Row>
            <Form.Item label="Jméno" name="jmenoKontaktu">
              <Input />
            </Form.Item>

            <Form.Item label="Tel. číslo" name="cisloKontaktu">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="emailKontaktu">
              <Input />
            </Form.Item>
          </Row>
          <Divider orientation="left" plain>
            Detail záznamu
          </Divider>
          <Row>
            <Form.Item label="Jméno" name="jmenoKontaktu">
              <Input />
            </Form.Item>

            <Form.Item label="Tel. číslo" name="cisloKontaktu">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="emailKontaktu">
              <Input />
            </Form.Item>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default CRM;
