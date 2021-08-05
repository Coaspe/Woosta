import { useState, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import { useRef } from "react";
import { uploadImage, getImage } from "../services/firebase";
import UserContext from "../context/user";
import { useHistory } from "react-router-dom";

const Posting = () => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const imageValue = useRef(null);
  const inputValue = useRef(null);
  const [next, setNext] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [previewURL, setPriviewURL] = useState("/images/image.png");

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
    <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        {!next ? (
          <div className="container col-span-2 flex flex-col items-center">
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
                사진 찾기
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
                  previewURL !== "/images/image.png"
                    ? "bg-blue-medium"
                    : "bg-gray-base"
                } rounded-md text-white cursor-pointer`}
                disabled={{ previewURL } === "/images/image.png" ? true : false}
                onClick={() => setNext(true)}
              >
                다음
              </button>
            </div>
          </div>
        ) : (
          <div className="container col-span-2 flex flex-col items-center">
            <img
              className="w-1/2 rounded-md"
              src={previewURL}
              key={previewURL}
              alt="Soon Posted"
            />
            <div className="flex justify-center items-center w-full mt-2">
              <form ref={inputValue}>
                <input
                  type="text"
                  className="outline-black"
                  label="caption"
                  name="caption"
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                />
              </form>
              <button
                className={`pt-2 pb-2 pl-3 pr-3 w-1/6 text-center bg-blue-medium rounded-md text-white cursor-pointer ml-2`}
                onClick={() => {
                  // setCaption(inputValue.current["caption"].value);
                  uploadImage(caption, file, user);
                  history.push("/");
                }}
              >
                제출
              </button>
            </div>
          </div>
        )}
        <Sidebar />
      </div>
    </div>
  );
};

export default Posting;