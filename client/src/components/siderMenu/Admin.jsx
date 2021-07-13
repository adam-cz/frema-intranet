import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Admin = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="uzivatele" title="Uživatelé">
          <Menu.Item key="1">
            <span>Přidat uživatele</span>
            <Link to="/admin/pridat-uzivatele" />
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Admin;
