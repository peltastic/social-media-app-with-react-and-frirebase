import { db } from "../../index";

export const getLikes = (postId) => {
  return (dispatch) => {
    db.collection("likesData")
      .where("postId", "==", postId)
      .onSnapshot((snapShot) => {
        const data = snapShot.docs;
        let shot;
        data.forEach((doc) => {
          shot = doc.data();
        });
        dispatch(likesData(shot, postId));
      });
  };
};

const likesData = (data, id) => {
  return {
    type: "LIKES",
    data: data,
    postId: id
  };
};

export const updateLikes = (postId, likesCount, uid) => {
  return (dispatch) => {
    db.collection("likesData")
      .doc("post"+postId)
      .update({ likes: likesCount + 1 })
      .then(() => {
        const id = Math.round(30000 * Math.random())
        db.collection("likesData").doc(postId).set({["likedBy"+id]: uid}, {merge: true})
      });
  };
};

