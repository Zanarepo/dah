// Layout.js
import React from 'react';
import Sidebar from '../Dashbaord/Sidebar';  // Assuming Sidebar is in the same directory
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";

const Layout = ({ children }) => {
  
  return ( 
    
    <div className="flex">
      <Sidebar /> {/* Sidebar */} 
      
      <div className="flex-1 p-6 ml-64"> {/* Content section */}
        
        {children} {/* Page content */}

        
        
      </div>
   
    </div>
  );
};

export default Layout;
