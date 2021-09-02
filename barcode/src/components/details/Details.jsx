import { useState } from 'react';
import Detailpriloz from './Detailpriloz';
import DetailSkenuj from './DetailSkenuj';
import DetailUzivatel from './DetailUzivatel';
import DetailHotovo from './DetailHotovo';

const Details = ({ step, setStep, setTime, time }) => {
  const [user, setUser] = useState(null);
  const [operace, setOperace] = useState(null);
  const [info, setInfo] = useState({});

  return (
    <>
      {step ? (
        operace ? (
          <DetailHotovo
            user={user}
            setUser={setUser}
            operace={operace}
            setOperace={setOperace}
            setStep={setStep}
            info={info}
          />
        ) : (
          <DetailSkenuj
            user={user}
            setUser={setUser}
            setOperace={setOperace}
            setStep={setStep}
            time={time}
            setTime={setTime}
            setInfo={setInfo}
          />
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
