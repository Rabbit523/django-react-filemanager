import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Explorer } from "./pages/Explorer";
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
    <Route path="/login" render={() => <Redirect to="/explorer" />} />
    <Route path="/signup" render={() => <Redirect to="/explorer" />} />
    <Route path="/explorer" component={Explorer} />
  </Switch>
);
