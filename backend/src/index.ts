import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';

// Umgebungsvariablen laden
dotenv.config();

// Express App initialisieren
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';

// Middleware - CORS mit einfacherer Konfiguration
app.use(cors()); // Erlaubt alle Ursprünge ohne spezifische Optionen
app.use(express.json());

// Routen
app.use('/api/todos', todoRoutes);

// API-Status-Route für Healthcheck
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API ist erreichbar' });
});

// MongoDB-Status-Route
app.get('/api/status', (req, res) => {
  console.log('GET /api/status wurde aufgerufen - Überprüfe MongoDB-Verbindung');
  
  res.status(200).json({ 
    status: 'success', 
    message: 'API ist erreichbar',
    mongodb: mongoose.connection.readyState === 1 ? 'verbunden' : 'nicht verbunden',
    node: process.version,
    timestamp: new Date().toISOString()
  });
});

// Hauptroute
app.get('/', (req, res) => {
  res.send('Todo API läuft - Version 3.0 mit verbessertem nodemon Auto-Restart!');
});

// MongoDB Verbindung
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB verbunden');
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Verbindungsfehler:', err.message);
    process.exit(1);
  });
