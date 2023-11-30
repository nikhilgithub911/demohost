import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import "./Building.css"
import Button from '@mui/material/Button';
import FormDataContext from '../GlobalContext'
import veris from "../Images/vms.png";
 
const Responsive = () => {

    const { searchBuilding,newFormData,handleNewChange } = useContext(FormDataContext)


    return (
        <div className='main_div'>
         <img src={veris} alt="veris" className='verislogo'/>
                <div className='search'>
                    <TextField
                        id="outlined-basic"
                        label="Building Id"
                        variant="outlined"
                        name="buildingId"
                        value={newFormData.buildingId}
                        // onChange={handleNewChange}
                        onInput={handleNewChange}
                        inputProps={{maxLength:5}}
                    />
                    <Button variant="contained" onClick={searchBuilding}>Search</Button>
                </div>
        </div>
    )
}

export default Responsive;


// folder inside downloads on november 29