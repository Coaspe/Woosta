import propTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  getUserProflieImgByUsername,
} from "../../services/firebase";
const Following = ({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
  setFollowingCount,
}) => {
  const [followed, setFollowed] = useState(true);
  const [profileImg, setProfileImg] = useState("");

  async function handleFollowUser() {
    setFollowed(false);

    // firebase: create 2 services (functions)
    // update the following array of the logged in user (in this case, my profile)
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, true);
    await updateFollowedUserFollowers(profileDocId, userId, true);
    // update the followers array of the user who has been followed
  }

  useEffect(() => {
    const userProfileImg = async () => {
      const img = await getUserProflieImgByUsername(username);
      setProfileImg(img);
    };
    userProfileImg();
  }, [username]);

  return followed ? (
    <div className="flex flex-row items-center align-items justify-between py-2">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 relative overflow-hidden rounded-full mr-2">
          <img
            className="rounded-fullinline w-10"
            src={profileImg ? profileImg : "/images/user.png"}
            alt="Suggestion"
          />
        </div>
        <Link to={`/p/${username}`}>
          <p className="font-bold">{username}</p>
        </Link>
      </div>
      <div>
        <button
          className="text-xs font-bold text-blue-medium"
          type="button"
          onClick={() => {
            handleFollowUser();
            setFollowingCount((followingCount) => followingCount - 1);
          }}
        >
          Unfollow
        </button>
      </div>
    </div>
  ) : null;
};

Following.propTypes = {
  profileDocId: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
  profileId: propTypes.string.isRequired,
  userId: propTypes.string.isRequired,
  loggedInUserDocId: propTypes.string.isRequired,
  setFollowingCount: propTypes.func.isRequired,
};
export default Following;
