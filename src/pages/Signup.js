import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTE from "../constants/routes";
import { doesUsernameExist } from "../services/firebase";

const Signup = () => {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleLogin = async (event) => {
    event.preventDefault();
    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        // authentication
        // -> emailAddress & password & username
        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        await firebase.firestore().collection("users").add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          followers: [],
          dateCreated: Date.now(),
          profileImg: "",
          profileCaption: "",
        });
        history.push(ROUTE.DASHBOARD);
      } catch (error) {
        setFullName("");
        setEmailAddress("");
        setUsername("");
        setPassword("");
      }
    } else {
      setError("That username is already taken, please try another.");
    }
  };
  useEffect(() => {
    document.title = "Sinup - Woosta";
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen font-stix">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with instagram"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="woosta"
              className="mt-2 w-6/12 mb-2"
            />
          </h1>
          <p className="mb-2 font-stix text-center text-lg text-gray-base font-bold">
            Sign up to see photos and videos from your friends.
          </p>
          <button className="mb-4 bg-blue-signupBtn w-full rounded-md py-1 text-white text-sm flex justify-center items-center">
            <img
              className="w-5 mr-0.5"
              src="/images/facebookWhite.png"
              alt="facebook icon"
            />
            Log in with facebook
          </button>
          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
          <form onSubmit={handleLogin} method="POST">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-base w-full mr-3 py-3 px-3 h-2
            border border-gray-primary rounded mb-2"
              onChange={({ target }) => {
                setUsername(target.value);
              }}
              value={username}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full Name"
              className="text-sm text-gray-base w-full mr-3 py-3 px-3 h-2
            border border-gray-primary rounded mb-2"
              onChange={({ target }) => {
                setFullName(target.value);
              }}
              value={fullName}
            />
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email Address"
              className="text-sm text-gray-base w-full mr-3 py-3 px-3 h-2
            border border-gray-primary rounded mb-2"
              autoComplete="username"
              onChange={({ target }) => {
                setEmailAddress(target.value);
              }}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-3 px-3 h-2
            border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 mt-2 
              ${isInvalid && "opacity-50"}`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div
          className="flex justify-center items-center flex-col w-full bg-white p-3 rounded border
      border-gray-primary"
        >
          <p className="text-sm">
            Have an account? {` `}
            <Link to={ROUTE.LOGIN} className="text-blue-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
