import { Descriptions, Row, Col, Button, Space } from 'antd';
import moment from 'moment';
import * as api from '../../../../api';

const DetailVykazu = ({ detailVykazu, setDataFiltered, dataFiltered }) => {
  const handleEdit = () => {};

  const handleDelete = ({ proces_id, start_time_id, end_time_id }) => {
    api.smazatVykazy(proces_id, start_time_id, end_time_id).then((res) => {
      if (res.data.status === 'success') {
      }
    });
  };

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
            <>{moment(detailVykazu.start_time).format('D.M. HH:mm')}</>
          </Descriptions.Item>
          <Descriptions.Item label="Konec výkazu">
            <>{moment(detailVykazu.end_time).format('D.M. HH:mm')}</>
          </Descriptions.Item>
          <Descriptions.Item label="Délka výkazu">
            {moment.utc(detailVykazu.trvani).format('HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item>
            <Space>
              <Button size="small" onClick={() => handleEdit(detailVykazu)}>
                Upravit čas
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleDelete(detailVykazu)}
              >
                Smazat výkaz
              </Button>
            </Space>
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
