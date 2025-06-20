import React from 'react';
import type { Todo } from '../services/todoService';
import SwipeableTodoItem from './SwipeableTodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, isLoading, onToggle, onDelete }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-3 text-gray-500">Lade deine Aufgaben...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="empty-state-illustration">
          <svg className="mx-auto h-24 w-24 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Aufgaben vorhanden</h3>
        <p className="mt-1 text-sm text-gray-500">
          Beginne damit, deine erste Aufgabe hinzuzufügen.
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list flex flex-col min-h-[calc(100vh-12rem)] sm:min-h-0">
      <h3 className="text-xl font-medium text-gray-900 mb-3 sm:mb-5">
        Deine Aufgaben ({todos.length})
      </h3>
      <ul className="flex-1 space-y-3 sm:space-y-4 transition-all duration-300">
        {todos.map(todo => (
          <SwipeableTodoItem 
            key={todo._id} 
            todo={todo} 
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
