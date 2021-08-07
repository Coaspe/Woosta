import { useState, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import { useRef } from "react";
import { uploadImage } from "../services/firebase";
import UserContext from "../context/user";
import { useHistory } from "react-router-dom";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
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
const Posting = () => {
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
  return (
    <div className="bg-gray-background font-stix font-thin">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        {!next ? (
          <div className="container col-span-2  flex flex-col items-center">
            <img
              className="w-1/2 rounded-md"
              src={previewURL}
              key={previewURL}
              alt="Soon Posted"
            />
            <div className="flex justify-center items-center w-full">
              <label
                className="pt-2 pb-2 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-blue-medium rounded-md text-white cursor-pointer"
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
              <button
                className={`pt-2 pb-2 pl-3 pr-3 mt-2 w-1/6 text-center ${
                  previewURL !== "/images/gallery.png"
                    ? "bg-blue-medium"
                    : "bg-gray-base"
                } rounded-md text-white cursor-pointer`}
                disabled={previewURL === "/images/gallery.png" ? true : false}
                onClick={() => setNext(true)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="container col-span-2 flex flex-col items-center">
            <motion.img
              variants={imgVariant}
              whileTap="whileTap"
              className="w-1/2 rounded-md"
              src={previewURL}
              key={previewURL}
              alt="Soon Posted"
            />
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
                  uploadImage(caption, file, user);
                  history.push("/");
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        <Sidebar />
      </div>
    </div>
  );
};

export default Posting;
