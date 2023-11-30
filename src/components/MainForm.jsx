import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import FormDataContext from '../GlobalContext'
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MainForm = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [localPhone, setLocalPhone] = useState(localStorage.getItem("phoneNumber") || "");

    // global context import 
    const { setStep, handleCancel } = useContext(FormDataContext)

    const [editMode, setEditMode] = useState(false);
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(true);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

// console.log(cities,"cities")
    // const [existingUserImage, setExistingUserImage] = useState("");
    const [users, setUsers] = useState([]);



    const companyId = localStorage.getItem("selectedCompanyId")
    const stateUrl = "http://192.168.12.54:8080/api/state/all";
    const userUrl = `http://192.168.12.54:8080/api/user/alluser?companyId=${companyId}`;

    // function to fetch hosts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(userUrl);
                if (response.status === 200 && response.data.data) {
                    // console.log("response.data.data for user",response.data.data)
                    const userList = response.data.data.map((user) => ({
                        id: user.id,
                        username: user.name,
                        status: user.isPresent
                    }));
                    setUsers(userList);
                }
                // room.roomName
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, []);



    const handleEditClick = () => {
        // When the "Edit" icon is clicked, enable the text field for editing
        setEditButtonClicked(true);
        setEditMode(true);
        // console.log("edit button clicked")
        setTooltipOpen(false);

    };

    // importing global context

    const { formData, setFormData, handleSubmit, handlePhoneNumberChange, fetchedUserData, setFetchedUserData, handleOpen, handleClose, open, setOpen, stream, setStream, currentStep } = useContext(FormDataContext)
    // console.log(formData, "ffffffffffff");
    // handle changes 
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "state") {

            setFormData({
                ...formData,
                [name]: value,
            });
            fetchCitiesByState(value);

        } else if (name === "user") {
            setFormData({
                ...formData,
                user: {
                    id: value,
                }
            })
        }

        else if (name === "city") {


            setFormData({
                ...formData,
                [name]: value,
            });
        } else if (name === "email") {
            const emailError = validateInput(value, emailRegex);
            setFormData({
                ...formData,
                email: value,
                emailError: emailError,
            })
        } else if (name === "phoneNumber") {
            if (value.length <= 10) {

                const phoneNumberError = validateInput(value, /^\d{10}$/);
                setFormData({
                    ...formData,
                    phoneNumber: value,
                    phoneError: phoneNumberError,
                })
            }
        }

        else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    // email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/i;

    // validate input function
    const validateInput = (value, validationRule) => {
        if (validationRule.test(value)) {
            return "";
        } else {
            return "Invalid Input"
        }
    }
    const emailError = validateInput(formData.email, emailRegex);
    const phoneNumberError = validateInput(formData.phoneNumber, /^\d{10}$/)

    //   fetch cities by state

    const fetchCitiesByState = async (state) => {
        try {
            const response = await axios.get(
                `http://192.168.12.54:8080/api/city/${state}`
            );
            if (response.status === 200 && response.data.data) {
                setCities(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(stateUrl);
                if (response.status === 200 && response.data.data) {
                    setStates(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching states", error);
            }
        };

        fetchStates();
    }, []);


    useEffect(() => {
        if (formData.state) {
            fetchCitiesByState(formData.state);
        }
    }, [formData.state]);


    //   disable dates
    const shouldDisableDate = (date) => {
        return date < new Date().setDate(new Date().getDate() - 1);
    };

    // state to store the meeting context dropdown
    const [meetingContextOptions, setMeetingContextOptions] = useState([]);
    const meetingContextUrl = "http://192.168.12.54:8080/vis/meetCon";

    // fetching meeting context options from api
    const fetchMeetingContextOptions = async () => {
        try {
            const response = await axios.get(meetingContextUrl);
            if (response.status === 200 && response.data.data) {
                setMeetingContextOptions(response.data.data);
            }
        } catch (error) {
            console.log("error fetching meeting context options");
        }
    };
    // calling the meeting context options inside useeffect
    useEffect(() => {
        fetchMeetingContextOptions();
    }, []);

    useEffect(() => {
        const phoneNumberFromLocalStorage = localStorage.getItem("phoneNumber");
        if (phoneNumberFromLocalStorage) {
          setLocalPhone(phoneNumberFromLocalStorage);
          setFormData({
            ...formData,
            phoneNumber: phoneNumberFromLocalStorage,
          });
        }
      }, []);
      

    // Effect to call handlePhoneNumberChange when the component mounts
    useEffect(() => {
        if (localPhone) {
            handlePhoneNumberChange({ target: { value: localPhone } });
        }
    }, []);
    // below changes has been made
    // }, [localPhone,handlePhoneNumberChange]);

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Box
                    display="flex"
                    flexDirection="column"
                    // minWidth="550px"
                    margin="auto"
                    marginTop={5}
                    padding={3}
                    borderRadius={2}
                    // gap={3}
                    justifyContent={'space-between'}
                    elevation={2}
                    boxShadow={"rgba(0, 0, 0, 0.25) 0px 5px 15px"}
                    className="img2"
                    // sx={{ height: img2Height }}
                >
                    <Typography  color="gray" variant={"h1"} sx={{ mb: 1, color: "#18453B" }}
                                            fontSize={isSmallScreen ? 25 : 44}

                    className='title'>
                        Meeting Details
                        {fetchedUserData ? <Tooltip title="Edit" open={tooltipOpen} placement="right-start" arrow ><EditIcon onClick={handleEditClick} sx={{ ml: 2, cursor: "pointer" }} /></Tooltip>
                            : ""}
                    </Typography>

                    <TextField
                        label="PhoneNumber"
                        name="phoneNumber"
                        variant="outlined"
                        id="outlined-basic"
                        // value changed from local phone to formData.phoneNumber
                        // value={formData.phoneNumber}
                        value={localPhone}
                        onChange={handleChange}
                        autoComplete="off"
                        onInput={handlePhoneNumberChange}
                        error={!!formData.phoneError}
                        helperText={formData.phoneError}
                        inputProps={{ maxLength: 10 }}
                        disabled={fetchedUserData && !editMode && !editButtonClicked}
                        autoFocus
                        // sx={{
                        //     height: isSmallScreen ? "40px" : "56px", 
                        // }}
                    />

                    {/* host name */}

                    <FormControl >
                        <InputLabel id="demo-user-select-label">Host*</InputLabel>
                        <Select
                            labelId="demo-user-select-label"
                            id="demo-user-select"
                            // value={formData.user.id || ""}
                            value={users.some(user => user.id === formData.user.id) ? formData.user.id : ""}

                            label="Select a User"
                            name="user"
                            onChange={handleChange}
                            MenuProps={MenuProps}
                            // defaultValue="" 
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}
                                    disabled={!user.status}

                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <span>{user.username}</span>
                                       
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Visit Type */}
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Visit Type*
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={formData.meetingContext || ""}
                            value={meetingContextOptions.includes(formData.meetingContext) ? formData.meetingContext : ""}

                            onChange={handleChange}
                            name="meetingContext"
                            label="meetingContext"
                        >
                            {meetingContextOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Remarks */}
                    {formData.meetingContext === "OTHERS" ? <TextField id="outlined-basic" label="Remarks" variant="outlined" value={formData.remarks || ""} name="remarks"
                        onChange={handleChange}
                        inputProps={{ maxLength: 60 }}
                    /> : ""}

                    {/* {---------------------------LAC----------------------------} */}
                    {/* </Box>                     */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }} className="buttonBox">

                        <Button variant="contained" sx={{ width: "40%" }} onClick={handleCancel}>Cancel</Button>
                        <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(2)}>Next</Button>

                    </Box>
                </Box>
            </form>
        </>
    )
}

export default MainForm

//main form as on 15:24 november 22