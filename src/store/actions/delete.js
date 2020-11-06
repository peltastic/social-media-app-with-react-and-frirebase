import { db } from "../../index";
import { storageRef } from "../../index";
import { onAuthStatus } from "./authStatus";
import {auth} from "../../index"
import * as firebase from "firebase/app";

const deleted = (uid, postId) => {
  return () => {
    db.collection("posts")
      .doc(uid)
      .update({
        [postId]: firebase.firestore.FieldValue.delete(),
      })
      .then(() => {
        return db
          .collection("allPosts")
          .doc(uid)
          .update({
            [postId]: firebase.firestore.FieldValue.delete(),
          });
      })
      .then(() => {
        return db
          .collection("comments")
          .doc("post" + postId)
          .delete();
      })
      .then(() => {
        return db
          .collection("commentsCount")
          .doc("post" + postId)
          .delete();
      })
      .then(() => {
        return db
        .collection("likesData")
        .doc("post" + postId)
          .delete();
      })
      .then(() => {
        return storageRef.child(`commentsImage/${"post" + postId}`).delete();
      })
      .catch(() => {
        return
      });
  };
};

export const deletePost = (uid, postId, type) => {
  return (dispatch) => {
    dispatch(onAuthStatus());
    if (type === "text") {
      dispatch(deleted(uid, postId));
    }
    if (type === "image") {
      dispatch(deleted(uid, postId));
      storageRef.child(`postImages/${uid}/${postId}`).delete();
    }
  };
};

export const deleteAllPost = (uid) => {
  return (dispatch) => {
   db.collection("allPosts").doc(uid).delete()
   .then(()=> {
     db.collection("posts").doc(uid).delete()
   })
    storageRef
      .child(`profilePic/${uid}`)
      .delete()
      .then(() => {
        return db.collection("userData").doc(uid).delete();
      })
      .then(() => {
        dispatch(deleteUser());
      });
      
  };
};

export const deleteUser = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    user.delete().then(() => {
      auth.signOut()
    })
  };
};
