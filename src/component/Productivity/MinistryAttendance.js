import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";

const MinistryAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [filters, setFilters] = useState({ name: "", department: "", ministry: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const employeeId = localStorage.getItem("employee_id");
      if (!employeeId) {
        toast.error("Employee ID not found.");
        return;
      }

      setLoading(true);
      try {
        // Fetch access details for employee with access_id = 2 (admin_ministry)
        const { data: accessData, error: accessError } = await supabase
          .from("access_level")
          .select("employee_id, ministry_id, department_id, access_id")
          .eq("employee_id", employeeId)
          .single();

        if (accessError || !accessData || accessData.access_id !== 2) {
          toast.error("Access denied. You must be an Admin Ministry.");
          setLoading(false);
          return;
        }

        // Fetch all attendance data regardless of access_id
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select(`employee_id, employee_profiles(first_name, last_name, department_id, ministry_id), check_in_time, check_out_time`);

        if (attendanceError) {
          toast.error("Error fetching attendance data.");
          setLoading(false);
          return;
        }

        if (!attendanceData || attendanceData.length === 0) {
          setAttendanceData([]);
          setFilteredData([]);
          setNoDataMessage("No attendance records found for this filter.");
          setLoading(false);
          return;
        }

        // Fetch department and ministry names
        const departmentIds = [...new Set(attendanceData.map(record => record.employee_profiles.department_id))];
        const ministryIds = [...new Set(attendanceData.map(record => record.employee_profiles.ministry_id))];

        const { data: departments } = await supabase
          .from("departments")
          .select("id, name")
          .in("id", departmentIds);

        const { data: ministries } = await supabase
          .from("ministries")
          .select("id, name")
          .in("id", ministryIds);

        // Enhance attendance data with names
        const enhancedData = attendanceData.map(record => ({
          ...record,
          department_name: departments.find(d => d.id === record.employee_profiles.department_id)?.name || "",
          ministry_name: ministries.find(m => m.id === record.employee_profiles.ministry_id)?.name || "",
        }));

        // Filter attendance data based on the ministry_id of the admin_ministry role
        const filteredByMinistry = enhancedData.filter(record => 
          record.employee_profiles.ministry_id === accessData.ministry_id
        );

        // Group attendance data by employee and aggregate stats
        const aggregatedData = filteredByMinistry.reduce((acc, record) => {
          const employeeKey = `${record.employee_id}-${record.department_name}-${record.ministry_name}`;
          if (!acc[employeeKey]) {
            acc[employeeKey] = { ...record, attendanceCount: 0 };
          }
          acc[employeeKey].attendanceCount += 1;
          return acc;
        }, {});

        setAttendanceData(Object.values(aggregatedData));
        setFilteredData(Object.values(aggregatedData));
        setNoDataMessage("");
      } catch (err) {
        toast.error("Error fetching attendance data.");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const calculateAttendanceRate = (attendanceCount) => {
    const totalWorkingDays = 260; // Example total working days
    return ((attendanceCount / totalWorkingDays) * 100).toFixed(2) + "%";
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });

    const filtered = attendanceData.filter(record => {
      const matchesName = filters.name
        ? `${record.employee_profiles.first_name} ${record.employee_profiles.last_name}`
            .toLowerCase()
            .includes(filters.name.toLowerCase())
        : true;
      const matchesDepartment = filters.department ? record.department_name === filters.department : true;
      const matchesMinistry = filters.ministry ? record.ministry_name === filters.ministry : true;

      return matchesName && matchesDepartment && matchesMinistry;
    });

    setFilteredData(filtered);
  };

  const downloadCSV = () => {
    const rows = [
      ["Name", "Department", "Ministry", "Attendance Rate"],
      ...filteredData.map(record => [
        `${record.employee_profiles.first_name} ${record.employee_profiles.last_name}`,
        record.department_name || "",
        record.ministry_name || "",
        calculateAttendanceRate(record.attendanceCount),
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Ministry Attendance</h1>

      {loading && (
        <div className="bg-gray-200 p-4 rounded-md">
          <p>Loading attendance data...</p>
        </div>
      )}

      {noDataMessage ? (
        <div className="bg-yellow-200 text-yellow-800 p-4 rounded-md">
          <p>{noDataMessage}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              className="p-2 border rounded-md"
              value={filters.name}
              onChange={e => handleFilterChange("name", e.target.value)}
            />
            <select
              className="p-2 border rounded-md"
              value={filters.department}
              onChange={e => handleFilterChange("department", e.target.value)}
            >
              <option value="">Filter by Department</option>
              {[...new Set(attendanceData.map(item => item.department_name))].map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className="p-2 border rounded-md"
              value={filters.ministry}
              onChange={e => handleFilterChange("ministry", e.target.value)}
            >
              <option value="">Filter by Ministry</option>
              {[...new Set(attendanceData.map(item => item.ministry_name))].map((ministry, index) => (
                <option key={index} value={ministry}>
                  {ministry}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={downloadCSV}
            className="mb-4 bg-blue-600 text-white p-2 rounded-md"
          >
            Download CSV
          </button>

          <table className="w-full border bg-white rounded-lg">
  <thead className="bg-blue-500 text-white">
    <tr>
      <th className="p-2">Name</th>
      <th className="p-2">Department</th>
      <th className="p-2">Ministry</th>
      <th className="p-2">Attendance Count</th>
      <th className="p-2">Attendance Rate</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((record, index) => (
      <tr key={index} className="text-center border-b">
        <td className="p-2">{`${record.employee_profiles.first_name} ${record.employee_profiles.last_name}`}</td>
        <td className="p-2">{record.department_name || ""}</td>
        <td className="p-2">{record.ministry_name || ""}</td>
        <td className="p-2">{record.attendanceCount}</td>
        <td className="p-2">{calculateAttendanceRate(record.attendanceCount)}</td>
      </tr>
    ))}
  </tbody>
</table>

        </>
      )}
    </div>
  );
};

export default MinistryAttendance;
