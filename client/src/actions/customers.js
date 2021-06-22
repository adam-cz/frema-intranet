import * as api from '../api';

//Action Creators
export const getCustomers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCustomers();
    const newData = data.map((item) => ({ ...item, key: item._id }));
    dispatch({ type: 'FETCH_ALL_CUSTOMERS', payload: newData });
  } catch (error) {
    console.log(error.message);
  }
};
