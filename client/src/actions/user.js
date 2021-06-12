import * as api from '../api';

//Action Creators
export const getUserData = (email, heslo) => async (dispatch) => {
  try {
    const { data } = await api.login(email, heslo);
    dispatch({ type: 'FETCH_USER', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
