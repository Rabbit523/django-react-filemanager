import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { authSignup } from "../store/actions/auth";
import Layout from "../containers/Layout";

const Signup = (props) => {
  const { error, loading } = props;
  const [user, setUser] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    props.signup(user.username, user.email, user.password1, user.password2);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="login-page">
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column className="login">
            <Header as="h2" color="teal" textAlign="center">
              Signup to your account
            </Header>
            {error && <p>{props.error.message}</p>}

            <React.Fragment>
              <Form size="large" onSubmit={handleSubmit}>
                <Segment stacked>
                  <Form.Input
                    onChange={handleChange}
                    value={user.username}
                    name="username"
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Username"
                  />
                  <Form.Input
                    onChange={handleChange}
                    value={user.email}
                    name="email"
                    fluid
                    icon="mail"
                    iconPosition="left"
                    placeholder="E-mail address"
                  />
                  <Form.Input
                    onChange={handleChange}
                    fluid
                    value={user.password1}
                    name="password1"
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                  />
                  <Form.Input
                    onChange={handleChange}
                    fluid
                    value={user.password2}
                    name="password2"
                    icon="lock"
                    iconPosition="left"
                    placeholder="Confirm password"
                    type="password"
                  />

                  <Button
                    color="teal"
                    fluid
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    Signup
                  </Button>
                </Segment>
              </Form>
              <Message>
                Already have an account? <NavLink to="/login">Login</NavLink>
              </Message>
            </React.Fragment>
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (username, email, password1, password2) =>
      dispatch(authSignup(username, email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
