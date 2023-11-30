import { Box, Button, Modal } from '@mui/material'
import React, { useContext } from 'react'
import WebcamImage from './WebcamImage'
import FormDataContext from '../GlobalContext'
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import './CameraComponent.css'



const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth:"450px",
    bgcolor: "background.paper",
    // border: "8px solid #000",
    display:"flex",
    justifyContent:"center",
    boxShadow: 24,
    p: 4,
};


const CameraComponent = () => {

    const { open, handleClose, handleImageCapture, handleSubmit, setStep, handleOpen, existingUserImage, capturedImage, recapture } = useContext(FormDataContext)
    return (
        <Box
            display="flex"
            flexDirection="column"
            margin="auto"
            marginTop={5}
            padding={3}
            borderRadius={2}
            gap={4}
            elevation={2}
            boxShadow={"rgba(0, 0, 0, 0.25) 0px 5px 15px"}
            className="img3"
        >
            <div className="seconddto">
                {existingUserImage ? (
                    <img src={existingUserImage} alt="User" style={{ height: "100%", width: "100%" }} />
                ) : (
                    !capturedImage ? (
                        <div>
                        <CameraEnhanceIcon sx={{ fontSize: 50, color: "#00308F", cursor: "pointer" }} onClick={handleOpen} />
                        <p>Click on the icon to capture image</p>
                        </div>
                    ) : (
                        <img src={capturedImage} alt="Captured" style={{ height: "100%", width: "100%" }} />
                    )
                )}

            </div>

            {/* <Button variant="contained" onClick={handleOpen}>Capture</Button> */}
            <Modal
                open={open} 
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ zIndex: 1 ,width:"100%"}}
                className='webModal'
            >

                {/* webcam in modal */}
                <Box sx={style}>
                    <WebcamImage onCloseModal={handleClose} onImageCapture={handleImageCapture} />
                </Box>
            </Modal>

            <Box sx={{ display: "flex", justifyContent: "space-between", border: "1" }}>

                <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(2)}>Prev</Button>
                {existingUserImage || capturedImage ?
                    (<div className="retakeImage">
                        <FlipCameraIosIcon sx={{ fontSize: 30, color: "#00308F", cursor: "pointer" }} onClick={recapture} />
                    </div>) : ("")
                }
                <Button variant="contained" sx={{ width: "40%" }} onClick={handleSubmit}>Submit</Button>

            </Box>
        </Box>
    )
}

export default CameraComponent