import { supabase } from "../../supabaseClient";

const Fetch = async (setNotifications) => {
  try {
    const employeeId = localStorage.getItem("employee_id"); // Get logged-in user's employee ID
    if (!employeeId) {
      console.error("User not logged in.");
      setNotifications([]);
      return;
    }

    // Fetch user's access level
    const { data: accessLevelData, error: accessError } = await supabase
      .from("access_level")
      .select("access_id, ministry_id, department_id")
      .eq("employee_id", employeeId)
      .single();

    if (accessError || !accessLevelData) {
      console.error("Error fetching access level:", accessError?.message);
      setNotifications([]);
      return;
    }

    const { access_id, ministry_id, department_id } = accessLevelData;

    // Build query based on user's role
    let query = supabase
      .from("general_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (access_id === 1) {
      // is_admin: Fetch notifications for their specific department
      query = query.eq("department_id", department_id);
    } else if (access_id === 2) {
      // admin_ministry: Fetch notifications for all departments in their ministry
      query = query.eq("ministry_id", ministry_id);
    }
    // access_id === 3 (super_admin): Fetch all notifications (no filters needed)

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error.message);
      setNotifications([]);
    } else {
      setNotifications(data);
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
    setNotifications([]);
  }
};

export default Fetch;
