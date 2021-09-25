import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import Finaly from './Finaly';
import Objednavky from './Objednavky';
import ZakazkovePostupy from './ZakazkovePostupy';
import * as api from '../../../../api/index';

const { TabPane } = Tabs;

const Vyhodnoceni = () => {
  const [loading, setLoading] = useState(true);
  const [operace, setOperace] = useState(null);
  const [vyber, setVyber] = useState({
    objednavka: null,
    final: null,
    opv: null,
  });

  useEffect(() => {
    if (loading && vyber.objednavka)
      api
        .fetchOperace(vyber.objednavka)
        .then((result) => setOperace(result.data));
    if (operace) setLoading(false);
    console.log(operace);
  }, [operace, loading, vyber]);

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Objednávky" key="1">
          <Objednavky setVyber={setVyber} />
        </TabPane>
        <TabPane tab="ZP Finály" key="2">
          <Finaly setVyber={setVyber} />
        </TabPane>
        <TabPane tab="Zakázkové postupy" key="3">
          <ZakazkovePostupy setVyber={setVyber} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Vyhodnoceni;
