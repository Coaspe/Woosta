import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import UserContext from "../../context/user";
import { useContext } from "react/cjs/react.development";
import Modal from "react-modal";
import { firebase, FieldValue } from "../../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { getImageOfComments } from "../../services/firebase";

const PhotoSlideComments = ({ docId, comments: allComments }) => {
  console.log(allComments);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [commentDetailArray, setCommentDetailArray] = useState(null);
  const { user } = useContext(UserContext);
  const [editOrDeleteComment, seteditOrDeleteComment] = useState("");
  const [comments, setComments] = useState(allComments);
  const [editOrDelete, setEditOrDelete] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const handleCommentDelete = async (displayName, comment) => {
    await firebase
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        comments: FieldValue.arrayRemove({
          comment: comment,
          displayName: displayName,
        }),
      });
  };

  const handleCommentEdit = async (displayName, comment, originalComment) => {
    handleCommentDelete(displayName, originalComment);
    await firebase
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({
          comment: comment,
          displayName: displayName,
        }),
      });
  };

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

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);
  useEffect(() => {
    getImageOfComments(allComments).then((res) => {
      setCommentDetailArray(res);
      console.log(res[0][0].username);
    });
  }, []);
  const commentVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
    },
  };

  const deleteEditVariant = {
    whileHover: {
      scale: 1.1,
    },
    whileTap: {
      scale: 0.9,
    },
  };
  return (
    <>
      <ul className="overflow-scroll">
        {commentDetailArray !== null
          ? comments.map((item) => (
              <AnimatePresence exitBeforeEnter>
                <motion.li
                  key={`${item.comment}-${item.displayName}`}
                  className="mb-4 flex justify-between items-center"
                  variants={commentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex items-center justify-center">
                    <Link to={`/p/${item.displayName}`}>
                      <img
                        className="rounded-full w-10 h-10 mr-3"
                        src={
                          commentDetailArray.find(
                            (el) =>
                              el[0].username.toLowerCase() ===
                              item.displayName.toLowerCase()
                          )[0].profileImg
                        }
                        alt="Comment"
                      />
                    </Link>
                    <span className="mr-1 font-bold text-sm">
                      {item.displayName}
                    </span>
                    <span className="text-sm">{item.comment}</span>
                  </div>
                  {item.displayName === user.displayName && (
                    <div>
                      <motion.button
                        className="text-red-primary text-xs mr-1"
                        variants={deleteEditVariant}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        onClick={() => {
                          setEditOrDelete("DELETE");
                          openModal();
                          seteditOrDeleteComment(item.comment);
                        }}
                      >
                        Delete
                      </motion.button>
                      <motion.button
                        className="text-xs opacity-50"
                        variants={deleteEditVariant}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        onClick={() => {
                          setEditOrDelete("EDIT");
                          openModal();
                          seteditOrDeleteComment(item.comment);
                        }}
                      >
                        Edit
                      </motion.button>
                    </div>
                  )}
                </motion.li>
              </AnimatePresence>
            ))
          : null}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {editOrDelete === "DELETE" ? (
          <div className="flex flex-col justify-center items-center font-stix">
            <span className="text-2xl mb-10">Delete Comment</span>
            <div className="flex w-full rounded-sm border border-gray-primary p-2">
              <span className="mr-3 font-bold text-xl">{user.displayName}</span>
              <span className="text-xl">{editOrDeleteComment}</span>
            </div>
            <div className="w-full flex items-center justify-center mt-10">
              <button
                className="mr-1 text-xs text-red-primary"
                onClick={() => {
                  handleCommentDelete(user.displayName, editOrDeleteComment);
                  setComments(
                    comments.filter(
                      (item) => item.comment !== editOrDeleteComment
                    )
                  );
                  closeModal();
                }}
              >
                Delete
              </button>
              <button
                className="text-xs"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancle
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <span className="text-2xl mb-10">Edit Comment</span>
            <div className="flex w-full justify-between rounded-sm border border-gray-primary p-2">
              <span className="mr-3 font-bold text-xl">{user.displayName}</span>
              <input
                type="text"
                placeholder={editOrDeleteComment}
                onChange={({ target }) => setEditCommentValue(target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-center mt-14">
              <button
                className="mr-1 text-xs text-red-primary"
                onClick={() => {
                  handleCommentEdit(
                    user.displayName,
                    editCommentValue,
                    editOrDeleteComment
                  );
                  let tmp = comments.filter(
                    (item) => item.comment !== editOrDeleteComment
                  );
                  tmp.push({
                    comment: editCommentValue,
                    displayName: user.displayName,
                  });
                  setComments(tmp);
                  closeModal();
                }}
              >
                Edit
              </button>
              <button
                className="text-xs"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancle
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PhotoSlideComments;

PhotoSlideComments.prototype = {
  docId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  commentInput: propTypes.object.isRequired,
};
