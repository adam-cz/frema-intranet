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
        procedures.reduce((total, current) => total + current.material, 0)
      ),
    },
    {
      type: 'Polotovary',
      value: Math.round(
        procedures.reduce((total, current) => total + current.polotovar, 0)
      ),
    },
    {
      type: 'Kooperace',
      value: Math.round(
        procedures.reduce((total, current) => total + current.kooper, 0)
      ),
    },
    {
      type: 'Strojní náklady',
      value: Math.round(
        procedures.reduce((total, current) => total + current.strnakl, 0)
      ),
    },
  ];
  const config = {
    appendPadding: 10,
    data: data.map((item) => item.value > 0 && item),
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}\n{value} Kč',
    },
  };
  return <Pie {...config} />;
};

export default PlanGraf;
