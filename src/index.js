import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import FormDataContext, { FormDataProvider } from './GlobalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <FormDataProvider>
      <App />
      </FormDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);


