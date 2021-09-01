import { Button, Result } from 'antd';

const DetailUzivatel = ({ user }) => {
  return (
    <Result
      status="success"
      title={`Zaměstnanec ${user.jmeno} načten`}
      extra={
        <Button type="primary" key="console">
          Pokračovat
        </Button>
      }
    />
  );
};

export default DetailUzivatel;
