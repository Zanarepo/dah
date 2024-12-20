import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaEye, FaTrash } from 'react-icons/fa';

const TaskTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', department: '', ministry: '' });

  useEffect(() => {
    const fetchTasksAndFilters = async () => {
      setLoading(true);

      try {
        const employeeId = localStorage.getItem('employee_id');

        if (!employeeId) {
          toast.error('Employee ID not found.');
          setLoading(false);
          return;
        }

        // Fetch access level for the employee
        const { data: accessData, error: accessError } = await supabase
          .from('access_level')
          .select('access_id, department_id, ministry_id')
          .eq('employee_id', employeeId)
          .single();

        if (accessError || !accessData) {
          toast.error('Access level not found.');
          setLoading(false);
          return;
        }

        const { access_id: accessId, department_id: departmentId, ministry_id: ministryId } = accessData;

        let query = supabase.from('task_manager').select(`
          task_id,
          task_name,
          status,
          comments,
          employee_profiles(first_name, last_name),
          departments(name),
          ministries(name)
        `);

        let departmentQuery = supabase.from('departments').select('*');
        let ministryQuery = supabase.from('ministries').select('*');

        // Apply filters based on access level
        if (accessId === 1) {
          query = query.eq('department_id', departmentId);
          departmentQuery = departmentQuery.eq('id', departmentId);
          ministryQuery = ministryQuery.eq('id', ministryId); 
        } else if (accessId === 2) {
          query = query.eq('ministry_id', ministryId);
          departmentQuery = departmentQuery.eq('ministry_id', ministryId);
          ministryQuery = ministryQuery.eq('id', ministryId);
        } else if (accessId === 3) {
          // Super Admin: No restrictions
        } else {
          toast.error('Invalid access level.');
          setLoading(false);
          return;
        }

        // Fetch tasks
        const { data: taskData, error: taskError } = await query;

        if (taskError) {
          toast.error('Error fetching tasks.');
          setLoading(false);
          return;
        }

        // Fetch departments and ministries
        const { data: departmentData, error: departmentError } = await departmentQuery;
        const { data: ministryData, error: ministryError } = await ministryQuery;

        if (departmentError || ministryError) {
          toast.error('Error fetching filter options.');
          setLoading(false);
          return;
        }

        const sortedTasks = taskData.sort((a, b) => (a.status === 'Pending' ? -1 : 1));
        setTasks(sortedTasks);

        setDepartments(departmentData || []);
        setMinistries(ministryData || []);
      } catch (error) {
        toast.error('Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndFilters();
  }, []);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.status ? task.status === filters.status : true) &&
      (filters.department ? task.departments?.name === filters.department : true) &&
      (filters.ministry ? task.ministries?.name === filters.ministry : true)
    );
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get color based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  // Open task modal
  const viewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Close task modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const deleteTask = async (taskId) => {
    const confirmToast = toast.info(
      <div className="flex justify-between items-center">
        <span>Are you sure you want to delete this task?</span>
        <div className="space-x-4">
          <button
            onClick={async () => {
              const { error } = await supabase
                .from('task_manager')
                .delete()
                .eq('task_id', taskId);
  
              if (error) {
                toast.error('Error deleting task.');
                toast.dismiss(confirmToast);
                return;
              }
  
              toast.success('Task deleted successfully!');
              setTasks(tasks.filter((task) => task.task_id !== taskId));
              toast.dismiss(confirmToast);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Yes, delete
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            No, cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        position: 'bottom-center',
      }
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Tracking</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="">All Departments</option>
          {departments.length > 0 ? (
            departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No departments available
            </option>
          )}
        </select>

        <select
          name="ministry"
          value={filters.ministry}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="">All Ministries</option>
          {ministries.length > 0 ? (
            ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.name}>
                {ministry.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No ministries available
            </option>
          )}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Task ID</th>
                <th className="px-4 py-2 border">Employee Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Ministry</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.task_id}
                  className={`hover:bg-gray-100 ${getStatusColor(task.status)}`}
                >
                  <td className="px-4 py-2 border">{task.task_id}</td>
                  <td className="px-4 py-2 border">
                    {task.employee_profiles?.first_name} {task.employee_profiles?.last_name}
                  </td>
                  <td className="px-4 py-2 border">{task.departments?.name || 'N/A'}</td>
                  <td className="px-4 py-2 border">{task.ministries?.name || 'N/A'}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border flex space-x-2 justify-center">
                    <FaEye
                      onClick={() => viewTask(task)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    />
                    <FaTrash
                      onClick={() => deleteTask(task.task_id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks found for the selected filters.</p>
      )}

      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Task Details</h2>
            <p>
              <strong>Task Name:</strong> {selectedTask.task_name}
            </p>
            <p>
              <strong>Status:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Comments:</strong> {selectedTask.comments || 'No comments available'}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracking;
