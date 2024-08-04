import React, { useState, useEffect } from 'react';
import './SearchPeople.css';

const SearchPeople = ({ setShowSearchPeople }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/auth/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials
          body: JSON.stringify({ searchInput: searchQuery }),
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="search-people-overlay">
      <div className="search-people">
        <div className="header">
          <h3>Search People</h3>
          <button className="close-btn" onClick={() => setShowSearchPeople(false)}>X</button>
        </div>
        <div className="content">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-results">
            {loading ? (
              <div className="loader"></div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => (
                <p key={result._id}>{result.username}</p>
              ))
            ) : (
              <p className="no-results">No results found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPeople;
