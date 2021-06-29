import { useSelector } from 'react-redux';
import { Avatar, Badge, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    </Menu.Item>
  </Menu>
);

const UserStatus = () => {
  const { data } = useSelector((state) => state.user);
  return (
    <div className="user-info-box">
      <Badge count={0}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
      <span className="user-status-name">
        <b>{`${data.name} ${data.surname}`}</b>
      </span>
    </div>
  );
};

export default UserStatus;
