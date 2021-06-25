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

export const getUserDataWithRefreshToken = () => async (dispatch) => {
  try {
    const data = await api.silentLogin();
    console.log(data);
    dispatch({ type: 'FETCH_USER', payload: data.data });
  } catch (error) {
    console.log(error.message);
  }
};
