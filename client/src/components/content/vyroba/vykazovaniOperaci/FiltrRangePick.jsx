import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';

moment.locale('cs');

const { RangePicker } = DatePicker;

const FiltrRangePick = ({ filtr, setFiltr }) => {
  return (
    <RangePicker
      showToday={true}
      locale={locale}
      value={[
        moment(filtr.datumOd).add(2, 'hour'),
        moment(filtr.datumDo).add(2, 'hour'),
      ]}
      onChange={(Moment) => {
        setFiltr({
          datumOd: Moment[0].startOf('day').subtract(2, 'hour'),
          datumDo: Moment[1].endOf('day').subtract(2, 'hour'),
        });
      }}
    />
  );
};

export default FiltrRangePick;
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
