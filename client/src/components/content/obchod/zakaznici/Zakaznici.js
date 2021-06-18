import AddCustomer from './AddCustomer';
import { useSelector } from 'react-redux';

const CRM = () => {
  const customers = useSelector((state) => state.customers);
  return (
    <div>
      <AddCustomer />
      {customers.map((customer) => (
        <li>{customer.name}</li>
      ))}
    </div>
  );
};

export default CRM;
