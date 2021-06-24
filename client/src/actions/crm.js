import * as api from '../api';

//Action Creators
export const getCrmRecords = () => async (dispatch) => {
  dispatch({ type: 'LOAD_CRM_LOADING' });
  try {
    const { data } = await api.fetchCrmRecords();
    const newData = data.map((item) => ({ ...item, key: item._id }));
    dispatch({ type: 'LOAD_CRM_SUCCESS', data: newData });
  } catch (error) {
    dispatch({
      type: 'LOAD_CRM_ERROR',
      error: error.message || 'Neočekávaná chyba!!!',
    });
  }
};
