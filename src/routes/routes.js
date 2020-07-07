import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Explorer from "../pages/Explorer";
import Home from "../pages/Home";

const routes = [
  {
    path: "/",
    exact: true,
    auth: false,
    component: Home,
  },
  {
    path: "/explorer",
    auth: true,
    component: Explorer,
  },
  {
    path: "/login",
    auth: false,
    component: Login,
  },
  {
    path: "/signup",
    auth: false,
    component: Signup,
  },
];

export default routes;
