import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserStatus = () => {
  const { data } = useSelector((state) => state.user);
  return (
    <div>
      <Badge count={1}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
      <span className="user-status-name">
        <b>{data.user.username}</b>
      </span>
    </div>
  );
};

export default UserStatus;
