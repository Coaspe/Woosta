import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTE from "../constants/routes";
import Carousel from "react-bootstrap/Carousel";

const Login = () => {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTE.DASHBOARD);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };
  useEffect(() => {
    document.title = "Login - Woosta";
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous"
      />
      <div className="flex w-3/5">
        {/* <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with instagram"
        /> */}
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/users/raphael/1.JPG"
              alt="First slide"
            />
            {/* <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/users/raphael/2.JPG"
              alt="Second slide"
            />
            {/* <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/users/raphael/3.JPG"
              alt="Third slide"
            />
            {/* <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption> */}
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="flex flex-col w-2/6 ml-32">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="woosta"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
          <form
            onSubmit={handleLogin}
            method="POST"
            className="flex flex-col w-11/12 items-center justify-center "
          >
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email Address"
              className="text-sm text-gray-base w-11/12 py-4 px-2 h-2
            border border-gray-primary rounded mb-2"
              autoComplete="username"
              onChange={({ target }) => {
                setEmailAddress(target.value);
              }}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-11/12 py-4 px-2 h-2
            border border-gray-primary rounded mb-2"
              autoComplete="current-password"
              onChange={({ target }) => setPassword(target.value)}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-11/12 rounded h-8 font-bold
              ${isInvalid && "opacity-50"}`}
            >
              Log In
            </button>
          </form>
          <div className="flex flex-col items-center">
            <p className="mt-3 text-sm text-gray-postBorder">OR</p>
            <p className="mb-3 text-blue-facebook font-bold">
              Log in with Facebook
            </p>
            <p className="text-xs mb-0 text-blue-facebook">Forgot password?</p>
          </div>
        </div>
        <div
          className="flex justify-center items-center flex-col w-full bg-white p-3 rounded border
      border-gray-primary"
        >
          <span className="text-sm">
            Don't have an account? {` `}
            <Link to="/signup" className="font-bold text-blue-medium">
              Sign up
            </Link>
          </span>
        </div>
        <div>
          <div className="flex flex-col items-center">
            <p className="mt-3 mb-3 text-sm">Get the app.</p>
          </div>
          <div className="flex justify-center">
            <img
              className="w-1/3 mr-2"
              src="/images/Apple.png"
              alt="App Store"
            />
            <img className="w-1/3" src="/images/Google.png" alt="Google Play" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
