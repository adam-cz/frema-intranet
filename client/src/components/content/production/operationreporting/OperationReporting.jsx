import { ApiTwoTone } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import InfoTimeline from './InfoTimeline';
import * as api from '../../../../api';

const OperationReporting = () => {
  const [vykazy, setVykazy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nacistVykazy = () => {
      api.nacistVykazy();
    };
    if (loading) {
    }
  }, [loading, vykazy]);

  return <div>{!loading && <InfoTimeline vykzay={vykazy} />}</div>;
};

export default OperationReporting;
