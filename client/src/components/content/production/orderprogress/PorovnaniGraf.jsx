import { Column } from '@ant-design/charts';

const PorovnaniGraf = ({ procedures, proceses }) => {
  const data = [
    {
      name: 'Plán',
      naklad: 'Mzdy',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.jedn_mzdy, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Soc./Zdrav.',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.rn1, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Strojní náklady',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.strnakl, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Materiál',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.material, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Kooperace',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.kooper, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Polotovary',
      hodnota: Math.round(
        procedures.reduce((total, current) => total + current.polotovar, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Mzdy',
      hodnota: Math.round(
        proceses.reduce((total, current) => total + current.vykazano, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Soc./Zdrav.',
      hodnota: 28.8,
    },
  ];
  const config = {
    data: data,
    isGroup: true,
    xField: 'naklad',
    yField: 'hodnota',
    seriesField: 'name',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  };
  return (
    <>
      {console.log(
        Math.round(
          proceses.reduce((total, current) => total + current.vykazano, 0)
        )
      )}
      <Column {...config} />;
    </>
  );
};

export default PorovnaniGraf;
