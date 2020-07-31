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
import { authLogin } from "../store/actions/auth";
import Layout from "../containers/Layout";

const Login = (props) => {
  const { error, loading } = props;
  const [user, setUser] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.login(user.username, user.password);
  };

  return (
    <Layout>
      <div className="login-page">
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column className="login">
            <Header as="h2" color="teal" textAlign="center">
              Log-in to your account
            </Header>
            {error && <p>{error.message}</p>}

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
                    fluid
                    value={user.password}
                    name="password"
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                  />

                  <Button
                    color="teal"
                    fluid
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    Login
                  </Button>
                </Segment>
              </Form>
              <Message>
                New to us? <NavLink to="/signup">Sign Up</NavLink>
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
    login: (username, password) => dispatch(authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
