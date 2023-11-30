import './App.css';
import { Route, Routes } from 'react-router-dom';
import Invite from './components/Invite';
import Responsive from './components/Responsive';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { Toaster } from 'react-hot-toast';
import Building from "./components/Building";
import CompanyList from './components/CompanyList';


function App() {


  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Building />} />
          <Route path="/company" element={<CompanyList/>}/>
          <Route path="/responsive" element={<Responsive />} />
          <Route path="/invite" element={<Invite />} />
          
        </Routes>
        {/* add toast */}
        <ToastContainer autoClose={800}/>
        <Toaster />

    </div>
  );
}

export default App;


// november 30 final folder