import {
  Modal,
  Input,
  Row,
  Col,
  Typography,
  Select,
  Checkbox,
  DatePicker,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import locale from 'antd/es/date-picker/locale/cs_CZ';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

const PridatVykazModal = ({ modalVisible, setModalVisible, setRestart }) => {
  const [disabledOk, setDisabledOk] = useState(true);
  const [vykaz, setVykaz] = useState({
    opv: null,
    operace: null,
    stroj: null,
    zamestnanecId: null,
    od: null,
    do: null,
  });
  const [data, setData] = useState(null);
  const [neukoncovat, setNeukoncovat] = useState(false);

  useEffect(() => {
    if (
      vykaz &&
      vykaz.opv &&
      vykaz.operace &&
      vykaz.stroj &&
      vykaz.zamestnanecId &&
      vykaz.od &&
      (vykaz.do || neukoncovat)
    )
      setDisabledOk(false);
    else setDisabledOk(true);
  }, [vykaz, neukoncovat]);

  const handleChangeOperace = (value) => {
    const stroje = data.procesy.find(
      (proces) => proces.polozka === value
    ).stroje;
    setData({ ...data, stroje });
    setVykaz({
      ...vykaz,
      operace: value,
      stroj: stroje[0].nazev === 'NULL' ? 'NULL' : null,
    });
  };

  const handleSearch = (value) => {
    setVykaz(null);
    setData(null);
    api.hledejProces(value).then((res) => {
      setData(res.data);
      setVykaz({ ...vykaz, opv: value });
    });
  };

  const vlozVykaz = () => {
    api.vytvoritVykaz(vykaz).then((res) => {
      if (res.data.status === 'error')
        message[res.data.status](res.data.message);
      if (res.data.status === 'success') {
        message[res.data.status](res.data.message);
        setData(null);
        setVykaz(null);
        setModalVisible(false);
        setRestart(true);
      }
    });
  };

  return (
    <Modal
      title="Přidat výkaz"
      visible={modalVisible}
      onOk={vlozVykaz}
      onCancel={() => setModalVisible(false)}
      cancelText="Storno"
      okText="Vložit výkaz"
      okButtonProps={{ disabled: disabledOk }}
      width={900}
    >
      <Row align="middle">
        <Col>
          <Search
            style={{ width: 200 }}
            onSearch={handleSearch}
            placeholder="Zadejte číslo OPV"
          />
        </Col>
        <Col offset={1}>
          {data?.status && <Text type={data.status}>{data.message}</Text>}
        </Col>
      </Row>
      {data?.procesy && (
        <>
          <Row align="middle" style={{ marginTop: 30 }}>
            <Col>
              <Text>Zvolte operaci</Text>
            </Col>
            <Col offset={1}>
              <Select style={{ width: 250 }} onSelect={handleChangeOperace}>
                {data?.procesy
                  .sort((a, b) => a.polozka.localeCompare(b.polozka))
                  .map((postup) => (
                    <Option value={postup.polozka}>
                      {postup.polozka} - {postup.popis}
                    </Option>
                  ))}
              </Select>
            </Col>
            {data.stroje?.length > 1 && (
              <>
                <Col offset={1}>
                  <Text>Zvolte stroj</Text>
                </Col>
                <Col offset={1}>
                  <Select
                    style={{ width: 120 }}
                    onSelect={(value) => setVykaz({ ...vykaz, stroj: value })}
                  >
                    {data.stroje?.map((stroj) => (
                      <Option value={stroj.nazev}>{stroj.nazev}</Option>
                    ))}
                  </Select>
                </Col>
              </>
            )}
            <Col offset={1}>
              <Text>Zvolte zaměstnance</Text>
            </Col>
            <Col offset={1}>
              <Select
                style={{ width: 180 }}
                onSelect={(value) =>
                  setVykaz({ ...vykaz, zamestnanecId: value })
                }
              >
                {data?.zamestnanci
                  .sort((a, b) => a.surname.localeCompare(b.surname))
                  .map((zamestnanec) => (
                    <Option value={zamestnanec._id}>
                      {zamestnanec.surname + ' ' + zamestnanec.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <Row align="middle" style={{ marginTop: 30 }}>
            <Col>
              <Text>Od</Text>
            </Col>
            <Col offset={1}>
              <DatePicker
                showTime
                showSecond={false}
                locale={locale}
                onChange={(value) => setVykaz({ ...vykaz, od: value })}
              />
            </Col>
            {!neukoncovat && (
              <>
                <Col offset={1}>
                  <Text>Do</Text>
                </Col>
                <Col offset={1}>
                  <DatePicker
                    showTime
                    showSecond={false}
                    locale={locale}
                    onChange={(value) => setVykaz({ ...vykaz, do: value })}
                  />
                </Col>
              </>
            )}
            <Col offset={1}>
              <Text>Neukončovat</Text>
            </Col>
            <Col offset={1}>
              <Checkbox
                onChange={() => {
                  if (!neukoncovat) setVykaz({ ...vykaz, do: null });
                  setNeukoncovat(!neukoncovat);
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
};

export default PridatVykazModal;
