import { useState, useContext, memo } from "react";
import propTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const Actions = ({
  docId,
  totlaLikes,
  likedPhoto,
  handleFocus,
  heartRef,
  iconRef,
  detection,
}) => {
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totlaLikes);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const animation = useAnimation();
  const handleToggleLiked = async () => {
    // true -> false, false -> true
    setToggleLiked((toggleLiked) => !toggleLiked);

    await firebase
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });

    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
  };
  async function seq() {
    await animation.start({ scale: 1.1 });
    await animation.start({ scale: 0.9 });
    animation.start({ scale: 1 });
  }
  const svgVariant = {
    whileHover: {
      scale: 1.2,
    },
    whileTap: {
      scale: 0.9,
    },
  };
  useEffect(() => {
    setToggleLiked(likedPhoto);
  }, [likedPhoto]);
  return (
    <>
      {toggleLiked !== null ? (
        <>
          <div className="flex justify-between px-4 py-2">
            <div className="flex items-center">
              <div
                ref={heartRef}
                onClick={() => {
                  seq();
                  handleToggleLiked();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
              >
                <motion.svg
                  id={docId}
                  variants={svgVariant}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  animate={animation}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  tabIndex={0}
                  className={`w-8 mr-4 select-none cursor-pointer ${
                    toggleLiked
                      ? "fill-red text-red-primary"
                      : "text-black-light"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </motion.svg>
              </div>
              <motion.svg
                variants={svgVariant}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={handleFocus}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleFocus();
                  }
                }}
                className="w-8 text-black-light select-none cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                tabIndex={0}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </motion.svg>
              <motion.img
                variants={svgVariant}
                whileHover="whileHover"
                whileTap="whileTap"
                src="/images/ai.png"
                alt="ai"
                className={`w-6 h-6 cursor-pointer ml-4 ${
                  detection === undefined ? "hidden" : null
                }`}
                onClick={() => {
                  iconRef.current.click();
                }}
              />
            </div>
          </div>
          <div className="p-4 py-0">
            <p className="font-bold">
              {likes === 1 ? `${likes} likes` : `${likes} likes`}
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-between px-4 py-2">
          <Skeleton count={1} width={200} height={100} />
        </div>
      )}
    </>
  );
};

Actions.propTypes = {
  docId: propTypes.string.isRequired,
  totlaLikes: propTypes.number.isRequired,
  likedPhoto: propTypes.bool.isRequired,
  handleFocus: propTypes.func.isRequired,
  heartRef: propTypes.object,
};

export default memo(Actions);
