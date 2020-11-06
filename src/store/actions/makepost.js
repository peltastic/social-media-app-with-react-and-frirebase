import { storageRef } from "../../index";
import { db } from "../../index";

const loading = () => {
  return {
    type: "LOADING",
  };
};

const stopLoading = () => {
  return {
    type: "STOP_LOADING",
  };
};

export const sendPost = (post, uid, userName) => {
  return (dispatch) => {
    dispatch(loading());
    const profilePicRef = storageRef.child(`profilePic/${uid}`);
    profilePicRef.getDownloadURL().then((url) => {
      const id = Math.round(207678000 * Math.random().toFixed(7));

      return db
        .collection("commentsCount")
        .doc("post" + id)
        .set({ commentCount: 0 })
        .then(() => {
          db.collection("posts")
            .doc(uid)
            .set(
              {
                [id]: {
                  post: post,
                  type: "text",
                  profilePic: url,
                  postId: id,
                  userId: uid,
                  userName: userName,
                },
                uid: uid,
              },
              { merge: true }
            );
        })
        .then(() => {
          return db
            .collection("allPosts")
            .doc(uid)
            .set(
              {
                [id]: {
                  post: post,
                  type: "text",
                  profilePic: url,
                  postId: id,
                  userId: uid,
                  userName: userName,
                },
                uid: uid,
              },
              { merge: true }
            );
        })
        .then(() => {
          dispatch(stopLoading());
          return db
            .collection("likesData")
            .doc("post" + id)
            .set({
              likes: 0,
              postId: id,
            });
        });
    });
  };
};

export const sendImage = (image, uid, userName) => {
  return (dispatch) => {
    dispatch(loading());
    const profilePicRef = storageRef.child(`profilePic/${uid}`);
    profilePicRef.getDownloadURL().then((urlP) => {
      const id = Math.round(167880000 * Math.random().toFixed(7));
      const postRef = storageRef.child(`postImages/${uid}/${id}`);
      postRef
        .put(image)
        .then(() => {
          return postRef.getDownloadURL();
        })
        .then((url) => {
          return db
            .collection("posts")
            .doc(uid)
            .set(
              {
                [id]: {
                  post: url,
                  type: "image",
                  profilePic: urlP,
                  postId: id,
                  userId: uid,
                  userName: userName,
                },
                uid: uid,
              },
              { merge: true }
            )
            .then(() => {
              db.collection("commentsCount")
                .doc("post" + id)
                .set({ commentCount: 0 });
            })
            .then(() => {
              return db
                .collection("allPosts")
                .doc(uid)
                .set(
                  {
                    [id]: {
                      post: url,
                      type: "image",
                      profilePic: urlP,
                      postId: id,
                      userId: uid,
                      userName: userName,
                    },
                    uid: uid,
                  },
                  { merge: true }
                );
            })
            .then(() => {
              dispatch(stopLoading());
              return db
                .collection("likesData")
                .doc("post" + id)
                .set({
                  likes: 0,
                  postId: id,
                });
            });
        });
    });
  };
};
