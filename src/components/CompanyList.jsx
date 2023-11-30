import React, { useContext } from 'react';
import FormDataContext from '../GlobalContext';
import "./CompanyList.css";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Button, Typography } from '@mui/material';
import reset from "../Images/reset.png"
const CompanyList = () => {
  const { data, handleCompanyClick, handleGoBack } = useContext(FormDataContext);

  return (
    <div className='main_div' style={{ position: 'relative' }}>
      {/* <List sx={{ width: '80%'}} > */}
      <List sx={{ width: '80%', '& .MuiListItem-root': { marginBottom: '16px' } }}>

        {data && data.length > 0 ? (
          data.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="center" onClick={() => handleCompanyClick(item.logo, item.id)}  className='colorlist'>
                <ListItemAvatar>
                  <Avatar alt={item.name} src={item.logo} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div"sx={{color:"#f0f8ff ",fontWeight:"BOLD"}}>
                      {item.name}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))
        ) : null}
      </List>
      <img src={reset} className='resetImg' alt="reset" onClick={handleGoBack} style={{ position: 'absolute', bottom: '20px', left: '20px' }} />
    </div>
  );
};

export default CompanyList;
