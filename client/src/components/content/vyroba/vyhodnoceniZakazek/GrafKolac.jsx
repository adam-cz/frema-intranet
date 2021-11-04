import { Pie } from '@ant-design/charts';

const GrafKolac = ({ operaceFiltr: operace }) => {
  console.log(operace);
  const data = [
    {
      type: 'Mzdy',
      value: Math.round(
        operace.reduce((total, current) => total + current.mzdy, 0)
      ),
    },
    {
      type: 'Socální a zdravotní',
      value: Math.round(
        operace.reduce((total, current) => total + current.nakl_r1, 0)
      ),
    },
    {
      type: 'Materiál',
      value: Math.round(
        operace.reduce(
          (total, current) =>
            current.material ? total + current.material : total,
          0
        )
      ),
    },
    {
      type: 'Kooperace',
      value: Math.round(
        operace.reduce(
          (total, current) =>
            current.kooperace ? total + current.kooperace : total,
          0
        )
      ),
    },
    {
      type: 'Strojní náklady',
      value: Math.round(
        operace.reduce(
          (total, current) =>
            current.nakl_stn ? total + current.nakl_stn : total,
          0
        )
      ),
    },
  ];
  const config = {
    appendPadding: 10,
    data: data.map((item) => item.value > 0 && item),
    angleField: 'value',
    colorField: 'type',
    color: ({ type }) => {
      if (type === 'Mzdy') {
        return '#6395F9';
      }
      if (type === 'Socální a zdravotní') {
        return '#7666F9';
      }
      if (type === 'Strojní náklady') {
        return '#F6C022';
      }
      if (type === 'Kooperace') {
        return '#657798';
      }
      if (type === 'Materiál') {
        return '#62DAAB';
      }
      return 'white';
    },
    radius: 0.75,
    legend: {
      position: 'right',
      offsetX: -50,
    },
    label: {
      type: 'spider',
      labelHeight: 50,
      content: '{name}\n{percentage}\n{value} Kč',
    },
  };
  return <Pie {...config} />;
};

export default GrafKolac;
