import { combineReducers } from 'redux';

//import all the reducers
import employees from './employees';
import user from './user';

const rootReducer = combineReducers({
  employees,
  user,
});

export default rootReducer;
