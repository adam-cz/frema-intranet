import { Result } from 'antd';
import { useEffect } from 'react';

const DetailHotovo = ({
  user,
  setUser,
  operace,
  setOperace,
  setStep,
  info,
}) => {
  useEffect(() => {
    if (operace)
      setTimeout(() => {
        setUser(null);
        setOperace(null);
        setStep(0);
      }, 3000);
  }, [operace, setOperace, setStep, setUser]);

  return <Result status={info && info.status} title={info && info.message} />;
};

export default DetailHotovo;
