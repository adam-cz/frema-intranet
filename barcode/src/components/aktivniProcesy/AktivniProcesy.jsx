import { Card, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const AktivniProcesy = ({ uzivatel }) => {
  return (
    <Space direction="vertical">
      {uzivatel.procesy.map((proces) => (
        <Card
          size="small"
          title="Aktivní proces"
          extra={<ExclamationCircleOutlined style={{ color: '#FF0000' }} />}
          style={{ width: 300 }}
        >
          <p>
            <b>OPV</b>: {proces.opv}
          </p>
          <p>
            <b>Operace</b>: {proces.polozka}
          </p>
          <p>
            <b>Stroj</b>:{' '}
            {proces.stroj === 'NULL' ? 'Výchozí stroj' : proces.stroj}
          </p>
        </Card>
      ))}
    </Space>
  );
};

export default AktivniProcesy;
