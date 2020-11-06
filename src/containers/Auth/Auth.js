import React, { Component } from "react";
import classes from "./Auth.module.css";
import { connect } from "react-redux";
import { signUp, signIn } from "../../store/actions/auth";
import Spinner from "../../components/Spinner/Spinner";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    passErr: false,
    signedUp: false,
    signUpEmail: "",
    signUppassword: "",
    signInEmail: "",
    signInpassword: "",
    userSignedIn: false,
    loading: false,
    userProfilePic: null,
    userData: {
      bio: "",
      username: "",
    },
    loading: false,
    fileUploaded: false
  };

  componentDidUpdate(nextprops) {
    if (nextprops.userData) {
      this.redirectHandler();
    }
  }

  checkPasswordValidity = (password) => {
    if (password.length < 7) {
      return false;
    } else {
      return true;
    }
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    

    const signUpEmail = this.state.signUpEmail;
    const signUppassword = this.state.signUppassword;
    const signInEmail = this.state.signInEmail;
    const signInpassword = this.state.signInpassword;
    const userNameSignUp = this.state.userData.username;
    const userProfilePic = this.state.userProfilePic;
    const userData = this.state.userData;
    if (
      this.checkPasswordValidity(signUppassword) &&
      signUpEmail &&
      userData &&
      userProfilePic &&
      userNameSignUp
    ) {
      this.props.onSignUp(
        signUpEmail,
        signUppassword,
        userData,
        userProfilePic
      );
      this.setState({ passErr: false });
      this.setState({ userSignedIn: true });
      this.setState({ loading: true });
    } else {
      this.setState({ passErr: true });
    }
    if (signInpassword && signInEmail) {
      this.props.onSignIn(signInEmail, signInpassword);
      this.setState({ loading: true });
    }
  };

  onFileChange = (e) => {
    this.setState({
      fileUploaded: true
    })
    this.setState({
      userProfilePic: e.target.files[0],
    });
  };

  redirectHandler = () => {
    this.props.history.push("/");
  };
  render() {
    let passErrMessage = null;
    let signInErrMessage = null;
    let loading = null;
    let fileStyle = "notuploaded" 
    if (this.state.fileUploaded) {
      fileStyle = "uploaded"
    } 
    if (this.state.loading) {
      loading = <Spinner />;
    }
    if (this.props.signInErrMessage) {
      signInErrMessage = (
        <p style={{ color: "red", marginBottom: "1rem", fontSize: "1.5rem" }}>
          {this.props.signInErrMessage}
        </p>
      );
    }
    if (this.state.passErr) {
      passErrMessage = (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          PASSWORD TOO SHORT, MOST CONTAIN 7 CHARACTERS OR MORE
        </p>
      );
    }
    let info = (
      <p className={classes.HaventSignedUp}>
        Haven't signed up?{" "}
        <Button clicked={() => this.setState({ signedUp: true })}>
          Sign up
        </Button>
      </p>
    );
    let formContent = (
      <React.Fragment>
        <h1>Sign In</h1>
        <Input
          class="input"
          type="email"
          placeholder="Email"
          changed={(e) => this.setState({ signInEmail: e.target.value })}
        />
        <Input
          class="input"
          type="text"
          placeholder="password"
          changed={(e) => this.setState({ signInpassword: e.target.value })}
        />
        {signInErrMessage}
        <button>Next</button>
      </React.Fragment>
    );
    if (this.state.signedUp) {
      formContent = (
        <React.Fragment>
          <h1>Sign Up</h1>
          <Input
            class="input"
            type="email"
            placeholder="Email"
            changed={(e) => this.setState({ signUpEmail: e.target.value })}
          />
          <Input
            class="input"
            type="text"
            placeholder="password"
            changed={(e) => this.setState({ signUppassword: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Your Bio"
            class="input"
            changed={(e) => {
              const userData = { ...this.state.userData };
              userData.bio = e.target.value;
              this.setState({ userData: userData });
            }}
          />
          <Input
            type="text"
            class="input"
            val={this.state.userData.username}
            placeholder="Username"
            changed={(e) => {
              const userData = { ...this.state.userData };
              userData.username = e.target.value;
              this.setState({ userData: userData });
            }}
          />
          <Input type="file" label="PROFILE PICTURE" class={["inpFile", fileStyle].join(" ")} changed={this.onFileChange} />
          {passErrMessage}
          <button style={{"display": "block", "margin" : "auto", "marginBottom" : "1.7rem"}}>Next</button>
        </React.Fragment>
      );

      info = (
        <Button clicked={() => this.setState({ signedUp: false })}>
          Login Page
        </Button>
      );
    }
    let redirect = null;
    if (this.state.userSignedIn) {
      redirect = <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <h1 className={classes.Intro}>Social Media App Made With React and Firebase</h1>
        <div className={classes.Container}>
          {redirect}
          <form onSubmit={this.onSubmitHandler}>{formContent}</form>
          {info}
        </div>
        {loading}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (email, password, userData, pic) =>
      dispatch(signUp(email, password, userData, pic)),
    onSignIn: (email, password) => dispatch(signIn(email, password)),
  };
};

const mapStateToProps = (state) => {
  return {
    userData: state.authStatus.userData,
    posted: state.authStatus.posted,
    pic: state.authStatus.profilePic,
    uid: state.authStatus.uid,
    signInErrMessage: state.auth.errMessage,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
