import React, { useState } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  validationError: string | null;
  onValidationError: (error: string | null) => void;
  onCancel?: () => void;  // Optional callback für Abbrechen/Zurück
  isMobile?: boolean;     // Flag für mobile Ansicht
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onAddTodo, 
  validationError, 
  onValidationError,
  onCancel,
  isMobile = false  // Default zu false
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    
    // Validierung zurücksetzen
    onValidationError(null);
    setTouched(true);
    
    // Überprüfen, ob der Titel leer ist
    if (newTodo.trim() === '') {
      onValidationError('Bitte geben Sie einen Titel für die Aufgabe ein.');
      return;
    }
    
    onAddTodo(newTodo, newDescription, priority);
    setNewTodo('');
    setNewDescription('');
    setPriority('medium');
    setTouched(false);
  };

  const showError = touched && validationError;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm todo-container">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700">
          Aufgabentitel <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-500">{newTodo.length}/100</span>
      </div>
      <input
        id="todo-title"
        type="text"
        className={`w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-1 py-3 px-4 text-base ${
          showError ? 'border-red-500 validation-error' : 'border-gray-300'
        }`}
        placeholder="Was muss erledigt werden?"
        value={newTodo}
        onChange={(e) => {
          if (e.target.value.length <= 100) {
            setNewTodo(e.target.value);
            if (touched) {
              if (e.target.value.trim() !== '') {
                onValidationError(null);
              } else {
                onValidationError('Bitte geben Sie einen Titel für die Aufgabe ein.');
              }
            }
          }
        }}
        onBlur={() => {
          setTouched(true);
          if (newTodo.trim() === '') {
            onValidationError('Bitte geben Sie einen Titel für die Aufgabe ein.');
          }
        }}
        maxLength={100}
        required
      />
      
      {showError && (
        <div className="mb-3 text-sm text-red-600 todo-item-enter">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {validationError}
          </div>
        </div>
      )}
      
      <div className="mt-3 mb-1 flex justify-between items-center">
        <label htmlFor="todo-description" className="block text-sm font-medium text-gray-700">
          Beschreibung (optional)
        </label>
        <span className="text-xs text-gray-500">{newDescription.length}/500</span>
      </div>
      <textarea
        id="todo-description"
        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-3 py-3 px-4 text-base"
        placeholder="Fügen Sie weitere Details zu Ihrer Aufgabe hinzu..."
        value={newDescription}
        onChange={(e) => {
          if (e.target.value.length <= 500) {
            setNewDescription(e.target.value);
          }
        }}
        rows={2}
        maxLength={500}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Priorität:</span>
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => setPriority('low')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${priority === 'low' 
                ? 'bg-green-100 text-green-800 ring-2 ring-green-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-green-50'}`}
            >
              Niedrig
            </button>
            <button 
              type="button"
              onClick={() => setPriority('medium')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-600'
                : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'}`}
            >
              Mittel
            </button>
            <button 
              type="button"
              onClick={() => setPriority('high')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${priority === 'high'
                ? 'bg-red-100 text-red-800 ring-2 ring-red-600'
                : 'bg-gray-100 text-gray-800 hover:bg-red-50'}`}
            >
              Hoch
            </button>
          </div>
        </div>
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full sm:w-auto gap-2`}>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Aufgabe hinzufügen
          </button>
          {onCancel && isMobile && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Zur Startseite
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
