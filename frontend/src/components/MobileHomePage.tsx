import React from 'react';
import type { Todo } from '../services/todoService';

interface MobileHomePageProps {
  todos: Todo[];
  onAddClick: () => void;
  onAllTodosClick: () => void;
  onFilteredListClick: (filter: 'active' | 'completed') => void;  // Yeni prop ekliyoruz
}

const MobileHomePage: React.FC<MobileHomePageProps> = ({ 
  todos, 
  onAddClick, 
  onAllTodosClick,
  onFilteredListClick 
}) => {
  // İstatistikleri hesapla
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const highPriorityTodos = todos.filter(todo => !todo.completed && todo.priority === 'high').length;
  
  // Günün saatine göre selamlama mesajı
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hoş geldin kartı */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">{getGreeting()}! 👋</h1>
        <p className="text-indigo-100">Hier ist dein täglicher Überblick</p>
      </div>

      {/* İstatistik kartları - Tıklanabilir yapıyoruz */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onFilteredListClick('active')}
              className="bg-indigo-50 p-4 rounded-xl text-left hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl font-bold text-indigo-600">{activeTodos}</span>
              <p className="text-sm text-indigo-900">Offene Aufgaben</p>
            </button>
            <button
              onClick={() => onFilteredListClick('completed')}
              className="bg-green-50 p-4 rounded-xl text-left hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl font-bold text-green-600">{completedTodos}</span>
              <p className="text-sm text-green-900">Erledigte Aufgaben</p>
            </button>
          </div>
        </div>
      </div>

      {/* Hızlı eylemler */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddClick}
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Neue Aufgabe</span>
            </div>
          </button>
          <button
            onClick={onAllTodosClick}
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Alle Aufgaben</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Yüksek öncelikli görevler uyarısı */}
      {highPriorityTodos > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  Sie haben {highPriorityTodos} wichtige {highPriorityTodos === 1 ? 'Aufgabe' : 'Aufgaben'} zu erledigen
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHomePage;
