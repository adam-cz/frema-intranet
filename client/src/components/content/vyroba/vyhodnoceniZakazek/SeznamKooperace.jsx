import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { DateTime } from 'luxon';
import prepocetKooperace from '../../../../utils/prepocetKooperace';

const SeznamKooperace = ({ operaceFiltr: operace }) => {
  const [operaceKooperace, setOperaceKooperace] = useState(null);
  const [loading, setLoading] = useState(true);

  //Přepočet operací pro účely snažšího zobrazení materiálu
  useEffect(() => {
    if (loading && operace) {
      setOperaceKooperace(prepocetKooperace(operace));
      setLoading(false);
    }
  }, [loading, operace]);

  return <div>{operace && console.log(operace)}Materiál</div>;
};

export default SeznamKooperace;
