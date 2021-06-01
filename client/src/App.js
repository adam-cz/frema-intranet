import 'antd/dist/antd.css';
import './styles/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Antd
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

import HeaderNavigation from './components/HeaderNavigation';
import Personalistika from './components/siderMenu/Personalistika';
import Zamestnanci from './components/content/Zamestnanci';

const { SubMenu } = Menu;
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
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
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
