import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const history = useHistory();
  if (!user) history.push('/login');
  return <>{children}</>;
};

export default ProtectedRoute;
