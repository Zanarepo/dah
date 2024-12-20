import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const EmployeeTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [ setEmployee] = useState(null);
  const [setDepartments] = useState([]);
  const [setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  
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
  
        // Fetch departments and ministries for name lookup
        const { data: departmentData } = await supabase
          .from('departments')
          .select('department_id, department_name');
  
        const { data: ministryData } = await supabase
          .from('ministries')
          .select('ministry_id, ministry_name');
  
        setDepartments(departmentData);
        setMinistries(ministryData);
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // This ensures that the effect only runs once on mount
  
  const updateTaskStatus = async (taskId, status) => {
    const { error } = await supabase
      .from('task_manager')
      .update({ status })
      .eq('task_id', taskId);

    if (error) {
      toast.error('Error updating task status.');
    } else {
      toast.success('Task status updated successfully!');
      setTasks(tasks.map(task => 
        task.task_id === taskId ? { ...task, status } : task
      ));
    }
  };

  const updateComment = async (taskId) => {
    const { error } = await supabase
      .from('task_manager')
      .update({ comments: comment })
      .eq('task_id', taskId);

    if (error) {
      toast.error('Error updating comment.');
    } else {
      toast.success('Comment updated successfully!');
      setTasks(tasks.map(task => 
        task.task_id === taskId ? { ...task, comments: comment } : task
      ));
      setComment(''); // Clear the comment input after update
    }
  };

  return (
    <div className="container mx-auto p-4">
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
                <th className="px-4 py-2 border">Task ID</th>
                <th className="px-4 py-2 border">Task Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Ministry</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Comments</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.task_id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{task.task_id}</td>
                  <td className="px-4 py-2 border">{task.task_name}</td>
                  <td className="px-4 py-2 border">{task.department_name}</td>
                  <td className="px-4 py-2 border">{task.ministry_name}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full p-2 border rounded-md"
                    />
                    <button
                      onClick={() => updateComment(task.task_id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Update Comment
                    </button>
                  </td>
                  <td className="px-4 py-2 border flex space-x-2 justify-center">
                    <button
                      onClick={() => updateTaskStatus(task.task_id, 'Completed')}
                      className="text-green-500 cursor-pointer hover:text-green-700"
                    >
                      Mark as Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks found for the employee.</p>
      )}
    </div>
  );
};

export default EmployeeTaskManager;
