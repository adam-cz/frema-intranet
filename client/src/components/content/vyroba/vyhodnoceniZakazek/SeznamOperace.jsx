import { Table } from 'antd';
import moment from 'moment';
import 'moment-duration-format';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const columns = [
  {
    title: 'Zakázkový postup',
    dataIndex: 'opv',
    key: 'opv',
  },
  {
    title: 'Položka',
    dataIndex: 'polozka',
    key: 'polozka',
  },
  {
    title: 'Popis',
    dataIndex: 'popis',
    key: 'popis',
  },
  {
    title: 'Plán výroba',
    dataIndex: 'planvyroba',
    key: 'planvyroba',
  },
  {
    title: 'Ve výrobě',
    dataIndex: 'vevyrobe',
    key: 'vevyrobe',
  },
  {
    title: 'Odvedeno',
    dataIndex: 'odvedeno',
    key: 'odevedeno',
  },
  {
    title: 'Trvání plán',
    dataIndex: 'trvani_plan',
    key: 'trvani_plan',
    render: (value) => moment.duration(value, 'minutes').format('DD:HH:mm'),
  },
  {
    title: 'Vykázáno',
    dataIndex: 'trvani',
    key: 'trvani',
    render: (value) => moment.duration(value).format('DD:HH:mm'),
  },
  {
    title: 'Zdroj',
    dataIndex: 'zdroj',
    key: 'zdroj',
  },
  {
    title: 'Náklady plán',
    dataIndex: 'nakl_celkem_plan',
    key: 'nakl_celkem_plan',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Náklady skutečnost',
    dataIndex: 'nakl_celkem',
    key: 'nakl_celkem',
    render: (value) => formatter.format(value),
  },
];

const SeznamOperace = ({ loading, operaceFiltr }) => {
  return (
    <div>
      <Table
        dataSource={operaceFiltr}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default SeznamOperace;
