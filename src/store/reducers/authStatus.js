const initialState = {
  uid: null,
  posted: false,
  profilePic: null,
  userData: null,
  postData: null,
  redirectAuth: false,
  noShowTools: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_SIGNED_IN":
      return {
        ...state,
        uid: action.uid,
        userData: action.userData,
      };
    case "USER_SIGNED_OUT":
      return {
        ...state,
        uid: null,
        profilePic: null,
        posted: false,
        userData: null,
        postData: null,
        redirectAuth: true,
      };
    case "GET_USER_PIC":
      return {
        ...state,
        profilePic: action.url,
      };
    case "DONT_SHOW_TOOLS":
      return {
        ...state,
        noShowTools: true,
      };
      case "NO_REDIRECT_AUTH":
        return {
          ...state,
          redirectAuth: false,
        }; 
    case "SHOW_TOOLS":
      return {
        ...state,
        noShowTools: false,
      };
    case "REDIRECT_AUTH":
      return {
        ...state,
        redirectAuth: true,
      };
    case "PROFILE_PIC_GOTTEN":
      return {
        ...state,
        posted: true,
      };
    case "USER_POST_GOTTEN":
      return {
        ...state,
        postData: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
