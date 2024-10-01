// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Buscar cursos..."
      className="mb-4 p-2 border border-gray-600 rounded w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default SearchBar;
