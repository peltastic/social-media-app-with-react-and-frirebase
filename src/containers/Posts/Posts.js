import React, { Component } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Post from "../Post/Post";
import { getPosts } from "../../store/actions/posts";
import MakePost from "../MakePost/MakePost";
import Nav from "../Navigation/navigationMobile";
import classes from "../ProfilePage/ProfilePage.module.css";

import sendPhoto from "../../assets/sendImage.png";

import { connect } from "react-redux";
class Posts extends Component {
  state = {
    showMakePost: false,
  };

  componentDidMount() {
    this.props.getPosts(this.props.uid);
  }
  showMakepostHandler = () => {
    this.setState({ showMakePost: true });
  };

  removeMakepostHandler = () => {
    this.setState({ showMakePost: false });
  };

  render() {
    let posts = <Spinner />;
    let loading = null
    if (this.props.loading) {
      loading = <Spinner />
    }

    let makepsot = (
      <div
        className={classes.MakepostContainer}
        onClick={this.showMakepostHandler}
      >
        <img src={sendPhoto} alt="send" />
      </div>
    );
    
    if (this.state.showMakePost) {
      makepsot = <MakePost changed={this.removeMakepostHandler} />
    }

    if (this.props.posts) {
      posts = this.props.posts.map((el) => {
        return (
          <Post
            post={el.post}
            type={el.type}
            key={Math.random()}
            el={el}
            profilepic={el.profilePic}
            postId={el.postId}
            userId={el.userId}
            userName={el.userName}
          />
        );
      });
    }

    return (
      <div>
        <Nav />
        {loading}
        {posts}
        {makepsot}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: (uid) => dispatch(getPosts(uid)),
  };
};

const mapStateToProps = (state) => {
  return {
    uid: state.authStatus.uid,
    posts: state.posts.posts,
    loading: state.makepost.loading
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Posts);
