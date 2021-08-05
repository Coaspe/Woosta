import propType from "prop-types";
import { Route, Redirect } from "react-router";

const IsUserLoggedIn = ({ user, loggedInPath, children, ...rest }) => {
  return (
    <Route
      {...rest}
      // render vs component -> Route 할 때 props를 넘겨주고 싶다면 render를 사용한다.
      // render methods will be passed the same three route props -> match, loaction, history
      // match -> A match object contains information about how a <Route path> matched the URL. match objects contain the following properties:
      // params - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
      // isExact - (boolean) true if the entire URL was matched (no trailing characters)
      // path - (string) The path pattern used to match. Useful for building nested <Route>s
      // url - (string) The matched portion of the URL. Useful for building nested <Link>s
      // locstion -> Locations represent where the app is now, where you want it to go, or even where it was.
      render={({ location }) => {
        if (!user) {
          return children;
        }
        if (user) {
          return (
            <Redirect
              to={{
                pathname: loggedInPath,
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

IsUserLoggedIn.propType = {
  user: propType.object,
  loggedInPath: propType.string.isRequired,
  children: propType.object.isRequired,
};

export default IsUserLoggedIn;
