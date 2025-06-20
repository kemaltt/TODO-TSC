import axios from 'axios';

// Prüfe Backend-Verbindung
async function checkBackend() {
  try {
    console.log('Versuche, das Backend unter http://localhost:5001/api zu erreichen...');
    const response = await axios.get('http://localhost:5001/api', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Erfolgreich! Antwort:', response.data);

    console.log('\nVersuche, Todos vom Backend abzurufen...');
    const todosResponse = await axios.get('http://localhost:5001/api/todos', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Erfolgreich! Todos:', todosResponse.data);
    
    console.log('\nVersuche, ein neues Todo zu erstellen...');
    const newTodo = {
      title: 'Test Todo',
      description: 'Dieses Todo wurde durch einen Test erstellt',
      completed: false
    };
    const createResponse = await axios.post('http://localhost:5001/api/todos', newTodo, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Erfolgreich! Neues Todo erstellt:', createResponse.data);
    
    return true;
  } catch (error) {
    console.error('Fehler beim Verbinden mit dem Backend:', error.message);
    if (error.response) {
      console.error('Antwort-Status:', error.response.status);
      console.error('Antwort-Daten:', error.response.data);
    } else if (error.request) {
      console.error('Keine Antwort vom Server erhalten. Ist der Server gestartet?');
    }
    return false;
  }
}

// Führe den Test aus
checkBackend()
  .then(success => {
    if (success) {
      console.log('\n✅ Backend-Verbindung erfolgreich getestet!');
    } else {
      console.log('\n❌ Backend-Verbindung fehlgeschlagen!');
    }
  });
