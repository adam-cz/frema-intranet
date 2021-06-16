import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const HeaderNavigation = () => {
  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
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
    </Header>
  );
};

export default HeaderNavigation;
