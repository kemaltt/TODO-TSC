// ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  currentTheme: 'light' | 'dark'; // tatsächliches Theme basierend auf System-Einstellung
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  currentTheme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') return savedTheme as Theme;
    return 'system';
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // System-Einstellung überwachen
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateCurrentTheme = () => {
      if (theme === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setCurrentTheme(theme === 'dark' ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', updateCurrentTheme);
    updateCurrentTheme();

    return () => mediaQuery.removeEventListener('change', updateCurrentTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
