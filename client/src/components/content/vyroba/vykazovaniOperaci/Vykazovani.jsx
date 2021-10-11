import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { DatePicker, Divider, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';
import prepocetMzdy from '../../../../utils/prepocetMzdy';

moment.locale('cs');

const { RangePicker } = DatePicker;

const OperationReporting = () => {
  const [vykazy, setVykazy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtrDatum, setFiltrDatum] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
  });

  useEffect(() => {
    if (loading && vykazy) {
      setLoading(false);
      console.log(vykazy);
    }
    if (loading && !vykazy)
      api.nacistVykazy(filtrDatum.datumOd, filtrDatum.datumDo).then((res) => {
        setVykazy(prepocetMzdy(res.data));
        console.log(res.data);
      });
  }, [filtrDatum.datumOd, filtrDatum.datumDo, loading, vykazy]);

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
            setVykazy(null);
            setFiltrDatum({
              datumOd: Moment[0].hours(0),
              datumDo: Moment[1].hours(24),
            });
          }}
        />
      )}
      <Divider>Časová osa výkazů</Divider>
      <VykazyGantt vykzay={vykazy} filtrDatum={filtrDatum} />
    </div>
  );
};

export default OperationReporting;
