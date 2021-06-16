const reducer = (record = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload;
    case 'POST_RECORD':
      return action.payload;
    case 'DELETE_RECORD':
      return action.payload;
    default:
      return record;
  }
};

export default reducer;
