import { useState, useEffect } from 'react';
import TableSearch from '../../ui/TableSearch';
import * as api from '../../../../api/index';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';

const Finaly = ({ setVyber }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [finaly, setFinaly] = useState(null);
  const columns = [
    {
      title: 'ZP Finál',
      dataIndex: 'opv',
      key: 'opv',
      searchIndex: 'opv',
    },
    {
      title: 'Objednávka',
      dataIndex: 'objednavka',
      key: 'objednavka',
      searchIndex: 'objednavka',
    },
    {
      title: 'Název',
      dataIndex: 'nazev',
      key: 'nazev',
      searchIndex: 'nazev',
    },
    {
      title: 'Datum vytvoření ZP',
      dataIndex: 'datum_vytvoreni',
      key: 'datum_vytvoreni',
      render: (value) => DateTime.fromISO(value).toLocaleString(),
    },
  ];

  useEffect(() => {
    if (loading) api.fetchFinals().then(({ data }) => setFinaly(data));
    if (finaly) setLoading(false);
  }, [loading, finaly]);

  return (
    <TableSearch
      dataSource={finaly}
      columns={columns}
      loading={loading}
      rowKey="opv"
      onRow={(record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            history.push(`/vyroba/zakazky/${record.objednavka}/${record.opv}`);
          },
        };
      }}
    />
  );
};

export default Finaly;