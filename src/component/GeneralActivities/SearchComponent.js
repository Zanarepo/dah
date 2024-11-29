import React, { useState } from "react";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-employees?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="my-4 p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-semibold mb-2">Search Employees</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter name or details"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <ul className="space-y-2 mt-2">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="p-4 border rounded bg-white shadow-sm"
              >
                <p>
                  <strong>Name:</strong> {result.name}
                </p>
                <p>
                  <strong>Department:</strong> {result.department}
                </p>
                <p>
                  <strong>Ministry:</strong> {result.ministry}
                </p>
                <p>
                  <strong>Post:</strong> {result.post}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !isSearching && (
        <p className="mt-4 text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchComponent;
