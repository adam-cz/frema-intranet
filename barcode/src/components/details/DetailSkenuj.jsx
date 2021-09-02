import { Button, Result, Input, Image } from 'antd';
import { useEffect, useState } from 'react';
import * as api from '../../api';
import barcode from './barcode.gif';

const timeout = 10000;

const DetailSkenuj = ({
  user,
  setUser,
  setOperace,
  time,
  setTime,
  setStep,
  setInfo,
}) => {
  const [input, setInput] = useState(null);

  useEffect(() => {
    if (input !== null && input.length > 8) {
      api
        .setProces(input, user)
        .then((res) => {
          console.log(res);
          setOperace(res.data);
        })
        .catch((err) => console.log(err));
    }
    setInput(null);
  }, [input, user, setOperace]);

  const manualInputHandler = () => {
    setInput(prompt('Zadejte ID operace'));
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
        onChange={inputHandleChange}
      />
    </>
  );
};

export default DetailSkenuj;
