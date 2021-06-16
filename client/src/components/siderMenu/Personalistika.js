import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Personalistika = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1">
          <span>Zaměstnanci</span>
          <Link to="/personalistika/zamestnanci" />
        </Menu.Item>
        <Menu.Item key="2">
          <span>Stravování</span>
          <Link to="/personalistika/stravovani" />
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Personalistika;
