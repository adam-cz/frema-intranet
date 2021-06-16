import 'antd/dist/antd.css';
import './styles/index.css';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import ProtectedRoute from './components/login/ProtectedRoute';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

//Antd
import { Layout } from 'antd';

import HeaderNavigation from './components/HeaderNavigation';
import Personalistika from './components/siderMenu/Personalistika';
import Zamestnanci from './components/content/Zamestnanci';
import Obchod from './components/siderMenu/Obchod';
import CRM from './components/content/CRM';

const { Content, Sider } = Layout;

function App() {
  const user = useSelector((state) => state.user);
  const history = useHistory();

  useEffect(() => {
    if (!user) history.push('/login');
  }, [history, user]);

  return (
    <Layout>
      <Router>
        <HeaderNavigation />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <ProtectedRoute path="/personalistika" component={Personalistika} />
            <ProtectedRoute path="/obchod" component={Obchod} />
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
              <ProtectedRoute
                path="/personalistika/zamestnanci"
                component={Zamestnanci}
              />
              <ProtectedRoute path="/obchod/crm" component={CRM} />
            </Content>
          </Layout>
        </Layout>
      </Router>
    </Layout>
  );
}

export default App;
