import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Import supabase client

import { CSVLink } from "react-csv"; // For CSV download
import Backfunction from "./MinistryDashboard"



  const MinistryDashboard = () => {
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false); // For modal visibility
  <Backfunction />
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const { data, error } = await supabase.from("ministries").select("id, name");
        if (error) throw error;
        setMinistries(data);
      } catch (error) {
        console.error("Error fetching ministries:", error.message);
      }
    };
    fetchMinistries();
  }, []);

  useEffect(() => {
    if (selectedMinistryId) {
      const fetchDepartments = async () => {
        try {
          const { data, error } = await supabase
            .from("departments")
            .select("id, name, ministry_id")
            .eq("ministry_id", selectedMinistryId);
          if (error) throw error;
          setDepartments(data);
        } catch (error) {
          console.error("Error fetching departments:", error.message);
        }
      };
      fetchDepartments();
    }
  }, [selectedMinistryId]);

  useEffect(() => {
    if (selectedDepartmentId) {
      const fetchEmployees = async () => {
        try {
          const { data, error } = await supabase
            .from("employee_profiles")
            .select("id, first_name, last_name, department_id, position, profile_picture")
            .eq("department_id", selectedDepartmentId);
          if (error) throw error;
          setEmployees(data);
        } catch (error) {
          console.error("Error fetching employees:", error.message);
        }
      };
      fetchEmployees();
    }
  }, [selectedDepartmentId]);

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.toLowerCase();
    const position = employee.position ? employee.position.toLowerCase() : "";
    return fullName.includes(searchQuery.toLowerCase()) || position.includes(searchQuery.toLowerCase());
    
  });
             
 

  return (
    
    <div className="ministry-dashboard p-6 relative">
      {/* Back Button */}
      {selectedMinistryId || selectedDepartmentId || selectedEmployee ? (
        <button
          onClick={() => {
            if (selectedEmployee) {
              setSelectedEmployee(null);
              setShowModal(false);
            } else if (selectedDepartmentId) {
              setSelectedDepartmentId(null);
              setEmployees([]);
            } else if (selectedMinistryId) {
              setSelectedMinistryId(null);
              setDepartments([]);
            }
 
          }}
          className="back-btn absolute top-4 left-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Back
        </button>
      ) : null}

      <h2 className="text-center text-xl font-bold mb-4">Ministry Dashboard</h2>

      {/* Ministries */}
      {!selectedMinistryId && (
        <div>
          <h3 className="text-lg font-semibold">Ministries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <div
                key={ministry.id}
                onClick={() => setSelectedMinistryId(ministry.id)}
                className="p-4 bg-blue-500 text-white rounded cursor-pointer text-center"
              >
                {ministry.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Departments */}
      {selectedMinistryId && !selectedDepartmentId && (
        <div>
          <h3 className="text-lg font-semibold">Departments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => setSelectedDepartmentId(department.id)}
                className="p-4 bg-green-500 text-white rounded cursor-pointer text-center"
              >
                {department.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees */}
      {selectedDepartmentId && (
        <div>
          <h3 className="text-lg font-semibold">Employees</h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 rounded p-2 mb-4 w-full"
          />

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="p-2 border">{`${employee.first_name} ${employee.last_name}`}</td>
                  <td className="p-2 border">{employee.position}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Download Button */}
          <CSVLink
            data={employees}
            headers={[
              { label: "First Name", key: "first_name" },
              { label: "Last Name", key: "last_name" },
              { label: "Position", key: "position" },
            ]}
            filename="employees.csv"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded inline-block"
          >
            Download Employee List
          </CSVLink>
        </div>
      )}

      {/* Employee Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Employee Details</h3>
            <img
              src={selectedEmployee.profile_picture}
              alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p className="text-center font-semibold">
              {`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
            </p>
            <p className="text-center text-gray-600">{selectedEmployee.position}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistryDashboard;
