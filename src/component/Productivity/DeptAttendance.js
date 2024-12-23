import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";
import Papa from "papaparse";

const DepartmentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [filters, setFilters] = useState({ name: "", department: "" });
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const employeeId = localStorage.getItem("employee_id");
      if (!employeeId) {
        toast.error("Employee ID not found in local storage.");
        return;
      }

      setLoading(true);
      try {
        const { data: accessData, error: accessError } = await supabase
          .from("access_level")
          .select("employee_id, department_id, access_id")
          .eq("employee_id", employeeId)
          .single();

        if (accessError || !accessData) {
          console.error("Access level fetch error:", accessError);
          toast.error("Error fetching access level data.");
          setLoading(false);
          return;
        }

        if (accessData.access_id !== 1) {
          toast.error("Access denied. Department-level admin access required.");
          setLoading(false);
          return;
        }

        const { department_id } = accessData;

        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select(
            `
            employee_id,
            employee_profiles (
              first_name,
              last_name,
              department_id
            ),
            check_in_time,
            check_out_time
          `
          )
          .eq("employee_profiles.department_id", department_id);

        if (attendanceError) {
          console.error("Attendance fetch error:", attendanceError);
          toast.error("Error fetching attendance data.");
          setLoading(false);
          return;
        }

        if (!attendanceData || attendanceData.length === 0) {
          setAttendanceData([]);
          setFilteredData([]);
          setNoDataMessage("No attendance records found for your department.");
          setLoading(false);
          return;
        }

        const validData = attendanceData.filter(record => record.employee_profiles !== null);

        const { data: departmentData, error: departmentError } = await supabase
          .from("departments")
          .select("id, name")
          .eq("id", department_id)
          .single();

        if (departmentError) {
          console.error("Department fetch error:", departmentError);
          toast.error("Error fetching department data.");
          setLoading(false);
          return;
        }

        const enhancedData = validData.map(record => ({
          ...record,
          department_name: departmentData?.name || "",
        }));

        const aggregatedData = enhancedData.reduce((acc, record) => {
          const key = record.employee_id;
          if (!acc[key]) {
            acc[key] = { ...record, attendanceCount: 0 };
          }
          acc[key].attendanceCount += 1;
          return acc;
        }, {});

        setAttendanceData(Object.values(aggregatedData));
        setFilteredData(Object.values(aggregatedData));
        setNoDataMessage("");
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Error fetching attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const calculateAttendanceRate = attendanceCount => {
    const totalWorkingDays = 260;
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

      return matchesName && matchesDepartment;
    });

    setFilteredData(filtered);
  };

  const handleDownload = () => {
    const csvData = filteredData.map(record => ({
      Name: `${record.employee_profiles.first_name} ${record.employee_profiles.last_name}`,
      Department: record.department_name,
      AttendanceCount: record.attendanceCount,
      AttendanceRate: calculateAttendanceRate(record.attendanceCount),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Department Attendance</h1>

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
          <div className="mb-4 flex flex-col md:flex-row justify-between">
            <input
              type="text"
              placeholder="Search by Name"
              className="p-2 border rounded-md"
              value={filters.name}
              onChange={e => handleFilterChange("name", e.target.value)}
            />
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Download CSV
            </button>
          </div>

          <table className="w-full border bg-white rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Department</th>
                <th className="p-2">Attendance Count</th>
                <th className="p-2">Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((record, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="p-2">{`${record.employee_profiles.first_name} ${record.employee_profiles.last_name}`}</td>
                  <td className="p-2">{record.department_name || ""}</td>
                  <td className="p-2">{record.attendanceCount}</td>
                  <td className="p-2">{calculateAttendanceRate(record.attendanceCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            {Array.from(
              { length: Math.ceil(filteredData.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentAttendance;
