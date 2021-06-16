import { combineReducers } from 'redux';

//import all the reducers
import employees from './employees';
import user from './user';
import crm from './crm';

const rootReducer = combineReducers({
  employees,
  user,
  crm,
});

export default rootReducer;
