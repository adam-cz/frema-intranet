import { Column } from '@ant-design/charts';
import { Table } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

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
      name: 'Plán',
      naklad: 'Celkem',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_celkem_plan, 0)
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
    {
      name: 'Skutečnost',
      naklad: 'Celkem',
      hodnota: Math.round(
        operace.reduce((total, current) => total + current.nakl_celkem, 0)
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
  const columns = [
    {
      title: 'Náklad',
      dataIndex: 'naklad',
      key: 'naklad',
    },
    {
      title: 'Plán',
      dataIndex: 'plan',
      key: 'plan',
      render: (value) => formatter.format(value),
    },
    {
      title: 'Skutečnost',
      dataIndex: 'skutecnost',
      key: 'skutecnost',
      render: (value) => formatter.format(value),
    },
    {
      title: 'Rozdíl',
      dataIndex: 'rozdil',
      key: 'rozdil',
      render: (value) =>
        value < 0 ? (
          <div style={{ color: 'red' }}>{formatter.format(value)}</div>
        ) : (
          <div style={{ color: 'green' }}>{formatter.format(value)}</div>
        ),
    },
    {
      title: 'Rozdíl v %',
      key: 'navysenirozdil%',
      render: (value, record) => {
        const procenta =
          record.skutecnost !== 0
            ? Math.round((record.plan / record.skutecnost) * 100)
            : 100;
        return procenta < 100 ? (
          <div style={{ color: 'red' }}>
            <CaretUpOutlined /> {Math.abs(procenta - 100) + '%'}
          </div>
        ) : (
          <div style={{ color: 'green' }}>
            <CaretDownOutlined />
            {procenta - 100 + '%'}
          </div>
        );
      },
    },
  ];

  const dataSource = [
    {
      naklad: 'Mzdy',
      plan: Math.round(
        operace.reduce((total, current) => total + current.mzdy_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.mzdy, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce((total, current) => total + current.mzdy_plan, 0)
        ) -
        Math.round(operace.reduce((total, current) => total + current.mzdy, 0)),
    },
    {
      naklad: 'Soc./Zdrav.',
      plan: Math.round(
        operace.reduce((total, current) => total + current.nakl_r1_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.nakl_r1, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce((total, current) => total + current.nakl_r1_plan, 0)
        ) -
        Math.round(
          operace.reduce((total, current) => total + current.nakl_r1, 0)
        ),
    },
    {
      naklad: 'Strojní náklady',
      plan: Math.round(
        operace.reduce((total, current) => total + current.nakl_stn_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.nakl_stn, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce((total, current) => total + current.nakl_stn_plan, 0)
        ) -
        Math.round(
          operace.reduce((total, current) => total + current.nakl_stn, 0)
        ),
    },
    {
      naklad: 'Materiál',
      plan: Math.round(
        operace.reduce((total, current) => total + current.material_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.material, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce((total, current) => total + current.material_plan, 0)
        ) -
        Math.round(
          operace.reduce((total, current) => total + current.material, 0)
        ),
    },
    {
      naklad: 'Kooperace',
      plan: Math.round(
        operace.reduce((total, current) => total + current.kooperace_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.kooperace, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce((total, current) => total + current.kooperace_plan, 0)
        ) -
        Math.round(
          operace.reduce((total, current) => total + current.kooperace, 0)
        ),
    },
    {
      naklad: 'Celkem',
      plan: Math.round(
        operace.reduce((total, current) => total + current.nakl_celkem_plan, 0)
      ),
      skutecnost: Math.round(
        operace.reduce((total, current) => total + current.nakl_celkem, 0)
      ),
      rozdil:
        Math.round(
          operace.reduce(
            (total, current) => total + current.nakl_celkem_plan,
            0
          )
        ) -
        Math.round(
          operace.reduce((total, current) => total + current.nakl_celkem, 0)
        ),
    },
  ];

  return (
    <>
      <Column {...config} style={{ marginBottom: 30 }} />
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

export default GrafPorovnani;
