import './DetailZakazky.css';
import { Divider, Tabs, Button } from 'antd';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as api from '../../../../api/index';

import { Barcodes } from './Barcodes';
import Breadcrumbs from './Breadcrumbs';
import SeznamZP from './SeznamZP';
import SeznamOperace from './SeznamOperace';
import GrafPorovnani from './GrafPorovnani';
import SeznamMzdy from './SeznamMzdy';
import NewWindow from 'react-new-window';
import SeznamStrojniNaklady from './SeznamStrojniNaklady';
import SeznamMaterial from './SeznamMaterial';
import SeznamKooperace from './SeznamKooperace';

const { TabPane } = Tabs;

const DetailZakazky = () => {
  const { objednavka, final, opv } = useParams();
  const [loading, setLoading] = useState(true);
  const [operace, setOperace] = useState(null);
  const [operaceFiltr, setOperaceFiltr] = useState(null);
  const [payload, setPayload] = useState(null);

  //Zpracování čárových kódů
  const clickHandler = () => {
    api.createProcedure(operaceFiltr).then(({ data }) => {
      console.log(data.payload);
      setPayload(
        data.payload.sort((a, b) => parseInt(a.opv) - parseInt(b.opv))
      );
    });
  };

  //Načítá operace na základě objednávky v prametru URL
  useEffect(() => {
    if (loading && !operace) {
      api.fetchOperace(objednavka).then((result) => setOperace(result.data));
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
      {operaceFiltr && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Porovnání nákladů" key="1">
            <GrafPorovnani operaceFiltr={operaceFiltr} />
          </TabPane>
          <TabPane tab="Poměr plánovaných a reálných nákladů" key="2"></TabPane>
          <TabPane tab="Dokončenost výroby" key="3"></TabPane>
          <TabPane tab="Vyhodnocení ziskovosti" key="4"></TabPane>
        </Tabs>
      )}
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
