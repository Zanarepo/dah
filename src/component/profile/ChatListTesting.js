import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ChatListTesting = ({ onSelectChat }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const currentUserId = localStorage.getItem("employee_id");
        const { data, error } = await supabase
          .from("employee_profiles")
          .select("*")
          .neq("employee_id", currentUserId); // Exclude the logged-in user

        if (error) throw error;
        setEmployees(data || []);
        setFilteredEmployees(data || []); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to load employee list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (employee) =>
            employee.first_name.toLowerCase().includes(lowerCaseSearch) ||
            employee.last_name.toLowerCase().includes(lowerCaseSearch)
        )
      );
    }
  }, [searchTerm, employees]);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white border rounded-md shadow-lg md:max-w-xs w-full">
      {/* Header 
      <h2 className="text-xl font-semibold mb-4 text-center w-full">
        Members
      </h2>
*/}
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-gray-400">No employees found</div>
      ) : (
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-150px)]">
          {filteredEmployees.map((employee) => (
            <li
              key={employee.employee_id}
              onClick={() => onSelectChat(employee)}
              className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer transition duration-150"
            >
              <img
                src={
                  employee.profile_picture
                    ? employee.profile_picture
                    : `https://ui-avatars.com/api/?name=${employee.first_name}+${employee.last_name}`
                }
                alt={employee.first_name}
                className="w-8 h-8 rounded-full mr-4"
              />
              <span className="truncate">
                {employee.first_name} {employee.last_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatListTesting;
