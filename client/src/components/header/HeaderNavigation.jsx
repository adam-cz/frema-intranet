import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserStatus from './UserStatus';

const { Header } = Layout;

const HeaderNavigation = () => {
  return (
    <Header className="header">
      <div className="header-menu">
        <img src={'/frema_logo.svg'} className="logo-svg" alt="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        >
          <Menu.Item key="1">
            <span>Personalistika</span>
            <Link to="/personalistika" />
          </Menu.Item>

          <Menu.Item key="2">
            <span>Obchod</span>
            <Link to="/obchod" />
          </Menu.Item>

          <Menu.Item key="3">
            <span>Výroba</span>
            <Link to="/vyroba" />
          </Menu.Item>
        </Menu>
      </div>
      <UserStatus />
    </Header>
  );
};

export default HeaderNavigation;
