import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Spin, Space } from 'antd';
import moment from 'moment';
import FiltrRangePick from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';
import RozpisVyberu from './RozpisVyberu';

const OperationReporting = () => {
  const [data, setData] = useState(null);
  const [dataFiltered, setDataFiltered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
  });

  useEffect(() => {
    console.log('loading');
    if (loading) {
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setData(res.data);
        setDataFiltered(res.data);
        setLoading(false);
      });
      console.log('nacteno');
    }
  }, []);

  return (
    <div>
      <Divider>Filtr</Divider>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space>
            <FiltrRangePick
              filtr={filtr}
              setFiltr={setFiltr}
              setLoading={setLoading}
              setData={setData}
              setDataFiltered={setDataFiltered}
            />
            <FiltrSelect setDataFiltered={setDataFiltered} data={data} />
          </Space>
        </>
      )}
      <Divider>Časová osa výkazů</Divider>
      {dataFiltered && (
        <VykazyGantt
          zamestnanci={dataFiltered.zamestnanci}
          vykazy={dataFiltered.vykazy}
          filtrDatum={filtr}
        />
      )}
      <Divider>Rozpis za vybrané období</Divider>
      {dataFiltered?.zamestnanci.length === 1 && (
        <RozpisVyberu data={dataFiltered} />
      )}
    </div>
  );
};

export default OperationReporting;
