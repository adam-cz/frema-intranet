import { message, Result, Image } from 'antd';
import card from './card.gif';

import { useEffect } from 'react';
import onScan from 'onscan.js';
import { translate } from '../../utils/charTranslator';
import * as api from '../../api';

const config = {
  keyCodeMapper: (oEvent) => {
    return translate(oEvent.which);
  },
};

const Karta = ({ setUzivatel }) => {
  useEffect(() => {
    const overUzivatele = (scanVystup) => {
      const scanKod = scanVystup.detail.scanCode;
      console.log(scanKod);
      api.verifyCardId(scanKod).then(({ data }) => {
        console.log(data);
        if (data.status === 'success') setUzivatel(data.employee);
        message[data.status](data.message);
      });
    };

    onScan.attachTo(window, config);
    window.addEventListener('scan', overUzivatele);
    return () => {
      window.removeEventListener('scan', overUzivatele);
      onScan.detachFrom(window);
    };
  }, [setUzivatel]);

  return (
    <div>
      <Result
        icon={
          <Image height={250} preview={false} alt="card reader" src={card} />
        }
        title="Přiložte svou čipovou kartu ke čtečce"
      />
    </div>
  );
};

export default Karta;
