# StudySphere

A fully functional, modern educational website designed to help secondary school students study effectively and advance their knowledge.

## Features

- **Interactive Quizzes** – Subject-based quizzes (Math, Science, English, History) with instant feedback, scoring, and progress saving
- **Flashcards** – Flip cards for active recall across all subjects; mark cards as known
- **Focus Timer** – Pomodoro-style 25/5 minute sessions that log study time
- **Progress Dashboard** – Quizzes taken, average score, cards reviewed, study minutes, day streak, subject performance, and activity history
- **Dark / Light Mode** – Persistent theme preference
- **Fully Responsive** – Works great on desktop, tablet, and mobile
- **Privacy-First** – No accounts or servers. All data stored in the browser’s localStorage

## How to Use

1. Open `home.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
2. Or serve the folder with any static file server:

```bash
# Python
python -m http.server 8000

# Node (if you have npx)
npx serve .
```

Then visit `http://localhost:8000`.

## Project Structure

```
studysphere/
├── home.html          # Home page
├── subjects.html       # Subject overview
├── quizzes.html        # Interactive quiz engine
├── flashcards.html     # Flashcard study tool
├── timer.html          # Pomodoro focus timer
├── dashboard.html      # Progress & stats
├── about.html          # About the project
├── design.css           # All styles (CSS variables, dark mode, responsive)
├── interact.js          # Quiz engine, flashcards, timer, storage, theme
└── README.md
```

## Technology

- Pure HTML, CSS, and Vanilla JavaScript
- No frameworks or build tools required
- Uses CSS custom properties for theming
- LocalStorage for persistence

## Customization

- Add more questions in `interact.js` under `QUIZ_DATA`
- Add more flashcards under `FLASHCARD_DATA`
- Adjust colors in `design.css` via the `:root` variables

---

Built for secondary school students who want to study smarter.
