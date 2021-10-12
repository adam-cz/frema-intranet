import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { DatePicker, Divider, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';

moment.locale('cs');

const { RangePicker } = DatePicker;

const OperationReporting = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtrDatum, setFiltrDatum] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
  });

  useEffect(() => {
    if (loading && data) {
      setLoading(false);
      console.log(data);
    }
    if (loading && !data)
      api.nacistVykazy(filtrDatum.datumOd, filtrDatum.datumDo).then((res) => {
        setData(res.data);
        console.log(res.data);
      });
  }, [filtrDatum.datumOd, filtrDatum.datumDo, loading, data]);

  return (
    <div>
      <Divider>Filtr</Divider>
      {loading ? (
        <Spin />
      ) : (
        <RangePicker
          showToday={true}
          locale={locale}
          onChange={(Moment) => {
            setLoading(true);
            setData(null);
            setFiltrDatum({
              datumOd: Moment[0].hours(0),
              datumDo: Moment[1].hours(24),
            });
          }}
        />
      )}
      <Divider>Časová osa výkazů</Divider>
      {data && (
        <VykazyGantt
          groups={data.zamestnanci}
          items={data.vykazy}
          filtrDatum={filtrDatum}
        />
      )}
    </div>
  );
};

export default OperationReporting;
