import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useRef, useState } from "react";
import ProfileAction from "./ProfileAction";
import ProfileImage from "../post/ProfileImage";
import {
  getIfSomeoneLikeThisPhoto,
  getOnePhotoDetail,
} from "../../services/firebase";
import PhotoSlideComments from "../post/PhotoSlideComments";

const ProfilePhotoSlides = ({
  photos,
  nowPhotoidx,
  clickDiv,
  setNowPhotoidx,
  user,
}) => {
  const [photoDetail, setPhotoDetail] = useState(null);
  const [ifILikedThisPhoto, setIfILikedThisPhoto] = useState(null);
  const heartRef = useRef(null);
  const divSizeRef = useRef(null);
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

  useEffect(() => {
    if (photos[nowPhotoidx].docId !== undefined) {
      getIfSomeoneLikeThisPhoto(photos[nowPhotoidx].docId, user.userId).then(
        (res) => setIfILikedThisPhoto(res)
      );
    }
  }, [nowPhotoidx]);

  useEffect(() => {
    getOnePhotoDetail(photos[nowPhotoidx].docId).then((res) =>
      setPhotoDetail(res)
    );
  }, []);
  return (
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
              ref={divSizeRef}
              className="grid grid-cols-3 w-full h-auto max-w-screen-lg z-30 min-h-70/70"
              variants={modal}
              exit="hidden"
            >
              <div className="col-span-2">
                <ProfileImage
                  nowPhotoidx={nowPhotoidx}
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
                    <div className="flex justify-center">
                      <i className="fas fa-ellipsis-h text-black-faded mr-3"></i>
                      <i
                        className="fas fa-times text-black-faded cursor-pointer"
                        onClick={() => clickDiv.click()}
                      ></i>
                    </div>
                  </div>
                </div>
                <PhotoSlideComments
                  docId={photos[nowPhotoidx].docId}
                  comments={photoDetail.comments}
                  user={user}
                />
                <div className="border border-gray-postBorder pt-3 w-full">
                  <ProfileAction
                    docId={photos[nowPhotoidx].docId}
                    totlaLikes={photos[nowPhotoidx].likes.length}
                    likedPhoto={ifILikedThisPhoto}
                    heartRef={heartRef}
                    posted={photoDetail.dateCreated}
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
  );
};

export default ProfilePhotoSlides;
