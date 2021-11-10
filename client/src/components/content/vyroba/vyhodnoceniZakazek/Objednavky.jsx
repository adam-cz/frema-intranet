import { useState, useEffect } from 'react';
import TableSearch from '../../ui/TableSearch';
import * as api from '../../../../api/index';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const Objednavky = ({ setObjednavka }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [objednavky, setObjednavky] = useState(null);
  const columns = [
    {
      title: 'Objednávka',
      dataIndex: 'doklad',
      key: 'doklad',
      searchIndex: 'doklad',
    },
    {
      title: 'Poznámka',
      dataIndex: 'poznamka',
      key: 'poznamka',
      searchIndex: 'poznamka',
    },
    {
      title: 'Partner',
      dataIndex: 'zkraceny_nazev',
      key: 'zkraceny_nazev',
      searchIndex: 'zkraceny_nazev',
    },
    {
      title: 'Cena bez DPH',
      dataIndex: 'cena_bez_dph',
      key: 'cena_bez_dph',
      render: (value, record) => formatter.format(value * record.kurz),
    },
    {
      title: 'DPH',
      dataIndex: 'dph',
      key: 'dph',
      render: (value, record) => formatter.format(value * record.kurz),
    },
    {
      title: 'Cena s DPH',
      dataIndex: 'cena_celkem',
      key: 'cena_celkem',
      render: (value, record) => formatter.format(value * record.kurz),
    },
    {
      title: 'Datum pořízení',
      dataIndex: 'dat_por',
      key: 'dat_por',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
    {
      title: 'Datum expedice',
      dataIndex: 'dat_expedice',
      key: 'dat_expedice',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
    {
      title: 'Datum dodání',
      dataIndex: 'dat_dodani',
      key: 'dat_dodani',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
    {
      title: 'Vyfakturováno',
      dataIndex: 'vyrizeno',
      key: 'vyrizeno',
      sorter: (a, b) => a.vyrizeno - b.vyrizeno,
      render: (value) => (value === 0 ? 'ne' : 'ano'),
    },
  ];

  useEffect(() => {
    if (loading) api.fetchOrders().then(({ data }) => setObjednavky(data));
    if (objednavky) setLoading(false);
  }, [loading, objednavky]);

  return (
    <TableSearch
      rowClassName={(record) =>
        record.vyrizeno ? 'table-row-vyfa' : 'table-row-nevyfa'
      }
      size="small"
      dataSource={objednavky}
      columns={columns}
      loading={loading}
      rowKey="doklad"
      onRow={(record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            history.push(`/vyroba/zakazky/${record.doklad}`);
          },
        };
      }}
    />
  );
};

export default Objednavky;
