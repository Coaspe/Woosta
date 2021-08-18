import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useRef, useState } from "react";
import ProfileAction from "./ProfileAction";
import ProfileImage from "../post/ProfileImage";
import {
  deletePhotos,
  getIfSomeoneLikeThisPhoto,
  getOnePhotoDetail,
} from "../../services/firebase";
import PhotoSlideComments from "../post/PhotoSlideComments";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useContext } from "react/cjs/react.development";
import UserContext from "../../context/user";

const ProfilePhotoSlides = ({
  photos,
  nowPhotoidx,
  clickDiv,
  setNowPhotoidx,
  user,
}) => {
  const [photoDetail, setPhotoDetail] = useState(null);
  const [ifILikedThisPhoto, setIfILikedThisPhoto] = useState(null);
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState(null);
  const { user: contextUser } = useContext(UserContext);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const iconRef = useRef(null);
  const heartRef = useRef(null);
  const backdrop = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };
  const modal = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  const handleDeletePhotos = async (docId) => {
    await deletePhotos(docId).then(() => window.location.reload());
  };
  useEffect(() => {
    if (photos[nowPhotoidx].docId !== undefined) {
      getIfSomeoneLikeThisPhoto(photos[nowPhotoidx].docId, user.userId).then(
        (res) => setIfILikedThisPhoto(res)
      );
    }
    getOnePhotoDetail(photos[nowPhotoidx].docId).then((res) => {
      setComments(res.comments);
      setPhotoDetail(res);
    });
  }, [nowPhotoidx]);
  console.log("photoDetail", photoDetail);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>Report Complete.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="top-0 left-0 w-full h-full fixed z-20 flex items-center justify-center bg-black-faded font-stix"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {ifILikedThisPhoto !== null && photoDetail !== null ? (
            <>
              <div
                className="rounded-full mr-4 w-7 h-7 flex items-center justify-center bg-opacity-30 cursor-pointer"
                onClick={() => {
                  nowPhotoidx === 0
                    ? setNowPhotoidx(photos.length - 1)
                    : setNowPhotoidx(nowPhotoidx - 1);
                }}
              >
                <i className="fas fa-chevron-left fa-lg"></i>
              </div>
              <motion.div
                className="grid grid-cols-3 w-full h-auto max-w-screen-lg z-30 min-h-70/70"
                variants={modal}
                exit="hidden"
              >
                <div className="col-span-2">
                  <ProfileImage
                    iconRef={iconRef}
                    detection={photoDetail.detection}
                    src={photos[nowPhotoidx].imageSrc}
                    alt={`${photos[nowPhotoidx].imageSrc}.jpg`}
                    heartRef={heartRef}
                  />
                </div>
                <div className="bg-white w-full flex flex-col items-center col-span-1 justify-between h-full">
                  <div className="px-3 py-3 flex items-center border border-gray-postBorder w-full">
                    <img
                      className="rounded-full w-10 h-10"
                      src={user.profileImg}
                      alt="profileSlide"
                    />
                    <div className="flex justify-between w-full pl-3 pr-1 items-center">
                      <span className="text-xm font-bold">{user.username}</span>
                      <div className="flex justify-center items-center">
                        <Dropdown>
                          <Dropdown.Toggle
                            className="bg-transparent border-none w-10 h-6"
                            variant="success"
                            id="dropdown-basic"
                          >
                            <i className="fas fa-ellipsis-h text-black-faded"></i>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="bg-white rounded-sm border">
                            {contextUser.displayName.toLowerCase() ===
                            user.username.toLowerCase() ? (
                              <>
                                <Dropdown.Item
                                  onClick={() => {
                                    handleDeletePhotos(
                                      photos[nowPhotoidx].docId
                                    );
                                  }}
                                >
                                  <i className="far fa-trash-alt mr-2"></i>
                                  <span className="text-xs">Delete</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href="#/action-2"
                                  className="w-full"
                                >
                                  <i className="far fa-edit mr-1.5"></i>
                                  <span className="text-xs">Edit</span>
                                </Dropdown.Item>
                              </>
                            ) : (
                              <>
                                <Dropdown.Item
                                  className=""
                                  onClick={handleShow}
                                >
                                  <i className="far fa-flag mr-1.5"></i>
                                  <span className="text-xs">Report</span>
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2">
                                  <i className="far fa-save mr-2"></i>
                                  <span className="text-xs">Save</span>
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                          <Dropdown.Toggle
                            className="bg-transparent border-none w-5 flex items-center justify-center pr-0 mr-0"
                            variant="success"
                            id="dropdown-basic"
                          >
                            <i
                              className="fas fa-times text-black-faded cursor-pointer"
                              onClick={() => clickDiv.click()}
                            ></i>
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <PhotoSlideComments
                    docId={photos[nowPhotoidx].docId}
                    comments={comments}
                    user={user}
                  />
                  <div className="border border-gray-postBorder pt-3 w-full">
                    <ProfileAction
                      iconRef={iconRef}
                      detection={photoDetail.detection}
                      docId={photos[nowPhotoidx].docId}
                      totlaLikes={photos[nowPhotoidx].likes.length}
                      likedPhoto={ifILikedThisPhoto}
                      heartRef={heartRef}
                      posted={photoDetail.dateCreated}
                      setComments={setComments}
                      comments={comments}
                    />
                  </div>
                </div>
              </motion.div>
              <div
                className="rounded-full ml-4 w-7 h-7 flex items-center justify-center bg-opacity-30 cursor-pointer"
                onClick={() => {
                  setNowPhotoidx((nowPhotoidx + 1) % photos.length);
                }}
              >
                <i className="fas fa-chevron-right fa-lg z-50"></i>
              </div>
            </>
          ) : (
            <>
              <img
                className="w-20 opacity-50"
                src="/images/loading.png"
                alt="loading..."
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ProfilePhotoSlides;
