import React from "react";
import { Route } from "react-router";
import Layout from "../containers/Layout";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default PublicRoute;
