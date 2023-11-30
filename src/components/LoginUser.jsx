// this component deals with fetching meeting details of user 
// for checking in 

import React, { useEffect } from "react";
import { Box,TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import {  useNavigate } from "react-router-dom";
import "./LoginUser.css"
const LoginUser = () => {
  const [fetchedUserData, setFetchedUserData] = useState(null);

  const [phoneInput, setPhoneInput] = useState("");
  // console.log(fetchedUserData,"this is fetched user data")


  const navigate = useNavigate();

  //   search meeting
  const searchMeeting = async (event) => {
    const visitorPhoneNumber = event.target.value;
    localStorage.setItem("phoneNumber", visitorPhoneNumber)
    // console.log(visitorPhoneNumber,"phoneNumber")

    if (visitorPhoneNumber.length === 10) {
      try {
        const response = await axios.get(
          // meeting response
          `http://192.168.12.54:8080/api/meeting/getByPhone?phoneNumber=${visitorPhoneNumber}`
        );

        if (response.data.data.length === 0) {
         
          toast.success("please fill up the details")
          navigate("/invite")


        } else if (response.data.data.length !== 0) {
          toast.success('you already have pending meetings', {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            },
          });

        }
      }
      catch (error) {



        console.error(error);
      }
    }
  };
  // start meeting

  // handle phone length
  //    const handleLength = (event)=>{
  //     const phone = event.target.value;
  //     setPhoneInput(phone);
  // // console.log("phoneInput value before slicing",phoneInput)
  // setPhoneInput(phone.slice(0, 10));
  // // console.log("phoneInput value after slicing",phoneInput)

  //   }
  return (
    <div className="checkinhyp">

     
      <TextField
        fullWidth
        // placeholder="Enter your Phone Number login*"
        label="Phone Number"
        variant="outlined" 
        id="outlined-basic"
        // type="number"
        name="phoneNumber"
        autoComplete="off"
        // onInput={searchMeeting}
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
            searchMeeting({ target: { value } });
          },
        }}
      />

      <Box>


      </Box>


    </div>
  );
};

export default LoginUser;


