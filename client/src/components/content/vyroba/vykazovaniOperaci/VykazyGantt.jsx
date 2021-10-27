import moment from 'moment';
import Timeline, { CustomMarker } from 'react-calendar-timeline';
import './Timeline.css';

const VykazyGantt = ({
  filtr,
  zamestnanci,
  vykazy,
  loading,
  setDetailVykazu,
}) => {
  const minTime = filtr.datumOd.valueOf();
  const maxTime = filtr.datumDo.valueOf();
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

  const itemRenderer = ({ item, itemContext, getItemProps }) => {
    const backgroundColor = itemContext.selected
      ? '#FFC107'
      : item.ukonceno
      ? '#2196F3'
      : '#04db88';
    const borderColor = itemContext.selected
      ? '#FF9800'
      : item.ukonceno
      ? '#1A6FB3'
      : '#04AA6B';
    return (
      <div
        {...getItemProps({
          style: {
            color: item.color,
            borderRadius: 4,
            background: backgroundColor,
            border: `1px solid ${borderColor}`,
          },
        })}
      >
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: 'hidden',
            paddingLeft: 3,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {itemContext.title}
        </div>
      </div>
    );
  };

  const groups = zamestnanci.map((zamestnanec) => {
    return { ...zamestnanec, stackItems: true };
  });

  const items = vykazy.map((vykaz) => {
    return {
      ...vykaz,
      end_time: vykaz.end_time ? vykaz.end_time : moment().valueOf(),
      title: `Operace ${vykaz.operace} z OPV ${vykaz.opv} na stroji ${vykaz.stroj}`,
      canMove: false,
      canResize: false,
      canChangeGroup: false,
    };
  });

  return (
    <div>
      {!loading && (
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={filtr.datumOd}
          defaultTimeEnd={filtr.datumDo}
          onTimeChange={onTimeChange}
          itemRenderer={itemRenderer}
          onItemSelect={(item) =>
            setDetailVykazu(items.find((_item) => _item.id === item))
          }
          onItemDeselect={(item) => setDetailVykazu(null)}
        >
          <CustomMarker date={moment()} />
          <CustomMarker date={filtr.datumOd}>
            {/* custom renderer for this marker */}
            {({ styles, date }) => {
              const customStyles = {
                ...styles,
                backgroundColor: 'red',
                width: '1px',
              };
              return <div style={customStyles} />;
            }}
          </CustomMarker>
          <CustomMarker date={filtr.datumDo}>
            {/* custom renderer for this marker */}
            {({ styles, date }) => {
              const customStyles = {
                ...styles,
                backgroundColor: 'red',
                width: '1px',
              };
              return <div style={customStyles} />;
            }}
          </CustomMarker>
        </Timeline>
      )}
    </div>
  );
};

export default VykazyGantt;
