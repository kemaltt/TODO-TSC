import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import MobileHomePage from './MobileHomePage';
import type { Todo } from '../services/todoService';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

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
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;  // Yeni prop ekliyoruz
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

    // Eğer PWA zaten yüklüyse
    window.addEventListener('appinstalled', () => {
      // Yükleme butonunu gizle
      setIsPWAInstallable(false);
      // Promptu temizle
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // PWA yükleme fonksiyonu
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Yükleme promptunu göster
    deferredPrompt.prompt();
    
    // Kullanıcının yanıtını bekle
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA yüklendi');
    } else {
      console.log('PWA yükleme reddedildi');
    }
    
    // Promptu temizle
    setDeferredPrompt(null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Tema Seçimi */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Erscheinungsbild</h3>
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Design</span>
            <select 
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value as Theme})}
              className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="system">System</option>
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sıralama Tercihleri */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Sortierung</h3>
        <div className="bg-white rounded-lg shadow p-4">
          <select 
            value={settings.sortOrder}
            onChange={(e) => setSettings({...settings, sortOrder: e.target.value as SortOrder})}
            className="w-full form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="creation">Nach Erstellungsdatum</option>
            <option value="priority">Nach Priorität</option>
            <option value="dueDate">Nach Fälligkeit</option>
          </select>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Benachrichtigungen</h3>
        <div className="bg-white rounded-lg shadow p-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-gray-700">Benachrichtigungen aktivieren</span>
          </label>
        </div>
      </div>

      {/* PWA Yükleme */}
      {isPWAInstallable && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">App Installation</h3>
          <div className="bg-white rounded-lg shadow p-4">
            <button 
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleInstallClick}
            >
              Als App installieren
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Installieren Sie die App auf Ihrem Gerät für schnelleren Zugriff und bessere Performance.
            </p>
          </div>
        </div>
      )}

      {/* Dil Seçimi */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Sprache</h3>
        <div className="bg-white rounded-lg shadow p-4">
          <select 
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value as Language})}
            className="w-full form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </div>

      {/* Uygulama Bilgileri */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Info</h3>
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
          <p className="text-sm text-gray-600">Version: 1.0.0</p>
          <p className="text-sm text-gray-600">© 2025 Todo App</p>
        </div>
      </div>
    </div>
  );
};

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  onAddTodo, 
  todos,
  onFilterChange 
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleAddClick = () => {
    setShowAddForm(true);
    setActiveTab('add');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setActiveTab('home');
  };

  const handleAddTodoWrapper = (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    onAddTodo(title, description, priority);
    setShowAddForm(false);
    setActiveTab('home');
  };

  const handleFilteredListClick = (filter: 'active' | 'completed') => {
    onFilterChange(filter);
    setActiveTab('todos');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className={`bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white p-4 shadow-md sm:hidden transition-colors duration-300 ${activeTab === 'home' ? 'hidden' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
            <h1 className="text-xl font-bold">Todo App</h1>
          </div>
          {activeTab === 'todos' && (
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              onClick={handleAddClick}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <MobileHomePage 
              todos={todos} 
              onAddClick={handleAddClick}
              onAllTodosClick={() => {
                onFilterChange('all');
                setActiveTab('todos');
              }}
              onFilteredListClick={handleFilteredListClick}
            />
          )}
          {activeTab === 'todos' && !showAddForm && children}
          {(activeTab === 'add' || showAddForm) && (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Neue Aufgabe</h2>
                <TodoForm 
                  onAddTodo={handleAddTodoWrapper}
                  onValidationError={() => {}}
                  validationError={null}
                  onCancel={handleCancel}
                  isMobile={true}
                />
              </div>
            </div>
          )}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 h-16 sm:hidden">
        <div className="grid grid-cols-4 h-full">
          <button 
            className={`flex flex-col items-center justify-center ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('home')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center ${activeTab === 'todos' ? 'text-indigo-600' : 'text-gray-500'}`}
            onClick={() => {
              setActiveTab('todos');
              setShowAddForm(false);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs mt-1">Aufgaben</span>
          </button>
          
          <button
            className={`flex flex-col items-center justify-center ${activeTab === 'add' ? 'text-indigo-600' : 'text-gray-500'}`}
            onClick={handleAddClick}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center -mt-5 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs mt-1">Neu</span>
          </button>
          
          <button
            className={`flex flex-col items-center justify-center ${activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-500'}`}
            onClick={() => {
              setActiveTab('settings');
              setShowAddForm(false);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Einstellungen</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
