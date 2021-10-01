import { message, Result, Image } from 'antd';
import barcode from './barcode.gif';

import { useEffect } from 'react';
import onScan from 'onscan.js';
import { translate } from '../../utils/charTranslator';
import * as api from '../../api';

const config = {
  keyCodeMapper: (oEvent) => {
    return translate(oEvent.which);
  },
};

const CarovyKod = ({ setUzivatel, uzivatel }) => {
  useEffect(() => {
    const overCarovyKod = (scanVystup) => {
      const scanKod = scanVystup.detail.scanCode;
      console.log(scanKod);
      api.setProces(scanKod, uzivatel).then(({ data }) => {
        console.log(data);
        if (data.status === 'success') setUzivatel(null);
        message[data.status](data.message);
      });
    };

    onScan.attachTo(window, config);
    window.addEventListener('scan', overCarovyKod);
    return () => {
      window.removeEventListener('scan', overCarovyKod);
      onScan.detachFrom(window);
    };
  }, [setUzivatel, uzivatel]);

  return (
    <div>
      <Result
        icon={
          <Image height={250} preview={false} alt="barcode" src={barcode} />
        }
        title="Naskenujte čárový kód operace"
      />
    </div>
  );
};

export default CarovyKod;
