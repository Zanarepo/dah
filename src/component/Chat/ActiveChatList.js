import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ActiveChatList = ({ onSelectChat }) => {
  const [activeChats, setActiveChats] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Fetch the logged-in user's ID
  useEffect(() => {
    const userId = localStorage.getItem("employee_id");
    if (userId) {
      setLoggedInUserId(userId);
    } else {
      console.error("Logged-in user ID not found in local storage");
    }
  }, []);

  // Fetch active chats
  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchActiveChats = async () => {
      try {
        // Only fetch sender_id and receiver_id from the direct_chats table (no content column reference)
        const { data: directChats, error: chatError } = await supabase
          .from("direct_chats")
          .select("sender_id, receiver_id")  // Only fetching the required columns
          .eq("sender_id", loggedInUserId);

        if (chatError) {
          console.error("Error fetching active chats:", chatError);
          return;
        }

        if (directChats.length === 0) {
          setActiveChats([]);
          return;
        }

        const receiverIds = [...new Set(directChats.map((chat) => chat.receiver_id))];
        const validReceiverIds = receiverIds.filter((id) => id !== undefined);

        if (validReceiverIds.length === 0) {
          console.error("No valid receiver IDs found.");
          return;
        }

        const { data: profiles, error: profileError } = await supabase
          .from("employee_profiles")
          .select("employee_id, first_name, last_name, profile_picture")
          .in("employee_id", validReceiverIds);

        if (profileError) {
          console.error("Error fetching employee profiles:", profileError);
          return;
        }

        const enrichedChats = validReceiverIds
          .map((receiverId) => {
            const receiver = profiles.find((profile) => profile.employee_id === receiverId);
            if (receiver) {
              return { receiver };
            }
            return null;
          })
          .filter((chat) => chat !== null);

        setActiveChats(enrichedChats);
      } catch (error) {
        console.error("Error fetching active chats:", error);
      }
    };

    fetchActiveChats();
  }, [loggedInUserId]);

  return (
    <div className="mt-2">
      {activeChats && activeChats.length > 0 ? (
        activeChats.map((chat, index) => (
          <div
            key={index}
            className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-700"
            onClick={() =>
              onSelectChat({
                receiver_id: chat.receiver.employee_id,
                name: `${chat.receiver.first_name} ${chat.receiver.last_name}`,
                profile_picture: chat.receiver.profile_picture,
              })
            }
          >
            <div className="flex items-center">
              <img
                src={chat.receiver.profile_picture || "/default-avatar.png"}
                alt={`${chat.receiver.first_name} ${chat.receiver.last_name}`}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="text-sm">
                <p className="font-semibold">
                  {chat.receiver.first_name} {chat.receiver.last_name}
                </p>
                <p className="text-gray-400">Active</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No active chats available</p>
      )}
    </div>
  );
};

export default ActiveChatList;
