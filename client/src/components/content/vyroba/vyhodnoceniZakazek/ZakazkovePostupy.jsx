import { useState, useEffect } from 'react';
import TableSearch from '../../ui/TableSearch';
import * as api from '../../../../api/index';
import { DateTime } from 'luxon';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const ZakazkovePostupy = ({ setVyber }) => {
  const [loading, setLoading] = useState(true);
  const [postupy, setPostupy] = useState(null);
  const columns = [
    {
      title: 'Zakázkový postup',
      dataIndex: 'opv',
      key: 'opv',
      searchIndex: 'opv',
    },
    {
      title: 'Finál',
      dataIndex: 'opvfinal',
      key: 'opvfinal',
      searchIndex: 'opvfinal',
    },
    {
      title: 'Popis',
      dataIndex: 'popis',
      key: 'popis',
      searchIndex: 'popis',
    },
    {
      title: 'Množství',
      dataIndex: 'planvyroba',
      key: 'planvyroba',
    },
    {
      title: 'Plánované náklady',
      dataIndex: 'cena',
      key: 'cena',
      render: (value) => formatter.format(value),
    },
    {
      title: 'Datum vzniku VP',
      dataIndex: 'datum_vzniku',
      key: 'datum_vzniku',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
  ];

  useEffect(() => {
    if (loading) api.fetchOpvs().then(({ data }) => setPostupy(data));
    if (postupy) setLoading(false);
  }, [loading, postupy]);

  return (
    <TableSearch
      dataSource={postupy}
      columns={columns}
      loading={loading}
      rowKey="opv"
      onRow={(record) => {
        return {
          onClick: () => {
            api.getOrderNumber(record.opvfinal).then((res) =>
              setVyber({
                objednavka: res.data,
                final: record.opvfinal,
                opv: record.opv,
              })
            );
            //setOrder(record.doklad);
          },
        };
      }}
    />
  );
};

export default ZakazkovePostupy;
