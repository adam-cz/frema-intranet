import { Button, Result, Image, Input } from 'antd';
import { useState, useEffect } from 'react';
import card from './card.gif';
import * as api from '../../api';

const Detailpriloz = ({ setUser, user, setStep }) => {
  const [input, setInput] = useState(null);

  useEffect(() => {
    if (input !== null && input.length === 8 && user === null) {
      api
        .verifyCardId(input)
        .then(({ data }) => {
          setTimeout(() => setStep(1), 2000);
          setUser({ ...data, exists: true });
        })
        .catch(() => {
          setUser({ exists: false });
          setTimeout(() => setUser(null), 3000);
        });
    }

    //setInput(null);
  }, [input, setUser, setStep, user]);

  const manualInputHandler = () => {
    setInput(prompt('Zadejte ID karty'));
  };

  const inputHandleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <>
      <Result
        icon={
          <Image height={250} preview={false} alt="card reader" src={card} />
        }
        title="Přiložte svou čipovou kartu ke čtečce"
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

export default Detailpriloz;
