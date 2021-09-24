import { Pie } from '@ant-design/charts';

const PlanGraf = ({ procedures }) => {
  const data = [
    {
      type: 'Mzdy',
      value: Math.round(
        procedures.reduce((total, current) => total + current.jedn_mzdy, 0)
      ),
    },
    {
      type: 'Socální a zdravotní',
      value: Math.round(
        procedures.reduce((total, current) => total + current.rn1, 0)
      ),
    },
    {
      type: 'Materiál',
      value: Math.round(
        procedures.reduce(
          (total, current) =>
            current.material ? total + current.material : total,
          0
        )
      ),
    },
    {
      type: 'Polotovary',
      value: Math.round(
        procedures.reduce(
          (total, current) =>
            current.polotovar ? total + current.polotovar : total,
          0
        )
      ),
    },
    {
      type: 'Kooperace',
      value: Math.round(
        procedures.reduce(
          (total, current) => (current.kooper ? total + current.kooper : total),
          0
        )
      ),
    },
    {
      type: 'Strojní náklady',
      value: Math.round(
        procedures.reduce(
          (total, current) =>
            current.strnakl ? total + current.strnakl : total,
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
    radius: 0.75,
    legend: {
      position: 'left',
      offsetX: 50,
    },
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}\n{value} Kč',
    },
  };
  return <Pie {...config} />;
};

export default PlanGraf;
