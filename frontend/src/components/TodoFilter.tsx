import React from 'react';

interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="flex justify-center space-x-1 sm:space-x-2 sm:mb-6">
      <button 
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full filter-btn ${filter === 'all' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        onClick={() => onFilterChange('all')}
      >
        Alle
      </button>
      <button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full filter-btn ${filter === 'active' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        onClick={() => onFilterChange('active')}
      >
        Offen
      </button>
      <button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full filter-btn ${filter === 'completed' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        onClick={() => onFilterChange('completed')}
      >
        Erledigt
      </button>
    </div>
  );
};

export default TodoFilter;
