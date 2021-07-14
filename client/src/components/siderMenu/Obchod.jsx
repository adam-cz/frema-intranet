import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Obchod = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1">
          <span>Záznamy z jednání</span>
          <Link to="/obchod/crm" />
        </Menu.Item>
        <Menu.Item key="2">
          <span>Firmy</span>
          <Link to="/obchod/zakaznici" />
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Obchod;
