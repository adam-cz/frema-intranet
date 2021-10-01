import { useState, useEffect } from 'react';
import onScan from 'onscan.js';

const config = {
  keyCodeMapper: (oEvent) => {
    console.log(oEvent.which);
  },
};

const Karta = () => {
  const [input, setInput] = useState(null);

  const overUzivatele = (scanVystup) => {
    console.log(scanVystup);
  };

  useEffect(() => {
    onScan.attachTo(window, config);
    window.addEventListener('scan', overUzivatele);
    return () => {
      window.removeEventListener('scan', overUzivatele);
      onScan.detachFrom(window);
    };
  }, []);

  return <div>Karta</div>;
};

export default Karta;
