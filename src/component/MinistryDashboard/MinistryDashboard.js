import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Import supabase client

const MinistryDashboard = () => {
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null); // Store employee_id from local storage
  //const [userRole, setUserRole] = useState(null); // Role of the user, to control access
  const [adminAccess, setAdminAccess] = useState(null); // Admin access details
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for viewing
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality

  useEffect(() => {
    const loggedInEmployeeId = localStorage.getItem("employee_id"); // Get employee_id from local storage
    setEmployeeId(loggedInEmployeeId); // Set employee_id
  }, []);

  useEffect(() => {
    if (employeeId) {
      const fetchAdminAccess = async () => {
        try {
          const { data, error } = await supabase
            .from("access_level")
            .select("ministry_id, department_id, access_id")
            .eq("employee_id", employeeId);

          if (error) throw error;

          // If the user is found in the access_level table, set the access
          setAdminAccess(data[0]);
        } catch (error) {
          console.error("Error fetching admin access:", error.message);
        }
      };

      fetchAdminAccess();
    }
  }, [employeeId]);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        let query = supabase.from("ministries").select("id, name");

        // If the user is a super admin (no ministry_id or department_id), they have access to all ministries
        if (!adminAccess?.ministry_id || !adminAccess?.department_id) {
          // Grant full access to all ministries and departments
        } else if (adminAccess?.ministry_id) {
          // If the user has a ministry_id, filter ministries based on their access
          query = query.eq("id", adminAccess.ministry_id);
        }

        const { data, error } = await query;
        if (error) throw error;

        setMinistries(data);
      } catch (error) {
        console.error("Error fetching ministries:", error.message);
      }
    };

    fetchMinistries();
  }, [adminAccess]);

  useEffect(() => {
    if (selectedMinistryId) {
      const fetchDepartments = async () => {
        try {
          let query = supabase
            .from("departments")
            .select("id, name, ministry_id")
            .eq("ministry_id", selectedMinistryId);

          // Check if user is a ministry admin (access_id 3 for example)
          if (!adminAccess?.ministry_id || !adminAccess?.department_id) {
            // Full access, no filtering needed
          } else if (adminAccess?.ministry_id) {
            query = query.eq("ministry_id", selectedMinistryId); // Show all departments in the ministry
          } else if (adminAccess?.department_id) {
            query = query.eq("id", adminAccess.department_id); // If user has department-level access
          }

          const { data, error } = await query;
          if (error) throw error;

          setDepartments(data);
        } catch (error) {
          console.error("Error fetching departments:", error.message);
        }
      };

      fetchDepartments();
    }
  }, [selectedMinistryId, adminAccess]);

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

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm) {
      // Apply search logic here, you can filter employees by searchTerm
      const filteredEmployees = employees.filter(
        (employee) =>
          employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEmployees(filteredEmployees);
    }
  };

  const handleDownload = () => {
    const data = employees.map((employee) => ({
      Name: `${employee.first_name} ${employee.last_name}`,
      Position: employee.position,
    }));

    const csv = [
      ["Name", "Position"],
      ...data.map((row) => [row.Name, row.Position]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees.csv";
    link.click();
  };

  return (
    <div className="ministry-dashboard p-6 relative">
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

      {/* Back Navigation for Departments */}
      {selectedMinistryId && !selectedDepartmentId && (
        <div>
          <h3 className="text-lg font-semibold">Departments</h3>
          <button
            onClick={() => setSelectedMinistryId(null)}
            className="text-blue-500 font-semibold mb-4 inline-block"
          >
            Back
          </button>
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
          <button
            onClick={() => setSelectedDepartmentId(null)}
            className="text-blue-500 font-semibold mb-4 inline-block"
          >
            Back
          </button>
          {/* Search and Download Buttons */}
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search Employee"
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Search
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download CSV
            </button>
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="p-2 border">{`${employee.first_name} ${employee.last_name}`}</td>
                  <td className="p-2 border">{employee.position}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              onClick={handleCloseModal}
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
