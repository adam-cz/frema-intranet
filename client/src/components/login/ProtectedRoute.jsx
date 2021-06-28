import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { Redirect } from 'react-router-dom';

import { getUserData } from '../../actions/user';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.data) dispatch(getUserData());
  }, [dispatch, user.data]);

  return (
    <>
      {user.data ? (
        <>{children}</>
      ) : user.error ? (
        <Redirect to="/login" />
      ) : (
        <Spin />
      )}
    </>
  );
};

export default ProtectedRoute;
