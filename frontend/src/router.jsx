import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App><Home /></App>,
  },
  {
    path: "/result",
    element: <App><Result /></App>,
  },
  {
    path: "/login",
    element: <App><Login /></App>,
  },
  {
    path: "/register",
    element: <App><Register /></App>,
  },
  {
    path: "/dashboard",
    element: <App><Dashboard /></App>,
  },
]);

export default router;