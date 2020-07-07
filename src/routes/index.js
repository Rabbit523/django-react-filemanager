import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Hoc from "../hoc/hoc";
import PublicRoute from "./public";
import PrivateRoute from "./private";
import routes from "./routes";

const BaseRouter = (props) => (
  <Hoc>
    <Router>
      <Switch>
        {routes.map((route, i) => {
          if (route.auth) {
            return <PrivateRoute key={i} {...route} props={props} />;
          } else {
            return <PublicRoute key={i} {...route} />;
          }
        })}
      </Switch>
    </Router>
  </Hoc>
);

export default BaseRouter;
