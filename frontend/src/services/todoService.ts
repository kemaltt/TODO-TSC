import axios from 'axios';

// Direkte URL zum Backend
const API_URL = 'http://localhost:5001/api/todos';

export interface Todo {
  _id?: string;
  id?: number; // Für lokale Verwendung
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
  priority?: 'low' | 'medium' | 'high';
}

// Überprüft, ob das Backend erreichbar ist
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    // Timeout von 5 Sekunden, um schnell zu erkennen, wenn das Backend nicht erreichbar ist
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await axios.get('http://localhost:5001/api');
    clearTimeout(timeoutId);
    
    return response.status === 200;
  } catch (error) {
    console.error('Backend ist nicht erreichbar:', error);
    return false;
  }
};

export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Todos:', error);
    throw error;
  }
};

export const createTodo = async (todo: Omit<Todo, '_id' | 'id' | 'createdAt'>): Promise<Todo> => {
  try {
    const response = await axios.post(API_URL, todo);
    return response.data.data;
  } catch (error) {
    console.error('Fehler beim Erstellen des Todos:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, todo: Partial<Todo>): Promise<Todo> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, todo);
    return response.data.data;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Todos (ID: ${id}):`, error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Fehler beim Löschen des Todos (ID: ${id}):`, error);
    throw error;
  }
};
