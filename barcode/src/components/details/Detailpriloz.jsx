import { Button, Result, Image } from 'antd';
import { useState, useEffect } from 'react';
import card from './card.gif';
import * as api from '../../api';

const Detailpriloz = () => {
  const [input, setInput] = useState('');

  useEffect(() => {
    api.verifyCardId(input);
  }, [input]);

  const inputHandler = () => {
    setInput(prompt('Zadejte ID karty'));
  };

  const sendHandler = () => {};

  return (
    <Result
      icon={<Image height={250} preview={false} alt="card reader" src={card} />}
      title="Přiložte svou čipovou kartu ke čtečce"
      extra={
        <Button type="primary" key="console" onClick={inputHandler}>
          Zadat ručně
        </Button>
      }
    />
  );
};

export default Detailpriloz;
