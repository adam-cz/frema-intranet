const reducer = (employees = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL:':
      return action.payload;
    default:
      return employees;
  }
};

export default reducer;
