import React, { useEffect, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import log from "../Images/rapidsoft.png";
import "./Responsive.css"
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import LoginUser from './LoginUser';
import Checkin from './Checkin';
import reset from "../Images/reset.png";
import { useNavigate } from 'react-router-dom';

// this is the home page component which was actually the add.jsx component
const style = {

    width: {
        xs: "70px",
        sm: "90px",
        md: "100px",
        lg: "120px"
    },
    height: {
        xs: "70px",
        sm: "90px",
        md: "100px",
        lg: "120px"
    },
    color: "#fff",
    cursor: "pointer"

}



const Responsive = () => {

    const navigate = useNavigate();
    const [iconVisible, setIconVisible] = useState(true);
    const [loginUserComponent, setLoginUserComponent] = useState(false);
    const [checkinComponent, setCheckinComponent] = useState(false);

    const [logoUrl, setLogoUrl] = useState(""); // State to store logo URL

    useEffect(() => {
        // Retrieve logo URL from local storage
        const storedLogoUrl = localStorage.getItem('selectedCompanyLogo');
        if (storedLogoUrl) {
            setLogoUrl(storedLogoUrl);
        }
    }, []);

    const handleCheckIn = () => {
        setIconVisible(false)
        setLoginUserComponent(true)
    }

    const handleCheckout = () => {
        setIconVisible(false)
        setCheckinComponent(true);
    }

    const homeClick = ()=>{
        setIconVisible(true)
        setLoginUserComponent(false)
        setCheckinComponent(false);
    }

    const handleCompanyBack = ()=>{
        navigate("/company")
    }
    return (
        // <div className='main_div'>
        <div className='main_div' style={{ position: 'relative' }}>

            <div className='logo_div'>
                <img src={logoUrl} alt="logo" className='img_style' />
            </div>

            {iconVisible ? <div className='icon_div'>
                <div>
                    <LoginIcon sx={style} onClick={handleCheckIn} />
                    <Typography sx={{ color: '#fff' }}>Checkin</Typography>
                </div>

                <div>
                    <LogoutIcon sx={style} onClick={handleCheckout} />
                    <Typography sx={{ color: '#fff' }}>Checkout</Typography>
                </div>

            </div> : ((loginUserComponent ? (<div style={{ marginBottom: '20px' }}><LoginUser /><Button variant="contained" href="#contained-buttons"onClick={homeClick} sx={{ width: "8.5em" }}>
                Go Back
            </Button></div>) : (checkinComponent ? <div className='loggingout' style={{ marginBottom: '20px'}}><Checkin />
            <Button variant="contained" href="#contained-buttons"onClick={homeClick} sx={{ width: "8.5em" }}>
                Go Back
            </Button>
            </div> : "")))}
            <img src={reset} className='resetImg' alt="reset" onClick={handleCompanyBack} style={{ position: 'absolute', bottom: '20px', left: '20px' }} />

        </div>
    )
}

export default Responsive
