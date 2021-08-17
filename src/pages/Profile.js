import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getUserByUsername } from "../services/firebase";
import * as ROUTES from "../constants/routes";
import Header from "../components/Header";
import UserProfile from "../components/profile";
import Posting from "./Posting";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [modal, setModal] = useState(false);
  const divRef = useRef(null);
  useEffect(() => {
    async function checkUserExists() {
      const user = await getUserByUsername(username);
      if (user.length > 0) {
        setUser(user[0]);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }
    checkUserExists();
  }, [username, history]);

  return user?.username ? (
    <div className="bg-gray-background font-stix">
      <Header setModal={setModal} divRef={divRef} />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
      {modal ? <Posting setModal={setModal} divRef={divRef} /> : null}
    </div>
  ) : null;
};

export default Profile;
