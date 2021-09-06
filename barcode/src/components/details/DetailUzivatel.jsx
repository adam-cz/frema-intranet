import { Result } from 'antd';

const DetailUzivatel = ({ user }) => {
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
