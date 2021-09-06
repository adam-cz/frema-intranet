import { Button, Result, Input, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';
import * as api from '../../api';
import barcode from './barcode.gif';

const DetailSkenuj = ({
  user,
  setUser,
  setOperace,
  operace,
  setStep,
  setInfo,
}) => {
  const [input, setInput] = useState(null);
  const timeout = useRef(3000);
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

  const manualInputHandler = () => {
    setInput(prompt('Zadejte ID operace'));
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter')
      api
        .setProces(input.trim(), user)
        .then(({ data }) => {
          setOperace(data.proces);
          clearInterval(interval.current);
          setInfo({ message: data.message, status: data.status });
        })
        .catch((err) => console.log(err));
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
          <div className="hidden-input">
            <Button type="primary" key="console" onClick={manualInputHandler}>
              Zadat ručně
            </Button>
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
