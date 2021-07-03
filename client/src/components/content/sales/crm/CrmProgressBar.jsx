import {
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';

const CrmProgressBar = ({ coms }) => {
  let color;
  if (coms.order.done) {
    color = '#588801';
  } else if (coms.visit.done) {
    color = '#F3C002';
  } else if (coms.email.done) {
    color = '#E08300';
  } else {
    color = '#B51903';
  }

  return (
    <div>
      <Space>
        <PhoneOutlined
          style={{ color: (coms.phone.done && color) || '#c4c4c4' }}
        />
        <MailOutlined
          style={{ color: (coms.email.done && color) || '#c4c4c4' }}
        />
        <TeamOutlined
          style={{ color: (coms.visit.done && color) || '#c4c4c4' }}
        />
        <DollarOutlined
          style={{ color: (coms.order.done && color) || '#c4c4c4' }}
        />
      </Space>
    </div>
  );
};

export default CrmProgressBar;
