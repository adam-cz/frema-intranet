import { Result, Input, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';
import * as api from '../../api';
import barcode from './barcode.gif';
import Proces from './Proces';

const DetailSkenuj = ({
  user,
  setUser,
  setOperace,
  operace,
  setStep,
  setInfo,
}) => {
  const [input, setInput] = useState(null);
  const timeout = useRef(10000);
  const interval = useRef(null);

  useEffect(() => {
    if (user) {
      interval.current = setInterval(() => {
        if (timeout.current === 0 && !operace) {
          clearInterval(interval.current);
          setStep(0);
          setUser(null);
        }
        timeout.current = timeout.current - 1000;
      }, 1000);
    }
  }, [setUser, setStep, operace, user]);

  const setProces = () => {
    api
      .setProces(input.trim(), user)
      .then(({ data }) => {
        setOperace(data.proces);
        clearInterval(interval.current);
        setInfo({ message: data.message, status: data.status });
      })
      .catch((err) => console.log(err));
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') setProces();
  };

  const inputHandleChange = (event) => {
    setInput(event.target.value);
  };
  return (
    <>
      <Result
        icon={
          <Image height={250} preview={false} alt="barcode" src={barcode} />
        }
        title="Naskenujte čárový kód operace"
        extra={
          <div>
            {user && user.procesy.length > 0 && (
              <>
                <h3>
                  Máte následující neukončené procesy. Kliknutím ukončíte:
                </h3>
                <div className="procesy">
                  {user.procesy.map((proces) => (
                    <Proces
                      proces={proces}
                      setInput={setInput}
                      setProces={setProces}
                      input={input}
                      key={proces._id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        }
      />
      <Input
        value={input}
        onBlur={({ target }) => target.focus()}
        autoFocus
        style={{ width: 10, opacity: 0, cursor: 'default' }}
        onKeyDown={handleEnter}
        onChange={inputHandleChange}
      />
    </>
  );
};

export default DetailSkenuj;
