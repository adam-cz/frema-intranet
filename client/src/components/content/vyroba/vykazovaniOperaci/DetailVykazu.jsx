import {
  Descriptions,
  Row,
  Col,
  Button,
  Space,
  Modal,
  message,
  DatePicker,
  Tag,
} from 'antd';
import moment from 'moment';
import * as api from '../../../../api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import locale from 'antd/es/date-picker/locale/cs_CZ';

const { confirm } = Modal;

const DetailVykazu = ({
  detailVykazu,
  setRestart,
  setDetailVykazu,
  editDate,
  setEditDate,
}) => {
  const [novyCas, setNovyCas] = useState(null);

  const handleEdit = ({ proces_id, id }) => {
    console.log(novyCas);
    api.upravitCas(proces_id, id, novyCas).then((res) => {
      setRestart(true);
      message[res.data.status](res.data.message);
    });
    setEditDate(!editDate);
  };

  const handleUkonciVykaz = ({ proces_id, id }) => {
    confirm({
      title: 'Ukončit výkaz?',
      okText: 'Ukončit výkaz',
      okType: 'danger',
      cancelText: 'Storno',
      icon: <ExclamationCircleOutlined />,
      content:
        'Chystáte se ručně uzavřít aktivní výkaz. Skutečně chcete pokračovat?',
      onOk() {
        api.ukoncitVykaz(proces_id, id).then((res) => {
          setRestart(true);
          setDetailVykazu(null);
          message[res.data.status](res.data.message);
        });
      },
    });
  };

  const handleDelete = ({ proces_id, id }) => {
    confirm({
      title: 'Smazat výkaz?',
      okText: 'Smazat Výkaz',
      okType: 'danger',
      cancelText: 'Storno',
      icon: <ExclamationCircleOutlined />,
      content:
        'Chystáte se trvale odstranit výkaz. Skutečně chcete pokračovat?',
      onOk() {
        api.smazatVykazy(proces_id, id).then((res) => {
          setRestart(true);
          setDetailVykazu(null);
          message[res.data.status](res.data.message);
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
            <a href={'/vyroba/zakazky/' + detailVykazu.objednavka}>
              {detailVykazu.objednavka}
            </a>
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
                onChange={(value) => setNovyCas({ ...novyCas, od: value })}
                showTime
              />
            ) : (
              moment(detailVykazu.start_time).format('D.M. HH:mm')
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Konec výkazu">
            {editDate && detailVykazu.ukonceno ? (
              <DatePicker
                locale={locale}
                size="small"
                format="D. M. HH:mm"
                defaultValue={moment(detailVykazu.end_time)}
                onChange={(value) => setNovyCas({ ...novyCas, do: value })}
                showTime
              />
            ) : detailVykazu.ukonceno ? (
              moment(detailVykazu.end_time).format('D.M. HH:mm')
            ) : (
              !detailVykazu.ukonceno && <Tag color="green">Stále probíhá</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Délka výkazu (za vybrané období)">
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
              {!detailVykazu.ukonceno && (
                <Button
                  size="small"
                  onClick={() => handleUkonciVykaz(detailVykazu)}
                >
                  Ukončit výkaz
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
          {/*  <Descriptions.Item label="Hodinová mzda pracovníka">
            {detailVykazu.sazba + ' Kč'}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Příplatky">
            <Tag color="green">Vícestroj +30%</Tag>
            <Tag color="green">Víkend +20%</Tag>
          </Descriptions.Item>
           */}
          <Descriptions.Item label="Vykázaná mzda">
            {Math.round(detailVykazu.mzda) + ' Kč'}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default DetailVykazu;
