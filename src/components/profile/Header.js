import propTypes from "prop-types";
import { useState, useEffect, useContext, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import useUser from "../../hooks/use-user";
import {
  isUserFollowingProfile,
  toggleFollow,
  getUserProflieImgByUsername,
  getUserByUsername,
} from "../../services/firebase";
import UserContext from "../../context/user";
import FirebaseContext from "../../context/firebase";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { motion } from "framer-motion";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

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
  const useStyles = makeStyles({
    root: {
      fontSize: "2rem",
      fontFamily: "STIX Two Text",
    },
  });
  const classes = useStyles();
  const [editCaption, setEditCaption] = useState("");
  const { user: contextUser } = useContext(UserContext);
  const { user } = useUser(contextUser.uid);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [imgimg, setImgImg] = useState("");
  const [caption, setCaption] = useState("");
  const [previewURL, setPriviewURL] = useState("/images/gallery.png");
  const [file, setFile] = useState("");
  const imageValue = useRef(null);
  const { firebase, storageRef } = useContext(FirebaseContext);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditClose = () => setShowEdit(false);
  const handleEditShow = () => setShowEdit(true);

  const [showImage, setShowImage] = useState(false);
  const handleImageClose = () => setShowImage(false);
  const handleImageShow = () => setShowImage(true);

  const [showFollowing, setShowFollowing] = useState(false);
  const handleFollowingClose = () => setShowFollowing(false);
  const handleFollowingShow = () => setShowFollowing(true);

  useEffect(() => {
    const profileImg = async () => {
      const userProfile = await getUserProflieImgByUsername(profileUsername);
      setImgImg(userProfile);
    };
    const getProfileCaption = async () => {
      const [{ profileCaption }] = await getUserByUsername(profileUsername);
      setCaption(profileCaption);
    };
    if (profileUsername !== undefined) {
      profileImg();
      getProfileCaption();
    }
  }, [profileUsername]);

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
  const handleFileOnChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setPriviewURL(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleCaptionChange = async (event) => {
    event.preventDefault();
    await firebase.firestore().collection("users").doc(profileDocId).update({
      profileCaption: editCaption,
    });
  };
  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg font-stix">
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="font-stix">Profile Image</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <motion.div className="container col-span-2 flex flex-col items-center font-stix">
            <motion.img
              className="w-1/2 rounded-md"
              src={previewURL}
              key={previewURL}
              alt="Soon Posted"
            />
          </motion.div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-center items-center w-full mt-0 font-stix">
            <label
              className="pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-blue-medium rounded-md text-white cursor-pointer"
              for="input-file"
            >
              Find
            </label>
            <form ref={imageValue}>
              <input
                type="file"
                id="input-file"
                label="image"
                name="image"
                style={{ display: "none" }}
                onChange={(event) => {
                  handleFileOnChange(event);
                }}
              />
            </form>
            <button
              className={`pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center ${
                previewURL !== "/images/gallery.png"
                  ? "bg-blue-medium"
                  : "bg-gray-base"
              } rounded-md text-white cursor-pointer`}
              disabled={
                previewURL === "/images/gallery.png" || undefined ? true : false
              }
              onClick={async () => {
                await storageRef
                  .child(`${contextUser.email}/${file}`)
                  .put(file);

                const imageAccessToken = await storageRef
                  .child(`${contextUser.email}/${file}`)
                  .getDownloadURL();

                await firebase
                  .firestore()
                  .collection("users")
                  .doc(profileDocId)
                  .update({
                    profileImg: imageAccessToken,
                  });

                handleClose();
                window.location.reload();
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="font-stix">Profile Caption</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="font-stix">{caption}</p>
          <form noValidate autoComplete="off" onSubmit={handleCaptionChange}>
            <Input
              id="newCaption"
              className={classes.root}
              placeholder="New Caption"
              inputProps={{ "aria-label": "description" }}
              onChange={(e) => {
                setEditCaption(e.target.value);
              }}
            />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleEditClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleEditClose();
                  setCaption(editCaption);
                }}
                type="submit"
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showImage}
        onHide={handleImageClose}
        centered
        dialogClassName="modal-50w"
      >
        <img src={imgimg} alt="Wide" className="rounded" />
      </Modal>

      <Modal
        show={showFollowing}
        onHide={handleFollowingClose}
        centered
        dialogClassName="modal-50w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="font-stix">Following</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="font-stix">Following</p>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFollowingClose}>
              Close
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <div className="container flex justify-center">
        {user?.username && (
          <img
            className="object-fit rounded-full h-40 flex cursor-pointer"
            alt={`${profileUsername} profile pciture`}
            src={imgimg ? imgimg : "/images/user.png"}
            onClick={() => {
              handleImageShow();
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow ? (
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
          ) : (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  className="bg-transparent border-none"
                  variant="success"
                  id="dropdown-basic"
                >
                  <Button
                    variant="outline-secondary"
                    className="text-sm font-bold"
                  >
                    Edit Profile
                  </Button>
                </Dropdown.Toggle>

                <Dropdown.Menu className="bg-white rounded-sm border">
                  <>
                    <Dropdown.Item
                      onClick={() => {
                        handleShow();
                      }}
                    >
                      <i class="far fa-user-circle mr-2"></i>
                      <span className="text-xs">Profile Image</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        handleEditShow();
                      }}
                    >
                      <i className="far fa-edit mr-1.5"></i>
                      <span className="text-xs">Caption</span>
                    </Dropdown.Item>
                  </>
                </Dropdown.Menu>
              </Dropdown>
              <i className="fas fa-cog fa-lg"></i>
            </>
          )}
        </div>
        <div className="container flex mt-4">
          {followers === undefined || following === undefined ? (
            <Skeleton conut={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10 ">
                <span className="font-bold">{photosCount}</span>
                <span> photos</span>
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount ?? 0}</span>
                {` `}
                {followerCount === 1 ? "follower" : "followers"}
              </p>
              <p className="mr-10 cursor-pointer" onClick={handleFollowingShow}>
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
          <p>{caption}</p>
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
