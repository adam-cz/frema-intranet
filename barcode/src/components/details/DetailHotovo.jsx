import { Button, Result } from 'antd';
import { useEffect } from 'react';

const DetailHotovo = ({ user, setUser, operace, setOperace, setStep }) => {
  useEffect(() => {
    if (operace)
      setTimeout(() => {
        setUser(null);
        setOperace(null);
        setStep(0);
      }, 2000);
  }, [operace, setOperace, setStep, setUser]);

  return (
    <Result
      status="success"
      title={`Operace ${operace.operace} na zakázkovém postupu ${operace.opv} načtena`}
      extra={
        <Button type="primary" key="console">
          Pokračovat
        </Button>
      }
    />
  );
};

export default DetailHotovo;
