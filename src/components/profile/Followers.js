import propTypes from "prop-types";
import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  getUserProflieImgByUsername,
} from "../../services/firebase";
const Followers = ({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
  profileCaption,
  setFollowingCount,
  IFollow,
}) => {
  const [profileImg, setProfileImg] = useState("");
  const [followState, setFollowState] = useState(IFollow);
  async function handleFollowUser() {
    // firebase: create 2 services (functions)
    // update the following array of the logged in user (in this case, my profile)
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, IFollow);
    await updateFollowedUserFollowers(profileDocId, userId, IFollow);
    // update the followers array of the user who has been followed
    setFollowState(!followState);
  }

  useEffect(() => {
    const userProfileImg = async () => {
      const img = await getUserProflieImgByUsername(username);
      setProfileImg(img);
    };
    userProfileImg();
  }, [username]);

  return (
    <div className="flex flex-row items-center align-items justify-between py-2 pl-2 pr-5 font-stix">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 relative overflow-hidden rounded-full mr-2">
          <img
            className="rounded-fullinline w-10"
            src={profileImg ? profileImg : "/images/user.png"}
            alt="Suggestion"
          />
        </div>
        <Link to={`/p/${username}`}>
          <p className="font-bold text-lg">{username}</p>
        </Link>
        <p className="ml-3 opacity-50">{profileCaption}</p>
      </div>
      <div>
        <button
          className="text-xs font-bold text-blue-medium"
          type="button"
          onClick={() => {
            handleFollowUser();
            if (followState !== true) {
              setFollowingCount((count) => count + 1);
            } else {
              setFollowingCount((count) => count - 1);
            }
          }}
        >
          {followState ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
};
Followers.propTypes = {
  profileDocId: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
  profileId: propTypes.string.isRequired,
  userId: propTypes.string.isRequired,
  loggedInUserDocId: propTypes.string.isRequired,
  setFollowingCount: propTypes.func.isRequired,
  profileCaption: propTypes.string,
  IFollow: propTypes.bool.isRequired,
};
export default memo(Followers);
