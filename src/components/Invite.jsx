import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import Check from "@mui/icons-material/Check";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

import "./Invite.css";
import FormDataContext from "../GlobalContext";
import MainForm from "./MainForm";
import MainForm2 from "./MainForm2";
import CameraComponent from "./CameraComponent";
import  { stepConnectorClasses } from '@mui/material/StepConnector';


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(109.6deg, rgb(6, 183, 249) 11.2%, rgb(25, 74, 236) 91.1%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(109.6deg, rgb(6, 183, 249) 11.2%, rgb(25, 74, 236) 91.1%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(109.6deg, rgb(6, 183, 249) 11.2%, rgb(25, 74, 236) 91.1%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(109.6deg, rgb(6, 183, 249) 11.2%, rgb(25, 74, 236) 91.1%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <GroupsIcon />,
    2: <PersonIcon />,
    3: <CameraEnhanceIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function CompanyReg() {
  // global context
  const { currentStep,formData } = useContext(FormDataContext);
  // console.log(formData.emailError,"this is email error inside stepper components")
  // keeping track of components being rendered
  function showStep(step) {
    switch (step) {
      case 1:
        return <MainForm />;
      case 2:
        return <MainForm2 />;
      case 3:
        return <CameraComponent />;
      default:
        return <MainForm />;
    }
  }

  const steps = [
    "Enter Meeting Details",
    "Enter Personal Details",
    "Capture your image",
  ];

  return (
    <>
      {/* <div className="img"> */}
        <Box
          display="flex"
          flexDirection="column"
          // minWidth="550px"
          margin="auto"
          padding={3}
          borderRadius={5}
          gap={2}
          elevation={2}
          marginTop={3}
          className="img1"
        >
          <Box sx={{ width: "100%" }}>
            <Stepper
              activeStep={currentStep - 1}
              alternativeLabel
              connector={<ColorlibConnector />}
              orientation="horizontal"
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {showStep(currentStep)}
        </Box>
      {/* </div> */}
    </>
  );
}

