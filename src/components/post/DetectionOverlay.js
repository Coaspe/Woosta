import { useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

const DetectionOverlay = ({ item, show }) => {
  const divRef = useRef(null);
  return (
    <>
      <Overlay target={divRef.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            {item.class}
            <p>{Math.round(item.score * 100)}%</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute w-1 h-1"
        ref={divRef}
        style={{
          left: (item.bbox[0] * 2 + item.bbox[2]) / 2,
          top: (item.bbox[1] * 2 + item.bbox[3]) / 2,
        }}
      ></div>
    </>
  );
};

export default DetectionOverlay;
