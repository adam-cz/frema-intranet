import { Tabs } from 'antd';
import Finaly from './Finaly';
import Objednavky from './Objednavky';
import ZakazkovePostupy from './ZakazkovePostupy';
import DetailZakazky from './DetailZakazky';
import { Route } from 'react-router-dom';

const { TabPane } = Tabs;

const Vyhodnoceni = () => {
  return (
    <div>
      <Route
        path="/vyroba/zakazky/"
        exact
        children={
          <Tabs defaultActiveKey="1">
            <TabPane tab="Objednávky" key="1">
              <Objednavky />
            </TabPane>
            <TabPane tab="ZP Finály" key="2">
              <Finaly />
            </TabPane>
            <TabPane tab="Zakázkové postupy" key="3">
              <ZakazkovePostupy />
            </TabPane>
          </Tabs>
        }
      />
      <Route
        path="/vyroba/zakazky/:objednavka/:final?/:opv?"
        children={<DetailZakazky />}
      />
    </div>
  );
};

export default Vyhodnoceni;
