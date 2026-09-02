# Projektvorschlag - FitLog

Mit FitLog können Trainingseinheiten getrackt werden. Die Applikation soll einem dabei unterstützen, seine Trainingsziele zu erreichen und in einer strukturierten Darstellung die Übersicht zu behalten.

## User Stories

### Trainings erfassen - MUST

Als User möchte ich meine Trainings mit Datum, Dauer und Beschrieb erfassen, bearbeiten und löschen können, um mein Training zu tracken.

### Darstellung - MUST

Als User möchte ich meine Trainings in mindestens zwei Darstellungsformen (Listenansicht mit Filterung und Kalenderansicht) anzeigen lassen, um den Überblick zu behalten.

### Kategorien - SHOULD

Als User möchte ich für meine Trainings Kategorien (wie Kraft, Ausdauer, Beweglichkeit) definieren können, damit ich meine Einheiten strukturiert kategorisieren kann.

### Ziele - SHOULD

Als User möchte ich wöchentliche Trainingsziele (wie zum Beispiel zwei Mal pro Woche Kraft) definieren können, um mich zu motivieren.

### Unterkategorien - COULD

Als User möchte ich für meine Kategorien spezifische Unterkategorien (z. B. Fitness, Laufen, Yoga) anlegen, um mein Training noch detaillierter zu analysieren.

### Fortschrittsbalken - COULD

Als User möchte ich einen Fortschrittsbalken meiner definierten Ziele sehen, um mich zu motivieren.

## Abgrenzung - Won't have
- Keine Benutzerverwaltung & Authentifizierung
- Kein Social Feed und Sharing
- Keine Auswertungen und Statistiken
- Keine Push-Benachrichtigungen
- Kein Cloud-Deployment

## Technologiestack

- **Frontend**: Angular
- **Backend**: Node.js
- **Persistierung**: PostgreSQL
- **Deployment**: Docker Compose
- **Tests**: Vitest (Unit/Integration), E2E TBD

## Projektanforderungen
### Funktionale Anforderungen

- Die Applikation muss das Erstellen, Anzeigen, Ändern und Löschen einer selbständig definierten Resource ermöglichen.
- Die Daten müssen persistent in einer Datenbank abgelegt werden.
- Die Daten müssen in mindestens zwei inhaltlich unterschiedlichen Darstellungsformen präsentiert werden.

### Nicht funktionale Anforderungen

- Die Applikation soll neben der Desktop-Ansicht auch für die Mobile/Tablet-Ansicht optimiert sein.
- Die Funktionalitäten sollen mittels sinnvoller automatisierter Unit/Integration/E2E-Tests überprüft werden.
- Lighthouse-Score von mindestens 90 (Durchschnitt aller Analysen) für Mobile sowie Desktop.
- Das Prod-Bundle der Applikation soll reproduzierbar gestartet werden können.
    - Option 1: Deployed auf einer öffentlichen URL
    - Option 2: via Docker-Compose mit einem Command (docker compose up) ausführbar
- Code-Lesbarkeit & Erweiterbarkeit
- Sinnvolle & durchdachte Strukturierung der gesamten Applikation
