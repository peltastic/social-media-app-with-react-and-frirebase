import React, { Component } from "react";
import classes from "./Post.module.css";
import likesImage from "../../assets/likeImage.svg";
import { db } from "../../index";
import * as firebase from "firebase/app";
import { connect } from "react-redux";
import { getUserData } from "../../store/actions/authStatus";
import { Redirect } from "react-router-dom";
import commentImage from "../../assets/comment.png";
import deleteImage from "../../assets/delete.png";
import Comment from "../Comments/Comments";
import { deletePost } from "../../store/actions/delete";

class Posts extends Component {
  state = {
    likedBy: [],
    likesData: null,
    liked: false,
    userData: null,
    comment: false,
    noOfComments: 0,
  };
  componentDidMount() {
    if (this.props.postId) {
      db.collection("likesData")
        .where("postId", "==", this.props.postId)
        .onSnapshot((snapShot) => {
          const data = snapShot.docs;
          let shot;
          data.forEach((doc) => {
            shot = doc.data();
          });
          for (const key in shot) {
            if (key === "likes" || key === "postId") {
            } else {
              this.state.likedBy.push(shot[key]);
            }
          }
          this.setState({ likesData: shot });
        });
      this.getCommentsCount();
    }
  }

  getCommentsCount = () => {
    db.collection("commentsCount")
      .doc("post" + this.props.postId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data().commentCount;
          this.setState({ noOfComments: data });
        }
      });
  };

  likesUpdateHandler = () => {
    this.state.likedBy.filter((el) => this.props.uid === el);
    this.state.likedBy.splice(0, 1);
    if (!this.state.liked) {
      db.collection("likesData")
        .doc("post" + this.props.postId)
        .update({ likes: this.state.likesData.likes + 1 })
        .then(() => {
          db.collection("likesData")
            .doc("post" + this.props.postId)
            
            .set({ [this.props.uid]: this.props.uid }, { merge: true });
        });
      this.setState({ liked: true });
    } else if (this.state.liked) {
      this.state.likedBy.splice(0, 1);
      db.collection("likesData")
        .doc("post" + this.props.postId)
        .update({ [this.props.uid]: firebase.firestore.FieldValue.delete() })
        .then(() => {
          db.collection("likesData")
            .doc("post" + this.props.postId)
            .update({ likes: this.state.likesData.likes - 1 });
        });
      this.setState({ liked: false });
    }
  };

  loadUserProfile = () => {
    this.props.getUserData(this.props.userId);

    this.setState({ userData: this.props.userData });
  };

  showComment = () => {
    this.setState({ comment: true });
  };
  removeComment = () => {
    this.setState({ comment: false });
  };
  deletePostHandler = () => {
    this.props.deletePost(this.props.uid, this.props.postId, this.props.type);
  };

  render() {
    let redirect = null;
    let showComment = null;
    let postInteractions = null;
    let deleteImg = null;

    if (!this.props.userId && !this.props.noShowTools) {
      deleteImg = (
        <img
          src={deleteImage}
          alt="X"
          className={classes.DeleteImage}
          onClick={this.deletePostHandler}
        />
      );
    }

    if (this.state.comment) {
      showComment = (
        <Comment clicked={this.removeComment} postId={this.props.postId} />
      );
    }
    if (this.state.userData) {
      redirect = <Redirect to={"/" + this.state.userData.userInfo.username} />;
    }
    const cN = [];
    let likeStyle = [classes.LikeImage];
    if (this.state.liked) {
      likeStyle.push(classes.liked);
    } else {
      likeStyle = [classes.LikeImage];
    }
    let postType = null;
    if (this.props.type === "text") {
      postType = <p className={classes.Post}>{this.props.post}</p>;
      cN.push(classes.Container);
    }

    if (this.props.type === "image") {
      postType = (
        <img
          src={this.props.post}
          alt="can't-load-post"
          className={classes.Image}
        />
      );
      cN.push(classes.ContainerImage);
    }
    if (this.props.postId) {
      postInteractions = (
        <React.Fragment>
          <img
            src={likesImage}
            alt="like"
            className={likeStyle.join(" ")}
            onClick={this.likesUpdateHandler}
          />

          <p
            style={{
              display: "inline-block",
              fontSize: "1rem",
              marginBottom: "1rem",
              marginRight: "2rem",
            }}
          >
            {this.state.likesData ? this.state.likesData.likes : 0}
          </p>
          <img src={commentImage} alt="comment" onClick={this.showComment} />
          <p style={{ display: "inline" }}>
            {this.state.noOfComments ? this.state.noOfComments : 0}
          </p>
          {showComment}
        </React.Fragment>
      );
    }

    return (
      <div className={cN.join(" ")}>
        {redirect}
        {deleteImg}
        <img
          src={this.props.profilepic}
          alt="profile"
          className={classes.ProfilePic}
          onClick={this.loadUserProfile}
        />
        <p className={classes.UserName}>{this.props.userName}</p>
        {postType}
        {postInteractions}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: (uid) => dispatch(getUserData(uid)),
    deletePost: (uid, postId, type) => dispatch(deletePost(uid, postId, type)),
  };
};

const mapStateToProps = (state) => {
  return {
    uid: state.authStatus.uid,
    userData: state.authStatus.userData,
    noShowTools: state.authStatus.noShowTools,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
