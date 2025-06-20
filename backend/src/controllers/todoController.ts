import { Request, Response } from 'express';
import Todo from '../models/Todo';

// Alle Todos abrufen
export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Serverfehler' });
  }
};

// Ein Todo erstellen
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      console.error('Unbekannter Fehler beim Erstellen des Todos');
      res.status(500).json({ success: false, error: 'Serverfehler' });
    }
  }
};

// Ein Todo abrufen
export const getTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo nicht gefunden' });
      return;
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    console.error(`Fehler beim Abrufen des Todos mit ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Serverfehler' });
  }
};

// Ein Todo aktualisieren
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo nicht gefunden' });
      return;
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Serverfehler' });
    }
  }
};

// Ein Todo löschen
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo nicht gefunden' });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Serverfehler' });
  }
};
