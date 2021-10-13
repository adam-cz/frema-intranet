import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { DatePicker, Divider, Spin, Select, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';

moment.locale('cs');

const { RangePicker } = DatePicker;
const { Option } = Select;

const OperationReporting = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
    zamestnanecId: null,
  });

  useEffect(() => {
    if (loading)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
      });
  }, [filtr.datumOd, filtr.datumDo, loading]);

  return (
    <div>
      <Divider>Filtr</Divider>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space>
            <RangePicker
              showToday={true}
              locale={locale}
              value={[filtr.datumOd, filtr.datumDo]}
              onChange={(Moment) => {
                setLoading(true);
                setData(null);
                setFiltr({
                  datumOd: Moment[0].hours(0),
                  datumDo: Moment[1].hours(24),
                });
              }}
            />
            <Select
              showSearch
              value={filtr.zamestnanecJmeno}
              style={{ width: 200 }}
              placeholder="Vyberte zaměstnance"
              onChange={(value, option) => {
                console.log(option);
                setFiltr({
                  ...filtr,
                  zamestnanecId: value,
                  zamestnanecJmeno: option.children,
                });
                setLoading(true);
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key={'vsichni'} value={null}>
                Všichni
              </Option>
              {data.zamestnanci.map((zamestnanec) => (
                <Option key={zamestnanec.id} value={zamestnanec.id}>
                  {zamestnanec.title}
                </Option>
              ))}
            </Select>
          </Space>
        </>
      )}
      <Divider>Časová osa výkazů</Divider>
      {data && (
        <VykazyGantt
          groups={data.zamestnanci}
          items={data.vykazy}
          filtrDatum={filtr}
        />
      )}
      <Divider>Rozpis za vybrané období</Divider>
    </div>
  );
};

export default OperationReporting;
