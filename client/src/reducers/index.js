import { combineReducers } from 'redux';

//import all the reducers
import zamestnanci from './zamestnanci';
import user from './user';

const rootReducer = combineReducers({
  zamestnanci,
  user,
});

export default rootReducer;
