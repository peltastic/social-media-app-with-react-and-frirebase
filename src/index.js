import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import authStatusReducer from "./store/reducers/authStatus";
import postsReducer from "./store/reducers/posts";
import postReducer from "./store/reducers/post";
import authReducer from "./store/reducers/auth";
import commentsReducer from "./store/reducers/comments"
import makepostReducer from "./store/reducers/makepost"

const firebaseConfig = {
  //your firebase config here.
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
const storage = firebase.storage();
export const storageRef = storage.ref();

const rootReducers = combineReducers({
  authStatus: authStatusReducer,
  posts: postsReducer,
  post: postReducer,
  auth: authReducer,
  comments: commentsReducer,
  makepost: makepostReducer
});

const store = createStore(
  rootReducers,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
