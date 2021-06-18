import { combineReducers } from 'redux';

//import all the reducers
import employees from './employees';
import user from './user';
import crm from './crm';
import customers from './customers';

const rootReducer = combineReducers({
  employees,
  user,
  crm,
  customers,
});

export default rootReducer;
