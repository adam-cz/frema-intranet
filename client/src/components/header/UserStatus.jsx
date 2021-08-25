import { useSelector } from 'react-redux';
import { Avatar, Badge, Menu, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as api from '../../api/index';

const handleClick = () => {
  api.logout();
  localStorage.clear();
  window.location.href = '/';
};

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Button type="link" onClick={handleClick}>
        Odhlásit
      </Button>
    </Menu.Item>
  </Menu>
);

const UserStatus = () => {
  const { data } = useSelector((state) => state.user);

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <div className="user-info-box">
        <Badge count={0}>
          <Avatar shape="circle" icon={<UserOutlined />} />
        </Badge>
        <span className="user-status-name">
          <b>{`${data.name} ${data.surname}`}</b>
        </span>
      </div>
    </Dropdown>
  );
};

export default UserStatus;
