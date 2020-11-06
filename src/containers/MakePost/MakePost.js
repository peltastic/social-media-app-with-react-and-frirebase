import React, { Component } from "react";
import Input from "../../components/Input/Input";
import classes from "./MakePost.module.css";
import media from "../../assets/media.svg";
import send from "../../assets/sendImage.png";

import { sendPost, sendImage } from "../../store/actions/makepost";
import { sendComments, sendCommentsImage } from "../../store/actions/comments";

import { connect } from "react-redux";

class MakePost extends Component {
  state = {
    post: "",
    image: "",
  };

  onFileChange = (e) => {
    this.setState({
      image: e.target.files[0],
    });
  };

  sendPost = () => {
    if (this.state.image && !this.props.postId) {
      this.props.sendImage(
        this.state.image,
        this.props.uid,
        this.props.userData.userInfo.username
      );
      this.setState({
        image: "",
      });
    }
    if (this.state.post && !this.props.postId) {
      this.props.sendPost(
        this.state.post,
        this.props.uid,
        this.props.userData.userInfo.username
      );

      this.setState({
        post: "",
      });
    }
    if (this.props.postId && this.state.post) {
      this.props.sendComment(
        this.props.postId,
        this.state.post,
        this.props.uid,
        this.props.userData.userInfo.username
      );
    }
    if (this.props.postId && this.state.image) {
      this.props.sendCommentsImage(
        this.props.postId,
        this.state.image,
        this.props.uid,
        this.props.userData.userInfo.username
      )
    }
    this.props.changed();
  };

  render() {
    return (
      <div className={classes.Makepost}>
        <Input
          type="text"
          class="input2"
          val={this.state.post}
          placeholder="Write Something"
          changed={(e) => this.setState({ post: e.target.value })}
        />
        <label className={classes.Label}>
          <img src={media} alt="media" className={classes.Media} />
          Media
          <input
            type="file"
            className={classes.InpFile}
            onChange={this.onFileChange}
          />
        </label>
        <img src={send} alt="send" onClick={this.sendPost} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.authStatus.uid,
    userData: state.authStatus.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendPost: (post, uid, username) => dispatch(sendPost(post, uid, username)),
    sendImage: (image, uid, username) =>
      dispatch(sendImage(image, uid, username)),
    sendComment: (postId, post, uid, username) =>
      dispatch(sendComments(postId, post, uid, username)),
    sendCommentsImage: (postId, image, uid, username)  => dispatch(sendCommentsImage(postId, image, uid, username))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakePost);
