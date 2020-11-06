import React, { Component } from "react";
import classes from "./Comments.module.css";
import sendPhoto from "../../assets/sendImage.png";
import MakePost from "../MakePost/MakePost";
import cancelImage from "../../assets/cancel.svg";
import { getComments, removeComments } from "../../store/actions/comments";
import { connect } from "react-redux";

import Spinner from "../../components/Spinner/Spinner";
import Post from "../Post/Post";

class Comments extends Component {
  state = {
    comment: false,
    commentCleanUp: false
  };
  componentDidMount() {
    this.props.getComments(this.props.postId);
  }
  comment = () => {
    this.setState({ comment: true });
  };
  removeComments = () => {
    this.setState({ comment: false });
  };
  render() {
    let comments = <Spinner />;
    if (this.props.commentsData) {
      comments = this.props.commentsData.map((el) => (
        <Post
          post={el.post}
          type={el.type}
          key={el.post}
          profilepic={el.profilePic}
          userId={el.userId}
          userName={el.userName}
        />
      ));
    }
    if(this.props.noComment) {
      comments = <p>No comments</p>
    }
    if (this.state.commentCleanUp) {
      comments =  true
    }
    let makeComment = (
      <img
        src={sendPhoto}
        alt="send"
        className={classes.SendImage}
        onClick={this.comment}
      />
    );
    if (this.state.comment) {
      makeComment = (
        <MakePost changed={this.removeComments} postId={this.props.postId} />
      );
    }
    return (
      <div className={classes.Container}>
        <img
          src={cancelImage}
          alt="x"
          className={classes.CancelImage}
          onClick={() => {
            this.props.clicked();
            this.props.removeComments()
            this.setState({commentCleanUp: true})
          }}
        />
        {comments}
        {makeComment}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    commentsData: state.comments.commentsData,
    noComment: state.comments.noComment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getComments: (postId) => dispatch(getComments(postId)),
    removeComments: () => dispatch(removeComments())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
