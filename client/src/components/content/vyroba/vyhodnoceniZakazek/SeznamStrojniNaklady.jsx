import { useEffect, useState, useRef } from 'react';
import { Table, Tag } from 'antd';
import moment from 'moment';
import 'moment-duration-format';
import prepocetStrojniNaklady from '../../../../utils/prepocetStrojniNaklady';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const columns = [
  {
    title: 'Stroj',
    dataIndex: 'stroj',
    key: 'stroj',
    render: (value, record) =>
      value === 'NULL' ? `Zařízení zdroje ${record.zdroj_nazev}` : value,
  },
  {
    title: 'Zdroj',
    dataIndex: 'zdroj',
    key: 'zdroj',
  },
  {
    title: 'Hodinová sazba',
    dataIndex: 'sazba',
    key: 'sazba',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Celkem vykázáno',
    dataIndex: 'vykazano',
    key: 'vykazano',
    render: (value) => moment.duration(value, 'minutes').format('HH:mm'),
  },
  {
    title: 'Náklady',
    dataIndex: 'naklady',
    key: 'naklady',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Činnost',
    dataIndex: 'cinnost',
    render: (value) =>
      value ? (
        <Tag color="orange">
          Stroj v proovzu od {moment(value).format('HH:mm')}
        </Tag>
      ) : (
        <Tag color="green">Všechny výkazy dokončeny</Tag>
      ),
  },
];

const SeznamStrojniNaklady = ({ operaceFiltr: operace }) => {
  const [operaceStrNakl, setOperaceStrNakl] = useState(null);
  const [loading, setLoading] = useState(true);
  const operaceRef = useRef(null);
  console.log(operace);
  //Způsobí přepočet při změně výběru ZP
  useEffect(() => {
    if (operace !== operaceRef.current) setLoading(true);
  }, [operace]);

  //Přepočet operací pro účely snažšího zobrazení mezd
  useEffect(() => {
    if (loading && operace) {
      operaceRef.current = operace;
      setOperaceStrNakl(prepocetStrojniNaklady(operace));
      setLoading(false);
    }
  }, [loading, operace]);

  const expandedRowRender = (stroje) => {
    const columns = [
      { title: 'Vykázal', dataIndex: 'vykazal', key: 'vykazal' },
      { title: 'OPV', dataIndex: 'opv', key: 'opv' },
      { title: 'Operace', dataIndex: 'polozka', key: 'polozka' },
      { title: 'Popis', dataIndex: 'popis', key: 'popis' },
      {
        title: 'Start',
        dataIndex: 'start',
        key: 'start',
        render: (value) => moment(value).format('D.M. HH:mm'),
      },
      {
        title: 'Stop',
        dataIndex: 'stop',
        key: 'stop',
        render: (value) =>
          value ? moment(value).format('D.M. HH:mm') : 'Výkaz není ukončen',
      },
      {
        title: 'Délka',
        dataIndex: 'trvaniMin',
        key: 'trvaniMin',
        render: (value) =>
          value
            ? moment.duration(value, 'minutes').format('HH:mm')
            : 'Výkaz není ukončen',
      },
      {
        title: 'Náklady',
        dataIndex: 'naklady',
        key: 'naklady',
        render: (value) => formatter.format(value),
      },
      {
        title: 'Činnost',
        dataIndex: 'cinnost',
        key: 'cinnost',
        render: (value, record) =>
          record.stop ? (
            <Tag color="green">Výkaz ukončen</Tag>
          ) : (
            <Tag color="orange">Činnost probíhá...</Tag>
          ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={stroje.vykazy}
        pagination={false}
        rowKey="start"
      />
    );
  };

  return (
    <div>
      <Table
        dataSource={operaceStrNakl}
        columns={columns}
        loading={loading}
        expandable={{ expandedRowRender }}
        rowKey={(row) => `${row.stroj}_${row.zdroj}`}
      />
    </div>
  );
};

export default SeznamStrojniNaklady;
