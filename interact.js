/* StudySphere - Core Application Logic */

// ========== Theme ==========
function initTheme() {
  const saved = localStorage.getItem('ss-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ss-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ========== Mobile Nav ==========
function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ========== Progress & Storage ==========
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem('ss-' + key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem('ss-' + key, JSON.stringify(value));
  }
};

function getProgress() {
  return Storage.get('progress', {
    quizzesTaken: 0,
    totalScore: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    flashcardsReviewed: 0,
    studyMinutes: 0,
    streak: 0,
    lastStudyDate: null,
    subjectScores: {},
    history: []
  });
}

function saveProgress(data) {
  Storage.set('progress', data);
}

function updateStreak() {
  const progress = getProgress();
  const today = new Date().toDateString();
  if (progress.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (progress.lastStudyDate === yesterday.toDateString()) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
    progress.lastStudyDate = today;
    saveProgress(progress);
  }
}

// ========== Toast ==========
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== Quiz Data ==========
const QUIZ_DATA = {
  math: {
    name: 'Mathematics',
    questions: [
      {
        q: 'What is the value of π (pi) approximately?',
        options: ['3.14', '2.71', '1.41', '1.61'],
        answer: 0
      },
      {
        q: 'Solve for x: 2x + 5 = 15',
        options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 4'],
        answer: 0
      },
      {
        q: 'What is the area of a circle with radius 7? (Use π ≈ 22/7)',
        options: ['154', '44', '22', '308'],
        answer: 0
      },
      {
        q: 'What is the next number in the sequence: 2, 4, 8, 16, ...?',
        options: ['24', '32', '20', '18'],
        answer: 1
      },
      {
        q: 'What is the square root of 144?',
        options: ['11', '12', '13', '14'],
        answer: 1
      },
      {
        q: 'If a triangle has angles 40°, 60°, and x°, what is x?',
        options: ['80°', '90°', '70°', '100°'],
        answer: 0
      },
      {
        q: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        answer: 2
      },
      {
        q: 'Simplify: (3x²)(2x³)',
        options: ['5x⁵', '6x⁵', '6x⁶', '5x⁶'],
        answer: 1
      }
    ]
  },
  science: {
    name: 'Science',
    questions: [
      {
        q: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2', 'NaCl'],
        answer: 0
      },
      {
        q: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        answer: 1
      },
      {
        q: 'What gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        answer: 2
      },
      {
        q: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'],
        answer: 2
      },
      {
        q: 'What force keeps planets in orbit around the sun?',
        options: ['Magnetism', 'Gravity', 'Friction', 'Tension'],
        answer: 1
      },
      {
        q: 'What is the boiling point of water at sea level?',
        options: ['90°C', '100°C', '110°C', '80°C'],
        answer: 1
      },
      {
        q: 'Which organ pumps blood throughout the body?',
        options: ['Liver', 'Lungs', 'Heart', 'Kidney'],
        answer: 2
      },
      {
        q: 'What is the speed of light approximately?',
        options: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '3,000 km/s'],
        answer: 0
      }
    ]
  },
  english: {
    name: 'English',
    questions: [
      {
        q: 'Which of the following is a synonym for "happy"?',
        options: ['Sad', 'Joyful', 'Angry', 'Tired'],
        answer: 1
      },
      {
        q: 'Identify the noun in: "The quick brown fox jumps."',
        options: ['quick', 'brown', 'fox', 'jumps'],
        answer: 2
      },
      {
        q: 'What is the past tense of "go"?',
        options: ['goed', 'went', 'gone', 'going'],
        answer: 1
      },
      {
        q: 'Which sentence is correct?',
        options: [
          'She dont like apples.',
          'She doesn\'t likes apples.',
          'She doesn\'t like apples.',
          'She not like apples.'
        ],
        answer: 2
      },
      {
        q: 'What is a metaphor?',
        options: [
          'A comparison using like or as',
          'A direct comparison without like or as',
          'An exaggeration',
          'A sound word'
        ],
        answer: 1
      },
      {
        q: 'Choose the correct spelling:',
        options: ['Recieve', 'Receive', 'Receeve', 'Receve'],
        answer: 1
      },
      {
        q: 'What is the plural of "child"?',
        options: ['Childs', 'Children', 'Childes', 'Childrens'],
        answer: 1
      },
      {
        q: 'Identify the adverb: "She runs quickly."',
        options: ['She', 'runs', 'quickly', 'None'],
        answer: 2
      }
    ]
  },
  history: {
    name: 'History',
    questions: [
      {
        q: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        answer: 2
      },
      {
        q: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'],
        answer: 1
      },
      {
        q: 'The Great Wall of China was primarily built to protect against which group?',
        options: ['Romans', 'Mongols', 'Persians', 'Vikings'],
        answer: 1
      },
      {
        q: 'Which ancient civilization built the pyramids of Giza?',
        options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'],
        answer: 2
      },
      {
        q: 'The Renaissance began in which country?',
        options: ['France', 'England', 'Italy', 'Spain'],
        answer: 2
      },
      {
        q: 'Who discovered America in 1492?',
        options: ['Vasco da Gama', 'Christopher Columbus', 'Ferdinand Magellan', 'Marco Polo'],
        answer: 1
      },
      {
        q: 'What was the main cause of the French Revolution?',
        options: [
          'Religious conflict',
          'Economic hardship and inequality',
          'Foreign invasion',
          'Natural disasters'
        ],
        answer: 1
      },
      {
        q: 'In which year did the Berlin Wall fall?',
        options: ['1987', '1989', '1991', '1990'],
        answer: 1
      }
    ]
  }
};

