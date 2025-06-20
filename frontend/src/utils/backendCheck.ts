import axios from 'axios';

// Überprüft, ob das Backend erreichbar ist
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    // Timeout von 5 Sekunden, um schnell zu erkennen, wenn das Backend nicht erreichbar ist
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await axios.get('/api', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    return response.status === 200;
  } catch (error) {
    console.error('Backend ist nicht erreichbar:', error);
    return false;
  }
};
