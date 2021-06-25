import * as api from '../api';

//Action Creators
export const loadCustomers = () => async (dispatch) => {
  dispatch({ type: 'LOAD_CUSTOMERS_LOADING' });
  try {
    const { data } = await api.fetchCustomers();
    dispatch({ type: 'LOAD_CUSTOMERS_SUCCESS', data });
  } catch (error) {
    dispatch({
      type: 'LOAD_CUSTOMERS_ERROR',
      error: error.message || 'Neočekávaná chyba!!!',
    });
  }
};
