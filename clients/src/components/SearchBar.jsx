import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const SearchBar = ({ isMobile = false, closeMobileSearch }) => {
   const [query, setQuery] = useState('');
   const [suggestions, setSuggestions] = useState([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const navigate = useNavigate();
   const { backendUrl } = useContext(AppContext);

   useEffect(() => {
      const fetchSuggestions = async () => {
         if (!query.trim()) return setSuggestions([]);
         try {
            const { data } = await axios.get(`${backendUrl}/api/user/search/suggestions?query=${encodeURIComponent(query)}`);
            if (data.success)
               setSuggestions(data.suggestions);
         } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
         }
      };

      const delayDebounce = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(delayDebounce);
   }, [query]);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (query.trim()) {
         navigate(`/search?query=${encodeURIComponent(query.trim())}`);
         setQuery('');
         setSuggestions([]);
         if (isMobile && closeMobileSearch) closeMobileSearch();
      }
   };

   const handleSuggestionClick = (title) => {
      navigate(`/search?query=${encodeURIComponent(title)}`);
      window.scrollTo(0, 0);
      setQuery('');
      setSuggestions([]);
      if (isMobile && closeMobileSearch) closeMobileSearch();
   };

   return (
      <div className={ `w-[300px] relative ${isMobile ? 'px-4 pb-4 w-full' : ''}` }>
         <form onSubmit={ handleSubmit }>
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full">
               <input
                  type="text"
                  value={ query }
                  onChange={ (e) => {
                     setQuery(e.target.value);
                     setShowSuggestions(true);
                  } }
                  placeholder="Search..."
                  className="flex-grow text-sm text-gray-700 bg-transparent focus:outline-none"
               />
               <button type="submit" className="text-gray-600 cursor-pointer">
                  <FaSearch />
               </button>
            </div>
         </form>

         { suggestions.length > 0 && (
            <ul
               className="absolute left-0 top-full mt-1 bg-white shadow-md rounded-md z-50 max-h-60 overflow-y-auto w-full"
               style={ { minWidth: '100%' } }
            >
               { suggestions.map((sugg, idx) => (
                  <li
                     key={ idx }
                     className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                     onClick={ () => handleSuggestionClick(sugg) }
                  >
                     { sugg }
                  </li>
               )) }
            </ul>
         ) }
      </div>
   );
};

export default SearchBar;