// ========== Flashcard Data ==========
const FLASHCARD_DATA = {
  math: [
    { front: 'What is the Pythagorean theorem?', back: 'a² + b² = c² (for right-angled triangles)' },
    { front: 'Formula for area of a triangle?', back: 'Area = (1/2) × base × height' },
    { front: 'What is a prime number?', back: 'A number greater than 1 with no positive divisors other than 1 and itself' },
    { front: 'Formula for circumference of a circle?', back: 'C = 2πr or πd' },
    { front: 'What does BODMAS stand for?', back: 'Brackets, Orders, Division, Multiplication, Addition, Subtraction' },
    { front: 'What is the quadratic formula?', back: 'x = [-b ± √(b² - 4ac)] / 2a' }
  ],
  science: [
    { front: 'What is photosynthesis?', back: 'Process by which plants convert light energy into chemical energy (glucose)' },
    { front: 'What are the three states of matter?', back: 'Solid, Liquid, Gas' },
    { front: 'What is Newton\'s First Law?', back: 'An object remains at rest or in uniform motion unless acted upon by an external force' },
    { front: 'What is the atomic number?', back: 'The number of protons in the nucleus of an atom' },
    { front: 'What is DNA?', back: 'Deoxyribonucleic acid – the molecule that carries genetic instructions' },
    { front: 'What is the unit of force?', back: 'Newton (N)' }
  ],
  english: [
    { front: 'What is a simile?', back: 'A comparison using "like" or "as" (e.g., as brave as a lion)' },
    { front: 'What is alliteration?', back: 'Repetition of the same sound at the beginning of nearby words' },
    { front: 'Define "protagonist"', back: 'The main character in a story' },
    { front: 'What is a haiku?', back: 'A Japanese poem with 3 lines (5-7-5 syllables)' },
    { front: 'What is personification?', back: 'Giving human qualities to non-human things' },
    { front: 'Define "irony"', back: 'When the opposite of what is expected occurs' }
  ],
  history: [
    { front: 'When did the Industrial Revolution begin?', back: 'Around the mid-18th century in Britain' },
    { front: 'Who was Cleopatra?', back: 'The last active ruler of the Ptolemaic Kingdom of Egypt' },
    { front: 'What was the Magna Carta?', back: 'A charter of rights signed in 1215 limiting the power of the English king' },
    { front: 'When was the Declaration of Independence signed?', back: 'July 4, 1776' },
    { front: 'What was the Cold War?', back: 'A period of geopolitical tension between the USA and USSR after WWII' },
    { front: 'Who invented the printing press?', back: 'Johannes Gutenberg (around 1440)' }
  ]
};

// ========== Quiz Engine ==========
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;

