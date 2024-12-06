import React, { useState, useEffect } from 'react';

const NotificationMessage = ({ notifications }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (notifications.length >= 5) {
      setMessage("Your Attention is seriously needed Here!!!");
    } else if (notifications.length > 1) {
      setMessage("Seems your table is getting full.");
    } else if (notifications.length === 0) {
      setMessage("Yippeee!!! All Clear Here.");
    } else {
      setMessage(''); // Handle other cases, if needed
    }
  }, [notifications]);

  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
      <p>{message}</p>
    </div>
  );
};

export default NotificationMessage;
