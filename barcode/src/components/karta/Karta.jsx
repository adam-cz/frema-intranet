import { Result, Image, Spin } from 'antd';
import card from './card.gif';

import { useEffect } from 'react';
import onScan from 'onscan.js';
import { isRfid, isBarcode } from '../../utils/scanRecognizer';
import { translate } from '../../utils/charTranslator';
import * as api from '../../api';

const config = {
  keyCodeMapper: (oEvent) => {
    return translate(oEvent.which);
  },
};

const Karta = ({
  setUzivatel,
  loading,
  setLoading,
  offline,
  setOffline,
  invokeModal,
}) => {
  useEffect(() => {
    const handleOffline = (scanKod) => {
      setLoading(false);
      setUzivatel({ rfid: scanKod });
      invokeModal('warning', 'Uživatel načten lokálně, terminál je OFFLINE');
    };
    const overUzivatele = (scanVystup) => {
      const scanKod = scanVystup.detail.scanCode;
      if (!isRfid(scanKod)) {
        if (isBarcode(scanKod))
          invokeModal('error', 'Nejdříve přiložte kartu ke čtečce');
        else invokeModal('error', 'Špatný formát karty');
        return;
      }
      if (loading) return;
      setLoading(true);
      if (!offline)
        api
          .verifyCardId(scanKod)
          .then(({ data }) => {
            setLoading(false);
            if (data.status === 'success') setUzivatel(data.employee);
            invokeModal(data.status, data.message);
          })
          .catch((error) => {
            console.log(error);
            if (!offline) setOffline(true);
            handleOffline(scanKod);
          });
      if (offline) handleOffline(scanKod);
    };

    onScan.attachTo(window, config);
    window.addEventListener('scan', overUzivatele);
    return () => {
      window.removeEventListener('scan', overUzivatele);
      onScan.detachFrom(window);
    };
  });

  return (
    <div>
      {loading ? (
        <Result icon={<Spin size="large" />} title="Hledám uživatele..." />
      ) : (
        <Result
          icon={
            <Image height={250} preview={false} alt="card reader" src={card} />
          }
          title="Přiložte svou čipovou kartu ke čtečce"
        />
      )}
    </div>
  );
};

export default Karta;
