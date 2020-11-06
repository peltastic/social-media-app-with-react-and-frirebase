import { db } from "../../index";


const posts = data => {
  return {
    type: "POSTS", 
    posts: data
  }
}

export const getPosts = () => {
  return dispatch =>
    db.collection("allPosts").onSnapshot((snapShot) => {
      const data = snapShot.docs;
      const shot = [];
      data.forEach((doc) => {
        shot.push(doc.data());
      });
      const dispatchData = []
      for (const el of shot) {
        for (const key in  el) {
          if (key === "uid") {

          } else {
            dispatchData.push(el[key])
          }
        }
      }
      dispatch(posts(dispatchData))
    });
};
