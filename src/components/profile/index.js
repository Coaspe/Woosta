import { useReducer, useEffect } from "react";
import propTypes from "prop-types";
import Header from "./Header";
import { getUserPhotosByUsername } from "../../services/firebase";
import Photos from "./Photos";

const UserProfile = ({ user }) => {
  const reducer = (state, newState) => ({ ...state, ...newState });
  const initialState = {
    profile: {},
    photosCollection: [],
    followerCount: 0,
  };
  // object 같이 복잡한 자료형을 변수로 이용할 때 useState가 아닌 useReducer을 사용함
  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function getProfileInfoAndPhtos() {
      const photos = await getUserPhotosByUsername(user.username);
      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers?.length,
      });
    }
    getProfileInfoAndPhtos();
  }, [user.username]);

  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      <Photos photos={photosCollection} user={user} />
    </>
  );
};

UserProfile.propTypes = {
  user: propTypes.shape({
    dateCreated: propTypes.number,
    emailAddress: propTypes.string,
    followers: propTypes.array,
    following: propTypes.array,
    fullName: propTypes.string,
    userId: propTypes.string,
    username: propTypes.string,
  }).isRequired,
};

export default UserProfile;
