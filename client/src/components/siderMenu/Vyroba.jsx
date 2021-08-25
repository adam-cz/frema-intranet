import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Vyroba = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1">
          <span>Rozpracovanost zakázek</span>
          <Link to="/vyroba/zakazky" />
        </Menu.Item>
        <Menu.Item key="2">
          <span>Vykazování operací</span>
          <Link to="/vyroba/vykazovani" />
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Vyroba;
