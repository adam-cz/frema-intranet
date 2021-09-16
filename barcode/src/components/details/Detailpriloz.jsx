import { Result, Image, Input } from 'antd';
import { useState } from 'react';
import card from './card.gif';
import * as api from '../../api';

const Detailpriloz = ({ setUser, setStep }) => {
  const [input, setInput] = useState(null);

  const handleEnter = (event) => {
    if (event.key === 'Enter')
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
      />
      <Input
        value={input}
        onBlur={({ target }) => target.focus()}
        autoFocus
        style={{ width: 10, opacity: 0, cursor: 'default' }}
        onChange={inputHandleChange}
        onKeyDown={handleEnter}
      />
    </>
  );
};

export default Detailpriloz;
