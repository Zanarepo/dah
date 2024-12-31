// Component: ListChannels.js
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListChannels = () => {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const fetchChannels = async () => {
            toast.info('Loading channels...');
            const { data, error } = await supabase
                .from('department_chat_channels')
                .select('*');

            if (error) {
                toast.error('Error fetching channels');
                console.error('Error fetching channels:', error);
            } else {
                toast.success('Channels loaded successfully');
                setChannels(data);
            }
        };

        fetchChannels();

        // Close dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
        toast.info(`Selected channel: ${channel.channel_name}`);
        setIsDropdownOpen(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Channels</h2>
            <div className="relative w-full max-w-md" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {selectedChannel ? (
                        <span>{selectedChannel.channel_name}</span>
                    ) : (
                        <span className="text-gray-500">Choose a channel...</span>
                    )}
                </button>

                {isDropdownOpen && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {channels.length > 0 ? (
                            channels.map((channel) => (
                                <li
                                    key={channel.channel_id}
                                    onClick={() => handleSelectChannel(channel)}
                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                >
                                        <strong>{channel.channel_name}</strong>
                                        <p className="text-sm text-gray-500">{channel.description}</p>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-500">No channels available</li>
                            )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ListChannels;
