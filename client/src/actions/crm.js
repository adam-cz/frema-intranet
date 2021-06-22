import * as api from '../api';

//Action Creators
export const getCrmRecords = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCrmRecords();
    const newData = data.map((item) => ({ ...item, key: item._id }));
    dispatch({ type: 'FETCH_ALL_RECORDS', payload: newData });
  } catch (error) {
    console.log(error.message);
  }
};
