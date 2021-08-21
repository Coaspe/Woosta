import { useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

const FaceDetectionOverlay = ({ item, show }) => {
  const leftEarDivRef = useRef(null);
  const rightEarDivRef = useRef(null);
  const noseDivRef = useRef(null);
  const mouthDivRef = useRef(null);
  const leftEyeDivRef = useRef(null);
  const rightEyeDivRef = useRef(null);
  return (
    <>
      <Overlay target={leftEarDivRef.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix">Left Eye</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute"
        ref={leftEarDivRef}
        style={{ left: item.landmark[0], top: item.landmark[1] }}
      ></div>
      <Overlay target={rightEarDivRef.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix text-thin">Right Eye</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute"
        ref={rightEarDivRef}
        style={{
          left: item.landmark[2],
          top: item.landmark[3],
        }}
      ></div>
      <Overlay target={noseDivRef.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix text-thin">Nose</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute w-1 h-1"
        ref={noseDivRef}
        style={{
          left: item.landmark[4],
          top: item.landmark[5],
        }}
      ></div>
      <Overlay target={mouthDivRef.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix font-thin">Mouth</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute w-1 h-1"
        ref={mouthDivRef}
        style={{
          left: item.landmark[6],
          top: item.landmark[7],
        }}
      ></div>
      <Overlay target={leftEyeDivRef.current} show={show} placement="left">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix font-thin">Left Ear</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute w-1 h-1"
        ref={leftEyeDivRef}
        style={{
          left: item.landmark[8],
          top: item.landmark[9],
        }}
      ></div>
      <Overlay target={rightEyeDivRef.current} show={show} placement="right">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <p className="font-stix font-thin">Right Ear</p>
          </Tooltip>
        )}
      </Overlay>
      <div
        className="absolute w-1 h-1"
        ref={rightEyeDivRef}
        style={{
          left: item.landmark[10],
          top: item.landmark[11],
        }}
      ></div>
    </>
  );
};

export default FaceDetectionOverlay;
