import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "./sass/App.scss";
import { PublicRoute, PrivateRoute } from "./routes";

class App extends Component {
  componentDidMount() {
    this.props.onAuthCheck();
  }

  render() {
    return (
      <Router>
        {this.props.isAuthenticated ? <PrivateRoute /> : <PublicRoute />}
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthCheck: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
