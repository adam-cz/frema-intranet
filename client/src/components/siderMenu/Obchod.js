import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Obchod = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="crm" title="CRM">
          <Menu.Item key="1">
            <span>CRM záznamy</span>
            <Link to="/obchod/crm" />
          </Menu.Item>
          <Menu.Item key="2">
            <span>Seznam firem</span>
            <Link to="/obchod/firmy" />
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Obchod;
