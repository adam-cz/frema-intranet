import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Spin, Space } from 'antd';
import moment from 'moment';
import { FiltrRangePick } from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';
import RozpisVyberu from './RozpisVyberu';

const OperationReporting = () => {
  const [data, setData] = useState(null);
  const [dataFiltered, setDataFiltered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState({
    datumOd: moment().hours(0),
    datumDo: moment().hours(24),
    zamestnanecId: null,
  });

  useEffect(() => {
    if (filtr.zamestnanecId && data)
      setDataFiltered({
        zamestnanci: data.zamestnanci.filter(
          (zamestnanec) => zamestnanec.id === filtr.zamestnanecId
        ),
        vykazy: data.vykazy.filter(
          (vykaz) => vykaz.group === filtr.zamestnanecId
        ),
      });
    else setDataFiltered(data);
  }, [filtr.zamestnanecId, data]);

  useEffect(() => {
    if (loading)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, [filtr.datumOd, filtr.datumDo, loading]);

  return (
    <div>
      {dataFiltered && console.log(dataFiltered)}
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
      {dataFiltered && (
        <VykazyGantt
          zamestnanci={dataFiltered.zamestnanci}
          vykazy={dataFiltered.vykazy}
          filtrDatum={filtr}
        />
      )}
      <Divider>Rozpis za vybrané období</Divider>
      {dataFiltered?.zamestnanci.length === 1 && (
        <RozpisVyberu dataFiltered={dataFiltered} />
      )}
    </div>
  );
};

export default OperationReporting;
