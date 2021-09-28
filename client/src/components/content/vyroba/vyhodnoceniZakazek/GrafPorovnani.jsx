import { Column } from '@ant-design/charts';

const GrafPorovnani = ({ operaceFiltr: operace }) => {
  const data = [
    {
      name: 'Plán',
      naklad: 'Mzdy',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.mzdy_plan, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Soc./Zdrav.',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_r1_plan, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Strojní náklady',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_stn_plan, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Materiál',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.material_plan, 0)
      ),
    },
    {
      name: 'Plán',
      naklad: 'Kooperace',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.kooperace_plan, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Mzdy',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.mzdy, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Soc./Zdrav.',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_r1, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Strojní náklady',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_stn, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Materiál',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.material, 0)
      ),
    },
    {
      name: 'Skutečnost',
      naklad: 'Kooperace',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.kooperace, 0)
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
    <div>
      <Column {...config} />
    </div>
  );
};

export default GrafPorovnani;
