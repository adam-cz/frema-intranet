import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Space, Button } from 'antd';
import moment from 'moment';
import FiltrRangePick from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';
import RozpisVyberu from './RozpisVyberu';
import DetailVykazu from './DetailVykazu';

const initDate = {
  datumOd: moment().startOf('day').subtract(2, 'hour'),
  datumDo: moment().endOf('day').subtract(2, 'hour'),
};

const OperationReporting = () => {
  const [detailVykazu, setDetailVykazu] = useState(null);
  const [dataFiltered, setDataFiltered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: initDate.datumOd,
    datumDo: initDate.datumDo,
  });
  const [restart, setRestart] = useState(true);
  const [data, setData] = useState(null);

  const clickHandler = () => {
    setLoading(true);
    api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
      setData(res.data);
      setDataFiltered(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (restart)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setData(res.data);
        setDataFiltered(res.data);
        setLoading(false);
        setRestart(false);
      });
  }, [restart]);

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
        {data?.zamestnanci.length > 1 && (
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
          setDetailVykazu={setDetailVykazu}
        />
      )}
      {detailVykazu && (
        <>
          <Divider>Detail Výkazu</Divider>
          <DetailVykazu
            detailVykazu={detailVykazu}
            setRestart={setRestart}
            setDetailVykazu={setDetailVykazu}
          />
        </>
      )}

      <Divider>Rozpis za vybrané období</Divider>
      {dataFiltered && <RozpisVyberu data={dataFiltered} loading={loading} />}
    </div>
  );
};

export default OperationReporting;
