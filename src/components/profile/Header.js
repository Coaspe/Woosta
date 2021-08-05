import propTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import useUser from "../../hooks/use-user";
import {
  isUserFollowingProfile,
  toggleFollow,
  getUserProflieImgByUsername,
} from "../../services/firebase";
import UserContext from "../../context/user";
import Modal from "react-modal";
import Button from "react-bootstrap/Button";

const Header = ({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers = [],
    following = [],
    username: profileUsername,
  },
  followerCount,
  setFollowerCount,
}) => {
  const { user: contextUser } = useContext(UserContext);
  const { user } = useUser(contextUser.uid);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [imgimg, setImgImg] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  console.log(profileUsername);

  useEffect(() => {
    const profileImg = async () => {
      const userProfile = await getUserProflieImgByUsername(profileUsername);
      setImgImg(userProfile);
    };
    if (profileUsername !== undefined) {
      profileImg();
    }
  }, [profileUsername]);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };
  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };
    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        Profile Image Update
      </Modal>
      <div className="container flex justify-center">
        {user?.username && (
          <img
            className="object-fit rounded-full h-40 flex cursor-pointer"
            alt={`${profileUsername} profile pciture`}
            src={imgimg ? imgimg : "/images/user.png"}
            onClick={() => {
              openModal();
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={() => handleToggleFollow()}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleToggleFollow();
                }
              }}
            >
              {isFollowingProfile ? "Unfollow" : "Follow"}
            </button>
          )}
          <Button variant="outline-secondary" className="text-sm font-bold">
            Edit Profile
          </Button>
          <i className="fas fa-cog fa-lg ml-3"></i>
        </div>
        <div className="container flex mt-4">
          {followers === undefined || following === undefined ? (
            <Skeleton conut={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span>
                <span> photos</span>
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>
                {` `}
                {followerCount === 1 ? "follower" : "followers"}
              </p>
              <p className="mr-10">
                <span className="font-bold">{following.length}</span>
                <span> following</span>
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  photosCount: propTypes.number.isRequired,
  profile: propTypes.shape({
    docId: propTypes.string,
    userId: propTypes.string,
    fullName: propTypes.string,
    username: propTypes.string,
    following: propTypes.array,
    followers: propTypes.array,
  }),
  followerCount: propTypes.number.isRequired,
  setFollowerCount: propTypes.func.isRequired,
};
export default Header;
