import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import "./RoughCompanyList.css"
import Button from '@mui/material/Button';
import axios from "axios";
import {  useNavigate } from "react-router-dom";


const Responsive = () => {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        buildingId: ""
    });
    const [showList, setShowList] = useState(false);

    const buildingUrl = `http://192.168.12.54:8080/com/getByBuildingId?buildingId=${formData.buildingId}`;

    const searchBuilding = async () => {
        try {
            const response = await axios.get(buildingUrl)
            if (response.status === 200) {
                setData(response.data.data);
                setShowList(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleGoBack = () => {
        setShowList(false);
    }

    const handleCompanyClick = (logoUrl,companyId) => {
        localStorage.setItem('selectedCompanyLogo', logoUrl);
        localStorage.setItem('selectedCompanyId', companyId);
        navigate('/responsive')

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            [name]: value
        })
    }

    return (
        <div className='main_div'>
            {showList ? (
                <div  className='listdiv'>
                    {data.length > 0 ? data.map((item) => (
                        <div key={item.id}  className='listdiv2'>
                            <p value={item.name} onClick={() => handleCompanyClick(item.logo,item.id)}>
                                {item.name}
                            </p>
                        </div>
                    )) : null}
                    <Button variant='contained' onClick={handleGoBack}>Go Back</Button>
                </div>
            ) : (
                <div className='search'>
                    <TextField
                        id="outlined-basic"
                        label="Building Id"
                        variant="outlined"
                        name="buildingId"
                        value={formData.buildingId}
                        onChange={handleChange}
                    />
                    <Button variant="contained" onClick={searchBuilding}>Search</Button>
                </div>
            )}
        </div>
    )
}

export default Responsive;