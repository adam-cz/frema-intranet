import { useSelector } from 'react-redux';
import { Avatar, Badge, Menu, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Odhlásit
      </a>
    </Menu.Item>
  </Menu>
);

const UserStatus = () => {
  const { data } = useSelector((state) => state.user);
  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <div className="user-info-box">
        <Badge count={1}>
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
