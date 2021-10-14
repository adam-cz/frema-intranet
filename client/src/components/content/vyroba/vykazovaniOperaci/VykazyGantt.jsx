import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';

const VykazyGantt = ({ filtrDatum, zamestnanci, vykazy }) => {
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

  const groups = zamestnanci.map((zamestnanec) => {
    return { ...zamestnanec, stackItems: true };
  });

  const items = vykazy.map((vykaz) => {
    return {
      ...vykaz,
      title: `Operace ${vykaz.operace} z OPV ${vykaz.opv} na stroji ${vykaz.stroj}`,
      canMove: false,
      canResize: false,
      canChangeGroup: false,
    };
  });

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
