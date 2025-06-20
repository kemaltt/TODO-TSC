import React from 'react';
import { useSwipeable } from 'react-swipeable';
import type { Todo } from '../services/todoService';

interface SwipeableTodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const SwipeableTodoItem: React.FC<SwipeableTodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => todo._id && onDelete(todo._id),
    onSwipedRight: () => onToggle(todo),
    trackMouse: false,
    trackTouch: true,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    delta: 50
  });

  return (
    <div {...handlers} className="touch-manipulation">
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
              <div className="text-xs text-gray-500">
                <span className="mr-4">←&nbsp;Wischen zum Erledigen</span>
                <span>Wischen zum Löschen&nbsp;→</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default SwipeableTodoItem;
