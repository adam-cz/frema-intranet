import { useState, useEffect } from 'react';
import TableSearch from '../../ui/TableSearch';
import * as api from '../../../../api/index';
import { DateTime } from 'luxon';

const Objednavky = ({ setVyber }) => {
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
  ];

  useEffect(() => {
    if (loading) api.fetchOrders().then(({ data }) => setObjednavky(data));
    if (objednavky) setLoading(false);
  }, [loading, objednavky]);

  return (
    <TableSearch
      dataSource={objednavky}
      columns={columns}
      loading={loading}
      rowKey="doklad"
      onRow={(record) => {
        return {
          onClick: () => {
            setVyber({ objednavka: record.doklad, final: null, opv: null });
          },
        };
      }}
    />
  );
};

export default Objednavky;
