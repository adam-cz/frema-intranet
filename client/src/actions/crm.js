import * as api from '../api';

//Action Creators
export const getCrmRecords = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCrmRecords();
    dispatch({ type: 'FETCH_ALL_RECORDS', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};