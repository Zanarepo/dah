import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure this is correctly imported from your Supabase config

const AdminNotification = () => {
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // Toast message for success/error

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employee_profiles').select('*');
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selection of employee(s)
  const handleSelectEmployee = (employee) => {
    if (selectedEmployees.some((emp) => emp.id === employee.id)) {
      setSelectedEmployees(selectedEmployees.filter((emp) => emp.id !== employee.id));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  // Handle sending notification
  const handleSendAdminNotification = async () => {
    const adminId = localStorage.getItem('employee_id'); // Admin's ID

    // Step 1: Build the list of recipients (either 'all' or specific employees)
    const validRecipients = [];
    if (recipientType === "all") {
      // If the recipient type is 'all', we send it to all employees.
      validRecipients.push("all"); // "all" can be used as a special flag for all users.
    } else {
      // If specific recipients are selected, push those employee IDs to the validRecipients array.
      for (const emp of selectedEmployees) {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('employee_id')
          .eq('employee_id', emp.id); // Validate employee existence

        if (data && data.length > 0) {
          validRecipients.push(emp.id); // Add valid employee IDs
        } else {
          console.error(`Employee with ID ${emp.id} not found.`);
        }
      }
    }

    // Step 2: Insert into admin_notice table
    const { data, error } = await supabase.from('admin_notice').insert([
      {
        message,
        type: "General Reminder",
        recipients: validRecipients, // Either all employees or specific selected employees
        is_read: false,
        created_at: new Date(),
        created_by: adminId,
      },
    ]);

    if (error) {
      console.error("Error sending admin notification:", error);
      setToastMessage("Error sending notification. Please try again.");
    } else {
      // Step 3: Send the notification to the recipients
      validRecipients.forEach(async (recipient) => {
        const notificationToSend = {
          message,
          type: "General Reminder",
          employee_id: recipient === "all" ? null : recipient, // 'null' for 'all'
          sender_id: adminId,
          is_read: false,
          created_at: new Date(),
        };

        // Insert into the general_notifications table
        const { error: notificationError } = await supabase
          .from('general_notifications')
          .insert([notificationToSend]);

        if (notificationError) {
          console.error("Error sending notification to employee:", notificationError);
        }
      });

      // Reset state after successful submission
      setToastMessage("Admin notification sent successfully!");
      setMessage("");
      setRecipientType("all");
      setSelectedEmployees([]);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Send Admin Notification</h2>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Message</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Recipient Type</label>
        <select
          className="w-full p-2 border rounded-md"
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
        >
          <option value="all">All Employees</option>
          <option value="specific">Specific Employees</option>
        </select>
      </div>

      {recipientType === "specific" && (
        <div className="mb-4">
          <label className="block text-gray-700">Select Employees</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Search Employees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${selectedEmployees.some((emp) => emp.id === employee.id) ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelectEmployee(employee)}
              >
                <input
                  type="checkbox"
                  checked={selectedEmployees.some((emp) => emp.id === employee.id)}
                  onChange={() => handleSelectEmployee(employee)}
                  className="mr-2"
                />
                <span>{`${employee.first_name} ${employee.last_name}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSendAdminNotification}
        >
          Send Notification
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-green-500 text-white rounded-md shadow-md">
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;
