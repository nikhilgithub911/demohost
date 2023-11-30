import React, { useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import "./WebcamImage.css"
import { Box, Button } from "@mui/material";
import FormDataContext from "../GlobalContext";

function WebcamImage({ onCloseModal, onImageCapture }) {

  

  const { setStep,handleSubmit } = useContext(FormDataContext)
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const binaryData = atob(imageSrc.split(",")[1]);
    const array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      array[i] = binaryData.charCodeAt(i);
    }

    const imageBlob = new Blob([array], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", imageBlob, "image.jpg");

    const url = "http://192.168.12.54:8080/vis/upload"
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("capturedImageURL", response.data.data);

      console.log(response);
      console.log("Image captured and URL stored in local storage");
      console.log("image captured")
    } catch (error) {
      console.error("Error sending image:", error);
    }

    setImg(imageSrc);
  };

  const handleCheckIconClick = () => {
    // Check if an image is captured before closing the modal
    if (img) {
      // Store the image in local storage
      // localStorage.setItem("capturedImageURL", img);
      onImageCapture(img);

      // Close the modal
      onCloseModal();
      // 
    }
  };

  return (
    <div className="Container">
      <div className="webcam-container">
        <Webcam
          audio={false}
          mirrored={true}
          height={window.innerWidth < 600 ? 250 : 400}
          width={window.innerWidth < 600 ? 300 : 400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          // videoConstraints={videoConstraints}
        />
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <button onClick={() => setImg(null)} style={{ width: "10%",cursor: "pointer" }}><CancelIcon /></button>
          <button onClick={capture} style={{ width: "10%",cursor: "pointer" }}> <CameraAltIcon /> </button>
          {img && <button onClick={handleCheckIconClick} style={{ width: "10%" ,cursor: "pointer"}}> <CheckCircleIcon /> </button>}
        </Box>
      </div>
      {img && (
        <div className="image-container">
          <img src={img} alt="screenshot"
            style={{ position: "absolute",
            //  top: 34,
              // left: 4,
              left: window.innerWidth < 600 ? 4 : 25,
              top: window.innerWidth < 600 ? 45 : 78,
              zIndex: 2 }}
          />
        </div>
      )}

     
    </div>
  );
}

export default WebcamImage;


// style={{
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   zIndex: 1,
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// }} 