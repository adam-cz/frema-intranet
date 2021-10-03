import { message, Result, Image, Spin } from 'antd';
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

const CarovyKod = ({
  setUzivatel,
  uzivatel,
  odpocet,
  setOdpocet,
  offline,
  setOffline,
  loading,
  setLoading,
}) => {
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (odpocet.value > 0) {
        setOdpocet({ ...odpocet, value: odpocet.value - 1 });
      }
      if (odpocet.value === 0) {
        setUzivatel(null);
        setOdpocet({ ...odpocet, value: odpocet.initValue });
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    const handleOffline = (scanKod, uzivatel) => {
      setLoading(false);
      const vykazy = JSON.parse(localStorage.getItem('vykazy')) || [];
      vykazy.push({ scanKod, uzivatel });
      localStorage.setItem('vykazy', JSON.stringify(vykazy));
      setUzivatel(null);
      message.warning('Výkaz uložen k pozdějšímu zpracování');
    };
    const overCarovyKod = (scanVystup) => {
      if (loading) return;
      setLoading(true);
      const scanKod = scanVystup.detail.scanCode;
      if (!offline)
        api
          .setProces(scanKod, uzivatel)
          .then(({ data }) => {
            if (data.status === ('success' || 'warning')) {
              setUzivatel(null);
            }
            if (data.status === 'error')
              setOdpocet({ ...odpocet, value: odpocet.initValue });
            message[data.status](data.message);
            console.log(data);
          })
          .catch((error) => {
            if (!offline) setOffline(true);
            handleOffline(scanKod, uzivatel);
            console.log(error);
          });
      //Pokud je offline nebo byl při identifikaci uřivatele, bude vykaz uložen do localstorage
      if (offline || !uzivatel.jmeno) handleOffline(scanKod, uzivatel);
    };

    onScan.attachTo(window, config);
    window.addEventListener('scan', overCarovyKod);
    return () => {
      window.removeEventListener('scan', overCarovyKod);
      onScan.detachFrom(window);
    };
  });

  return (
    <div>
      {loading ? (
        <Result icon={<Spin size="large" />} title="Ukládám výkaz..." />
      ) : (
        <Result
          icon={
            <Image height={250} preview={false} alt="barcode" src={barcode} />
          }
          title="Naskenujte čárový kód operace"
        />
      )}
    </div>
  );
};

export default CarovyKod;
