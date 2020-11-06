const initialState = {
  commentsData: null,
  noComment: false,
  noOfComment: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_COMMENTS":
      return {
        ...state,
        commentsData: action.data,
        noComment: false,
      };
    case "NO_COMMENT":
      return {
        ...state,
        noComment: true,
      };
    case "REMOVE_COMMENTS":
      return {
        ...state,
        commentsData: null,
      };
      case "NO_OF_COMMENTS":
        return {
          ...state,
          noOfComment: action.data
        };
        case "CLEAN_UP":
            return {
              ...state,
              noOfComment: null,
            };      
    default:
      return state;
  }
};

export default reducer;
