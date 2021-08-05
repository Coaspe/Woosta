import { AnimatePresence, motion } from "framer-motion";
const ProfilePhotoSlides = ({
  photos,
  nowPhotoidx,
  clickDiv,
  setNowPhotoidx,
}) => {
  const backdrop = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };
  const modal = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="top-0 left-0 w-full h-full fixed z-20 flex items-center justify-center bg-black-faded"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div
          className="rounded-full bg-gray-postBorder mr-4 w-7 h-7 flex items-center justify-center bg-opacity-30 cursor-pointer"
          onClick={() => {
            nowPhotoidx === 0
              ? setNowPhotoidx(photos.length - 1)
              : setNowPhotoidx(nowPhotoidx - 1);
          }}
        >
          <i className="fas fa-chevron-left fa-lg"></i>
        </div>
        <motion.div className="w-6/12 flex" variants={modal} exit="hidden">
          <div className="">
            <motion.img
              className="cursor-pointer rounded-sm w-full"
              key={`${photos[nowPhotoidx].imageSrc}.jpg`}
              src={photos[nowPhotoidx].imageSrc}
              alt={`${photos[nowPhotoidx].imageSrc}.jpg`}
              onClick={() => clickDiv.click()}
            />
          </div>
          <motion.div className="bg-gray-postBack w-full">
            <motion.div className="p-4 flex items-center border border-gray-postBorder">
              <motion.img
                className="rounded-full w-10 h-10"
                src="/images/avatars/12.jpg"
              />
              <motion.div className="flex justify-between w-full pl-3 pr-3">
                <motion.span>Name</motion.span>
                <motion.span>icon</motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        <div
          className="rounded-full bg-gray-postBorder ml-4 w-7 h-7 flex items-center justify-center bg-opacity-30 cursor-pointer"
          onClick={() => {
            setNowPhotoidx((nowPhotoidx + 1) % photos.length);
          }}
        >
          <i className="fas fa-chevron-right fa-lg"></i>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePhotoSlides;
