import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, ArcElement, LineElement } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, ArcElement, LineElement);

const PerformanceTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('');
  const [employeeFilter] = useState('');
  const [chartType, setChartType] = useState('bar'); // Default chart type: Bar

  useEffect(() => {
    const fetchTasksAndFilters = async () => {
      try {
        const employeeId = localStorage.getItem('employee_id');

        if (!employeeId) {
          toast.error('Employee ID not found.');
          return;
        }

        const { data: accessData, error: accessError } = await supabase
          .from('access_level')
          .select('access_id, department_id, ministry_id')
          .eq('employee_id', employeeId)
          .single();

        if (accessError || !accessData) {
          toast.error('Access level not found.');
          return;
        }

        const { access_id: accessId, department_id: departmentId, ministry_id: ministryId } = accessData;

        let query = supabase.from('task_manager').select(`
          task_id,
          task_name,
          status,
          created_at,
          updated_at,
          employee_id,
          department_id,
          ministry_id
        `);
        

        let ministryQuery = supabase.from('ministries').select('*');
        let departmentQuery = supabase.from('departments').select('*');
        

        if (accessId === 1) {
          query = query.eq('department_id', departmentId);
          departmentQuery = departmentQuery.eq('id', departmentId);
          ministryQuery = ministryQuery.eq('id', ministryId);
        } else if (accessId === 2) {
          query = query.eq('ministry_id', ministryId);
          departmentQuery = departmentQuery.eq('ministry_id', ministryId);
          ministryQuery = ministryQuery.eq('id', ministryId);
        }

        const { data: taskData, error: taskError } = await query;

        if (taskError) {
          toast.error('Error fetching tasks.');
          return;
        }

        // Fetch employee names based on employee_id from employee_profiles
        const employeeIds = taskData.map(task => task.employee_id);
        const { data: employeeProfiles, error: employeeError } = await supabase
          .from('employee_profiles')
          .select('employee_id, first_name, last_name')
          .in('employee_id', employeeIds);

        if (employeeError) {
          toast.error('Error fetching employee profiles.');
          return;
        }

        const employeesData = employeeProfiles.reduce((acc, profile) => {
          acc[profile.employee_id] = {
            first_name: profile.first_name,
            last_name: profile.last_name,
          };
          return acc;
        }, {});

        // Add employee names to taskData
        const tasksWithEmployeeNames = taskData.map((task) => {
          const employee = employeesData[task.employee_id] || {};
          return {
            ...task,
            first_name: employee.first_name,
            last_name: employee.last_name,
          };
        });

        // Fetch departments and ministries
        const { data: departmentData, error: departmentError } = await departmentQuery;
        const { data: ministryData, error: ministryError } = await ministryQuery;

        if (departmentError || ministryError) {
          toast.error('Error fetching departments or ministries.');
          return;
        }

        // Calculate task completion time and sort tasks
        const tasksWithCompletionData = tasksWithEmployeeNames.map((task) => {
          const timeTaken = task.updated_at
            ? new Date(task.updated_at).getTime() - new Date(task.created_at).getTime()
            : 0;

          return {
            ...task,
            timeTaken,
          };
        });

        setTasks(tasksWithCompletionData);
        setDepartments(departmentData);
        setMinistries(ministryData);
        setFilteredTasks(tasksWithCompletionData);
      } catch (error) {
        toast.error('An error occurred while fetching the data.');
      }
    };

    fetchTasksAndFilters();
  }, []);


  const handleMinistryFilterChange = (e) => {
    setMinistryFilter(e.target.value);
    filterTasks(departmentFilter, e.target.value, employeeFilter);
  };

  const handleDepartmentFilterChange = (e) => {
    setDepartmentFilter(e.target.value);
    filterTasks(e.target.value, ministryFilter, employeeFilter);
  };

  
  //const handleEmployeeFilterChange = (e) => {
   // setEmployeeFilter(e.target.value);
    //filterTasks(departmentFilter, ministryFilter, e.target.value);
 // };

  const filterTasks = (department, ministry, employee) => {
    const filtered = tasks.filter((task) => {
      const departmentMatch = department ? task.department_id === parseInt(department) : true;
      const ministryMatch = ministry ? task.ministry_id === parseInt(ministry) : true;
      const employeeMatch = employee ? task.employee_id === parseInt(employee) : true;
      return departmentMatch && ministryMatch && employeeMatch;
    });
    setFilteredTasks(filtered);
  };

  const calculatePerformance = (tasks) => {
    const performance = tasks.reduce((acc, task) => {
      const { employee_id, first_name, last_name, department_id, ministry_id, timeTaken, status } = task;
      if (!acc[employee_id]) {
        acc[employee_id] = {
          first_name,
          last_name,
          department_id,
          ministry_id,
          completedTasks: 0,
          assignedTasks: 0,
          totalTime: 0,
        };
      }
      acc[employee_id].assignedTasks += 1;
      acc[employee_id].completedTasks += status === 'Completed' ? 1 : 0;
      acc[employee_id].totalTime += timeTaken;
      return acc;
    }, {});

    const sortedPerformance = Object.values(performance).sort((a, b) => b.completedTasks - a.completedTasks);
    return sortedPerformance;
  };

  const performanceData = calculatePerformance(filteredTasks);


  
  const ministryChartData = ministries.map((ministry) => {
    const ministryTasks = performanceData.filter((task) => task.ministry_id === ministry.id);
    const totalTasks = ministryTasks.reduce((sum, task) => sum + task.completedTasks, 0);
    return {
      ministry: ministry.name,
      tasks: totalTasks,
    };
  });
  
  const departmentChartData = departments.map((department) => {
    const departmentTasks = performanceData.filter((task) => task.department_id === department.id);
    const totalTasks = departmentTasks.reduce((sum, task) => sum + task.completedTasks, 0);
    return {
      department: department.name,
      tasks: totalTasks,
    };
  });


  const employeeChartData = performanceData.map((employee) => {
    // Calculate completion rate with a decimal
    const completionRate = employee.assignedTasks
      ? ((employee.completedTasks / employee.assignedTasks) * 1000).toFixed(1) // Calculation formula updated
      : 0;
    return {
      employee: `${employee.first_name} ${employee.last_name}`,
      completionRate,
    };
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const chartData = {
    bar: {
      labels: departmentChartData.map((data) => data.department),
      datasets: [
        {
          label: 'Completed Tasks',
          data: departmentChartData.map((data) => data.tasks),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    line: {
      labels: ministryChartData.map((data) => data.ministry),
      datasets: [
        {
          label: 'Completed Tasks',
          data: ministryChartData.map((data) => data.tasks),
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    },
    pie: {
      labels: employeeChartData.map((data) => data.employee),
      datasets: [
        {
          label: 'Completion Rate',
          data: employeeChartData.map((data) => data.completionRate),
          backgroundColor: employeeChartData.map(() =>
            `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`
          ),
          borderColor: employeeChartData.map(() => 'rgba(0, 0, 0, 0.1)'),
          borderWidth: 1,
        },
      ],
    },
  };

  return (

    <><div className="container mx-auto py-10">
          <div className="flex flex-wrap gap-6 items-center">
              {/* Ministry Filter */}
              <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-2">
                  <label
                      htmlFor="ministryFilter"
                      className="text-gray-700 font-medium"
                  >
                      Ministry:
                  </label>
                  <select
                      id="ministryFilter"
                      value={ministryFilter}
                      onChange={handleMinistryFilterChange}
                      className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <option value="">All</option>
                      {ministries.map((ministry) => (
                          <option key={ministry.id} value={ministry.id}>
                              {ministry.name}
                          </option>
                      ))}
                  </select>
              </div>

              {/* Department Filter */}
              <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-2">
                  <label
                      htmlFor="departmentFilter"
                      className="text-gray-700 font-medium"
                  >
                      Department:
                  </label>
                  <select
                      id="departmentFilter"
                      value={departmentFilter}
                      onChange={handleDepartmentFilterChange}
                      className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <option value="">All</option>
                      {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                              {department.name}
                          </option>
                      ))}
                  </select>
              </div>
          </div>
      </div><table className="min-w-full table-auto border-collapse mb-8">
              <thead>
                  <tr className="bg-gray-200 text-gray-800">
                      <th className="px-6 py-3 border-b text-left font-semibold">Employee</th>
                      <th className="px-6 py-3 border-b text-left font-semibold">Department</th>
                      <th className="px-6 py-3 border-b text-left font-semibold">Ministry</th>
                      <th className="px-6 py-3 border-b text-center font-semibold">Assigned Tasks</th>
                      <th className="px-6 py-3 border-b text-center font-semibold">Completed Tasks</th>
                      <th className="px-6 py-3 border-b text-center font-semibold">Completion Rate</th>
                  </tr>
              </thead>

              <tbody>


                  {performanceData.map((employee) => {
                      // Calculate completion rate
                      const completionRate = employee.assignedTasks
                          ? ((employee.completedTasks / employee.assignedTasks) * 100).toFixed(1)
                          : 0;

                      // Determine background color based on completion rate (green for high, red for low)
                      const completionColor = completionRate >= 80
                          ? 'bg-green-100 text-green-700'
                          : completionRate >= 50
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700';

                      return (
                          <tr
                              key={employee.employee_id}
                              className="hover:bg-gray-50 transition-all ease-in-out duration-200"
                          >
                              <td className="px-6 py-4 border-b text-left font-medium text-gray-800">
                                  {employee.first_name} {employee.last_name}
                              </td>
                              <td className="px-6 py-4 border-b text-left text-gray-700" title="Department">
                                  {departments.find((dept) => dept.id === employee.department_id)?.name}
                              </td>
                              <td className="px-6 py-4 border-b text-left text-gray-700" title="Ministry">
                                  {ministries.find((ministry) => ministry.id === employee.ministry_id)?.name}
                              </td>
                              <td className="px-6 py-4 border-b text-center text-gray-800">
                                  {employee.assignedTasks}
                              </td>
                              <td className="px-6 py-4 border-b text-center text-gray-800">
                                  {employee.completedTasks}
                              </td>
                              <td
                                  className={`px-6 py-4 border-b text-center ${completionColor} font-semibold`}
                                  title={`Completion rate: ${completionRate}%`}
                              >
                                  {completionRate}%
                              </td>
                          </tr>
                      );
                  })}
              </tbody>

          </table>
        
        
        <div className="mb-8">
              <label className="mr-2">Select Chart Type:</label>
              <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="border border-gray-300 p-2"
              >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
              </select>
          </div><div className="chart-container">
              {chartType === 'bar' && <Bar data={chartData.bar} options={chartOptions} />}
              {chartType === 'line' && <Line data={chartData.line} options={chartOptions} />}
              {chartType === 'pie' && <Pie data={chartData.pie} options={chartOptions} />}
              
          </div>
          
          
          </>
    











  );
};

export default PerformanceTracking;
