import React, { useState } from "react";
import "./navigationMobile.css";
import BackDrop from "../../components/BackDrop/BackDrop";
import { connect } from "react-redux";
import {Redirect } from "react-router-dom";
import { onAuthStatus } from "../../store/actions/authStatus";
import {deleteAllPost, deleteUser } from "../../store/actions/delete"

import { NavLink } from "react-router-dom";
const NavigationMobile = (props) => {
  const [state, setState] = useState({
    show: false,
  });

  const returnNavHandler = () => {
    setState({
      show: false,
    });
  };
  const navIconHandler = () => {
    if (!state.show) {
      setState({
        show: true,
      });
    } else {
      setState({
        show: false,
      });
    }
  };
  const deleteAccHandler = () => {
    props.deleteAllPost(props.uid)
    
    
    
  };
  const loadProfilePage = () => {
    props.onAuthStatus();
  };
  let backDrop = null;
  let profileLink = null;

  if (props.userData) {
    profileLink = (
      <NavLink
        to={"/" + props.userData.userInfo.username}
        onClick={loadProfilePage}
        exact={true}
        activeClassName="clicked"
      >
        <li>Profile</li>
      </NavLink>
    );
  }
  if (state.show) {
    backDrop = <BackDrop />;
  }
  const navIconClicked = state.show ? "active" : null;
  let redirect = null
  if (props.redirectAuth) {
    redirect = <Redirect to="/auth"/>
  }
  return (
    <React.Fragment>
      {redirect}
      {backDrop}
      <div className="NavIcon" onClick={navIconHandler}>
        <div className={["NavIconTop", navIconClicked].join(" ")}></div>
        <div className={["NavIconMiddle", navIconClicked].join(" ")}></div>
        <div className={["NavIconBottom", navIconClicked].join(" ")}></div>
      </div>
      <nav className={["Nav", navIconClicked].join(" ")}>
        <ul>
          <NavLink to="/" exact={true} activeClassName="clicked">
            <li>Home</li>
          </NavLink>
          {profileLink}
          <NavLink to="/logout" exact={true} onClick={returnNavHandler} activeClassName="clicked">
            <li>Logout</li>
          </NavLink>
          <li onClick={deleteAccHandler}>Delete Account</li>
        </ul>
      </nav>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.authStatus.userData,
    uid: state.authStatus.uid,
    redirectAuth: state.authStatus.redirectAuth
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuthStatus: () => dispatch(onAuthStatus()),
    deleteAllPost: uid => dispatch(deleteAllPost(uid)),
    deleteUser: () => dispatch(deleteUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMobile);
