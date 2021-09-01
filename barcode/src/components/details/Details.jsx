import { Button, Result } from 'antd';
import { useState } from 'react';
import Detailpriloz from './Detailpriloz';
import DetailUzivatel from './DetailUzivatel';

const Details = ({ step, setStep }) => {
  const [user, setUser] = useState(null);
  return (
    <>
      {step ? (
        <Result
          title="Your operation has been executed"
          extra={
            <Button type="primary" key="console">
              Go Console
            </Button>
          }
        />
      ) : user ? (
        <DetailUzivatel user={user} setStep={setStep} />
      ) : (
        <Detailpriloz setUser={setUser} />
      )}
    </>
  );
};

export default Details;
