import { Button, Result } from 'antd';
import { useEffect } from 'react';

const DetailHotovo = ({ user, setUser, operace, seOperace, setStep }) => {
  useEffect(() => {
    if (user) setTimeout(() => setStep(1), 1000);
  }, [user, setStep]);

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

export default DetailHotovo;
