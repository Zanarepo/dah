import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';  // Adjust according to your project setup
import { FiEdit, FiTrash } from 'react-icons/fi';  // Icons for Edit, Delete
import { ToastContainer, toast } from 'react-toastify';  // Import toast notifications
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [comment, setComment] = useState('');
  const [showResolved, setShowResolved] = useState(true);  // State for showing/hiding resolved issues

  const fetchIssues = useCallback(async () => {
    const { data, error } = await supabase
      .from('employee_issue_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching issues:', error);
    } else {
      const enrichedIssues = await Promise.all(data.map(async (issue) => {
        // Fetch employee data by employee_id
        const { data: employeeData, error: employeeError } = await supabase
          .from('employee_profiles')
          .select('first_name, last_name')
          .eq('employee_id', issue.employee_id)
          .single();  // Get single result

        // Fetch department data by department_id (assuming 'id' is the department primary key)
        const { data: departmentData, error: departmentError } = await supabase
          .from('departments')
          .select('name')  // Assuming 'name' is the department column
          .eq('id', issue.department_id)  // Ensure we're using 'id' for departments table
          .single();  // Get single result

        if (employeeError || departmentError) {
          console.error('Error fetching related data:', employeeError || departmentError);
        }

        return {
          ...issue,
          employee_first_name: employeeData ? employeeData.first_name : 'Unknown',
          employee_last_name: employeeData ? employeeData.last_name : 'Unknown',
          department_name: departmentData ? departmentData.name : 'Unknown'  // Adjusted to 'name'
        };
      }));

      setIssues(enrichedIssues);
    }
  }, []);  // Dependency array is empty since fetchIssues doesn't depend on any state or props

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);  // Include fetchIssues in the dependency array

  // Change issue status
  const changeStatus = async (reportId, newStatus) => {
    const { error } = await supabase
      .from('employee_issue_reports')
      .update({ status: newStatus })
      .eq('report_id', reportId);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update issue status.');
    } else {
      fetchIssues();  // Refresh issues list
      toast.success('Issue status updated!');
    }
  };

  // Delete issue
  const deleteIssue = async (reportId) => {
    const { error } = await supabase
      .from('employee_issue_reports')
      .delete()
      .eq('report_id', reportId);

    if (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue.');
    } else {
      fetchIssues();  // Refresh issues list
      toast.success('Issue deleted!');
    }
  };

  // Add comment to issue
  const addComment = async (reportId) => {
    const { error } = await supabase
      .from('employee_issue_reports')
      .update({ issue_description: comment })
      .eq('report_id', reportId);

    if (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment.');
    } else {
      fetchIssues();  // Refresh issues list
      setSelectedIssue(null); // Close modal after submitting comment
      toast.success('Comment added!');
    }
  };

  // Calculate unresolved issues count
  const unresolvedIssuesCount = issues.filter(issue => issue.status !== 'resolved').length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Issue Tracker</h1>

      {/* Unresolved issues count */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-xl">
          <strong>Unresolved Issues: </strong>{unresolvedIssuesCount}
        </div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          {showResolved ? 'Hide Resolved' : 'Show Resolved'}
        </button>
      </div>

      {/* Issue Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Employee</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Issue Type</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues
            .filter(issue => showResolved || issue.status !== 'resolved')  // Filter based on showResolved
            .map((issue) => (
              <tr key={issue.report_id}>
                <td className="px-4 py-2 border">{`${issue.employee_first_name} ${issue.employee_last_name}`}</td>
                <td className="px-4 py-2 border">{issue.department_name}</td>
                <td className="px-4 py-2 border">{issue.issue_type}</td>
                <td className="px-4 py-2 border">
                  <select
                    className="w-full p-2 border rounded"
                    value={issue.status}
                    onChange={(e) => changeStatus(issue.report_id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="work-in-progress">Work in Progress</option>
                    <option value="fixed">Fixed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit className="inline-block" /> View
                  </button>
                  <button
                    onClick={() => deleteIssue(issue.report_id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FiTrash className="inline-block" /> Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* View Issue Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Issue Details</h2>
            <p><strong>Employee:</strong> {`${selectedIssue.employee_first_name} ${selectedIssue.employee_last_name}`}</p>
            <p><strong>Department:</strong> {selectedIssue.department_name}</p>
            <p><strong>Issue Type:</strong> {selectedIssue.issue_type}</p>
            <p><strong>Description:</strong> {selectedIssue.issue_description}</p>

            {/* Comment Section */}
            <textarea
              className="w-full p-2 border rounded mt-4"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => addComment(selectedIssue.report_id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Submit Comment
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default IssueTracker;
