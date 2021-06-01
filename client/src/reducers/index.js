import { combineReducers } from 'redux';

//import all the reducers
import _items from './_items';

const rootReducer = combineReducers({
  _items,
});

export default rootReducer;
