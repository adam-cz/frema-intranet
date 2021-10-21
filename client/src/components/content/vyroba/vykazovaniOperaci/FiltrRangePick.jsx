import { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import locale from 'antd/es/date-picker/locale/cs_CZ';
import * as api from '../../../../api';

moment.locale('cs');

const { RangePicker } = DatePicker;

const FiltrRangePick = ({
  filtr,
  setFiltr,
  setDataFiltered,
  setData,
  setLoading,
}) => {
  useEffect(() => {
    if (filtr.datumOd && filtr.datumDo)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        console.log('nacitam');
        setData(res.data);
        setDataFiltered(res.data);
        console.log(filtr, res.data);
      });
  }, [filtr]);

  return (
    <RangePicker
      showToday={true}
      locale={locale}
      value={[filtr.datumOd, filtr.datumDo]}
      onChange={(Moment) => {
        console.log('zmena data');
        setFiltr({ datumOd: Moment[0], datumDo: Moment[1] });
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
