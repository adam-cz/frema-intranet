import { useEffect, useState, useRef } from 'react';
import { Table, Tag } from 'antd';
import prepocetMaterial from '../../../../utils/prepocetMaterial';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const columns = [
  {
    title: 'Název',
    dataIndex: 'nazev',
    key: 'nazev',
  },
  {
    title: 'Nomenklatura',
    dataIndex: 'nomenklatura',
    key: 'nomenklatura',
  },
  {
    title: 'cena za MJ',
    dataIndex: 'cena_mj',
    key: 'cena_mj',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Požadováno',
    dataIndex: 'pozadovano',
    key: 'pozadovano',
    render: (value, record) => `${value} ${record.MJ}`,
  },
  {
    title: 'Vydáno',
    dataIndex: 'vydano',
    key: 'vydano',
    render: (value, record) => `${value} ${record.MJ}`,
  },
  {
    title: 'Náklady',
    dataIndex: 'cena',
    key: 'cena',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Činnost',
    dataIndex: 'cinnost',
    key: 'cinnost',
    render: (value, record) =>
      record.pozadovano - record.vydano > 0 ? (
        <Tag color="orange">
          {`Zbývá vydat ${record.pozadovano - record.vydano} ${record.MJ}`}{' '}
          celkem
        </Tag>
      ) : (
        <Tag color="green">Všechen materiál vydán</Tag>
      ),
  },
];

const SeznamMaterial = ({ operaceFiltr: operace }) => {
  const [operaceMaterial, setOperaceMaterial] = useState(null);
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
      setOperaceMaterial(prepocetMaterial(operace));
      setLoading(false);
    }
  }, [loading, operace]);

  const expandedRowRender = (material) => {
    const columns = [
      { title: 'Autor', dataIndex: 'autor', key: 'autor' },
      { title: 'OPV', dataIndex: 'opv', key: 'opv' },
      { title: 'Operace', dataIndex: 'polozka', key: 'polozka' },
      { title: 'Popis', dataIndex: 'popis', key: 'popis' },
      {
        title: 'Požadováno',
        dataIndex: 'pozadovano',
        key: 'pozadovano',
        render: (value, record) => `${value} ${record.MJ}`,
      },
      {
        title: 'Vydáno',
        dataIndex: 'vydano',
        key: 'vydano',
        render: (value, record) => `${value} ${record.MJ}`,
      },
      {
        title: 'Náklady',
        dataIndex: 'cena',
        key: 'cena',
        render: (value) => formatter.format(value),
      },
      {
        title: 'Činnost',
        dataIndex: 'cinnost',
        key: 'cinnost',
        render: (value, record) =>
          record.pozadovano - record.vydano > 0 ? (
            <Tag color="orange">
              {`Zbývá vydat ${record.pozadovano - record.vydano} ${record.MJ}`}{' '}
              do operace
            </Tag>
          ) : (
            <Tag color="green">Všechen materiál vydán</Tag>
          ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={material.operace}
        pagination={false}
        rowKey={(row) => `${row.opv}_${row.operace}`}
      />
    );
  };

  return (
    <div>
      <Table
        dataSource={operaceMaterial}
        columns={columns}
        loading={loading}
        expandable={{ expandedRowRender }}
        rowKey="nomenklatura"
      />
    </div>
  );
};

export default SeznamMaterial;
