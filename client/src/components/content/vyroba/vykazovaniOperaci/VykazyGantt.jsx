import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

const groups = [
  { id: 1, title: 'Zaměstnanec 1', stackItems: true },
  { id: 2, title: 'Zaměstnanec 2', stackItems: false },
];

const items = [
  {
    id: 1,
    group: 1,
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(1, 'hour'),
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: moment().add(-0.5, 'hour'),
    end_time: moment().add(0.5, 'hour'),
  },
  {
    id: 3,
    group: 1,
    title: 'item 3',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour'),
  },
  {
    id: 4,
    group: 1,
    title: 'item 3',
    start_time: moment().add(1, 'hour'),
    end_time: moment().add(3, 'hour'),
  },
];

const VykazyGantt = ({ filtrDatum }) => {
  const minTime = filtrDatum.datumOd.hours(0).valueOf();
  const maxTime = filtrDatum.datumDo.hours(23).valueOf();
  const onTimeChange = (
    visibleTimeStart,
    visibleTimeEnd,
    updateScrollCanvas
  ) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(
        minTime,
        minTime + (visibleTimeEnd - visibleTimeStart)
      );
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(
        maxTime - (visibleTimeEnd - visibleTimeStart),
        maxTime
      );
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={filtrDatum.datumOd}
        defaultTimeEnd={filtrDatum.datumDo}
        onTimeChange={onTimeChange}
      />
    </div>
  );
};

export default VykazyGantt;
