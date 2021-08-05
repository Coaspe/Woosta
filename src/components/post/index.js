import { useRef } from "react";
import propTypes from "prop-types";
import Header from "./Header";
import Image from "./Image";
import Actions from "./Actions";
import Footer from "./Footer";
import Comments from "./Comments";
import { motion } from "framer-motion";

const Post = ({ content }) => {
  const divRef = useRef(null);
  const commentInput = useRef(null);
  const heartRef = useRef(null);
  const handleFocus = () => commentInput.current.focus();
  const handleClick = () => heartRef.current.click();
  //components
  // -> header, image, actions (like & comment icons), footer, comments
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
  return (
    <motion.div
      className="rounded col-span-4 border bg-white border-gray-primary mb-12 font-stix"
      variants={postVariant}
      initial="initial"
      animate="animate"
      ref={divRef}
    >
      <Header
        username={content.username}
        reference={divRef}
        docId={content.docId}
      />
      <Image
        docId={content.docId}
        src={content.imageSrc}
        caption={content.caption}
        heartRef={heartRef}
        handleClick={handleClick}
      />
      <Actions
        docId={content.docId}
        totlaLikes={content.likes.length}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
        heartRef={heartRef}
      />
      <Footer caption={content.caption} username={content.username} />
      <Comments
        docId={content.docId}
        comments={content.comments}
        posted={content.dateCreated}
        commentInput={commentInput}
      />
    </motion.div>
  );
};

Post.prototype = {
  content: propTypes.shape({
    username: propTypes.string.isRequired,
    imageSrc: propTypes.string.isRequired,
    caption: propTypes.string.isRequired,
    docId: propTypes.string.isRequired,
    userLikedPhoto: propTypes.bool.isRequired,
    likes: propTypes.array.isRequired,
    comments: propTypes.array.isRequired,
    dateCreated: propTypes.number.isRequired,
  }),
  photos: propTypes.object,
};

export default Post;
