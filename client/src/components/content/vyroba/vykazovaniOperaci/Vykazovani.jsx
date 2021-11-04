import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';
import { Divider, Space, Button, Tabs } from 'antd';
import moment from 'moment';
import 'moment/locale/cs';
import FiltrRangePick from './FiltrRangePick';
import { FiltrSelect } from './FiltrSelect';
import RozpisVyberu from './RozpisVyberu';
import DetailVykazu from './DetailVykazu';
import DetailZamestnance from './DetailZamestnance';
import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PridatVykazModal from './PridatVykazModal';

moment.locale('cs');

const { TabPane } = Tabs;

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
    zamestnanecId: null,
  });
  const [restart, setRestart] = useState(true);
  const [data, setData] = useState(null);
  const [editDate, setEditDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState(null);

  const defineMarkers = (datumOd, datumDo) => {
    let markers = [];
    let id = 1;
    for (
      let i = moment(datumOd).add(8, 'hours');
      i <= moment(datumDo);
      i.add(8, 'hours')
    ) {
      markers.push({ date: i.valueOf(), id });
      id++;
    }
    return markers;
  };

  const clickHandler = () => {
    setLoading(true);
    api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
      setMarkers(defineMarkers(filtr.datumOd, filtr.datumDo));
      setFiltr({ ...filtr, zamestnanecId: null });
      setData(res.data);
      setDataFiltered(res.data);
      setLoading(false);
    });
  };

  const pridatVykaz = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (restart)
      api.nacistVykazy(filtr.datumOd, filtr.datumDo).then((res) => {
        setMarkers(defineMarkers(filtr.datumOd, filtr.datumDo));
        setData(res.data);
        setDataFiltered(res.data);
        setLoading(false);
        setRestart(false);
      });
  }, [restart, filtr.datumOd, filtr.datumDo]);

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
        <Button loading={loading} onClick={clickHandler} icon={<EyeOutlined />}>
          Zobrazit
        </Button>
        {data?.zamestnanci.length > 1 && (
          <FiltrSelect
            setDataFiltered={setDataFiltered}
            data={data}
            filtr={filtr}
            setFiltr={setFiltr}
          />
        )}
      </Space>

      <Divider>Časová osa výkazů</Divider>
      {dataFiltered && (
        <>
          <VykazyGantt
            loading={loading}
            zamestnanci={dataFiltered.zamestnanci}
            vykazy={dataFiltered.vykazy}
            filtr={filtr}
            setDetailVykazu={setDetailVykazu}
            setEditDate={setEditDate}
            markers={markers}
          />
          <Button
            style={{ marginTop: 20 }}
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => pridatVykaz()}
          >
            Přidat výkaz
          </Button>
          <PridatVykazModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setRestart={setRestart}
          />
        </>
      )}
      {detailVykazu && (
        <>
          <Divider>Detail Výkazu</Divider>
          <DetailVykazu
            detailVykazu={detailVykazu}
            setRestart={setRestart}
            setDetailVykazu={setDetailVykazu}
            editDate={editDate}
            setEditDate={setEditDate}
            markers={markers}
          />
        </>
      )}

      <Divider></Divider>
      {dataFiltered && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Rozpis výkazů za vybrané období" key="1">
            <RozpisVyberu data={dataFiltered} loading={loading} />
          </TabPane>
          <TabPane tab="Statistické údaje" key="2">
            <DetailZamestnance
              zamestnanci={dataFiltered.zamestnanci}
              vykazy={dataFiltered.vykazy}
            />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default OperationReporting;
