import * as api from '../api';

//Action Creators
export const getUserData =
  (email = false, heslo = false) =>
  async (dispatch) => {
    dispatch({ type: 'LOGIN_USER_LOADING' });
    try {
      const { data } = !email
        ? await api.silentLogin()
        : await api.login(email, heslo);
      api.silentRefresh(data.user.expiresIn);
      dispatch({ type: 'LOGIN_USER_SUCCESS', data });
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_ERROR',
        error: error.message || 'Neočekávaná chyba!!!',
      });
    }
  };
