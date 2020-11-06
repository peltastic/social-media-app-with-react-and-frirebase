import * as firebase from "firebase/app";
import { db } from "../../index";
import { storageRef } from "../../index";
import { onAuthStatus } from './authStatus'
export const signUp = (email, password, userData, pic) => {
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => {
        return db.collection("userData")
        .doc(cred.user.uid)
        .set(
          {
            userInfo: userData,
          }
        )
        .then(() => {
          const profilePicRef = storageRef.child(`profilePic/${cred.user.uid}`);
          return profilePicRef.put(pic).then ( ()=> {
            dispatch(onAuthStatus())
          });
        })
    });
  };
};


export const signIn = (email, password) => {
    return dispatch => {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(err => dispatch(Error(err.message + " Or maybe you haven't signed up")))
    }
}

const Error = err => {
  return {
    type: "ERROR",
    error:err
    }
}