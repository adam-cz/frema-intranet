import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';

moment.locale('cs');

const { RangePicker } = DatePicker;

export const FiltrRangePick = ({ filtr, setFiltr, setData, setLoading }) => {
  return (
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
  );
};
