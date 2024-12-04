// CancelLeave.js
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const CancelLeave = ({ leaveId, leaveRecords, setLeaveRecords }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCancelLeave = async () => {
    try {
      setIsCancelling(true);

      const { error } = await supabase
        .from("employee_leave")
        .update({ status: "Cancelled", is_cancelled: true })
        .eq("id", leaveId);

      if (error) throw error;

      // Remove cancelled leave from the records
      setLeaveRecords((prevRecords) =>
        prevRecords.filter((leave) => leave.id !== leaveId)
      );

      setSuccessMessage("Leave successfully cancelled!");
      setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
    } catch (err) {
      console.error("Error cancelling leave:", err);
      setError("Failed to cancel leave");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <button
        onClick={handleCancelLeave}
        className="bg-red-500 text-white py-2 px-4 rounded-lg"
        disabled={isCancelling}
      >
        {isCancelling ? "Cancelling..." : "Cancel Leave"}
      </button>
    </div>
  );
};

export default CancelLeave;
