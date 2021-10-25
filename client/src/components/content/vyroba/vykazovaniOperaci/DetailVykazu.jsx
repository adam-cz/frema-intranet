import {
  Descriptions,
  Row,
  Col,
  Button,
  Space,
  Modal,
  message,
  DatePicker,
} from 'antd';
import moment from 'moment';
import * as api from '../../../../api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import locale from 'antd/es/date-picker/locale/cs_CZ';

const { confirm } = Modal;

const DetailVykazu = ({ detailVykazu, setRestart, setDetailVykazu }) => {
  const [editDate, setEditDate] = useState(false);

  const handleEdit = () => {
    console.log('uloženo');
    setEditDate(!editDate);
  };

  const handleDelete = ({ proces_id, start_time_id, end_time_id }) => {
    confirm({
      title: 'Smazat výkaz?',
      okText: 'Smazat Výkaz',
      okType: 'danger',
      cancelText: 'Storno',
      icon: <ExclamationCircleOutlined />,
      content:
        'Chystáte se trvale odstranit výkaz. Skutečně chcete pokračovat?',
      onOk() {
        api.smazatVykazy(proces_id, start_time_id, end_time_id).then((res) => {
          console.log(res);
          if (res.status === 204) {
            setRestart(true);
            setDetailVykazu(null);
            message.success('Výkaz byl smazán!');
          }
        });
      },
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
            {editDate ? (
              <DatePicker
                locale={locale}
                size="small"
                format="D. M. HH:mm"
                defaultValue={moment(detailVykazu.start_time)}
                showTime
              />
            ) : (
              moment(detailVykazu.start_time).format('D.M. HH:mm')
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Konec výkazu">
            {editDate ? (
              <DatePicker
                locale={locale}
                size="small"
                format="D. M. HH:mm"
                defaultValue={moment(detailVykazu.end_time)}
                showTime
              />
            ) : (
              moment(detailVykazu.end_time).format('D.M. HH:mm')
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Délka výkazu">
            {moment.utc(detailVykazu.trvani).format('HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item>
            <Space>
              <Button size="small" onClick={() => setEditDate(!editDate)}>
                {editDate ? 'Storno' : 'Upravit čas'}
              </Button>
              {editDate && (
                <Button size="small" onClick={() => handleEdit(detailVykazu)}>
                  Uložit změny
                </Button>
              )}
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