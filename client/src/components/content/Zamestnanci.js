import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

//import actions
import { getEmployees } from '../../actions/zamestnanci';

const Zamestnanci = () => {
  const employees = useSelector((state) => state.zamestnanci);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <div>
      {employees.map((employee) => (
        <li>{employee.Jmeno}</li>
      ))}
    </div>
  );
};

export default Zamestnanci;
