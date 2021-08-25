import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

//Antd and styles
import 'antd/dist/antd.css';
import './styles/index.css';
import { Layout } from 'antd';

//Components
import HeaderNavigation from './components/header/HeaderNavigation';
import Personalistika from './components/siderMenu/Personalistika';
import Zamestnanci from './components/content/humanresources/Employees';
import Obchod from './components/siderMenu/Obchod';
import Vyroba from './components/siderMenu/Vyroba';
import CRM from './components/content/sales/crm/CRM';
import Customers from './components/content/sales/customers/Customers';
import { getEmployees } from './actions/employees';
import Admin from './components/siderMenu/Admin';
import NewUser from './components/admin/NewUser';

const { Content, Sider } = Layout;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <Layout className="canvas">
      <Router>
        <HeaderNavigation />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Route path="/personalistika" component={Personalistika} />
            <Route path="/obchod" component={Obchod} />
            <Route path="/vyroba" component={Vyroba} />
            <Route path="/admin" component={Admin} />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Route
                path="/personalistika/zamestnanci"
                component={Zamestnanci}
              />
              <Route path="/obchod/crm" component={CRM} />
              <Route path="/obchod/zakaznici" component={Customers} />
              <Route path="/admin/pridat-uzivatele" component={NewUser} />
            </Content>
          </Layout>
        </Layout>
      </Router>
    </Layout>
  );
}

export default App;
