import { Table, Typography } from 'antd';

const { Text } = Typography;
const columns = [
  { title: 'OPV', dataIndex: 'opv', key: 'opv' },
  {
    title: 'Popis',
    dataIndex: 'popis',
    key: 'popis',
    render: (value, record) =>
      record.opv === record.opvfinal ? <b>{value}</b> : value,
  },
  { title: 'Plán výroba', dataIndex: 'planvyroba', key: 'planvyroba' },
  { title: 'Ve výrobě', dataIndex: 'vevyrobe', key: 'vevyrobe' },
  { title: 'Odvedeno', dataIndex: 'odvedeno', key: 'odvedeno' },
  {
    title: 'Mzdy',
    dataIndex: 'jedn_mzdy',
    key: 'jedn_mzdy',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Soc./Zdrav.',
    dataIndex: 'rn1',
    key: 'rn1',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Materiál',
    dataIndex: 'material',
    key: 'material',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Polotovary',
    dataIndex: 'polotovar',
    key: 'polotovar',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Kooperace',
    dataIndex: 'kooper',
    key: 'kooper',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Strojní náklady',
    dataIndex: 'strnakl',
    key: 'strnakl',
    render: (value) => Math.round(value * 100) / 100,
  },
  {
    title: 'Cena',
    dataIndex: 'cena',
    key: 'cena',
    render: (value) => Math.round(value * 100) / 100,
  },
];

const PlanTable = ({ procedures, loading }) => {
  return (
    <Table
      dataSource={procedures}
      columns={columns}
      loading={loading}
      rowKey="opv"
      pagination={false}
      summary={(data) => {
        const planvyroba =
          data &&
          data.reduce((total, current) => total + current.planvyroba, 0);
        const vevyrobe =
          data && data.reduce((total, current) => total + current.vevyrobe, 0);
        const odvedeno =
          data && data.reduce((total, current) => total + current.odvedeno, 0);

        const jedn_mzdy =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.jedn_mzdy, 0) *
                100
          ) / 100;
        const material =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.material, 0) * 100
          ) / 100;
        const polotovar =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.polotovar, 0) *
                100
          ) / 100;
        const kooper =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.kooper, 0) * 100
          ) / 100;
        const strnakl =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.strnakl, 0) * 100
          ) / 100;
        const rn1 =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.rn1, 0) * 100
          ) / 100;
        const cena =
          Math.round(
            data &&
              data.reduce((total, current) => total + current.cena, 0) * 100
          ) / 100;

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>Celkem</Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{planvyroba}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{vevyrobe}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{odvedeno}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{jedn_mzdy}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{rn1}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{material}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{polotovar}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{kooper}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{strnakl}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text type="danger">{cena}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

export default PlanTable;
