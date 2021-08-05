// photo info
// Delete or Edit
import propType from "prop-types";
import { useContext } from "react";
import UserContext from "../../context/user";
const EditOrDeleteComment = (comment, check) => {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-black-faded w-full h-full flex items-center jutify-center">
      {check === true ? (
        <div>
          <div className="flex items-center justify-center">
            <span>Delete Comment</span>
            <p>{user.displayName}</p>
            <p>{comment}</p>
            <button className="mr-2" onClick={() => {}}>
              Comfirm
            </button>
            <button>Cancle</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-center">
            <p>{user.displayName}</p>
            <input type="text" />
            <button className="mr-2" onClick={() => {}}>
              Comfirm
            </button>
            <button>Cancle</button>
          </div>
        </div>
      )}
    </div>
  );
};

EditOrDeleteComment.prototype = {
  comment: propType.string.isRequired,
};

export default EditOrDeleteComment;
