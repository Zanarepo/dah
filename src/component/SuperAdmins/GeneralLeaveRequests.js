import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { FaEdit, FaTrash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LeaveRequest = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    comment: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit", or "view"
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employee_id");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    } else {
      setError("Employee ID is missing. Please log in again.");
    }
  }, []);

  // Use useCallback to memoize fetchLeaveRecords so it doesn't change on every render
  const fetchLeaveRecords = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("*")
        .eq("employee_id", employeeId)
        .order("start_date", { ascending: false });

      if (error) throw error;

      const currentDate = new Date();
      const activeRecords = data.filter(
        (record) => new Date(record.end_date) >= currentDate
      );
      setLeaveRecords(activeRecords);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave records.");
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchLeaveRecords();
    }
  }, [employeeId, fetchLeaveRecords]); // Now fetchLeaveRecords is included in the dependency array

  const handleOpenModal = (type, leave = null) => {
    setModalType(type);
    setSelectedLeave(leave);

    if (type === "edit" && leave) {
      setLeaveDetails({
        leaveType: leave.leave_type,
        startDate: leave.start_date,
        endDate: leave.end_date,
        status: leave.status,
        comment: leave.comment || "",
      });
    } else if (type === "add") {
      setLeaveDetails({
        leaveType: "",
        startDate: "",
        endDate: "",
        status: "Pending",
        comment: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
    setSelectedLeave(null);
  };

  const handleSaveLeave = async () => {
    if (!leaveDetails.leaveType || !leaveDetails.startDate || !leaveDetails.endDate) {
      setError("All fields are required.");
      return;
    }

    if (new Date(leaveDetails.startDate) > new Date(leaveDetails.endDate)) {
      setError("Start date cannot be later than end date.");
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("employee_profiles")
        .select("department_id, ministry_id")
        .eq("employee_id", employeeId)
        .single();

      if (profileError) throw profileError;

      if (!profileData) {
        setError("Employee profile not found.");
        return;
      }

      const { department_id, ministry_id } = profileData;

      const payload = {
        employee_id: employeeId,
        leave_type: leaveDetails.leaveType,
        start_date: leaveDetails.startDate,
        end_date: leaveDetails.endDate,
        status: leaveDetails.status,
        comment: leaveDetails.comment || "",
        department_id,
        ministry_id,
      };

      if (modalType === "edit" && selectedLeave) {
        const { error } = await supabase
          .from("employee_leave")
          .update(payload)
          .eq("id", selectedLeave.id);

        if (error) throw error;

        fetchLeaveRecords();  // Call fetchLeaveRecords after update
      } else {
        const { error } = await supabase.from("employee_leave").insert([payload]);

        if (error) throw error;

        fetchLeaveRecords();  // Call fetchLeaveRecords after insert
      }

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save leave request.");
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    try {
      const { error } = await supabase.from("employee_leave").delete().eq("id", leaveId);
      if (error) throw error;

      setLeaveRecords((prev) => prev.filter((record) => record.id !== leaveId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete leave record.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Back Button */}
      <button
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6">Leave Management</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add Leave Button */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-600"
        onClick={() => handleOpenModal("add")}
      >
        Request Leave
      </button>

      {/* Leave Records Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Leave Type</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRecords.map((record) => (
              <tr key={record.id}>
                <td className="py-2 px-4 border">{record.leave_type}</td>
                <td className="py-2 px-4 border">{record.start_date}</td>
                <td className="py-2 px-4 border">{record.end_date}</td>
                <td className="py-2 px-4 border">{record.status}</td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleOpenModal("view", record)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleOpenModal("edit", record)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteLeave(record.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add" ? "Request Leave" : modalType === "edit" ? "Edit Leave" : "View Leave"}
            </h3>

            {modalType !== "view" ? (
              <div className="space-y-4">
                <select
                  className="w-full border p-2 rounded"
                  value={leaveDetails.leaveType}
                  onChange={(e) =>
                    setLeaveDetails({ ...leaveDetails, leaveType: e.target.value })
                  }
                >
                  <option value="">Select Leave Type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>

                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={leaveDetails.startDate}
                  onChange={(e) =>
                    setLeaveDetails({ ...leaveDetails, startDate: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={leaveDetails.endDate}
                  onChange={(e) =>
                    setLeaveDetails({ ...leaveDetails, endDate: e.target.value })
                  }
                />

                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Comments"
                  value={leaveDetails.comment}
                  onChange={(e) =>
                    setLeaveDetails({ ...leaveDetails, comment: e.target.value })
                  }
                />
              </div>
            ) : (
              <div>
                <p><strong>Leave Type:</strong> {selectedLeave.leave_type}</p>
                <p><strong>Start Date:</strong> {selectedLeave.start_date}</p>
                <p><strong>End Date:</strong> {selectedLeave.end_date}</p>
                <p><strong>Status:</strong> {selectedLeave.status}</p>
                <p><strong>Comment:</strong> {selectedLeave.comment}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {modalType !== "view" && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={handleSaveLeave}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
