import { Timeline } from 'antd';
import moment from 'moment';

const color = {
  success: 'green',
  warning: 'orange',
  error: 'red',
};

const Historie = ({ message }) => {
  console.log(message);
  return (
    <div>
      <Timeline mode="left" reverse={true} style={{ marginTop: 50 }}>
        {message
          .filter((item, index) => index < 10)
          .map((message) => (
            <Timeline.Item
              color={color[message.status]}
              label={moment(message.time).format('D.M. HH:mm')}
            >
              {message.title}
            </Timeline.Item>
          ))}
      </Timeline>
    </div>
  );
};

export default Historie;
