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
      hodnota:
        proceses &&
        Math.round(
          proceses.reduce((total, current) => total + current.vykazanaMzda, 0)
        ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Soc./Zdrav.',
      hodnota:
        proceses &&
        Math.round(
          proceses.reduce(
            (total, current) =>
              total + current.nakl_mzd
                ? current.vykazanaMzda * (current.nakl_r1 / current.nakl_mzd)
                : 0,
            0
          )
        ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Strojní náklady',
      hodnota:
        proceses &&
        Math.round(
          proceses.reduce(
            (total, current) =>
              total +
              (current.vykazanyCas / 1000 / 60) * (current.sazbaZdroje / 60),
            0
          )
        ),
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
      {proceses &&
        console.log(
          // Math.round(
          proceses,
          procedures
          //.reduce((total, current) => total + current.vykazanaMzda, 0)
          //)
        )}
      <Column {...config} />;
    </>
  );
};

export default PorovnaniGraf;
