import { Layout, Menu, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import UserStatus from './UserStatus';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const HeaderNavigation = () => {
  const user = useSelector((state) => state.user);

  return (
    <Header className="header">
      <Row wrap="false">
        <Col>
          <img src={'/frema_logo.svg'} className="logo-svg" alt="logo" />
        </Col>
        <Col flex={24}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <span>Personalistika</span>
              <Link to="/personalistika/zamestnanci" />
            </Menu.Item>

            <Menu.Item key="2">
              <span>Obchod</span>
              <Link to="/obchod/crm" />
            </Menu.Item>

            <Menu.Item key="3">
              <span>Výroba</span>
              <Link to="/vyroba" />
            </Menu.Item>

            {user.data.role.includes('admin') ? (
              <Menu.Item key="4">
                <span>Admin</span>
                <Link to="/admin/pridat-uzivatele" />
              </Menu.Item>
            ) : (
              ''
            )}
          </Menu>
        </Col>
        <Col flex="auto">
          <UserStatus />
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderNavigation;
