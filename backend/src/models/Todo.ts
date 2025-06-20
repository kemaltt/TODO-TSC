import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo muss einen Titel haben'],
    trim: true,
    maxlength: [100, 'Titel darf nicht mehr als 100 Zeichen haben']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Beschreibung darf nicht mehr als 500 Zeichen haben']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Todo', TodoSchema);
