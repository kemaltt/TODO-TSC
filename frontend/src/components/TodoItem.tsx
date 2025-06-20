import React from 'react';
import type { Todo } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li 
      className={`todo-item px-5 py-5 rounded-lg border ${
        todo.completed 
          ? 'completed-item border-gray-200 bg-gray-50' 
          : 'border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-150'
      } ${
        todo.priority === 'high' 
          ? 'priority-high border-l-4 border-l-red-500' 
          : todo.priority === 'medium' 
            ? 'priority-medium border-l-4 border-l-yellow-500' 
            : todo.priority === 'low' 
              ? 'priority-low border-l-4 border-l-green-500' 
              : ''
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-sm checkbox-custom cursor-pointer"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h3 className={`text-lg font-medium mb-2 sm:mb-0 mr-4 break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            <div className="flex flex-shrink-0 space-x-2 mt-1 sm:mt-0">
              {todo.priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  todo.priority === 'high' 
                    ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20' 
                    : todo.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20' 
                      : 'bg-green-100 text-green-800 ring-1 ring-green-600/20'
                }`}>
                  {todo.priority === 'high' 
                    ? 'Hoch' 
                    : todo.priority === 'medium' 
                      ? 'Mittel' 
                      : 'Niedrig'}
                </span>
              )}
              {todo.createdAt && (
                <span className="date-badge">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {todo.description && (
            <p className={`mt-2 text-sm todo-description ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-3 flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none transition-colors duration-150"
              onClick={() => todo._id && onDelete(todo._id)}
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Löschen
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
