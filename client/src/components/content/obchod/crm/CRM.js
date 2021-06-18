import AddCrmRecord from './AddCrmRecord';
import { useSelector } from 'react-redux';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  return (
    <div>
      <AddCrmRecord />
      {console.log(crmRecords)}
      {typeof crmRecords !== 'undefined' ? (
        crmRecords.map((record) => <li>{console.log(record.klient.firma)}</li>)
      ) : (
        <p>Načítám...</p>
      )}
    </div>
  );
};

export default CRM;
