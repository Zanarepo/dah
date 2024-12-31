import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaEye, FaCheck } from 'react-icons/fa';

const EmployeeTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskComment, setTaskComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      setLoading(true);
      try {
        const employeeId = localStorage.getItem('employee_id');

        if (!employeeId) {
          toast.error('Employee ID not found.');
          setLoading(false);
          return;
        }

        // Fetch employee details (name, department, ministry)
        const { data: employeeData, error: employeeError } = await supabase
          .from('employee_profiles')
          .select('first_name, last_name, department_id, ministry_id')
          .eq('employee_id', employeeId)
          .single();

        if (employeeError || !employeeData) {
          toast.error('Error fetching employee details.');
          setLoading(false);
          return;
        }

        setEmployee(employeeData);

        // Fetch tasks assigned to the employee
        const { data: taskData, error: taskError } = await supabase
          .from('task_manager')
          .select('task_id, task_name, status, comments, department_id, ministry_id')
          .eq('employee_id', employeeId);

        if (taskError) {
          toast.error('Error fetching tasks.');
          setLoading(false);
          return;
        }

        setTasks(taskData);
      } catch (error) {
        toast.error('Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('task_manager')
        .update({ status: newStatus })
        .eq('task_id', taskId);

      if (error) {
        toast.error('Error updating task status.');
        return;
      }

      toast.success(`Task marked as ${newStatus}`);
      setTasks(tasks.map(task => task.task_id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      toast.error('Error updating task status.');
    }
  };

  const handleCommentUpdate = async () => {
    try {
      const { error } = await supabase
        .from('task_manager')
        .update({ comments: taskComment })
        .eq('task_id', selectedTask.task_id);

      if (error) {
        toast.error('Error updating task comments.');
        return;
      }

      toast.success('Comment updated successfully');
      setSelectedTask({ ...selectedTask, comments: taskComment });
    } catch (error) {
      toast.error('Error updating task comment.');
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-center">Assigned Tasks</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Task Name</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Comments</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.task_id}
                  className={`hover:bg-gray-100 ${task.status === 'Pending' ? 'bg-yellow-100' : 'bg-green-100'}`}
                >
                  <td className="px-4 py-2 border">{task.task_name}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border">{task.comments}</td>
                  <td className="px-4 py-2 border flex space-x-2 justify-center">
                    <FaEye
                      onClick={() => {
                        setSelectedTask(task);
                        setTaskComment(task.comments || '');
                        setShowModal(true);
                      }}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    />
                    {task.status === 'Pending' && (
                      <FaCheck
                        onClick={() => updateTaskStatus(task.task_id, 'Completed')}
                        className="text-green-500 cursor-pointer hover:text-green-700"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks assigned to you.</p>
      )}

      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Task Details</h2>
            <p><strong>Task Name:</strong> {selectedTask.task_name}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Department ID:</strong> {employee?.department_id}</p>
            <p><strong>Ministry ID:</strong> {employee?.ministry_id}</p>

            <div className="mt-4">
              <strong>Comments:</strong>
              <textarea
                value={taskComment}
                onChange={(e) => setTaskComment(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
                rows="4"
              />
              <button
                onClick={handleCommentUpdate}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Comment
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTaskManager;
