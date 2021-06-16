import { useSelector } from 'react-redux';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  return (
    <div>
      {crmRecords.map((record) => (
        <li>{record.klient.firma}</li>
      ))}
    </div>
  );
};

export default CRM;
