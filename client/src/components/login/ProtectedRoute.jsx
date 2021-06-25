import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { silentRefresh } from '../../api';
import { getUserData } from '../../actions/user';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserData());
    silentRefresh();
  }, [dispatch]);

  return (
    <>
      {user.data ? (
        <>{children}</>
      ) : user.error ? (
        history.push('/login')
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default ProtectedRoute;
