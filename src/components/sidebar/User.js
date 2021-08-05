import propTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import UserContext from "../../context/user";
import { useContext } from "react";
import { getUserProflieImg } from "../../services/firebase";
const User = ({ username, fullName }) => {
  const { user } = useContext(UserContext);
  const [imgimg, setImgImg] = useState("");
  const profileImg = async () => {
    const userProfile = await getUserProflieImg(user);
    setImgImg(userProfile);
  };

  useEffect(() => {
    profileImg();
  }, []);

  const postVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
  };
  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link
      to={`p/${username}`}
      className="grid grid-cols-4 gap-4 mb-6 items-center"
    >
      <motion.div
        className="flex items-center justify-between col-span-1"
        variants={postVariant}
        initial="initial"
        animate="animate"
      >
        <img
          id="userProfile"
          src={imgimg ? imgimg : "/images/user.png"}
          className="rounded-full w-16 flex mr-3"
          alt="12"
        />
      </motion.div>
      <motion.div
        className="col-span-3"
        variants={postVariant}
        initial="initial"
        animate="animate"
      >
        <span
          className="font-bold text-lg"
          style={{
            color: "black",
            border: "none",
          }}
        >
          {username}
        </span>
        <p className="text-sm">{fullName}</p>
      </motion.div>
    </Link>
  );
};

User.propTypes = {
  username: propTypes.string,
  fullName: propTypes.string,
};
export default memo(User);
User.whyDidYouRender = true;
// 컴퍼넌트가 React.memo()로 래핑 될 때, React는 컴퍼넌트를 렌더링하고 결과를 메모이징(Memoizing)한다.
// 그리고 다음 렌더링이 일어날 때 props가 같다면, React는 메모이징(Memoizing)된 내용을 재사용한다.
