import React, { Component } from "react";
import testProfile from "../../assets/NoProfilePic.png";
import sendPhoto from "../../assets/sendImage.png";
import classes from "./ProfilePage.module.css";
import Nav from "../Navigation/navigationMobile";
import Post from "../Post/Post";
import Makepost from "../MakePost/MakePost";
import Spinner from "../../components/Spinner/Spinner";

import { connect } from "react-redux";

class ProfilePage extends Component {
  state = {
    popup: false,
    showMakePost: false,
  };
  
  showMakepostHandler = () => {
    this.setState({ showMakePost: true });
  };
  removeMakepostHandler = () => {
    this.setState({ showMakePost: false });
  };
  render() {
    let posts = <p>No posts yet</p>;
    let loading = null
    if (this.props.loading) {
      loading = <Spinner />
    }
    if (this.props.postData) {
      if (this.props.postData.length > 0) {
        posts = this.props.postData.map((el) => (
          <Post
            post={el.post}
            type={el.type}
            key={Math.random()}
            profilepic={el.profilePic ? el.profilePic : testProfile}
            postId={el.postId}
            userName={el.userName}
          />
        ));
      } else {
        posts = <p>No posts yet</p>
      }
      
    }
    let makepost = (
      <div
        className={classes.MakepostContainer}
        onClick={this.showMakepostHandler}
      >
        <img src={sendPhoto} alt="send" />
      </div>
    );

    if (this.props.noShowTools) {
      makepost = null
    }

    if (this.state.showMakePost) {
      makepost = <Makepost changed={this.removeMakepostHandler} />;
    }
    return (
      <React.Fragment>
        <Nav />
        <div className={classes.Container}>
          <div className={classes.ImageContainer}>
            <img
              src={this.props.profilePic ? this.props.profilePic : testProfile}
              alt="profile-pic-here"
            />
          </div>
          <p className={classes.UserName}>
            {this.props.userData ? this.props.userData.userInfo.username : null}
          </p>
          <p className={classes.Bio}>{this.props.userData ? this.props.userData.userInfo.bio : null}</p>
        </div>
        {loading}
        {posts}
        {makepost}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.authStatus.uid,
    userData: state.authStatus.userData,
    profilePic: state.authStatus.profilePic,
    postData: state.authStatus.postData,
    noShowTools: state.authStatus.noShowTools,
    loading: state.makepost.loading
  };
};

export default connect(mapStateToProps)(ProfilePage);