function startQuiz(subject) {
  if (!QUIZ_DATA[subject]) return;
  currentQuiz = {
    subject,
    questions: [...QUIZ_DATA[subject].questions].sort(() => Math.random() - 0.5).slice(0, 5) // 5 random questions
  };
  currentQuestionIndex = 0;
  userAnswers = [];
  quizScore = 0;
  updateStreak();
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quizArea');
  if (!container || !currentQuiz) return;

  const q = currentQuiz.questions[currentQuestionIndex];
  const total = currentQuiz.questions.length;
  const progress = ((currentQuestionIndex) / total) * 100;

  container.innerHTML = `
    <div class="quiz-container fade-in">
      <div class="quiz-progress">
        <span>Question ${currentQuestionIndex + 1} of ${total}</span>
        <span>${QUIZ_DATA[currentQuiz.subject].name}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="question-card">
        <div class="question-text">${q.q}</div>
        <div class="options-list" id="optionsList">
          ${q.options.map((opt, i) => `
            <button class="option-btn" onclick="selectOption(${i})" data-index="${i}">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-outline" onclick="exitQuiz()">Exit</button>
        <button class="btn btn-primary" id="nextBtn" disabled onclick="nextQuestion()">
          ${currentQuestionIndex === total - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  `;
}

function selectOption(index) {
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  buttons[index].classList.add('selected');
  userAnswers[currentQuestionIndex] = index;
  document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
  const q = currentQuiz.questions[currentQuestionIndex];
  const selected = userAnswers[currentQuestionIndex];
  const buttons = document.querySelectorAll('.option-btn');

  // Show correct/incorrect
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('incorrect');
  });

  if (selected === q.answer) quizScore++;

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 900);
}

function showQuizResult() {
  const total = currentQuiz.questions.length;
  const percent = Math.round((quizScore / total) * 100);
  const progress = getProgress();

  progress.quizzesTaken += 1;
  progress.correctAnswers += quizScore;
  progress.totalQuestions += total;
  progress.totalScore += percent;
  if (!progress.subjectScores[currentQuiz.subject]) {
    progress.subjectScores[currentQuiz.subject] = { taken: 0, avg: 0 };
  }
  const sub = progress.subjectScores[currentQuiz.subject];
  sub.avg = Math.round(((sub.avg * sub.taken) + percent) / (sub.taken + 1));
  sub.taken += 1;
  progress.history.unshift({
    type: 'quiz',
    subject: currentQuiz.subject,
    score: percent,
    date: new Date().toISOString()
  });
  if (progress.history.length > 20) progress.history.pop();
  saveProgress(progress);

  const container = document.getElementById('quizArea');
  let message = percent >= 80 ? 'Excellent work! 🎉' : percent >= 60 ? 'Good job! Keep practicing. 💪' : 'Keep studying — you\'ll improve! 📚';

  container.innerHTML = `
    <div class="result-card fade-in">
      <h2>Quiz Complete!</h2>
      <div class="result-score">${percent}%</div>
      <p>You scored ${quizScore} out of ${total}</p>
      <p class="mt-2" style="color: var(--text-muted)">${message}</p>
      <div class="mt-3" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="startQuiz('${currentQuiz.subject}')">Try Again</button>
        <button class="btn btn-secondary" onclick="exitQuiz()">Back to Subjects</button>
        <a href="dashboard.html" class="btn btn-outline">View Progress</a>
      </div>
    </div>
  `;
  showToast(`Quiz saved! Score: ${percent}%`);
}

function exitQuiz() {
  currentQuiz = null;
  const container = document.getElementById('quizArea');
  if (container) {
    container.innerHTML = `
      <div class="text-center">
        <h2>Choose a Subject</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Select a subject to start a 5-question quiz</p>
        <div class="subject-select">
          <button class="subject-chip" onclick="startQuiz('math')">📐 Mathematics</button>
          <button class="subject-chip" onclick="startQuiz('science')">🔬 Science</button>
          <button class="subject-chip" onclick="startQuiz('english')">📖 English</button>
          <button class="subject-chip" onclick="startQuiz('history')">🏛️ History</button>
        </div>
      </div>
    `;
  }
}

// ========== Flashcards ==========
let currentFlashSubject = 'math';
let currentCardIndex = 0;
let knownCards = new Set();

function initFlashcards(subject = 'math') {
  currentFlashSubject = subject;
  currentCardIndex = 0;
  knownCards = new Set(Storage.get('known-' + subject, []));
  renderFlashcard();
  updateFlashControls();
}

function renderFlashcard() {
  const cards = FLASHCARD_DATA[currentFlashSubject];
  if (!cards || cards.length === 0) return;

  const card = cards[currentCardIndex];
  const el = document.getElementById('flashcard');
  if (!el) return;

  el.classList.remove('flipped');
  el.innerHTML = `
    <div class="flashcard-face front">
      <div class="flashcard-label">Question</div>
      <div class="flashcard-content">${card.front}</div>
      <p style="margin-top: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">Click to flip</p>
    </div>
    <div class="flashcard-face back">
      <div class="flashcard-label">Answer</div>
      <div class="flashcard-content">${card.back}</div>
    </div>
  `;
}

function flipCard() {
  const el = document.getElementById('flashcard');
  if (el) el.classList.toggle('flipped');
}

function nextCard() {
  const cards = FLASHCARD_DATA[currentFlashSubject];
  currentCardIndex = (currentCardIndex + 1) % cards.length;
  renderFlashcard();
  updateFlashControls();
}

function prevCard() {
  const cards = FLASHCARD_DATA[currentFlashSubject];
  currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  renderFlashcard();
  updateFlashControls();
}

function markKnown() {
  knownCards.add(currentCardIndex);
  Storage.set('known-' + currentFlashSubject, [...knownCards]);
  const progress = getProgress();
  progress.flashcardsReviewed += 1;
  saveProgress(progress);
  updateStreak();
  showToast('Marked as known!');
  nextCard();
}

function updateFlashControls() {
  const counter = document.getElementById('cardCounter');
  if (counter) {
    const total = FLASHCARD_DATA[currentFlashSubject].length;
    counter.textContent = `${currentCardIndex + 1} / ${total}`;
  }
  // Update subject chips
  document.querySelectorAll('.flash-subject').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.subject === currentFlashSubject);
  });
}

// ========== Study Timer (Pomodoro-style) ==========
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let timerMode = 'focus'; // focus or break

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s = (timerSeconds % 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('startTimerBtn')?.classList.add('hidden');
  document.getElementById('pauseTimerBtn')?.classList.remove('hidden');

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      if (timerMode === 'focus') {
        const progress = getProgress();
        progress.studyMinutes += 25;
        saveProgress(progress);
        updateStreak();
        showToast('Focus session complete! Take a break 🎉');
        timerMode = 'break';
        timerSeconds = 5 * 60;
      } else {
        showToast('Break over! Ready to focus again?');
        timerMode = 'focus';
        timerSeconds = 25 * 60;
      }
      updateTimerDisplay();
      document.getElementById('startTimerBtn')?.classList.remove('hidden');
      document.getElementById('pauseTimerBtn')?.classList.add('hidden');
      // Optional: play a simple beep via Web Audio if desired
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('startTimerBtn')?.classList.remove('hidden');
  document.getElementById('pauseTimerBtn')?.classList.add('hidden');
}

function resetTimer() {
  pauseTimer();
  timerMode = 'focus';
  timerSeconds = 25 * 60;
  updateTimerDisplay();
}

function setTimerMode(mode) {
  pauseTimer();
  timerMode = mode;
  timerSeconds = mode === 'focus' ? 25 * 60 : 5 * 60;
  updateTimerDisplay();
}

// ========== Dashboard ==========
function renderDashboard() {
  const progress = getProgress();
  const avgScore = progress.totalQuestions > 0
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  // Update stats
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('statQuizzes', progress.quizzesTaken);
  set('statAvg', avgScore + '%');
  set('statFlash', progress.flashcardsReviewed);
  set('statMinutes', progress.studyMinutes);
  set('statStreak', progress.streak);

  // History
  const historyEl = document.getElementById('historyList');
  if (historyEl) {
    if (progress.history.length === 0) {
      historyEl.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No activity yet. Take a quiz or review flashcards!</p>';
    } else {
      historyEl.innerHTML = progress.history.slice(0, 8).map(h => {
        const date = new Date(h.date).toLocaleDateString();
        const icon = h.type === 'quiz' ? '📝' : '🃏';
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
            <div>
              <span>${icon}</span>
              <strong style="margin-left: 0.5rem;">${h.subject.charAt(0).toUpperCase() + h.subject.slice(1)}</strong>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 0.5rem;">${date}</span>
            </div>
            <span style="font-weight: 600; color: var(--primary);">${h.score}%</span>
          </div>
        `;
      }).join('');
    }
  }

  // Subject performance
  const subjectEl = document.getElementById('subjectPerformance');
  if (subjectEl) {
    const subjects = Object.keys(progress.subjectScores);
    if (subjects.length === 0) {
      subjectEl.innerHTML = '<p style="color: var(--text-muted);">Complete quizzes to see subject performance.</p>';
    } else {
      subjectEl.innerHTML = subjects.map(s => {
        const data = progress.subjectScores[s];
        return `
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
              <span style="font-weight: 500;">${s.charAt(0).toUpperCase() + s.slice(1)}</span>
              <span>${data.avg}% (${data.taken} quizzes)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${data.avg}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Page-specific inits
  if (document.getElementById('quizArea')) {
    exitQuiz(); // Show subject selection
  }
  if (document.getElementById('flashcard')) {
    initFlashcards('math');
  }
  if (document.getElementById('timerDisplay')) {
    updateTimerDisplay();
  }
  if (document.getElementById('statQuizzes')) {
    renderDashboard();
  }
});