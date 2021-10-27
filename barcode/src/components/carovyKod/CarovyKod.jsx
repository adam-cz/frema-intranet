import { Result, Image, Spin } from 'antd';
import barcode from './barcode.gif';

import { useEffect } from 'react';
import onScan from 'onscan.js';
import { translate } from '../../utils/charTranslator';
import { isRfid, isBarcode } from '../../utils/scanRecognizer';
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
  invokeModal,
  addMessage,
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
      vykazy.push({ scanKod, uzivatel, cas: Date.now() });
      localStorage.setItem('vykazy', JSON.stringify(vykazy));
      setUzivatel(null);
      setOdpocet({ ...odpocet, value: odpocet.initValue });
      invokeModal('warning', 'Výkaz uložen k pozdějšímu zpracování');
      addMessage('warning', 'Výkaz uložen k pozdějšímu zpracování');
    };
    const overCarovyKod = (scanVystup) => {
      const scanKod = scanVystup.detail.scanCode;
      if (!isBarcode(scanKod)) {
        if (isRfid(scanKod))
          invokeModal(
            'error',
            'Uživatel je již načten, nyní načtěte čárový kód'
          );
        else invokeModal('error', 'Chybný formát čárového kódu');
        setOdpocet({ ...odpocet, value: odpocet.initValue });
        return;
      }
      if (loading) return;
      setLoading(true);
      if (!offline)
        api
          .setProces(scanKod, uzivatel)
          .then(({ data }) => {
            if (data.status === 'success' || data.status === 'warning') {
              setUzivatel(null);
            }
            if (data.status === 'error')
              setOdpocet({ ...odpocet, value: odpocet.initValue });
            setLoading(false);
            invokeModal(data.status, data.message);
            addMessage(data.status, data.message);
            console.log(data);
          })
          .catch((error) => {
            setLoading(false);
            if (!offline) setOffline(true);
            handleOffline(scanKod, uzivatel);
            console.log(error);
          });
      //Pokud je offline nebo byl při identifikaci uřivatele, bude vykaz uložen do localstorage
      if (offline || !uzivatel.id) handleOffline(scanKod, uzivatel);
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
