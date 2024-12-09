import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const MinistryList = ({ onSelectMinistry }) => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMinistries = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("ministries").select("*");
      if (!error) setMinistries(data);
      setLoading(false);
    };
    fetchMinistries();
  }, []);

  if (loading) return <p>Loading ministries...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select a Ministry</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ministries.map((ministry) => (
          <button
            key={ministry.id}
            onClick={() => onSelectMinistry(ministry)}
            className="p-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            {ministry.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MinistryList;
