import React from "react";
import { Route, Redirect } from "react-router";
import Layout from "../containers/Layout";

const PrivateRoute = ({ component: Component, props, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        props.isAuthenticated ? (
          <Layout {...props}>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
