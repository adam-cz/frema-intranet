import { Button, Result, Image, Input } from 'antd';
import { useState, useEffect } from 'react';
import card from './card.gif';
import * as api from '../../api';

const Detailpriloz = ({ setUser }) => {
  const [input, setInput] = useState(null);

  useEffect(() => {
    if (input !== null && input.length === 16) {
      api
        .verifyCardId(input)
        .then(({ data }) => setUser({ ...data, exists: true }))
        .catch(() => setUser({ exists: false }));
    }
    setInput(null);
  }, [input, setUser]);

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
