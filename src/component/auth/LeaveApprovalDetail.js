import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient"; // Assuming you've set up supabaseClient

const LeaveApprovalDetails = ({ leaveRequestId }) => {
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('leave_approvals')
          .select(`
            comments,
            approval_date,
            employee_profiles!employee_leave_admin_id_fkey (
              first_name,
              last_name,
              email
            )
          `)
          .eq('leave_request_id', leaveRequestId)
          .single(); // Assuming each leave request only has one approval record
  
        if (error) throw error;
        
        setApprovalDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch approval details.');
        setLoading(false);
      }
    };

    fetchApprovalDetails();
  }, [leaveRequestId]);

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {approvalDetails ? (
        <div>
          <p>
            <span>Approval Status: {approvalDetails.status}</span>
            <button onClick={handleViewDetails}>View Details</button>
          </p>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Approval Details</h2>
                <p><strong>Comments:</strong> {approvalDetails.comments}</p>
                <p><strong>Approved By:</strong> {approvalDetails.employees.first_name} {approvalDetails.employees.last_name}</p>
                <p><strong>Approver Email:</strong> {approvalDetails.employees.email}</p>
                <p><strong>Approval Date:</strong> {new Date(approvalDetails.approval_date).toLocaleString()}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>No approval details found.</div>
      )}
    </div>
  );
};

export default LeaveApprovalDetails;
