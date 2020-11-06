const initialState = {
  posts: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "POSTS":
      return {
        ...state,
        posts: action.posts,
      };
    default:
      return state;
  }
};

export default reducer;
