import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import Pop from './Pop';
import "./Checkin.css";

const Checkin = ({ onCloseModal }) => {
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [logoutmessage, setLogoutMessage] = useState(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchMeeting = async (event) => {
    const visitorPhoneNumber = event.target.value;

    if (visitorPhoneNumber.length === 10) {
      try {
        const response = await axios.get(`http://192.168.12.54:8080/api/meeting/getMeetingsToCheckout?phoneNumber=${visitorPhoneNumber}`);

        if (response.status === 200 && response.data.data) {
          setFetchedUserData(response.data.data);
        } else if (response.data.data === null) {
          toast('No meeting details found!', {
            icon: '👏',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
      } catch (error) {
        // toast('Number does not exist!', {
        toast('No meeting found!', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#FF000080',
            color: '#fff',
          },
        });
        console.error(error);
      }
    }
  };

  const checkoutUser = async () => {
    try {
      const response = await axios.get(`http://192.168.12.54:8080/api/meeting/checkout?phone=${fetchedUserData.visitor.phoneNumber}`);

      if (response.status === 200 && response.data.data === null) {
        // Open the modal
        setIsModalOpen(true);

        // Wait for a few seconds before reloading the page
        setTimeout(function () {
          window.location.reload();
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      toast("Already checked out", {
        position: "top-center",
        autoClose: 800,
      });
    }
  };

  const formatStartDate = () => {
    if (fetchedUserData && fetchedUserData.meetingStartDateTime) {
      const originalStartDate = new Date(fetchedUserData.meetingStartDateTime);
      const adjustedStartDate = new Date(originalStartDate.getTime() - (5 * 60 + 30) * 60 * 1000);

      return adjustedStartDate.toLocaleString();
    }
    return null;
  };

  const handleLength = (event) => {
    const phone = event.target.value;
    setPhoneInput(phone);
    setPhoneInput(phone.slice(0, 10));
  };

  return (
    <div className='checkoutComponent'>
      <TextField
        fullWidth
        label="Phone Number"
        variant="outlined"
        // type="number"
        name="phoneNumber"
        autoComplete="off"
        onInput={searchMeeting}
        // onChange={handleLength}
        value={phoneInput}
        inputProps={{
          pattern: '^[0-9]*',
          onInput: (event) => {
            let value = event.target.value;
            value = value.replace(/\D/g, '');
            if (value.length > 10) {
              value = value.slice(0, 10);
            }
            setPhoneInput(value);
          },
        }}
      />
      <Box mb={1}>
        {fetchedUserData && (
          <>
            <Typography>
              <strong> Name: </strong>
              {fetchedUserData.visitor.name}
            </Typography>
            <Typography>
              <strong> Phone: </strong>
              {fetchedUserData.visitor.phoneNumber}
            </Typography>
            <Typography>
              <strong> Company: </strong>
              {fetchedUserData.visitor.companyName}
            </Typography>

            <Typography variant="h6" sx={{ color: "blue" }}>
              Meeting Details:
            </Typography>
            <Typography>
              <strong>Host Name: </strong>
              {fetchedUserData.user.firstName}
            </Typography>
            <Typography>
              <strong>Status: </strong>
              {fetchedUserData.status}
            </Typography>
            <Typography>
              <strong>Visit Type: </strong>
              {fetchedUserData.context}
            </Typography>
            <Box className="baton">
              <Button
                variant="outlined"
                sx={{ width: "8.5em" }}
                onClick={checkoutUser}
                color="primary"
              >
                Check out
              </Button>
            </Box>
          </>
        )}
      </Box>

      {isModalOpen && <Pop onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Checkin;
