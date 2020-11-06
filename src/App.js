import React, { Component } from "react";
import Layout from "./components/Layout/Layout";
import Auth from "./containers/Auth/Auth";
import Posts from "./containers/Posts/Posts";
import ProfilePage from "./containers/ProfilePage/ProfilePage";
import Logout from "./components/Logout/Logout";
import { Route, Switch, Redirect } from "react-router-dom";
import { onAuthStatus } from "./store/actions/authStatus";
import { connect } from "react-redux";

class App extends Component {
  state = {
    redirectAuth: false
  }
  componentDidMount () {
    this.props.onAuthStatus();
  }
  render() {
    let redirect = null 
    if (this.props.redirectAuth) {
      redirect = <Redirect  to="/auth" />
    }
    return (
      <Layout>
        {redirect}
        <Switch>
          <Route path="/auth" exact component={Auth} />
          <Route path="/" exact component={Posts}/>
          <Route path="/logout" exact component={Logout} />
          <Route path="/:username" component={ProfilePage} />
        </Switch>
      </Layout>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onAuthStatus: () => dispatch(onAuthStatus()),
  };
};

const mapStateToProps = (state) => {
  return {
    pic: state.authStatus.profilePic,
    userData: state.authStatus.userData,
    redirectAuth: state.authStatus.redirectAuth
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
