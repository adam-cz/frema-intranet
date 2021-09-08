import Timeline from 'react-calendar-timeline';
import './Timeline.css';
import { DateTime } from 'luxon';

const InfoTimeline = () => {
  const groups = [
    { id: 1, title: 'group 1' },
    { id: 2, title: 'group 2' },
  ];
  const items = [
    {
      id: 1,
      group: 1,
      title: 'item 1',
      start_time: DateTime.local(),
      end_time: DateTime.local().plus({ hours: 1 }),
    },
  ];

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={DateTime.local()}
        defaultTimeEnd={DateTime.local().plus({ days: 1 })}
      />
    </div>
  );
};

export default InfoTimeline;
