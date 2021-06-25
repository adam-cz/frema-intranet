import * as api from '../api';

//Action Creators
export const getCrmRecords = () => async (dispatch) => {
  dispatch({ type: 'LOAD_CRM_LOADING' });
  try {
    const { data } = await api.fetchCrmRecords();
    dispatch({ type: 'LOAD_CRM_SUCCESS', data });
  } catch (error) {
    dispatch({
      type: 'LOAD_CRM_ERROR',
      error: error.message || 'Neočekávaná chyba!!!',
    });
  }
};
