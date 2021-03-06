import './DetailZakazky.css';
import { Divider, Tabs, Button, Typography, Alert } from 'antd';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as api from '../../../../api/index';

import { Barcodes } from './Barcodes';
import Breadcrumbs from './Breadcrumbs';
import SeznamZP from './SeznamZP';
import SeznamOperace from './SeznamOperace';
import GrafPorovnani from './GrafPorovnani';
import GrafKolacPlan from './GrafKolacPlan';
import GrafKolac from './GrafKolac';
import SeznamMzdy from './SeznamMzdy';
import NewWindow from 'react-new-window';
import SeznamStrojniNaklady from './SeznamStrojniNaklady';
import SeznamMaterial from './SeznamMaterial';
import SeznamKooperace from './SeznamKooperace';
import GrafDokoncenoProgress from './GrafDokoncenoProgress';
import GrafZiskovost from './GrafZiskovost';
import PridatVykazModal from '../vykazovaniOperaci/PridatVykazModal';

const { TabPane } = Tabs;
const { Title } = Typography;

const DetailZakazky = () => {
  const { objednavka, final, opv } = useParams();
  const [loading, setLoading] = useState(true);
  const [postupy, setPostupy] = useState(null);
  const [operace, setOperace] = useState(null);
  const [objednavkaDetail, setObjednavkaDetail] = useState(null);
  const [operaceFiltr, setOperaceFiltr] = useState(null);
  const [payload, setPayload] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  //Zpracování čárových kódů
  const clickHandler = () => {
    api.createProcedure(operaceFiltr).then(({ data }) => {
      setPayload(
        data.payload.sort((a, b) => parseInt(a.opv) - parseInt(b.opv))
      );
    });
  };

  const volneKodyModal = () => {
    setModalVisible(true);
  };

  //Doplní souhrnná data objednávky
  useEffect(() => {
    if (postupy) {
      setObjednavkaDetail({
        ...objednavkaDetail,
        planVyroba: postupy.reduce(
          (total, postup) => total + postup.planvyroba,
          0
        ),
        odvedeno: postupy.reduce((total, postup) => total + postup.odvedeno, 0),
      });
    }
  }, [operaceFiltr]);

  //Načítá operace na základě objednávky v prametru URL
  useEffect(() => {
    if (loading && !operace) {
      api.fetchOperace(objednavka).then((result) => {
        setOperace(result.data.operace);
        setObjednavkaDetail(result.data.objednavka);
      });
    }
  }, [operace, loading, objednavka]);

  //Filtruje operace na základě výběru (parametru final a opv v url)
  useEffect(() => {
    if (operace && opv) {
      setOperaceFiltr(operace.filter((operace) => operace.opv === opv));
      return;
    }
    if (operace && final) {
      setOperaceFiltr(operace.filter((operace) => operace.opvfinal === final));
      return;
    }
    if (operace) {
      setOperaceFiltr(operace);
      return;
    }
    setLoading(false);
  }, [operace, final, opv]);

  return (
    <div>
      <Breadcrumbs objednavka={objednavka} final={final} opv={opv} />
      <Divider />
      {objednavkaDetail?.vyrizeno === 0 ? (
        <Alert
          type="error"
          message="Objednávka není uzavřena, celkové údaje se ještě mohou měnit!"
          showIcon
        />
      ) : (
        ''
      )}
      {postupy?.length === 0 ? (
        <Alert
          type="warning"
          message="Objednávka ještě nebyla zpracována technologem a nemá vytvořeny zakázkové postupy!"
          showIcon
        />
      ) : (
        ''
      )}
      {operaceFiltr && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Porovnání nákladů" key="1">
            <GrafPorovnani operaceFiltr={operaceFiltr} />
          </TabPane>
          <TabPane tab="Poměr plánovaných a reálných nákladů" key="2">
            <div className="kolace">
              <div className="kolacPlan">
                <Title level={5}>Plánované náklady:</Title>
                <GrafKolacPlan operaceFiltr={operaceFiltr} />
              </div>
              <div className="kolac">
                <Title level={5}>Skutečné náklady:</Title>
                <GrafKolac operaceFiltr={operaceFiltr} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="Dokončenost výroby" key="3">
            <div className="dokoncenost">
              <div className="progress-bar">
                {operaceFiltr && (
                  <GrafDokoncenoProgress operaceFiltr={operaceFiltr} />
                )}
              </div>
            </div>
          </TabPane>
          <TabPane tab="Vyhodnocení ziskovosti" key="4">
            <GrafZiskovost
              operace={operace}
              objednavkaDetail={objednavkaDetail}
            />
          </TabPane>
        </Tabs>
      )}
      <Divider>Zakázkové postupy objednávky {objednavka}</Divider>
      <SeznamZP postupy={postupy} setPostupy={setPostupy} />
      <Divider>Rozpis operací vybraných zakázkových postupů</Divider>
      <div>
        <Button className="buttonOperace" type="primary" onClick={clickHandler}>
          Generovat čárové kódy k operacím
        </Button>
        <Button
          disabled
          className="buttonOperace"
          type="primary"
          onClick={() => volneKodyModal()}
        >
          Generovat volné čárové kódy
        </Button>
        <PridatVykazModal modalVisible={modalVisible} />
      </div>
      {payload && (
        <NewWindow
          features={{ width: 1200, height: 1000 }}
          onUnload={() => setPayload(null)}
        >
          <Barcodes data={payload} />
        </NewWindow>
      )}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Operace" key="1">
          <SeznamOperace loading={loading} operaceFiltr={operaceFiltr} />
        </TabPane>
        <TabPane tab="Mzdy" key="2">
          <SeznamMzdy operaceFiltr={operaceFiltr} />
        </TabPane>
        <TabPane tab="Strojní náklady" key="3">
          <SeznamStrojniNaklady operaceFiltr={operaceFiltr} />
        </TabPane>
        <TabPane tab="Materiál" key="4">
          <SeznamMaterial operaceFiltr={operaceFiltr} />
        </TabPane>
        <TabPane tab="Kooperace" key="5">
          <SeznamKooperace operaceFiltr={operaceFiltr} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DetailZakazky;
