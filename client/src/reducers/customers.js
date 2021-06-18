const reducer = (customer = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_CUSTOMERS':
      return action.payload;
    case 'POST_CUSTOMER':
      return action.payload;
    case 'DELETE_CUSTOMER':
      return action.payload;
    default:
      return customer;
  }
};

export default reducer;
