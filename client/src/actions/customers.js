import * as api from '../api';

//Action Creators
export const getCustomers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCustomers();
    dispatch({ type: 'FETCH_ALL_CUSTOMERS', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
