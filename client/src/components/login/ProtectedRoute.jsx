import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';

import { silentRefresh } from '../../api';
import { getUserData } from '../../actions/user';

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
        <Spin size="large" className="loading" />
      )}
    </>
  );
};

export default ProtectedRoute;
