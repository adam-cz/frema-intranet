import 'antd/dist/antd.css';
import './styles/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Antd
import { Layout } from 'antd';

import HeaderNavigation from './components/HeaderNavigation';
import Personalistika from './components/siderMenu/Personalistika';
import Zamestnanci from './components/content/Zamestnanci';

const { Content, Sider } = Layout;

function App() {
  return (
    <Layout>
      <Router>
        <HeaderNavigation />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Route path="/personalistika" component={Personalistika} />
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
            </Content>
          </Layout>
        </Layout>
      </Router>
    </Layout>
  );
}

export default App;
