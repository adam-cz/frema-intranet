import { combineReducers } from 'redux';

//import all the reducers
import zamestnanci from './zamestnanci';

const rootReducer = combineReducers({
  zamestnanci,
});

export default rootReducer;
