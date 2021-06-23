import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Login';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user);
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) => {
        //console.log(user);
        if (user) {
          //console.log(user);
          return <Component {...props} />;
        } else {
          //console.log(user);
          return <Login />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
