import { useState, useEffect } from 'react';
import * as api from '../../../../api';
import VykazyGantt from './VykazyGantt';

const OperationReporting = () => {
  const [vykazy, setVykazy] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <VykazyGantt vykzay={vykazy} />
    </div>
  );
};

export default OperationReporting;
