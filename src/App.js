import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import UserContext from "./context/user";
import useAuthListner from "./hooks/use-auth-listener";
import ProtectedRoute from "./helpers/Protected.route";
import IsUserLoggedIn from "./helpers/Is-user-logged-in";
import "./dfd.css";

// lazy code spliting
// Loadtest
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/Not-found"));
const Posting = lazy(() => import("./pages/Posting"));

const App = () => {
  const { user } = useAuthListner();

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        {/* lazy function need Suspense */}
        <Suspense
          fallback={
            <div className="w-screen h-screen flex items-center justify-center">
              <img
                className="w-14 opacity-50"
                src="/images/loading.png"
                alt="loading"
              />
            </div>
          }
        >
          <Switch>
            <IsUserLoggedIn
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              path={ROUTES.LOGIN}
            >
              <Login />
            </IsUserLoggedIn>
            <IsUserLoggedIn
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              path={ROUTES.SIGH_UP}
            >
              <Signup />
            </IsUserLoggedIn>
            <Route path={ROUTES.PROFILE} component={Profile} />
            <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
              <Dashboard />
            </ProtectedRoute>
            <ProtectedRoute user={user} path={ROUTES.POSTING} exact>
              <Posting />
            </ProtectedRoute>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
};

// react-loading-skeleton
// firebase
// date-fns
export default App;
