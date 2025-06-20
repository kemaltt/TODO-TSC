# Todo App

Eine moderne Todo-Anwendung mit ReactJS, TypeScript, Tailwind CSS, Node.js, Express und MongoDB.
Optimiert für Desktop und Mobile als Progressive Web App (PWA).

## Funktionen

### Desktop-Version
- Erstellen, Lesen, Aktualisieren und Löschen von Todos
- Filtern nach aktivem Status (Alle, Offen, Erledigt)
- Beschreibungen für Todos
- Responsive Design mit Tailwind CSS
- Vollständige Backend-API mit Express und MongoDB

### Mobile Version (PWA)
- Optimierte mobile Benutzeroberfläche
- Swipe-Gesten für schnelles Löschen und Abhaken
- Bottom Navigation für einfache Bedienung
- Speziell gestaltete mobile Startseite
- Aufgaben-Übersicht und Schnellzugriffe
- Installierbar als Progressive Web App
- Offline-Funktionalität
- Touch-optimierte Eingabeformulare
- Native App-ähnliche Erfahrung

## Features im Detail

### Mobile Funktionen
1. **Intuitive Navigation**
   - Bottom Navigation Bar mit Home, Aufgaben, Neu und Einstellungen
   - Swipe-Gesten für Aufgaben-Management
   - Optimierte Touch-Targets

2. **Mobile Startseite**
   - Personalisierte Begrüßung
   - Aufgaben-Statistiken
   - Schnellzugriffe auf wichtige Funktionen
   - Priorisierte Aufgabenübersicht

3. **PWA-Funktionalität**
   - Als App installierbar
   - Offline-Unterstützung
   - App-like Erfahrung
   - Push-Benachrichtigungen (optional)

4. **Mobile-optimierte UI**
   - Angepasste Formulare
   - Verbesserte Touch-Bereiche
   - Native Transitions
   - Responsive Layouts

## Technologie-Stack

### Frontend
- React mit TypeScript
- Tailwind CSS für das UI
- Axios für API-Anfragen
- Vite als Build-Tool
- PWA-Plugin für Progressive Web App
- React Swipeable für mobile Gesten

### Backend
- Node.js mit Express
- TypeScript
- MongoDB mit Mongoose als ODM
- RESTful API

## Installation

### Voraussetzungen
- Node.js (v16+)
- MongoDB (lokal oder remote)

### Backend starten
```bash
cd backend
npm install
npm run dev
```

### Frontend starten
```bash
cd frontend
npm install
npm run dev
```

## Entwicklung

### Mobile Entwicklung
```bash
# PWA assets erstellen
npm run generate-pwa-assets

# Development mit PWA
npm run dev
```

### PWA Testen
1. Production Build erstellen:
```bash
npm run build
```

2. Production Build testen:
```bash
npm run preview
```

3. Im Chrome DevTools:
   - Mobile Emulation aktivieren
   - Lighthouse Test durchführen
   - PWA Installation testen

### Mobile Features Testen
- Swipe-Gesten auf Aufgaben
- Bottom Navigation
- Formular-Validierung
- Touch-Targets
- Offline-Funktionalität
- PWA-Installation

## API-Endpunkte

- `GET /api/todos` - Alle Todos abrufen
- `POST /api/todos` - Ein neues Todo erstellen
- `GET /api/todos/:id` - Ein bestimmtes Todo abrufen
- `PUT /api/todos/:id` - Ein Todo aktualisieren
- `DELETE /api/todos/:id` - Ein Todo löschen

## Mobile Design-Entscheidungen

### UI/UX
- Bottom Navigation für optimale Erreichbarkeit
- Große Touch-Targets (min. 44x44px)
- Vertikale Button-Anordnung in Formularen
- Swipe-Aktionen für schnelle Interaktionen
- Optimierte Formulare für mobile Eingabe

### PWA
- App-Manifest für native Installation
- Service Worker für Offline-Support
- Responsive Images für Performance
- Touch-Icons für verschiedene Plattformen


# TODO-TSC
# TODO-TSC
