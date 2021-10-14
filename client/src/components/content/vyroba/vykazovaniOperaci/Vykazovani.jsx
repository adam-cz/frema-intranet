import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Spin, Space } from 'antd';
import moment from 'moment';
import { FiltrRangePick } from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';

const OperationReporting = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
    zamestnanecId: null,
  });

  useEffect(() => {
    if (loading)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
      });
  }, [filtr.datumOd, filtr.datumDo, loading]);

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
            />
            <FiltrSelect
              filtr={filtr}
              setFiltr={setFiltr}
              setLoading={setLoading}
              data={data}
            />
          </Space>
        </>
      )}
      <Divider>Časová osa výkazů</Divider>
      {data && (
        <VykazyGantt
          groups={data.zamestnanci}
          items={data.vykazy}
          filtrDatum={filtr}
        />
      )}
      <Divider>Rozpis za vybrané období</Divider>
    </div>
  );
};

export default OperationReporting;
