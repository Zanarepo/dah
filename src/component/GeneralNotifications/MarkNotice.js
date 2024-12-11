import React from "react";
import { supabase } from "../../supabaseClient";

const MarkNotice = ({ id, isRead, refreshNotifications }) => {
  const toggleReadStatus = async () => {
    const { error } = await supabase
      .from("general_notifications")
      .update({ is_read: !isRead })
      .eq("id", id);

    if (error) {
      console.error("Error updating notification status:", error);
    } else {
      refreshNotifications();
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded-md text-sm ${
        isRead ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"
      }`}
      onClick={toggleReadStatus}
    >
      {isRead ? "Mark Unread" : "Mark Read"}
    </button>
  );
};

export default MarkNotice;
