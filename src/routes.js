import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Drive } from "./pages/Drive";
import { Home } from "./pages/Home";

export const PublicRoute = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);

export const PrivateRoute = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" render={() => <Redirect to="/drive" />} />
    <Route path="/signup" render={() => <Redirect to="/drive" />} />
    <Route path="/drive" component={Drive} />
  </Switch>
);
