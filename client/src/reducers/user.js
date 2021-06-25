const initialState = {
  data: null,
  loading: false,
  error: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER_LOADING':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'LOGIN_USER_SUCCESS':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case 'LOGIN_USER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
