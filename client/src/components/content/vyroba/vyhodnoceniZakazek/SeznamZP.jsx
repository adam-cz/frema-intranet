import { Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import * as api from '../../../../api';
import { useParams, useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import { FlagOutlined, EyeOutlined } from '@ant-design/icons';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const { Text } = Typography;

const SeznamZP = ({ postupy, setPostupy }) => {
  const history = useHistory();
  const { objednavka, final, opv } = useParams();
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'Finál/OPV',
      render: (value, record) => (
        <div>
          <FlagOutlined
            style={{ fontSize: '16px', marginLeft: 10, cursor: 'pointer' }}
            onClick={() =>
              history.push(`/vyroba/zakazky/${objednavka}/${record.opvfinal}`)
            }
          />
          <EyeOutlined
            style={{ fontSize: '16px', marginLeft: 10, cursor: 'pointer' }}
            onClick={() =>
              history.push(
                `/vyroba/zakazky/${objednavka}/${record.opvfinal}/${record.opv}`
              )
            }
          />
        </div>
      ),
    },
    {
      title: 'OPV',
      dataIndex: 'opv',
      key: 'opv',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        if (opv && record.opv !== opv)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        else return <Text>{value}</Text>;
      },
    },
    {
      title: 'OPV Finál',
      dataIndex: 'opvfinal',
      key: 'opvfinal',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        if (opv && record.opv !== opv)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        else return <Text>{value}</Text>;
      },
    },
    {
      title: 'Popis',
      dataIndex: 'popis',
      key: 'popis',
      render: (value, record) => {
        if (record.opv === record.opvfinal) {
          if (!opv && final && record.opvfinal !== final)
            return <b style={{ color: '#D6DBDE' }}>{value}</b>;
          if (opv && record.opv !== opv)
            return <b style={{ color: '#D6DBDE' }}>{value}</b>;
          else return <b>{value}</b>;
        } else {
          if (!opv && final && record.opvfinal !== final)
            return (
              <Text style={{ color: '#D6DBDE', paddingLeft: 30 }}>{value}</Text>
            );
          if (opv && record.opv !== opv)
            return (
              <Text style={{ color: '#D6DBDE', paddingLeft: 30 }}>{value}</Text>
            );
          else return <Text style={{ paddingLeft: 30 }}>{value}</Text>;
        }
      },
    },
    {
      title: 'Plán výroba',
      dataIndex: 'planvyroba',
      key: 'planvyroba',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        if (opv && record.opv !== opv)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        else return <Text>{value}</Text>;
      },
    },
    {
      title: 'Ve výrobě',
      dataIndex: 'vevyrobe',
      key: 'vevyrobe',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        if (opv && record.opv !== opv)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        else return <Text>{value}</Text>;
      },
    },
    {
      title: 'Odvedeno',
      dataIndex: 'odvedeno',
      key: 'odvedeno',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        if (opv && record.opv !== opv)
          return <Text style={{ color: '#D6DBDE' }}>{value}</Text>;
        else return <Text>{value}</Text>;
      },
    },
    {
      title: 'Datum vzniku VP',
      dataIndex: 'datum_vzniku',
      key: 'datum_vzniku',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return (
            <Text style={{ color: '#D6DBDE' }}>
              {DateTime.fromISO(value).toLocaleString()}
            </Text>
          );
        if (opv && record.opv !== opv)
          return (
            <Text style={{ color: '#D6DBDE' }}>
              {DateTime.fromISO(value).toLocaleString()}
            </Text>
          );
        else return <Text>{DateTime.fromISO(value).toLocaleString()}</Text>;
      },
    },
    {
      title: 'Plánované náklady',
      dataIndex: 'cena',
      key: 'cena',
      render: (value, record) => {
        if (!opv && final && record.opvfinal !== final)
          return (
            <Text style={{ color: '#D6DBDE' }}>{formatter.format(value)}</Text>
          );
        if (opv && record.opv !== opv)
          return (
            <Text style={{ color: '#D6DBDE' }}>{formatter.format(value)}</Text>
          );
        else return <Text>{formatter.format(value)}</Text>;
      },
    },
  ];

  useEffect(() => {
    if (loading) {
      api.fetchOpvList(objednavka).then((result) => {
        setPostupy(result.data);
        setLoading(false);
      });
    }
  }, [loading, objednavka]);

  return (
    <div>
      <Table
        dataSource={postupy}
        columns={columns}
        loading={loading}
        rowKey="opv"
        pagination={false}
      />
    </div>
  );
};

export default SeznamZP;
