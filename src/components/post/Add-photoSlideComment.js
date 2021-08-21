import { useState, useContext } from "react";
import propTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
const AddPhotoSlideComment = ({ docId, comments, setComments }) => {
  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const {
    user: { displayName },
  } = useContext(UserContext);
  const handleSubmitComment = (event) => {
    setComments([...comments, { displayName, comment }]);
    setComment("");

    return firebase
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({ displayName, comment }),
      });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          arai-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-3 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment ..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${
            !comment && "opacity-25"
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={() => {
            handleSubmitComment();
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};
export default AddPhotoSlideComment;

AddPhotoSlideComment.propTypes = {
  docId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  setComments: propTypes.func.isRequired,
  commentInput: propTypes.object,
  setCommentExpanded: propTypes.func,
};
