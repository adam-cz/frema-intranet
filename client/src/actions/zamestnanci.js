import * as api from '../api';

//Action Creators
export const getEmployees = () => async (dispatch) => {
  try {
    const { data } = await api.fetchEmployees();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
