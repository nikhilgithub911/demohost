import { Box, Button, TextField, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import FormDataContext from '../GlobalContext'
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import "./MainForm.css"
import Autocomplete from '@mui/material/Autocomplete';


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

const MainForm2 = () => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // importing global context
    const { setStep } = useContext(FormDataContext)

    const [editMode, setEditMode] = useState(false);
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(true);

    // const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const { formData, setFormData, handleSubmit, fetchedUserData } = useContext(FormDataContext)
    // console.log(cities, "transferred cities")

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const response = await axios.get(
                    `http://192.168.12.54:8080/api/cityByName?cityName=${formData.city}`
                );
                if (response.status === 200) {
                    setCities(response.data.data);
                    // setFormData({
                    //     city:response.data.data.city.name
                    // })
                    // console.log(response.data.data, "this is city data from search filter");
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (formData.city) {
            fetchCity();
        }
    }, [formData.city]);

 
    const handleEditClick = () => {
        setEditButtonClicked(true);
        setEditMode(true);
        console.log("edit button clicked")
        setTooltipOpen(false);

    };


    // handle changes 
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            const emailError = validateInput(value, emailRegex);
            setFormData({
                ...formData,
                email: value,
                emailError: emailError,
            });
        } else if (name === 'city') {
            const selectedCity = cities.find((city) => city.name === value);
            const cityId = selectedCity ? selectedCity.id : null;

            setFormData({
                ...formData,
                city: value,
                cityId: cityId,
            });
        } else if (name === 'phoneNumber') {
            if (value.length <= 10) {
                const phoneNumberError = validateInput(value, /^\d{10}$/);
                setFormData({
                    ...formData,
                    phoneNumber: value,
                    phoneError: phoneNumberError,
                });
            }
        } else if (name === "aadhaarNumber") {
            if (value.length <= 12) {
                setFormData({
                    ...formData,
                    aadhaarNumber: value,
                });
            }
        } else {
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
    // console.log(emailError, "emailError in mainform2")
    // console.log(phoneNumberError, "phoneNumberError in mainform2")

    // console.log(formData,"formmmmmmmmmmmmmm")

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent={'space-between'}
                    margin="auto"
                    marginTop={5}
                    padding={3}
                    borderRadius={2}
                    elevation={2}
                    boxShadow={"rgba(0, 0, 0, 0.25) 0px 5px 15px"}
                    className='img2'
                >
                    <Typography color="gray" variant={"h1"} sx={{ mb: 1, color: "#18453B" }}
                        fontSize={isSmallScreen ? 25 : 44}
                    >
                        Personal Details
                        {fetchedUserData ? <Tooltip title="Edit" open={tooltipOpen} placement="right-start" arrow ><EditIcon onClick={handleEditClick} sx={{ ml: 2, cursor: "pointer" }} /></Tooltip>
                            : ""}
                    </Typography>

                    <TextField
                        variant='outlined'
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        inputProps={{ maxLength: 25 }}
                        disabled={fetchedUserData && !editMode && !editButtonClicked}
                        style={{ outline: 'none', boxShadow: 'none' }}

                    />

                    <TextField
                        variant='outlined'
                        label="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formData.emailError}
                        helperText={formData.emailError}
                        inputProps={{ maxLength: 60 }}
                        disabled={fetchedUserData && !editMode && !editButtonClicked}

                    />
                    
                    <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                        name="city"
                        options={cities}
                        freeSolo={false}
                        // value={formData.city}
                        value={
                            {id:formData.cityId, name:formData.city} && cities.some((city) => city.id === formData.cityId)
                              ? {id:formData.cityId, name:formData.city}
                              : null
                          }
                        // autoComplete
                        // autoHighlight
                        // options={cities.map((city) => city.name)}
                        // options={cities.map((city, index) => ({ label: city.name, value: city.name, id: index }))}

                        onInputChange={(event, newValue) => {

                            const formCityId = formData.city ? formData.cityId:null;
                            const formStateId = formData.stateId;
                            const selectedCity = cities.find((city) => city.name === newValue);
                            const cityId = selectedCity ? selectedCity.id :formCityId || null;
                            const stateId = selectedCity ? selectedCity.state.id : formStateId || null;

                            // console.log("newData", newValue)
                    
                            setFormData({
                                ...formData,
                                city: newValue,
                                cityId: cityId,
                                stateId: stateId, 
                            });
                        }}
                        getOptionLabel={(option) => option.name || ""}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option.name}
                            </li>
                          )}
                        // onChange={handleChange}
                        renderInput={(params) => (
                            <TextField
                             {...params} 
                             variant="outlined"
                              label="City "
                              id={formData.cityId ? String(formData.cityId) : ""}
                              value={formData.cityId ? formData.city:""}
                              />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        disabled={fetchedUserData && !editMode && !editButtonClicked}

                    />

                    <TextField
                        // placeholder=" Company Name*"
                        variant='outlined'
                        label="company"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled={fetchedUserData && !editMode && !editButtonClicked}
                        inputProps={{ maxLength: 25 }}

                    />

                    {/* {---------------------------LAC----------------------------} */}

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>

                        <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(1)}>Prev</Button>
                        <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(3)}>Next</Button>

                    </Box>
                </Box>
            </form>
        </>
    )
}

export default MainForm2
