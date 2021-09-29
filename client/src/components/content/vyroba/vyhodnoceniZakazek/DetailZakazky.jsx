import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Divider, Tabs, Button } from 'antd';
import * as api from '../../../../api/index';
import Breadcrumbs from './Breadcrumbs';
import SeznamZP from './SeznamZP';
import SeznamOperace from './SeznamOperace';
import GrafPorovnani from './GrafPorovnani';
import SeznamMzdy from './SeznamMzdy';
import NewWindow from 'react-new-window';
import { Barcodes } from './Barcodes';
import './DetailZakazky.css';

const { TabPane } = Tabs;

const DetailZakazky = () => {
  const { objednavka, final, opv } = useParams();
  const [loading, setLoading] = useState(true);
  const [operace, setOperace] = useState(null);
  const [operaceFiltr, setOperaceFiltr] = useState(null);
  const [payload, setPayload] = useState(null);

  const clickHandler = () => {
    api.createProcedure(operace).then(({ data }) => {
      setPayload(data.payload);
    });
  };

  //Filtruje operace na základě parametru final a opv v url
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
  }, [operace, final, opv]);

  //Načítá operace na základě objednávky v prametru URL
  useEffect(() => {
    if (loading && !operace) {
      api.fetchOperace(objednavka).then((result) => setOperace(result.data));
    }
    if (operaceFiltr) setLoading(false);
  }, [operace, loading, objednavka, operaceFiltr]);

  return (
    <div>
      <Breadcrumbs objednavka={objednavka} final={final} opv={opv} />
      <Divider>Porovnání plánu a skutečnosti</Divider>
      <div>{operaceFiltr && <GrafPorovnani operaceFiltr={operaceFiltr} />}</div>
      <Divider>Zakázkové postupy objednávky {objednavka}</Divider>
      <SeznamZP />
      <Divider>Rozpis operací vybraných zakázkových postupů</Divider>
      <div>
        <Button className="buttonOperace" type="primary" onClick={clickHandler}>
          Generovat čárové kódy k operacím
        </Button>
        <Button
          className="buttonOperace"
          type="primary"
          onClick={clickHandler}
          disabled
        >
          Generovat volné čárové kódy
        </Button>
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
          Na tomhle budu dělat potom
        </TabPane>
        <TabPane tab="Materiál" key="4">
          Pak se vrhnu na tohle
        </TabPane>
        <TabPane tab="Kooperace" key="5">
          No a na konec dodělám i tohle
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DetailZakazky;
