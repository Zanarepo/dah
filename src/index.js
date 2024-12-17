import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you're using 'react-dom/client' for React 18+
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <ToastContainer /> {/* Include ToastContainer here */}
  </>
);

// Optional: Service worker and web vitals
serviceWorkerRegistration.unregister();
reportWebVitals();
