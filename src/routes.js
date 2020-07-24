import React from "react";
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Drive } from "./pages/Drive";
import { Directory } from "./pages/Directory";
import { Home } from "./pages/Home";

export const PublicRoute = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

export const PrivateRoute = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" render={() => <Redirect to="/drive" />} />
      <Route path="/signup" render={() => <Redirect to="/drive" />} />
      <Route exact path="/drive" component={Drive} />
      <Route path="/drive/:name" component={Directory} />
    </Switch>
  </Router>
);
