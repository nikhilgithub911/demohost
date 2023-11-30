import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import image from "../Images/fold.png";
import "./Pop.css";

const Pop = ({ onClose }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modalContainer">
        <img className="modalImage" src={image} alt="thank you" />
        <p className="modalTitle">
          Thank you for visiting 
        </p>
        {/* <p className="modalDescription">
          We appreciate your time and hope to see you again soon !!
        </p> */}
      </Box>
    </Modal>
  );
};

export default Pop;
