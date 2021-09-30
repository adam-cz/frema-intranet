import { useEffect, useState, useRef } from 'react';
import { Table } from 'antd';
import prepocetKooperace from '../../../../utils/prepocetKooperace';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const columns = [
  {
    title: 'Dodavatel',
    dataIndex: 'dodavatel',
    key: 'ndodavatel',
  },
  {
    title: 'Cena',
    dataIndex: 'cena',
    key: 'cena',
    render: (value) => formatter.format(value),
  },
];

const SeznamKooperace = ({ operaceFiltr: operace }) => {
  const [operaceKooperace, setOperaceKooperace] = useState(null);
  const [loading, setLoading] = useState(true);
  const operaceRef = useRef(null);

  //Způsobí přepočet při změně výběru ZP
  useEffect(() => {
    if (operace !== operaceRef.current) setLoading(true);
  }, [operace]);

  //Přepočet operací pro účely snažšího zobrazení materiálu
  useEffect(() => {
    if (loading && operace) {
      operaceRef.current = operace;
      setOperaceKooperace(prepocetKooperace(operace));
      setLoading(false);
    }
  }, [loading, operace]);

  const expandedRowRender = (kooperace) => {
    const columns = [
      { title: 'OPV', dataIndex: 'opv', key: 'opv' },
      { title: 'Operace', dataIndex: 'polozka', key: 'polozka' },
      { title: 'Popis', dataIndex: 'popis', key: 'popis' },
      {
        title: 'Množství',
        dataIndex: 'mnozstvi',
        key: 'mnozstvi',
      },
      {
        title: 'Cena',
        dataIndex: 'cena',
        key: 'cena',
        render: (value) => formatter.format(value),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={kooperace.operace}
        pagination={false}
        rowKey={(row) => `${row.opv}_${row.operace}`}
      />
    );
  };

  return (
    <div>
      {' '}
      <Table
        dataSource={operaceKooperace}
        columns={columns}
        loading={loading}
        expandable={{ expandedRowRender }}
        rowKey="dodavatel"
      />
    </div>
  );
};

export default SeznamKooperace;
