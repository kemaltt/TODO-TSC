import React, { useState, useEffect } from 'react';
import MobileHomePage from './MobileHomePage';
import type { Todo } from '../services/todoService';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import TodoForm from './TodoForm';
import { toast } from 'react-toastify';

// Tema ve dil seçenekleri için tipler
type Theme = 'light' | 'dark' | 'system';
type Language = 'de' | 'en' | 'tr';
type SortOrder = 'creation' | 'priority' | 'dueDate';

interface Settings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  sortOrder: SortOrder;
}

interface MobileLayoutProps {
  children: React.ReactNode;
  onAddTodo: (title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  todos: Todo[];
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

// Settings bileşeni
const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    language: 'de',
    notifications: true,
    sortOrder: 'creation'
  });

  const [isPWAInstallable, setIsPWAInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA yükleme olayını dinle
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Chrome + Mobile için yükleme promtunu engelle
      e.preventDefault();
      // Promptu daha sonra kullanmak üzere sakla
      setDeferredPrompt(e);
      // Yükleme butonunu göster
      setIsPWAInstallable(true);
    };

    // PWA yükleme olayını dinle
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null);
    setIsPWAInstallable(false);

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const { theme: currentTheme, setTheme } = useTheme();

  const handleThemeChange = (value: Theme) => {
    setSettings({...settings, theme: value});
    setTheme(value);
  };

  const handleLanguageChange = (value: Language) => {
    setSettings({...settings, language: value});
  };

  const handleNotificationToggle = () => {
    setSettings({...settings, notifications: !settings.notifications});
  };

  const handleSortOrderChange = (value: SortOrder) => {
    setSettings({...settings, sortOrder: value});
  };

  return (
    <div className="space-y-6">
      {/* Tema Ayarları */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Aktuelles Theme</span>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Dil Ayarları */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sprache</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <select 
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Benachrichtigungen</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Benachrichtigungen aktivieren</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications} 
                onChange={handleNotificationToggle}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* PWA Kurulum */}
      {isPWAInstallable && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">App-Installation</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <button
              onClick={handleInstallClick}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Als App installieren
            </button>
          </div>
        </div>
      )}

      {/* Uygulama Bilgileri */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Info</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Version: 1.0.0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 Todo App</p>
        </div>
      </div>
    </div>
  );
};

// MobileLayout Komponente
const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  onAddTodo, 
  todos,
  onFilterChange 
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'home' | 'todos' | 'settings' | 'new'>('home');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleAddTodoClick = () => {
    // Zum neuen Tab für das Hinzufügen von Todos wechseln
    setActiveTab('new');
  };

  const handleAllTodosClick = () => {
    setActiveTab('todos');
    onFilterChange('all');
  };

  const handleFilteredListClick = (filter: 'active' | 'completed') => {
    setActiveTab('todos');
    onFilterChange(filter);
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header mit ThemeToggle wurde entfernt */}

      {/* Hauptinhalt ohne Abstand für Header */}
      <main className="flex-1 overflow-hidden dark:bg-gray-900 pt-0 pb-16">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${activeTab === 'home' ? 'py-0' : 'py-4'}`}>
          {activeTab === 'home' ? (
            <MobileHomePage
              todos={todos}
              onAddClick={handleAddTodoClick}
              onAllTodosClick={handleAllTodosClick}
              onFilteredListClick={handleFilteredListClick}
            />
          ) : activeTab === 'new' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Neue Aufgabe erstellen</h1>
              <TodoForm
                onAddTodo={(title, description, priority) => {
                  onAddTodo(title, description, priority);
                  setActiveTab('todos'); // Nach dem Hinzufügen zur Todo-Liste wechseln
                  toast.success('Aufgabe erfolgreich hinzugefügt!');
                }}
                validationError={validationError}
                onValidationError={setValidationError}
              />
              <div className="mt-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Zurück zur Startseite
                </button>
              </div>
            </div>
          ) : activeTab === 'todos' ? (
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Aufgaben</h1>
              {children}
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Einstellungen</h1>
              <Settings />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation - nur auf mobilen Geräten anzeigen */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg h-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center w-full ${
                activeTab === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('todos')}
              className={`flex flex-col items-center justify-center w-full ${
                activeTab === 'todos'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs mt-1">Aufgaben</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center w-full ${
                activeTab === 'settings'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs mt-1">Einstellungen</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Modal für das TodoForm - nicht mehr verwendet, da wir direkt zur Todo-Seite wechseln
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Neue Aufgabe
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Schließen</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TodoForm
                onAddTodo={handleAddTodo}
                validationError={validationError}
                onValidationError={setValidationError}
              />
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default MobileLayout;
