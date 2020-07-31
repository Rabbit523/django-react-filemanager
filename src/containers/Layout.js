import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

class CustomLayout extends React.Component {
  render() {
    const { authenticated } = this.props;
    return (
      <React.Fragment>
        <Menu fixed="top" className="navbar">
          <Menu.Item
            as={NavLink}
            exact
            to="/"
            name="Home"
            className="nav-brand"
          >
            <img src={"/static/logo.png"} alt="logo"></img>
          </Menu.Item>
          <div className="end-nav">
            {authenticated ? (
              <React.Fragment>
                <Menu.Item
                  as={NavLink}
                  exact
                  to="/drive"
                  name="My Drive"
                ></Menu.Item>
                <Menu.Item header onClick={() => this.props.logout()}>
                  Logout
                </Menu.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Menu.Item header as={NavLink} exact to="/login">
                  Login
                </Menu.Item>
                <Menu.Item header as={NavLink} exact to="/signup">
                  Signup
                </Menu.Item>
              </React.Fragment>
            )}
          </div>
        </Menu>
        {this.props.children}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
