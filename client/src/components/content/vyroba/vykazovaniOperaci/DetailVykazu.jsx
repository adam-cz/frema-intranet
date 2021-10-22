import { Descriptions, Row, Col, Button, Space } from 'antd';
import moment from 'moment';

const DetailVykazu = ({ detailVykazu }) => {
  return (
    <Row>
      <Col span={8}>
        <Descriptions column={1} title="Obecné informace">
          <Descriptions.Item label="Jméno pracovníka">
            {detailVykazu.jmeno}
          </Descriptions.Item>
          <Descriptions.Item label="Objednávka">
            {detailVykazu.objednavka}
          </Descriptions.Item>
          <Descriptions.Item label="OPV">{detailVykazu.opv}</Descriptions.Item>
          <Descriptions.Item label="Číslo operace">
            {detailVykazu.operace}
          </Descriptions.Item>
          <Descriptions.Item label="Stroj">
            {detailVykazu.stroj === 'NULL'
              ? `Výchozí stroj zdroje ${detailVykazu.zdroj}`
              : detailVykazu.stroj}
          </Descriptions.Item>
          <Descriptions.Item label="Popis operace">
            {detailVykazu.nazev}
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={8}>
        <Descriptions column={1} title="Časové údaje">
          <Descriptions.Item label="Začátek výkazu">
            <Space>
              <>{moment(detailVykazu.start_time).format('D.M. HH:mm')}</>
              <Button disabled size="small">
                Změnit
              </Button>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Konec výkazu">
            <Space>
              <>{moment(detailVykazu.end_time).format('D.M. HH:mm')}</>
              <Button disabled size="small">
                Změnit
              </Button>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Délka výkazu">
            {moment.utc(detailVykazu.trvani).format('HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={8}>
        <Descriptions column={1} title="Mzdové údaje">
          <Descriptions.Item label="Hodinová mzda"></Descriptions.Item>
          <Descriptions.Item label="Vykázaná mzda"></Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default DetailVykazu;
