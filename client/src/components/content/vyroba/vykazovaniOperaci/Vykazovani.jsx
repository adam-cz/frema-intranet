import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Space, Button } from 'antd';
import moment from 'moment';
import FiltrRangePick from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';
import RozpisVyberu from './RozpisVyberu';

const initDate = { datumOd: moment().hours(0), datumDo: moment().hours(23) };

const OperationReporting = () => {
  const [dataFiltered, setDataFiltered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: initDate.datumOd,
    datumDo: initDate.datumDo,
  });
  const [data, setData] = useState(null);

  const clickHandler = () => {
    setLoading(true);
    api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
      setData(res.data);
      setDataFiltered(res.data);
      setLoading(false);
      console.log(res.data, 'po kliku');
    });
  };

  useEffect(() => {
    api.nacistVykazy(initDate.datumOd, initDate.datumDo).then((res) => {
      setData(res.data);
      setDataFiltered(res.data);
      setLoading(false);
      console.log(res.data, 'pri nacteni');
    });
  }, []);

  return (
    <div>
      <Divider>Filtr</Divider>

      <Space>
        <FiltrRangePick
          filtr={filtr}
          setFiltr={setFiltr}
          setLoading={setLoading}
          setData={setData}
          setDataFiltered={setDataFiltered}
        />
        <Button loading={loading} onClick={clickHandler}>
          Zobrazit
        </Button>
        {dataFiltered?.zamestnanci.length > 1 && (
          <FiltrSelect setDataFiltered={setDataFiltered} data={data} />
        )}
      </Space>

      <Divider>Časová osa výkazů</Divider>
      {dataFiltered && (
        <VykazyGantt
          loading={loading}
          zamestnanci={dataFiltered.zamestnanci}
          vykazy={dataFiltered.vykazy}
          filtr={filtr}
        />
      )}
      <Divider>Rozpis za vybrané období</Divider>
      {dataFiltered?.zamestnanci.length === 1 && (
        <RozpisVyberu data={dataFiltered} loading={loading} />
      )}
    </div>
  );
};

export default OperationReporting;
