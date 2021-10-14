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

/*
vykazy: [{cas, stav (start, end)]

  let jednostroj = [{od, do}]
  let vicestroj = [{od, do}]
  let pocetStroju = 0;
  
  vykazy.forEach((vykaz, index) => {
    if (vykaz.stav === 'start') pocetStroju++;
    if (vykaz.stav === 'end') pocetstroju--;
  
    if (pocetStroju === 0) return;		
    if (pocetStroju	=== 1) jednostroj.push({od: vykazy[index].cas, do: vykazy[index + 1].cas})
    if (pocetStroju > 1) vicestroj.push({od: vykazy[index].cas, do: vykazy[index + 1].cas})	
  })
  */
