import propTypes from "prop-types";
import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useDimensions } from "../../menu-animation/use-dimensions";
import { useEffect, useState } from "react";

const Image = ({ src, caption, heartRef, handleClick, docId }) => {
  const animation = useAnimation();
  const x = useMotionValue(0);
  const tickPath = useTransform(x, [-200, 0, 200], [1, 0, 1]);
  const fillOpacity = useTransform(x, [-200, 0, 200], [1, 1, 1]);
  const va = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };
  async function sequence() {
    await animation.start({ opacity: 1 });
    await animation.start({ scale: 1.5 });
    await animation.start({ scale: 1 });
    await animation.start({ scale: 1.5 });
    animation.start({ scale: 0.1 });
    await animation.start({ opacity: 0 });
    animation.start({ scale: 1 });
    heartRef.current.click();
  }
  useEffect(() => {}, []);
  return (
    <motion.div className="flex items-center justify-center">
      <motion.img
        variants={va}
        initial="hidden"
        animate="visible"
        onDoubleClick={sequence}
        src={src}
        alt={caption}
      />
      <motion.div
        className="absolute w-96 h-96 flex justify-center items-center"
        style={{ x }}
        // drag="x"
        // dragElastic={0.16}
        // dragConstraints={{ left: 0, right: 0 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="-10 -10 50 50"
        >
          <motion.path
            opacity="0"
            animate={animation}
            fill="red"
            d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

Image.propTypes = {
  src: propTypes.string.isRequired,
  caption: propTypes.string.isRequired,
  heartRef: propTypes.object,
  handleClick: propTypes.func,
  docId: propTypes.string,
};
export default Image;
