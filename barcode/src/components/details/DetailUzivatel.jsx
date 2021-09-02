import { Result } from 'antd';
import { useEffect } from 'react';

const DetailUzivatel = ({ user, setStep, setUser }) => {
  useEffect(() => {
    if (user.exists) setTimeout(() => setStep(1), 1000);
    if (!user.exists) setTimeout(() => setUser(null), 2000);
  }, [user, setStep, setUser]);

  return (
    <>
      {user && user.exists ? (
        <Result status="success" title={`Zaměstnanec ${user.jmeno} načten`} />
      ) : (
        <Result status="error" title={`Čipová karta nerozpoznána!`} />
      )}
    </>
  );
};

export default DetailUzivatel;
