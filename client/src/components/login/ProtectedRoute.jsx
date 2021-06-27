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
    //silentRefresh();
  }, [dispatch]);

  useEffect(() => {
    if (user.error) history.push('/login');
  }, [user, history]);

  return <> {children} </>;
};

export default ProtectedRoute;
