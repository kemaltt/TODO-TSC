import { useState, useEffect } from 'react'
import { getAllTodos, createTodo, updateTodo, deleteTodo } from './services/todoService';
import type { Todo } from './services/todoService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import './TodoApp.css' // Importieren der spezifischen Todo-App-Stile

// Komponenten importieren
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import MobileLayout from './components/MobileLayout';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);
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

  const handleAddTodo = async (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const todoData = {
        title,
        description,
        completed: false,
        priority
      };
      
      const addedTodo = await createTodo(todoData);
      setTodos([...todos, addedTodo]);
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
    <MobileLayout 
      onAddTodo={handleAddTodo} 
      todos={todos}
      onFilterChange={setFilter}
    >
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="sm:max-w-2xl sm:mx-auto w-full">
          <div className="px-2 sm:px-4 sm:py-10 bg-white sm:shadow-lg sm:rounded-3xl sm:p-10 sm:border sm:border-gray-100">
            
            {/* Masaüstü başlık */}
            <div className="text-center hidden sm:block mb-6">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-3">
                Todo App
              </h1>
              <p className="text-sm text-gray-500">Organisiere deine Aufgaben einfach und effektiv</p>
            </div>
            
            {error && (
              <div className="mb-2 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md todo-item-enter">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobil filtreler */}
            <div className="sm:hidden mb-2 -mx-2 px-2 py-1 bg-white sticky top-0 z-10">
              <TodoFilter filter={filter} onFilterChange={setFilter} />
            </div>

            {/* Masaüstü form ve filtreler */}
            <div className="hidden sm:block">
              <div className="mb-6">
                <TodoForm 
                  onAddTodo={handleAddTodo}
                  validationError={validationError}
                  onValidationError={setValidationError}
                />
              </div>
              <TodoFilter filter={filter} onFilterChange={setFilter} />
            </div>
            
            {/* Todo Listesi */}
            <div className="mt-2 sm:mt-4">
              <TodoList 
                todos={filteredTodos} 
                isLoading={isLoading} 
                onToggle={handleToggleTodo}
                onDelete={openDeleteModal}
              />
            </div>
            
            {/* Alt bilgi */}
            <div className="mt-2 py-2 flex justify-between items-center text-xs sm:text-sm">
              <p className="text-gray-500">
                {todos.filter(todo => !todo.completed).length} Aufgaben übrig
              </p>
              {todos.length > 0 && todos.some(todo => todo.completed) && (
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={openBulkDeleteModal}
                >
                  Erledigte Aufgaben löschen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lösch-Bestätigungs-Modal für einzelne Todos */}
      <DeleteConfirmationModal
        isOpen={deleteModal}
        title="Aufgabe löschen"
        message="Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        onConfirm={() => todoToDelete && handleDeleteTodo(todoToDelete)}
        onCancel={cancelDelete}
      />
      
      {/* Modal für Löschen mehrerer Aufgaben */}
      <DeleteConfirmationModal
        isOpen={bulkDeleteModal}
        title="Erledigte Aufgaben löschen"
        message={`Sind Sie sicher, dass Sie alle erledigten Aufgaben löschen möchten? Dies betrifft ${todos.filter(t => t.completed).length} Aufgaben und kann nicht rückgängig gemacht werden.`}
        confirmButtonText="Alle löschen"
        onConfirm={deleteCompletedTodos}
        onCancel={cancelBulkDelete}
      />
      
      {/* Toast-Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </MobileLayout>
  );
}

export default App
