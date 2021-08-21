import { useState, useContext, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { uploadImage } from "../services/firebase";
import UserContext from "../context/user";
import { useHistory } from "react-router-dom";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Spinner from "react-bootstrap/Spinner";
import * as blazeface from "@tensorflow-models/blazeface";

const useStyles = makeStyles({
  root: {
    fontSize: "1.2rem",
    fontFamily: "STIX Two Text",
    marginRight: "1rem",
  },
});
const useStylesBtn = makeStyles({
  root: {
    fontFamily: "STIX Two Text",
    fontWeight: "bold",
  },
});
const Posting = ({ divRef }) => {
  const imgVariant = {
    whileTap: {
      scale: 1.5,
    },
  };
  const classes = useStyles();
  const classesBtn = useStylesBtn();

  const { user } = useContext(UserContext);
  const history = useHistory();
  const imageValue = useRef(null);
  const inputValue = useRef(null);
  const [next, setNext] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [previewURL, setPriviewURL] = useState("/images/gallery.png");

  const handleFileOnChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setPriviewURL(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const [detection, setDetection] = useState(null);
  const [imgCheck, setImgCheck] = useState(null);
  const [singleShortDetector, setSingleShortDetector] = useState(null);
  const [uploadFaceDetection, setUploadFaceDetection] = useState(null);
  const tmp = [];
  useEffect(() => {
    const img = document.getElementById("img");
    if (img) {
      setImgCheck(img);
    }
  }, [previewURL]);

  useEffect(() => {
    setDetection(null);
  }, [previewURL]);

  useEffect(() => {
    if (imgCheck !== null && previewURL !== "/images/gallery.png") {
      try {
        (async () => {
          const model2 = await blazeface.load();
          await model2.estimateFaces(imgCheck).then((res) => {
            setSingleShortDetector(res);
          });
          const model = await cocoSsd.load();
          await model.detect(imgCheck).then((res) => {
            setDetection(res);
          });
        })();
      } catch (error) {
        console.log("Detection Error!", error);
      }
    }
  }, [imgCheck, previewURL]);

  useEffect(() => {
    if (singleShortDetector !== null) {
      singleShortDetector.map((item) =>
        tmp.push({
          landmark: [
            item.landmarks[0][0],
            item.landmarks[0][1],
            item.landmarks[1][0],
            item.landmarks[1][1],
            item.landmarks[2][0],
            item.landmarks[2][1],
            item.landmarks[3][0],
            item.landmarks[3][1],
            item.landmarks[4][0],
            item.landmarks[4][1],
            item.landmarks[5][0],
            item.landmarks[5][1],
          ],
          topLeft: item.topLeft,
          bottomRight: item.bottomRight,
          probability: item.probability,
        })
      );
      setUploadFaceDetection(tmp);
    }
  }, [singleShortDetector]);

  console.log("detection", detection);
  console.log("singleShortDetector", singleShortDetector);
  console.log("uploadFaceDetection", uploadFaceDetection);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="top-0 left-0 w-full h-full fixed flex z-50 items-center justify-center bg-black-faded font-stix"
        // variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="grid grid-cols-3 w-full h-auto max-w-screen-lg z-50 min-h-70/70"
          // variants={modal}
          exit="hidden"
        >
          {previewURL !== "/images/gallery.png" ? (
            <>
              <div className="col-span-2">
                <div className="h-full flex justify-center items-center bg-white">
                  <motion.img
                    id="img"
                    variants={imgVariant}
                    whileTap="whileTap"
                    src={previewURL}
                    key={previewURL}
                    alt="Soon Posted"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <div className="bg-white w-full flex flex-col items-center col-span-1 justify-between h-full py-3">
                <div className="flex justify-between w-full px-3">
                  <p></p>
                  <p>Profile Edit</p>
                  <i
                    className="fas fa-times cursor-pointer"
                    onClick={() => {
                      if (divRef.current !== undefined) {
                        divRef.current.click();
                      }
                    }}
                  ></i>
                </div>
                <div>Add later...</div>
                {!next ? (
                  <div className="flex justify-center items-center w-full">
                    <label
                      className="pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 text-center bg-blue-medium rounded-md text-white cursor-pointer"
                      for="input-file"
                    >
                      Explore
                    </label>
                    <form ref={imageValue}>
                      <input
                        type="file"
                        id="input-file"
                        label="image"
                        name="image"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          handleFileOnChange(event);
                        }}
                      />
                    </form>
                    {previewURL === "/images/gallery.png" ||
                    detection === null ||
                    uploadFaceDetection === null ? (
                      <Spinner animation="border" variant="info" />
                    ) : (
                      <button
                        className={`pt-1 pb-1 pl-3 pr-3 mt-2 text-center bg-blue-medium rounded-md text-white cursor-pointer`}
                        disabled={
                          previewURL === "/images/gallery.png" ||
                          detection === null
                            ? true
                            : false
                        }
                        onClick={() => {
                          setNext(true);
                        }}
                      >
                        Next
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full mt-3">
                    <form ref={inputValue}>
                      <Input
                        id="newCaption"
                        className={classes.root}
                        placeholder="Caption"
                        inputProps={{ "aria-label": "description" }}
                        onChange={(e) => {
                          setCaption(e.target.value);
                        }}
                      />
                    </form>

                    <Button
                      className={classesBtn.root}
                      variant="contained"
                      color="default"
                      onClick={() => {
                        // setCaption(inputValue.current["caption"].value);
                        uploadImage(
                          caption,
                          file,
                          user,
                          detection,
                          uploadFaceDetection
                        );
                        history.push("/");
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="col-span-3 flex flex-col justify-between items-center bg-white py-3 rounded-md">
                <div className="flex w-full justify-between px-3 border-b-2 border-gray-primary pb-2 items-center">
                  <p></p>
                  <p className="text-xl font-medium">New Post</p>
                  <i
                    className="fas fa-times cursor-pointer fa-lg"
                    onClick={() => {
                      if (divRef.current !== undefined) {
                        divRef.current.click();
                      }
                    }}
                  ></i>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <svg
                    aria-label="Icon to represent media such as images or videos"
                    class="_8-yf5 "
                    fill="#262626"
                    height="77"
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width="96"
                  >
                    <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"></path>
                    <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"></path>
                    <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"></path>
                  </svg>
                  <p className="py-3 text-2xl">Selete photos.</p>
                  <form ref={imageValue}>
                    <label
                      className="pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 text-center bg-blue-medium rounded-md text-white cursor-pointer"
                      for="input-file"
                    >
                      Selete From Computer
                    </label>
                    <input
                      type="file"
                      id="input-file"
                      label="image"
                      name="image"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        handleFileOnChange(event);
                      }}
                    />
                  </form>
                </div>
                <p></p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Posting;
