import { supabase } from "../../supabaseClient";

const Fetch = async (setNotifications) => {
  const { data, error } = await supabase
    .from("general_notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
  } else {
    setNotifications(data);
  }
};

export default Fetch;
