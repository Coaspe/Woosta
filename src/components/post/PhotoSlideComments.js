import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import UserContext from "../../context/user";
import { useContext } from "react/cjs/react.development";
import { firebase, FieldValue } from "../../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { getImageOfComments } from "../../services/firebase";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const PhotoSlideComments = ({
  docId,
  comments: allComments,
  user: contextUser,
}) => {
  const [editCommentValue, setEditCommentValue] = useState("");
  const [commentDetailArray, setCommentDetailArray] = useState(null);
  const { user } = useContext(UserContext);
  const [editOrDeleteComment, seteditOrDeleteComment] = useState("");
  const [comments, setComments] = useState(allComments);
  const [editOrDelete, setEditOrDelete] = useState("");

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

  useEffect(() => {
    getImageOfComments(allComments).then((res) => {
      setCommentDetailArray(res);
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
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal className="font-stix" show={show} onHide={handleClose} centered>
        {editOrDelete === "DELETE" ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Delete Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span className="mr-3 font-bold text-xl">{user.displayName}</span>
              <span className="text-xl">{editOrDeleteComment}</span>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  handleCommentDelete(user.displayName, editOrDeleteComment);
                  setComments(
                    comments.filter(
                      (item) => item.comment !== editOrDeleteComment
                    )
                  );
                  handleClose();
                }}
              >
                Confirm
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Edit Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span className="mr-3 font-bold text-xl">{user.displayName}</span>
              <input
                type="text"
                placeholder={editOrDeleteComment}
                onChange={({ target }) => setEditCommentValue(target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
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
                  handleClose();
                }}
              >
                Confirm
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <div className="font-stix overflow-y-scroll h-full w-full px-3 mt-3">
        <ul className="">
          {commentDetailArray !== null
            ? comments.map((item) => (
                <AnimatePresence exitBeforeEnter>
                  <motion.li
                    key={`${item.comment}-${item.displayName}`}
                    className="mb-4 flex justify-between items-center group"
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
                            )[0].profileImg || "/images/user.png"
                          }
                          alt="Comment"
                        />
                      </Link>
                      <span className="mr-1 font-bold text-sm">
                        {item.displayName}
                      </span>
                      <span className="text-sm">{item.comment}</span>
                    </div>
                    <div>
                      <Dropdown>
                        <Dropdown.Toggle
                          className="bg-transparent border-none w-10"
                          variant="success"
                          id="dropdown-basic"
                        >
                          <i className="fas fa-ellipsis-h text-black-faded opacity-0 group-hover:opacity-100"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="bg-white rounded-sm border">
                          {contextUser.username.toLowerCase() ===
                          item.displayName.toLowerCase() ? (
                            <>
                              <Dropdown.Item
                                className=""
                                onClick={() => {
                                  setEditOrDelete("DELETE");
                                  handleShow();
                                  seteditOrDeleteComment(item.comment);
                                }}
                              >
                                <i className="far fa-trash-alt mr-2"></i>
                                <span className="text-xs">Delete</span>
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="w-full"
                                onClick={() => {
                                  setEditOrDelete("EDIT");
                                  handleShow();
                                  seteditOrDeleteComment(item.comment);
                                }}
                              >
                                <i className="far fa-edit mr-1.5"></i>
                                <span className="text-xs">Edit</span>
                              </Dropdown.Item>
                            </>
                          ) : (
                            <>
                              <Dropdown.Item className="">
                                <i className="far fa-flag mr-1.5"></i>
                                <span className="text-xs">Report</span>
                              </Dropdown.Item>
                            </>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </motion.li>
                </AnimatePresence>
              ))
            : null}
        </ul>
      </div>
    </>
  );
};

export default PhotoSlideComments;

PhotoSlideComments.prototype = {
  docId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  commentInput: propTypes.object.isRequired,
};
