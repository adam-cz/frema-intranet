import AddCrmRecord from './AddCrmRecord';
import { useSelector } from 'react-redux';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  return (
    <div>
      <AddCrmRecord />
      {crmRecords.map((record) => (
        <li>{record.klient.firma}</li>
      ))}
    </div>
  );
};

export default CRM;
