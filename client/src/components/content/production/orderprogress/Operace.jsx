import { ApiTwoTone } from '@ant-design/icons';
import { Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import NewWindow from 'react-new-window';
import { Barcodes } from './Barcodes';
import * as api from '../../../../api';

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
    title: 'Minut na 1 ks',
    dataIndex: 'minut_nor',
    key: 'minut_nor',
  },
  {
    title: 'Středisko zdroje',
    dataIndex: 'zdroj',
    key: 'zdroj',
  },
  {
    title: 'Mzdové náklady',
    dataIndex: 'nakl_mzd',
    key: 'nakl_mzd',
  },
  {
    title: 'Soc./Zdrav.',
    dataIndex: 'nakl_r1',
    key: 'nakl_r1',
  },
  {
    title: 'Strojní náklady',
    dataIndex: 'nakl_stn',
    key: 'nakl_stn',
  },

  {
    title: 'Celkem cena',
    dataIndex: 'naklady',
    key: 'naklady',
  },
];

const Operace = ({ procedures, loading }) => {
  const [data, setData] = useState([]);
  const [mountBarcodePage, setMountBarcodePage] = useState(false);

  const clickHandler = () => {
    setMountBarcodePage(!mountBarcodePage);
    api.createProcedure(data);
  };

  useEffect(() => {
    if (!loading) {
      const count = [];
      procedures.map((zp) => zp.operace.map((op) => count.push(op)));
      setData(count);
    }
  }, [loading, procedures]);

  return (
    <div>
      <Button type="primary" onClick={clickHandler}>
        Generovat čárové kódy
      </Button>
      {mountBarcodePage && (
        <NewWindow features={{ width: 1200, height: 1000 }}>
          <Barcodes data={data} />
        </NewWindow>
      )}
      <Table dataSource={data} columns={columns} loading={loading} />
    </div>
  );
};

export default Operace;
