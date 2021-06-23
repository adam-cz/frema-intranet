const initialState = {
  data: [],
  loading: false,
  error: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_CUSTOMERS_LOADING':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'LOAD_CUSTOMERS_SUCCESS':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case 'LOAD_CUSTOMERS_ERROR':
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
