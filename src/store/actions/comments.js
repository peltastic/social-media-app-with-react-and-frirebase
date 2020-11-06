import { db } from "../../index";
import { storageRef } from "../../index";

const storeComments = (data) => {
  return {
    type: "GET_COMMENTS",
    data: data,
  };
};

const noComment = () => {
  return {
    type: "NO_COMMENT",
  };
};

export const removeComments = () => {
  return {
    type: "REMOVE_COMMENTS",
  };
};

export const getComments = (postId) => {
  return (dispatch) => {
    db.collection("comments")
      .doc("post" + postId)
      .onSnapshot((doc) => {
        const data = doc.data();
        const dispatchData = [];
        for (const key in data) {
          dispatchData.push(data[key]);
        }
        dispatch(storeComments(dispatchData));
        if (dispatchData.length === 0) {
          dispatch(noComment());
        }
      });
  };
};

export const sendComments = (postId, post, uid, username) => {
  return (dispatch) => {
    let noOfComments = 0;
    const id = Math.round(50000 * Math.random().toFixed(5));
    const profilePicRef = storageRef.child(`profilePic/${uid}`);
    profilePicRef
      .getDownloadURL()
      .then((url) => {
        return db
          .collection("comments")
          .doc("post" + postId)
          .set(
            {
              [id]: {
                post: post,
                type: "text",
                profilePic: url,
                userId: uid,
                userName: username,
                commentId: id,
              },
            },
            { merge: true }
          );
      })
      .then(() => {
        return db
          .collection("commentsCount")
          .doc("post" + postId)
          .get()
          .then((doc) => {
            const data = doc.data();
            noOfComments = data.commentCount;
          });
      })
      .then(() => {
        db.collection("commentsCount")
          .doc("post" + postId)
          .update({ commentCount: noOfComments + 1 });
      });
  };
};

export const sendCommentsImage = (postId, image, uid, username) => {
  return () => {
    let noOfComments = 0;
    const profilePicRef = storageRef.child(`profilePic/${uid}`);
    profilePicRef.getDownloadURL().then((urlP) => {
      const id = Math.round(45000 * Math.random().toFixed(5));
      const postRef = storageRef.child(
        `commentsImage/${"post" + postId}/comment${id}`
      );
      postRef
        .put(image)
        .then(() => {
          return postRef.getDownloadURL();
        })
        .then((url) => {
          return db
            .collection("comments")
            .doc("post" + postId)
            .set(
              {
                [id]: {
                  post: url,
                  type: "image",
                  profilePic: urlP,
                  userId: uid,
                  userName: username,
                  commentId: id,
                },
              },
              { merge: true }
            );
        })
        .then(() => {
          return db
            .collection("commentsCount")
            .doc("post" + postId)
            .get()
            .then((doc) => {
              const data = doc.data();

              noOfComments = data.commentCount;
            });
        })
        .then(() => {
          db.collection("commentsCount")
            .doc("post" + postId)
            .update({ commentCount: noOfComments + 1 });
        });
    });
  };
};
