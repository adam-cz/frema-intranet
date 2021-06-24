import * as api from '../api';

//Action Creators
export const getEmployees = () => async (dispatch) => {
  dispatch({ type: 'LOAD_EMPLOYEES_LOADING' });
  try {
    const { data } = await api.fetchEmployees();
    dispatch({ type: 'LOAD_EMPLOYEES_SUCCESS', data });
  } catch (error) {
    dispatch({
      type: 'LOAD_EMPLOYEES_ERROR',
      error: error.message || 'Neočekávaná chyba!!!',
    });
  }
};
