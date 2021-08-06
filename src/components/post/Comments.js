import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import AddComments from "./Add-comment";
import UserContext from "../../context/user";
import { useContext } from "react/cjs/react.development";
import Modal from "react-modal";
import { firebase, FieldValue } from "../../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";

const Comments = ({ docId, comments: allComments, posted, commentInput }) => {
  const [editCommentValue, setEditCommentValue] = useState("");
  const { user } = useContext(UserContext);
  const [editOrDeleteComment, seteditOrDeleteComment] = useState("");
  const [comments, setComments] = useState(allComments);
  const [commentExpanded, setCommentExpanded] = useState(false);
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
      <div className="p-4 pt-1 pb-4 font-stix">
        {!commentExpanded ? null : (
          <p
            className="text-sm text-gray-base mb-1 cursor-pointer"
            onClick={() => {
              setCommentExpanded(!commentExpanded);
            }}
          >
            Fold all comments
          </p>
        )}
        {comments.length >= 3 && !commentExpanded && (
          <p
            className="text-sm text-gray-base mb-1 cursor-pointer"
            onClick={() => setCommentExpanded(!commentExpanded)}
          >
            View all {comments.length} comments
          </p>
        )}
        {!commentExpanded
          ? comments.slice(0, 3).map((item) => (
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={`${item.comment}-${item.displayName}`}
                  className="mb-1 flex justify-between"
                  variants={commentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div>
                    <Link to={`/p/${item.displayName}`}>
                      <span className="mr-1 font-bold">{item.displayName}</span>
                    </Link>
                    <span>{item.comment}</span>
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
                </motion.div>
              </AnimatePresence>
            ))
          : comments.map((item) => (
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={`${item.comment}-${item.displayName}`}
                  className="mb-1 flex justify-between"
                  variants={commentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div>
                    <Link to={`/p/${item.displayName}`}>
                      <span className="mr-1 font-bold">{item.displayName}</span>
                    </Link>
                    <span>{item.comment}</span>
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
                </motion.div>
              </AnimatePresence>
            ))}

        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComments
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
        setCommentExpanded={setCommentExpanded}
      />
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

export default Comments;

Comments.prototype = {
  docId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  posted: propTypes.number.isRequired,
  commentInput: propTypes.object.isRequired,
};
