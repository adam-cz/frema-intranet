import { Button, Result, Input, Image } from 'antd';
import { useEffect, useState } from 'react';
import * as api from '../../api';

const DetailSkenuj = ({ user, setOperace }) => {
  const [input, setInput] = useState(null);

  useEffect(() => {
    if (input !== null && input.length === 16) {
      api
        .setProces(input)
        .then(({ data }) => setOperace(data))
        .catch((err) => console.log('Uživatel neexistuje'));
    }
    setInput(null);
  }, [input, setOperace]);

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
          <Image height={250} preview={false} alt="card reader" src={card} />
        }
        title="Přiložte svou čipovou kartu ke čtečce"
        extra={
          <div class="hidden-input">
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
