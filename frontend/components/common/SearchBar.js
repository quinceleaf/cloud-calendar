import React from "react";

const SearchBar = ({ setFilter, placeholderText, resetPage }) => {
  return (
    <div className="items-center pl-1 pt-1 h-8 text-sm text-gray-500 border-gray-200 border-2 rounded-md">
      <input
        className="w-32 h-6 md:w-48 min-w-1/4 pb-1 pl-2 focus:outline-none "
        placeholder={`${placeholderText}...` || "Filter objects..."}
        onChange={(e) => setFilter(e.target.value)}
        value={undefined}
      />
    </div>
  );
};

export default SearchBar;
