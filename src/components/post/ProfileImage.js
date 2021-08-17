import propTypes from "prop-types";
import * as React from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useEffect } from "react";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useState } from "react";
import DetectionOverlay from "./DetectionOverlay";
const ProfileImage = ({ nowPhotoidx, src, caption, heartRef, detection }) => {
  const animation = useAnimation();
  const imgAnimation = useAnimation();

  const x = useMotionValue(0);
  const va = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  async function sequence() {
    imgAnimation.start({ opacity: 0.6 });
    await animation.start({ opacity: 1 });
    await animation.start({ scale: 1.5 });
    await animation.start({ scale: 1 });
    await animation.start({ scale: 1.5 });
    animation.start({ scale: 0.1 });
    animation.start({ opacity: 0 });
    imgAnimation.start({ opacity: 1 });
    animation.start({ scale: 1 });

    heartRef.current.click();
  }
  console.log(detection);
  const [show, setShow] = useState(false);
  return (
    <motion.div
      className="flex items-center justify-center h-full bg-opacity-50 bg-gray-background"
      variants={va}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        {detection !== undefined
          ? detection.map((item) => (
              <DetectionOverlay item={item} show={show} />
            ))
          : null}
        <motion.img
          id="img"
          animate={imgAnimation}
          onDoubleClick={() => {
            sequence();
          }}
          src={src}
          alt={caption}
        />

        <i
          className={`cursor-pointer fas fa-robot fa-lg absolute ${
            detection === undefined ? "hidden" : null
          }`}
          style={{ left: 7, bottom: 7 }}
          onClick={() => {
            setShow(!show);
          }}
        ></i>
      </div>
      <motion.div
        className="absolute w-96 h-96 flex justify-center items-center"
        style={{ x }}
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
            fill="white"
            d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

ProfileImage.propTypes = {
  src: propTypes.string.isRequired,
  caption: propTypes.string.isRequired,
  heartRef: propTypes.object,
  handleClick: propTypes.func,
  docId: propTypes.string,
};
export default ProfileImage;
