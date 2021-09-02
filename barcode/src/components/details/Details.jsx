import { useState } from 'react';
import Detailpriloz from './Detailpriloz';
import DetailSkenuj from './DetailSkenuj';
import DetailUzivatel from './DetailUzivatel';
import DetailHotovo from './DetailHotovo';

const Details = ({ step, setStep }) => {
  const [user, setUser] = useState(null);
  const [operace, setOperace] = useState(null);

  return (
    <>
      {step ? (
        operace ? (
          <DetailHotovo
            user={user}
            setUser={setUser}
            operace={operace}
            setStep={setStep}
          />
        ) : (
          <DetailSkenuj user={user} setOperace={setOperace} />
        )
      ) : user ? (
        <DetailUzivatel user={user} setStep={setStep} />
      ) : (
        <Detailpriloz setUser={setUser} />
      )}
    </>
  );
};

export default Details;
