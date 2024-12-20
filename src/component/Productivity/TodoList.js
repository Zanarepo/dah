import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify'; // Import Toastify for notifications
import { FaEdit, FaTrash } from 'react-icons/fa'; // Icons for edit and delete

const TaskManagement = () => {
  const [taskName, setTaskName] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [editingTask, setEditingTask] = useState(null); // State for editing a task
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // For delete confirmation modal
  const [taskToDelete, setTaskToDelete] = useState(null); // Store task to delete
  const employeeId = localStorage.getItem('employee_id');

  // Fetch tasks from Supabase
  const getTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('personal_tasks')
      .select('*')
      .eq('employee_id', employeeId);
    if (error) {
      toast.error('Error fetching tasks');
    } else {
      setTasks(data);
    }
    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  // Create or Update task
  const saveTask = async (e) => {
    e.preventDefault();
    if (!taskName || !dueTime) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    if (editingTask) {
      // Update task
      const { error } = await supabase
        .from('personal_tasks')
        .update({
          task_name: taskName,
          due_time: dueTime,
        })
        .eq('id', editingTask.id);

      if (error) {
        toast.error('Error updating task');
      } else {
        toast.success('Task updated successfully');
        setEditingTask(null);
      }
    } else {
      // Create task
      const { error } = await supabase
        .from('personal_tasks')
        .insert([
          {
            task_name: taskName,
            employee_id: employeeId,
            due_time: dueTime,
            status: 'Pending',
          },
        ]);

      if (error) {
        toast.error('Error creating task');
      } else {
        toast.success('Task created successfully');
      }
    }
    setTaskName('');
    setDueTime('');
    setIsModalOpen(false);
    getTasks();
    setLoading(false);
  };

  // Mark task as completed
  const markAsCompleted = async (taskId) => {
    setLoading(true);
    const { error } = await supabase
      .from('personal_tasks')
      .update({ status: 'Completed' })
      .eq('id', taskId);

    if (error) {
      toast.error('Error updating task');
    } else {
      toast.success('Task marked as completed');
      getTasks();
    }
    setLoading(false);
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmation(true);
  };

  // Delete task
  const deleteTask = async () => {
    if (!taskToDelete) return;
    setLoadingDelete(true);
    const { error } = await supabase
      .from('personal_tasks')
      .delete()
      .eq('id', taskToDelete);

    if (error) {
      toast.error('Error deleting task');
    } else {
      toast.success('Task deleted successfully');
      getTasks();
    }
    setLoadingDelete(false);
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  // Countdown Timer Function for Notification
  const getCountdown = (dueDate) => {
    const now = new Date();
    const timeRemaining = new Date(dueDate) - now;

    if (timeRemaining <= 0) return 'expired'; // Return "expired" if past due

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="max-w-full mx-auto p-4 overflow-x-hidden">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 text-center">Personal Tasks</h1>
  
      {/* Create Task Button */}
      <div className="text-right mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Task
        </button>
      </div>
  
      {/* Task List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Task Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{task.task_name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{new Date(task.due_time).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => markAsCompleted(task.id)}
                        className={`px-4 py-2 rounded-md ${
                          task.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {task.status === 'Completed' ? 'Completed' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-4">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setTaskName(task.task_name);
                            setDueTime(task.due_time);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteConfirmation(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
  
                      <div className="text-sm text-gray-500">
                        {getCountdown(task.due_time) === 'expired' ? (
                          <span className="text-red-600 font-semibold">Expired</span>
                        ) : (
                          `Countdown: ${getCountdown(task.due_time)}`
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md max-w-xs sm:max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this task?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                disabled={loadingDelete}
              >
                {loadingDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 sm:w-96">
            <h2 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={saveTask}>
              <div className="mb-4">
                <label htmlFor="taskName" className="block text-sm font-semibold text-gray-600">Task Name</label>
                <input
                  type="text"
                  id="taskName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dueTime" className="block text-sm font-semibold text-gray-600">Due Date</label>
                <input
                  type="datetime-local"
                  id="dueTime"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  disabled={loadingEdit}
                >
                  {loadingEdit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
};
export default TaskManagement;
