import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { DateTime } from 'luxon';
import prepocetMaterial from '../../../../utils/prepocetMaterial';

const SeznamMaterial = ({ operaceFiltr: operace }) => {
  const [operaceMaterial, setOperaceMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  //Přepočet operací pro účely snažšího zobrazení materiálu
  useEffect(() => {
    if (loading && operace) {
      setOperaceMaterial(prepocetMaterial(operace));
      setLoading(false);
    }
  }, [loading, operace]);

  return <div>{operace && console.log(operace)}Materiál</div>;
};

export default SeznamMaterial;
