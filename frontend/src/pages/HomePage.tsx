import { useState, useEffect } from 'react'
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import type { Todo } from '../services/todoService';
import { toast } from 'react-toastify';
import '../TodoApp.css' // Importieren der spezifischen Todo-App-Stile

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  // Daten vom Backend laden
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Fehler beim Laden der Todos. Bitte versuchen Sie es später erneut.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    // Validierung zurücksetzen
    setValidationError(null);
    
    // Überprüfen, ob der Titel leer ist
    if (newTodo.trim() === '') {
      setValidationError('Bitte geben Sie einen Titel für die Aufgabe ein.');
      return;
    }
    
    try {
      const todoData = {
        title: newTodo,
        description: newDescription,
        completed: false,
        priority
      };
      
      const addedTodo = await createTodo(todoData);
      setTodos([...todos, addedTodo]);
      setNewTodo('');
      setNewDescription('');
      setError(null);
      toast.success('Aufgabe erfolgreich hinzugefügt!');
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Fehler beim Hinzufügen des Todos.');
      toast.error('Fehler beim Hinzufügen des Todos.');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      if (!todo._id) return;
      
      const updatedTodo = await updateTodo(todo._id, { 
        completed: !todo.completed 
      });
      
      setTodos(todos.map(t => 
        t._id === updatedTodo._id ? updatedTodo : t
      ));
      setError(null);
      toast.success(`Aufgabe erfolgreich ${todo.completed ? 'wiederhergestellt' : 'als erledigt markiert'}.`);
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Fehler beim Aktualisieren des Todos.');
      toast.error('Fehler beim Aktualisieren des Todos.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      setError(null);
      toast.success('Aufgabe erfolgreich gelöscht.');
      // Modal schließen nach dem Löschen
      setDeleteModal(false);
      setTodoToDelete(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Fehler beim Löschen des Todos.');
      toast.error('Fehler beim Löschen des Todos.');
    }
  };

  // Zeigt das Lösch-Modal an und speichert die ID des zu löschenden Todos
  const openDeleteModal = (id: string) => {
    setTodoToDelete(id);
    setDeleteModal(true);
  };

  // Schließt das Modal ohne zu löschen
  const cancelDelete = () => {
    setDeleteModal(false);
    setTodoToDelete(null);
  };

  // Öffnet das Modal zum Löschen aller erledigten Aufgaben
  const openBulkDeleteModal = () => {
    setBulkDeleteModal(true);
  };

  // Schließt das Massen-Lösch-Modal ohne zu löschen
  const cancelBulkDelete = () => {
    setBulkDeleteModal(false);
  };

  // Löscht alle erledigten Aufgaben
  const deleteCompletedTodos = async () => {
    try {
      const completedIds = todos.filter(t => t.completed).map(t => t._id).filter(Boolean) as string[];
      await Promise.all(completedIds.map(id => deleteTodo(id)));
      setTodos(todos.filter(t => !t.completed));
      setBulkDeleteModal(false);
      setError(null);
      toast.success('Alle erledigten Aufgaben wurden gelöscht.');
    } catch (err) {
      console.error('Error clearing completed todos', err);
      setError('Fehler beim Löschen erledigter Aufgaben');
      toast.error('Fehler beim Löschen erledigter Aufgaben.');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-2xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10 border border-gray-100">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-3">
                Todo App
              </h1>
              <p className="text-sm text-gray-500 mb-6">Organisiere deine Aufgaben einfach und effektiv</p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md todo-item-enter">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-gray-200">
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm todo-container">
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
                      validationError ? 'border-red-500 validation-error' : 'border-gray-300'
                    }`}
                    placeholder="Was muss erledigt werden?"
                    value={newTodo}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setNewTodo(e.target.value);
                        if (e.target.value.trim() !== '') {
                          setValidationError(null);
                        }
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    maxLength={100}
                    required
                  />
                  
                  {validationError && (
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
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-600">Priorität:</div>
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
                  
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none btn-add"
                    onClick={handleAddTodo}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Aufgabe hinzufügen
                  </button>
                </div>
                
                <div className="flex justify-center space-x-2 mb-6">
                  <button 
                    className={`px-4 py-2 rounded-full filter-btn ${filter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setFilter('all')}
                  >
                    Alle
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full filter-btn ${filter === 'active' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setFilter('active')}
                  >
                    Offen
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full filter-btn ${filter === 'completed' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setFilter('completed')}
                  >
                    Erledigt
                  </button>
                </div>
              </div>
              
              <div className="py-4">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-3 text-gray-500">Lade deine Aufgaben...</p>
                  </div>
                ) : (
                  <>
                    {filteredTodos.length === 0 ? (
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
                    ) : (
                      <div className="todo-list">
                        <h3 className="text-xl font-medium text-gray-900 mb-5">
                          Deine Aufgaben ({filteredTodos.length})
                        </h3>
                        <ul className="space-y-4 transition-all duration-300">
                          {filteredTodos.map(todo => (
                            <li 
                              key={todo._id} 
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
                                    onChange={() => handleToggleTodo(todo)}
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
                                      onClick={() => todo._id && openDeleteModal(todo._id)}
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
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {todos.filter(todo => !todo.completed).length} Aufgaben übrig
                </p>
                {todos.length > 0 && todos.some(todo => todo.completed) && (
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={openBulkDeleteModal}
                  >
                    Erledigte Aufgaben löschen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lösch-Bestätigungs-Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-3 shadow-xl transform transition-all">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Aufgabe löschen
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => todoToDelete && handleDeleteTodo(todoToDelete)}
              >
                Löschen
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                onClick={cancelDelete}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal für Löschen mehrerer Aufgaben */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-3 shadow-xl transform transition-all">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Erledigte Aufgaben löschen
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Sind Sie sicher, dass Sie alle erledigten Aufgaben löschen möchten? Dies betrifft {todos.filter(t => t.completed).length} Aufgaben und kann nicht rückgängig gemacht werden.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={deleteCompletedTodos}
              >
                Alle löschen
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                onClick={cancelBulkDelete}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
