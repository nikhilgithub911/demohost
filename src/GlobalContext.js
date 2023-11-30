import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const FormDataContext = createContext();

export function FormDataProvider({ children }) {

  // keeping track of the steps
  const [currentStep, setStep] = useState(1);
  // captured image will be stored here
  const [capturedImage, setCapturedImage] = useState(null);

  const navigate = useNavigate();
  const localPhone = localStorage.getItem("phoneNumber")

  const [existingUserImage, setExistingUserImage] = useState("");

  //  state to store fetched user data
  const [fetchedUserData, setFetchedUserData] = useState(null);

// ----------------------new module-------------------
const [newFormData,setNewFormData] = useState({
  buildingId:""
})
const [data, setData] = useState(() => {
  const storedData = localStorage.getItem('companyList');
  return storedData ? JSON.parse(storedData) : [];
});

const handleNewChange = (e) => {
  const { name, value } = e.target;
console.log("this function is getting called")
  const numericValue = value.replace(/[^0-9]/g, '');

  // setNewFormData({ target: { name, value: numericValue } });

  setNewFormData({
      [name]: numericValue
  })
}

const buildingUrl = `http://192.168.12.54:8080/com/getByBuildingId?buildingId=${newFormData.buildingId}`;

const searchBuilding = async () => {
  try {
    const response = await axios.get(buildingUrl);
    if (response.data.data.length > 0) {
      const newData = response.data.data;
      setData(newData);
      localStorage.setItem('companyList', JSON.stringify(newData));
      // console.log("Data updated:", newData);
      navigate("/company");
      setNewFormData({
        buildingId: ""
      });
    }else if(response.data.data.length === 0){
      toast.error("no companies found")
    }
  } catch (err) {
    console.error(err);
  }
};
const handleGoBack = ()=>{

    navigate("/")
    // localStorage.removeItem("companyList")
}
const handleCompanyClick = (logoUrl,companyId) => {
  localStorage.setItem('selectedCompanyLogo', logoUrl);
  localStorage.setItem('selectedCompanyId', companyId);
  navigate('/responsive')

}

// --------------------------------------------------------------


  const initialFormData = {
    id: "",
    name: "",
    phoneNumber: localPhone || "",
    email: "",
    gender: "",
    // age: "",
    state: "",
    stateId:"",
    city: "",
    cityId:"",
    address: "",
    imageUrl: null,
    aadhaarNumber: "",
    user: {
      id: "",
    },
    companyName: "",
    meetingContext: "",
    remarks:""
  };


  const [formData, setFormData] = useState({ ...initialFormData });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData, "formdata")
    // Check if any of the required fields are empty
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.email ||
      // !formData.city ||
      !formData.user.id ||
      !formData.companyName

    ) {
      toast('Please fill up all the details!',
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            // background:'#FF0000',
            color: '#fff',
          },
        }
      );

      return;
    } else if (formData.emailError) {
      toast('please enter a valid email!',
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      )
      return;
    }

    const imageUrl = localStorage.getItem("capturedImageURL");
    // console.log(formData.cityId, "cityId before API call");

    const updatedFormData = {
      // ...formData,
      id: formData.id,

      name: formData.name || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      // age: formData.age || "",
      state: {
        id: formData.stateId,
      },
      city: {
        id: formData.cityId,
      },
      imageUrl: existingUserImage || imageUrl,
      companyName: formData.companyName,
      remarks: formData.remarks || '',
      context: formData.meetingContext || '',
      user: {
        id: formData.user.id || ''
      }
    };

    try {
      const response = await axios.post(
        "http://192.168.12.54:8080/api/visitor-meeting/save",
        updatedFormData
      );
      if (response.status === 200) {
        console.log("Form Data:", updatedFormData);
        localStorage.removeItem("capturedImageURL");
        // toast.success("data added successfully")
        toast.success("meeting request sent ")
        // console.log("Request successful", response.data);
        console.log(formData.emailError, "error in email in global context")

        setCapturedImage(null);
        setExistingUserImage("");
      }
    } catch (err) {
      console.error(err, "There is some issue moving into the database");
      toast.error("Meeting request failed")
    }

    setFormData({ ...initialFormData });
    localStorage.removeItem("capturedImageURL");
    localStorage.removeItem("phoneNumber")
    navigate('/company');
    // navigate('/');
    setTimeout(function(){
      window.location.reload()
    },2000)

  };

  const handlePhoneNumberChange = async (event) => {
    const phoneNumber = event.target.value;

    // handle selected states
    if (phoneNumber.length === 10) {
      try {
        const response = await axios.get(`http://192.168.12.54:8080/vis/getVisitorByPhone?phoneNumber=${phoneNumber}`)


        if (response.status === 200 && response.data.data) {
          // set the fetched user data in the form 
          setFetchedUserData(response.data.data);
          // console.log(response.data.data,"fetcheduser data")
          
          setExistingUserImage(response.data.data.imageUrl);
          // console.log(response.data.data.id, "existing visitor id")
          const newStateId = response.data.data.state.id;
          const newCityId = response.data.data.city.id;
          const newCityName = response.data.data.city.name;
          setFormData({
            ...formData,
            id: response.data.data.id,
            imageUrl: response.data.data.imageUrl,
            name: response.data.data.name || "",
            phoneNumber: phoneNumber,
            email: response.data.data.email || "",
           

            // stateId: response.data.data.state.id,
            stateId: newStateId,
            // state: response.data.data.state.name,
            city:newCityName,
            cityId: newCityId,

            address: response.data.data.address || "",
            companyName: response.data.data.companyName || "",
            // context: formData.meetingContext || '',

          });
        }
      } catch (error) {
        console.error(error);
      }

    }
  }
// console.log(formData,"formData from handle phone number change")
  // opening the camera modal
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState(null);
  // opening the camera modal
  const handleOpen = async () => {

    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true })

      setStream(userMediaStream);
      setOpen(true);
    } catch (error) {
      console.error('webcam access denied', error);
    }
  }

  // closing the camera modal
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setOpen(false);

  };

  // function for handling the captured image
  
  const handleImageCapture = (imageURL) => {
    // Set the captured image URL in the state
    setCapturedImage(imageURL);
  };


  // recapture the image
  const recapture = () => {
    // console.log("removing the captured image")
    setCapturedImage(null);
    setExistingUserImage("");

    setFormData({
      ...formData,
      imageUrl: null,
    });

  }


  const handleCancel = () => {
    setFormData({ ...initialFormData });

    setCapturedImage(null);
    setExistingUserImage("");
    setFetchedUserData(null);
    // localStorage.removeItem("capturedImageURL");
    // localStorage.clear();

    navigate("/company")

  }
  // console.log("contextrerender");
  return (
    <FormDataContext.Provider value={{handleGoBack,handleCompanyClick, data,setData,recapture, formData, setFormData, handleSubmit,searchBuilding, handleNewChange,newFormData,handlePhoneNumberChange, fetchedUserData, setFetchedUserData, handleOpen, handleClose, open, setOpen, stream, setStream, localPhone, currentStep, setStep, handleImageCapture, existingUserImage, capturedImage, handleCancel }}>
      {children}
    </FormDataContext.Provider>
  );
}

export default FormDataContext;



