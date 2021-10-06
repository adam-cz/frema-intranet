import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { DatePicker, Divider } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';

moment.locale('cs');

const { RangePicker } = DatePicker;

const OperationReporting = () => {
  const [vykazy, setVykazy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtrDatum, setFiltrDatum] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
  });

  return (
    <div>
      <Divider>Filtr</Divider>
      <RangePicker
        showToday={true}
        locale={locale}
        onChange={(Moment) => {
          setFiltrDatum({
            datumOd: Moment[0].hours(0),
            datumDo: Moment[1].hours(24),
          });
        }}
      />
      <Divider>Časová osa výkazů</Divider>
      <VykazyGantt vykzay={vykazy} filtrDatum={filtrDatum} />
    </div>
  );
};

export default OperationReporting;
