import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { useState, useContext, useEffect } from "react";
import {
  deletePhotos,
  getUserProflieImgByUsername,
} from "../../services/firebase";
import UserContext from "../../context/user";
import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { motion } from "framer-motion";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Header = ({ username, docId }) => {
  const { user } = useContext(UserContext);
  const [imgimg, setImgImg] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const profileImg = async () => {
      const userProfile = await getUserProflieImgByUsername(username);
      setImgImg(userProfile);
    };
    profileImg();
  }, []);

  const handleDeletePhotos = async (docId) => {
    await deletePhotos(docId).then(() => window.location.reload());
  };
  const va = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>Report Complete.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex border-b border-gray-primary h-4 px-4 py-7 justify-between items-center font-stix">
        <div className="flex items-center">
          <Link to={`/p/${username}`} className="flex items-center">
            <motion.img
              variants={va}
              initial="hidden"
              animate="visible"
              className="rounded-full h-8 w-8 flex mr-3"
              src={imgimg ? imgimg : "/images/user.png"}
              alt={`${username} profile`}
            />
            <p className="font-bold">{username}</p>
          </Link>
        </div>
        <Dropdown>
          <Dropdown.Toggle
            className="bg-transparent border-none w-10"
            variant="success"
            id="dropdown-basic"
          >
            <i className="fas fa-ellipsis-h text-black-faded"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu className="bg-white rounded-sm border">
            {username === user.displayName.toLowerCase() ? (
              <>
                <Dropdown.Item
                  className=""
                  onClick={() => {
                    handleDeletePhotos(docId);
                  }}
                >
                  <i className="far fa-trash-alt mr-2"></i>
                  <span className="text-xs">Delete</span>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2" className="w-full">
                  <i className="far fa-edit mr-1.5"></i>
                  <span className="text-xs">Edit</span>
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item className="" onClick={handleShow}>
                  <i className="far fa-flag mr-1.5"></i>
                  <span className="text-xs">Report</span>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  <i className="far fa-save mr-2"></i>
                  <span className="text-xs">Save</span>
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};
Header.propTypes = {
  username: propTypes.string.isRequired,
  reference: propTypes.object.isRequired,
  docId: propTypes.string.isRequired,
};
export default Header;
