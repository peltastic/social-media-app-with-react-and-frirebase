import { auth } from "../../index";
import { storageRef } from "../../index";
import { db } from "../../index";
export const userSignedIn = (uid, ud) => {
  return {
    type: "USER_SIGNED_IN",
    uid: uid,
    userData: ud,
  };
};

const userPic = (url) => {
  return {
    type: "GET_USER_PIC",
    url: url,
  };
};

const profilePicGotten = () => {
  return {
    type: "PROFILE_PIC_GOTTEN",
  };
};

export const redirectAuth = () => {
  return {
    type: "REDIRECT_AUTH",
  };
};

const noRedirectAuth = () => {
  return {
    type: "NO_REDIRECT_AUTH"
  }
}

export const userSignedOut = () => {
  return {
    type: "USER_SIGNED_OUT",
  };
};

const userPostGotten = (postData) => {
  return {
    type: "USER_POST_GOTTEN",
    data: postData,
  };
};

const noShowTools = () => {
  return {
    type: "DONT_SHOW_TOOLS"
  }
}

const showTools = () => {
  return {
    type: "SHOW_TOOLS"
  }
}


export const onAuthStatus = () => {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(noRedirectAuth())
        dispatch(showTools())
        dispatch(getUserInfo(user.uid));
        dispatch(getUserPic(user.uid));
      } else {
        dispatch(redirectAuth());
        dispatch(userSignedOut());
      }
    });
  };
};

const getUserPic = (user) => {
  return dispatch => {
    const profilePicRef = storageRef.child(`profilePic/${user}`);
    return profilePicRef.getDownloadURL().then((url) => {
      dispatch(userPic(url));
      dispatch(profilePicGotten());
    }).catch(() => {return} );
  };
};

const getUserInfo = (user) => {
  return (dispatch) => {
    const docRef = db.collection("userData").doc(user);
    docRef.get().then((doc) => {
      dispatch(userSignedIn(user, doc.data()));
      
      dispatch(getUserPost(user));
    });
  };
};

const getUserPost = (uid) => {
  return (dispatch) => {
    db.collection("posts")
      .where("uid", "==", uid)
      .onSnapshot((snapShot) => {
        const data = snapShot.docs;
        let shot;
        data.forEach((doc) => {
          shot = doc.data();
        });
        let dispatchData = [];
        for (const key in shot) {
          if (key === "uid") {
          } else {
            dispatchData.push(shot[key]);
          }
        }
        dispatch(userPostGotten(dispatchData));
      });
  };
};

export const getUserData = (uid) => {
  return (dispatch) => {
    dispatch(noShowTools())
    dispatch(getUserInfo(uid));
    dispatch(getUserPic(uid));

  };
};
