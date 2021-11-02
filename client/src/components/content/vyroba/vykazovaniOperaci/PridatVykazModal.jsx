import {
  Modal,
  Input,
  Row,
  Col,
  Typography,
  Select,
  Checkbox,
  DatePicker,
} from 'antd';
import { useState } from 'react';
import * as api from '../../../../api';
import locale from 'antd/es/date-picker/locale/cs_CZ';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PridatVykazModal = ({ modalVisible, setModalVisible }) => {
  const [disabledOk, setDisabledOk] = useState(true);
  const [vykaz, setVykaz] = useState(null);
  const [data, setData] = useState(null);
  const [neukoncovat, setNeukoncovat] = useState(false);

  const handleSearch = (value) => {
    setVykaz(null);
    setData(null);
    api.hledejProces(value).then((res) => {
      setData(res.data);
      setVykaz({ ...vykaz, opv: value });
    });
  };

  return (
    <Modal
      title="Přidat výkaz"
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
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
              <Select
                style={{ width: 80 }}
                onSelect={(value) => setVykaz({ ...vykaz, operace: value })}
              >
                {data?.procesy
                  .sort((a, b) => a.polozka.localeCompare(b.polozka))
                  .map((postup) => (
                    <Option value={postup.polozka}>{postup.polozka}</Option>
                  ))}
              </Select>
            </Col>
            <Col offset={1}>
              <Text>Zvolte zaměstnance</Text>
            </Col>
            <Col offset={1}>
              <Select
                style={{ width: 200 }}
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
              <Checkbox onChange={() => setNeukoncovat(!neukoncovat)} />
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
};

export default PridatVykazModal;
