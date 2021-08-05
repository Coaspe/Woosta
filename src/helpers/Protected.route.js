import propType from "prop-types";
import { Route, Redirect } from "react-router";
import * as ROUTES from "../constants/routes";

const ProtectedRoute = ({ user, children, ...rest }) => {
  console.log("children", children);
  // children -> Dashboard ect...
  // ...rest -> path, exact ect...
  // user -> useContext(UserContext)
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (user) {
          return children;
        }
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: ROUTES.LOGIN,
                state: { from: location },
              }}
            />
          );
        }
        return null;
      }}
    />
  );
};

ProtectedRoute.propType = {
  user: propType.object,
  children: propType.object.isRequired,
};

export default ProtectedRoute;
