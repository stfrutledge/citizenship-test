/**
 * Main Application Controller
 *
 * Handles all application logic, state management, and coordinates
 * between UI and data layers.
 */

const App = {
  // Application state
  state: {
    currentScreen: 'home',
    answerMode: 'typed', // typed answers only
    weakThreshold: 70,
    darkMode: false,
    age65Mode: false,
    testVersion: '2008', // '2008' or '2025'

    // Study mode state
    studyQuestions: [],
    currentQuestionIndex: 0,
    studyFilter: 'all',
    studyOneAtATime: false,
    studySessionCorrect: 0,
    studySessionIncorrect: 0,

    // Exam mode state
    examQuestions: [],
    examCurrentIndex: 0,
    examAnswers: [],
    examScore: 0,
    examInProgress: false,

    // Weak areas state
    weakQuestions: [],
    weakCurrentIndex: 0,

    // Data cache
    questionStats: [],
    examHistory: [],
    settings: {}
  },

  /**
   * Get the questions array for the current test version
   */
  getQuestions() {
    return this.state.testVersion === '2025' ? QUESTIONS_2025 : QUESTIONS;
  },

  /**
   * Get the 65/20 questions for the current test version
   */
  getQuestions65_20() {
    return this.state.testVersion === '2025' ? QUESTIONS_2025_65_20 : QUESTIONS_65_20;
  },

  /**
   * Set the test version (2008 or 2025)
   */
  setTestVersion(version) {
    this.state.testVersion = version;
    localStorage.setItem('testVersion', version);

    // Update UI
    document.getElementById('version-2008-btn')?.classList.toggle('active', version === '2008');
    document.getElementById('version-2025-btn')?.classList.toggle('active', version === '2025');

    // Update hero description
    const heroDesc = document.getElementById('hero-description');
    if (heroDesc) {
      if (version === '2025') {
        heroDesc.textContent = 'Practice all 128 civics questions from the 2025 USCIS test';
      } else {
        heroDesc.textContent = 'Practice all 100 civics questions from the official USCIS test';
      }
    }

    // Update mode card descriptions
    const studyModeDesc = document.getElementById('study-mode-desc');
    const examModeDesc = document.getElementById('exam-mode-desc');
    if (studyModeDesc) {
      studyModeDesc.textContent = version === '2025'
        ? 'Browse and practice all 128 civics questions by category'
        : 'Browse and practice all 100 civics questions by category';
    }
    if (examModeDesc) {
      examModeDesc.textContent = version === '2025'
        ? 'Take a 20-question practice test (12/20 to pass)'
        : 'Take a 10-question practice test (6/10 to pass)';
    }

    // Update home stats display total
    const totalPracticed = document.getElementById('home-total-practiced');
    if (totalPracticed) {
      const questionCount = version === '2025' ? 128 : 100;
      const currentText = totalPracticed.textContent;
      const currentCount = currentText.split('/')[0] || '0';
      totalPracticed.textContent = `${currentCount}/${questionCount}`;
    }

    // Update study mode question total display
    const practiceTotal = document.getElementById('practice-q-total');
    if (practiceTotal) {
      practiceTotal.textContent = version === '2025' ? '128' : '100';
    }

    // Update category filter options
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      if (version === '2025') {
        categoryFilter.innerHTML = `
          <option value="all">All Categories</option>
          <option value="American Government">American Government</option>
          <option value="American History">American History</option>
          <option value="Symbols and Holidays">Symbols and Holidays</option>
        `;
      } else {
        categoryFilter.innerHTML = `
          <option value="all">All Categories</option>
          <option value="American Government">American Government</option>
          <option value="American History">American History</option>
          <option value="Integrated Civics">Integrated Civics</option>
        `;
      }
    }

    // Update home stats for the selected version
    this.updateHomeStats();
  },

  /**
   * Initialize the application
   */
  async init() {
    console.log('Initializing Citizenship Test App...');

    // Load saved test version
    const savedVersion = localStorage.getItem('testVersion');
    if (savedVersion === '2025' || savedVersion === '2008') {
      this.state.testVersion = savedVersion;
    }

    // Load data
    await this.loadData();

    // Apply settings
    this.applySettings();

    // Apply saved test version to UI
    this.setTestVersion(this.state.testVersion);

    // Update home stats
    this.updateHomeStats();

    // Set up event listeners
    this.setupEventListeners();

    console.log('App initialized');
  },

  /**
   * Load all data from storage
   */
  async loadData() {
    UI.showLoading('Loading your progress...');

    try {
      const result = await SheetsAPI.getAllData(true);

      if (result.success && result.data) {
        this.state.questionStats = result.data.questionStats || [];
        this.state.examHistory = result.data.examHistory || [];
        this.state.settings = result.data.settings || {};
      } else {
        // API failed - fall back to localStorage
        this.loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fall back to localStorage on any error
      this.loadFromLocalStorage();
    }

    // Update cache so getOverallStats works
    SheetsAPI.cache.questionStats = this.state.questionStats;
    SheetsAPI.cache.examHistory = this.state.examHistory;
    SheetsAPI.cache.settings = this.state.settings;

    UI.hideLoading();
  },

  /**
   * Load data from localStorage (fallback)
   */
  loadFromLocalStorage() {
    const localData = SheetsAPI.getLocalData('getAllData');
    if (localData.success && localData.data) {
      this.state.questionStats = localData.data.questionStats || [];
      this.state.examHistory = localData.data.examHistory || [];
      this.state.settings = localData.data.settings || {};
    }
  },

  /**
   * Apply saved settings
   */
  applySettings() {
    const settings = this.state.settings;

    // Answer mode is always 'typed' - no longer configurable
    this.state.answerMode = 'typed';

    // Weak threshold
    if (settings.weakThreshold) {
      this.state.weakThreshold = parseInt(settings.weakThreshold);
    }

    // Dark mode (from localStorage, not Google Sheets)
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      this.state.darkMode = true;
      UI.toggleDarkMode(true);
    }

    // 65/20 mode (from localStorage)
    const age65Mode = localStorage.getItem('age65Mode');
    if (age65Mode === 'true') {
      this.state.age65Mode = true;
    }

    // Update dark mode button text
    this.updateDarkModeButton();

    // Update settings UI if on settings screen
    UI.updateSettingsUI({
      weakThreshold: this.state.weakThreshold,
      darkMode: this.state.darkMode,
      age65Mode: this.state.age65Mode
    });
  },

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Enter key for typed answers in study mode
    document.getElementById('typed-answer-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        this.checkTypedAnswer();
      }
    });

    document.getElementById('exam-typed-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        this.submitExamAnswer();
      }
    });

    document.getElementById('weak-typed-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        this.checkWeakAnswer();
      }
    });

    // Enter key to advance to next question when feedback is showing
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        // Check if exam feedback is visible (answer was submitted)
        const examFeedback = document.getElementById('exam-feedback');
        if (this.state.currentScreen === 'exam' &&
            examFeedback &&
            examFeedback.style.display !== 'none') {
          this.nextExamQuestion();
        }
        // Check if study mode feedback is visible
        const studyFeedback = document.getElementById('answer-feedback');
        if (this.state.currentScreen === 'study' &&
            studyFeedback &&
            studyFeedback.style.display !== 'none') {
          this.nextQuestion();
        }
        // Check if weak areas feedback is visible
        const weakFeedback = document.getElementById('weak-feedback');
        if (this.state.currentScreen === 'weak' &&
            weakFeedback &&
            weakFeedback.style.display !== 'none') {
          this.nextWeakQuestion();
        }
      }
    });

    // Close modal on click outside
    document.getElementById('confirm-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'confirm-modal') {
        UI.closeModal();
      }
    });
  },

  /**
   * Update home screen statistics
   */
  updateHomeStats() {
    const stats = SheetsAPI.getOverallStats();
    const questionTotal = this.state.testVersion === '2025' ? 128 : 100;
    UI.updateHomeStats(stats, questionTotal);
  },

  /**
   * Show a screen
   */
  showScreen(screenId) {
    this.state.currentScreen = screenId;
    UI.showScreen(screenId);

    // Screen-specific initialization
    if (screenId === 'stats') {
      this.loadStatsScreen();
    } else if (screenId === 'settings') {
      UI.updateSettingsUI({
        answerMode: this.state.answerMode,
        weakThreshold: this.state.weakThreshold,
        darkMode: this.state.darkMode,
        age65Mode: this.state.age65Mode
      });
    }
  },

  // ==================
  // Writing Test Mode
  // ==================

  /**
   * Start writing test mode
   */
  startWritingTest() {
    this.showScreen('writing');
  },

  // ==================
  // Study Mode
  // ==================

  /**
   * Start study mode
   */
  startStudyMode() {
    // Use 65/20 questions if age65Mode is enabled
    const filter = this.state.age65Mode ? '65_20' : 'all';
    this.state.studyFilter = filter;

    let questions = [...this.getQuestions()];

    // Apply filter
    if (filter === '65_20') {
      questions = this.getQuestions65_20();
    }

    this.state.studyQuestions = questions;
    UI.renderQuestionsList(questions, this.state.questionStats);
    UI.showQuestionsList();
    this.showScreen('study');
    UI.updateAnswerModeToggle(this.state.answerMode);
  },

  /**
   * Filter questions in study mode
   */
  filterQuestions() {
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const sortOrder = document.getElementById('sort-order')?.value || 'default';

    let questions = [...this.getQuestions()];

    // Category filter
    if (categoryFilter !== 'all') {
      questions = questions.filter(q => q.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const stats = this.state.questionStats;

      questions = questions.filter(q => {
        const stat = stats.find(s => s.questionId === q.id);

        // Convert successRate to percentage if stored as decimal
        let successRate = stat?.successRate || 0;
        if (successRate > 0 && successRate <= 1) {
          successRate = successRate * 100;
        }

        switch (statusFilter) {
          case 'not-practiced':
            return !stat || stat.timesAsked === 0;
          case 'weak':
            return stat && stat.timesAsked > 0 && successRate < this.state.weakThreshold;
          case 'strong':
            return stat && stat.timesAsked > 0 && successRate >= this.state.weakThreshold;
          default:
            return true;
        }
      });
    }

    // Sort questions
    if (sortOrder !== 'default') {
      const stats = this.state.questionStats;

      questions.sort((a, b) => {
        const statA = stats.find(s => s.questionId === a.id);
        const statB = stats.find(s => s.questionId === b.id);

        // Get success rates, converting from decimal if needed
        let rateA = statA?.successRate || 0;
        let rateB = statB?.successRate || 0;
        if (rateA > 0 && rateA <= 1) rateA = rateA * 100;
        if (rateB > 0 && rateB <= 1) rateB = rateB * 100;

        // Unpracticed questions go to the end for "strongest first", beginning for "weakest first"
        const practicedA = statA && statA.timesAsked > 0;
        const practicedB = statB && statB.timesAsked > 0;

        if (!practicedA && !practicedB) return a.id - b.id;
        if (!practicedA) return sortOrder === 'weakest' ? -1 : 1;
        if (!practicedB) return sortOrder === 'weakest' ? 1 : -1;

        if (sortOrder === 'weakest') {
          return rateA - rateB;
        } else {
          return rateB - rateA;
        }
      });
    }

    this.state.studyQuestions = questions;
    this.state.currentQuestionIndex = 0;
    UI.renderQuestionsList(questions, this.state.questionStats);
    UI.showQuestionsList();
  },

  /**
   * Shuffle the current study questions
   */
  shuffleStudyQuestions() {
    // Fisher-Yates shuffle
    const questions = [...this.state.studyQuestions];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    this.state.studyQuestions = questions;
    UI.renderQuestionsList(questions, this.state.questionStats);
  },

  /**
   * Start studying questions one at a time
   */
  startOneAtATime() {
    if (this.state.studyQuestions.length === 0) {
      return;
    }
    this.state.currentQuestionIndex = 0;
    this.state.studyOneAtATime = true;
    this.state.studySessionCorrect = 0;
    this.state.studySessionIncorrect = 0;
    const question = this.state.studyQuestions[0];
    const progress = {
      current: 1,
      total: this.state.studyQuestions.length,
      correct: 0,
      incorrect: 0
    };
    UI.renderQuestion(question, this.state.answerMode, progress);
  },

  /**
   * Shuffle remaining questions and continue studying
   */
  shuffleAndContinue() {
    // Get remaining questions (from current index onwards)
    const remaining = this.state.studyQuestions.slice(this.state.currentQuestionIndex);

    // Fisher-Yates shuffle
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }

    // Replace remaining portion of study questions
    this.state.studyQuestions = [
      ...this.state.studyQuestions.slice(0, this.state.currentQuestionIndex),
      ...remaining
    ];

    // Show the current (now shuffled) question
    this.state.studyOneAtATime = true;
    const question = this.state.studyQuestions[this.state.currentQuestionIndex];
    const progress = {
      current: this.state.currentQuestionIndex + 1,
      total: this.state.studyQuestions.length,
      correct: this.state.studySessionCorrect,
      incorrect: this.state.studySessionIncorrect
    };
    UI.renderQuestion(question, this.state.answerMode, progress);
  },

  /**
   * Set answer mode
   */
  setAnswerMode(mode) {
    this.state.answerMode = mode;
    UI.updateAnswerModeToggle(mode);
  },

  /**
   * Select a question to practice
   */
  selectQuestion(questionId) {
    const index = this.state.studyQuestions.findIndex(q => q.id === questionId);
    if (index === -1) return;

    this.state.currentQuestionIndex = index;
    this.state.studyOneAtATime = false;
    const question = this.state.studyQuestions[index];
    UI.renderQuestion(question, this.state.answerMode, null);
  },

  /**
   * Handle choice selection in study mode
   */
  selectChoice(button, choiceIndex, isCorrect) {
    const question = this.state.studyQuestions[this.state.currentQuestionIndex];

    // Record answer
    SheetsAPI.recordAnswer(question.id, isCorrect);

    // Update UI
    UI.updateChoiceStates(button, isCorrect, 'choices-container');
    UI.showFeedback(isCorrect, question.answers);

    // Update local stats
    const statIndex = this.state.questionStats.findIndex(s => s.questionId === question.id);
    if (statIndex >= 0) {
      this.state.questionStats[statIndex].timesAsked++;
      if (isCorrect) {
        this.state.questionStats[statIndex].timesCorrect++;
      }
      this.state.questionStats[statIndex].successRate =
        (this.state.questionStats[statIndex].timesCorrect /
         this.state.questionStats[statIndex].timesAsked) * 100;
    }
  },

  /**
   * Check typed answer
   */
  checkTypedAnswer() {
    const input = document.getElementById('typed-answer-input');
    const checkBtn = document.getElementById('study-check-btn');
    const userAnswer = input?.value.trim();

    if (!userAnswer) return;

    const question = this.state.studyQuestions[this.state.currentQuestionIndex];
    const isCorrect = this.validateAnswer(userAnswer, question.answers);

    // Record answer with version
    SheetsAPI.recordAnswer(question.id, isCorrect, this.state.testVersion);

    // Update session score
    if (isCorrect) {
      this.state.studySessionCorrect++;
    } else {
      this.state.studySessionIncorrect++;
    }

    // Update session score display
    if (this.state.studyOneAtATime) {
      UI.updateStudySessionScore(this.state.studySessionCorrect, this.state.studySessionIncorrect);
    }

    // Show feedback
    UI.showFeedback(isCorrect, question.answers);

    // Disable and blur input so next Enter advances
    if (input) {
      input.disabled = true;
      input.blur();
    }

    // Transform Check Answer button to Next Question
    if (checkBtn) {
      checkBtn.textContent = 'Next Question';
      checkBtn.onclick = () => App.nextQuestion();
    }

    // Update local stats
    const statIndex = this.state.questionStats.findIndex(s => s.questionId === question.id);
    if (statIndex >= 0) {
      this.state.questionStats[statIndex].timesAsked++;
      if (isCorrect) {
        this.state.questionStats[statIndex].timesCorrect++;
      }
      this.state.questionStats[statIndex].successRate =
        (this.state.questionStats[statIndex].timesCorrect /
         this.state.questionStats[statIndex].timesAsked) * 100;
    }
  },

  /**
   * Validate a typed answer against acceptable answers
   */
  validateAnswer(userAnswer, acceptableAnswers, questionId = null) {
    const normalizedUser = this.normalizeAnswer(userAnswer);

    // First try exact/fuzzy string matching
    for (const answer of acceptableAnswers) {
      const normalizedAcceptable = this.normalizeAnswer(answer);

      // Exact match
      if (normalizedUser === normalizedAcceptable) {
        return true;
      }

      // Contains match (for partial answers)
      if (normalizedAcceptable.includes(normalizedUser) && normalizedUser.length > 3) {
        return true;
      }

      // User answer contains acceptable answer
      if (normalizedUser.includes(normalizedAcceptable)) {
        return true;
      }

      // Check if user entered a number that appears in the acceptable answer
      // e.g., "435" should match "Four hundred thirty-five (435)"
      const userNumbers = normalizedUser.match(/\d+/g) || [];
      const acceptableNumbers = normalizedAcceptable.match(/\d+/g) || [];
      if (userNumbers.length > 0 && acceptableNumbers.length > 0) {
        // If user typed just a number and it matches a number in the answer, accept it
        const isJustNumber = /^\d+$/.test(normalizedUser.trim());
        const hasMatchingNumber = userNumbers.some(n => acceptableNumbers.includes(n));
        if (isJustNumber && hasMatchingNumber) {
          return true;
        }
        // Also check for age/years context
        if (hasMatchingNumber) {
          const ageContext = ['age', 'years', 'old', 'eighteen'];
          const hasAgeContext = ageContext.some(word =>
            normalizedUser.includes(word) || normalizedAcceptable.includes(word)
          );
          if (hasAgeContext) {
            return true;
          }
        }
      }

      // Fuzzy match - allow for minor typos (but not for short numeric answers)
      const isNumeric = /^\d+$/.test(normalizedUser);
      if (!isNumeric && this.fuzzyMatch(normalizedUser, normalizedAcceptable, 2)) {
        return true;
      }

      // Check word-by-word matching with fuzzy tolerance for typos
      const userWords = normalizedUser.split(' ').filter(w => w.length > 2);
      const acceptableWords = normalizedAcceptable.split(' ').filter(w => w.length > 2);
      if (userWords.length >= 2 && acceptableWords.length >= 2) {
        let matchedWords = 0;
        for (const userWord of userWords) {
          for (const acceptWord of acceptableWords) {
            // Exact match or fuzzy match for longer words
            if (userWord === acceptWord) {
              matchedWords++;
              break;
            } else if (userWord.length >= 5 && acceptWord.length >= 5 &&
                       this.fuzzyMatch(userWord, acceptWord, 3)) {
              matchedWords++;
              break;
            }
          }
        }
        // If 60%+ of user's words match, accept it
        if (matchedWords / userWords.length >= 0.6) {
          return true;
        }
      }

      // Check for equivalent locations (e.g., "New York" = "World Trade Center")
      const locationEquivalents = [
        [['new york', 'nyc'], ['world trade center', 'wtc']],
        [['washington dc', 'washington', 'dc'], ['pentagon']],
      ];

      if (normalizedUser.includes('terrorist') || normalizedUser.includes('attack')) {
        for (const [group1, group2] of locationEquivalents) {
          const userHasGroup1 = group1.some(loc => normalizedUser.includes(loc));
          const userHasGroup2 = group2.some(loc => normalizedUser.includes(loc));
          const acceptableHasGroup1 = group1.some(loc => normalizedAcceptable.includes(loc));
          const acceptableHasGroup2 = group2.some(loc => normalizedAcceptable.includes(loc));

          // User used equivalent location
          if ((userHasGroup1 && acceptableHasGroup2) || (userHasGroup2 && acceptableHasGroup1)) {
            return true;
          }
        }
      }
    }

    // Try keyword-based validation (more flexible)
    if (this.validateByKeywords(normalizedUser, acceptableAnswers)) {
      return true;
    }

    return false;
  },

  /**
   * Validate answer using keyword/concept matching
   * Checks if user's answer matches the key concepts of ANY acceptable answer
   */
  validateByKeywords(userAnswer, acceptableAnswers) {
    // Define synonym groups for common concepts
    const synonymGroups = {
      // Numbers
      'fifty': ['50', 'fifty'],
      'thirteen': ['13', 'thirteen'],
      'twentyseven': ['27', 'twenty-seven', 'twentyseven', 'twenty seven'],
      'hundred': ['100', 'hundred'],
      'four': ['4', 'four'],
      'six': ['6', 'six'],
      'two': ['2', 'two'],
      'nine': ['9', 'nine'],
      'eighteen': ['18', 'eighteen'],
      'ten': ['10', 'ten'],
      // Government concepts
      'constitution': ['constitution', 'constitutional'],
      'president': ['president', 'presidential'],
      'vice president': ['vice president', 'vp', 'vice-president'],
      'congress': ['congress', 'congressional'],
      'senator': ['senator', 'senators', 'senate'],
      'representative': ['representative', 'representatives', 'rep'],
      'supreme court': ['supreme court', 'highest court'],
      'judicial': ['judicial', 'courts', 'judges'],
      'executive': ['executive', 'president'],
      'legislative': ['legislative', 'congress', 'legislature'],
      // Actions/concepts
      'wrote': ['wrote', 'write', 'writing', 'written', 'author', 'authored'],
      'declare': ['declare', 'declares', 'declared', 'declaring', 'declaration'],
      'make': ['make', 'makes', 'made', 'making'],
      'represent': ['represent', 'represents', 'representing', 'representation', 'stands for', 'symbolize', 'symbolizes'],
      'protect': ['protect', 'protects', 'protecting', 'protection', 'defend', 'defends'],
      'resolve': ['resolve', 'resolves', 'resolving', 'resolution', 'settle', 'settles', 'decide', 'decides'],
      'review': ['review', 'reviews', 'reviewing', 'examine', 'examines'],
      'explain': ['explain', 'explains', 'explaining', 'interpret', 'interprets'],
      'freedom': ['freedom', 'free', 'liberty', 'right', 'rights'],
      'vote': ['vote', 'voting', 'elect', 'election'],
      'law': ['law', 'laws', 'legal', 'legislation'],
      'dispute': ['dispute', 'disputes', 'disagreement', 'disagreements', 'conflict', 'conflicts'],
      'state': ['state', 'states'],
      'colony': ['colony', 'colonies', 'colonial'],
      'amendment': ['amendment', 'amendments', 'change', 'addition'],
      'independence': ['independence', 'independent', 'free', 'freedom'],
      'citizen': ['citizen', 'citizens', 'citizenship'],
      'war': ['war', 'wars', 'fought', 'battle'],
      'world war i': ['world war i', 'world war 1', 'wwi', 'ww1', 'first world war'],
      'world war ii': ['world war ii', 'world war 2', 'wwii', 'ww2', 'second world war'],
      'rights': ['rights', 'right', 'freedom', 'freedoms', 'liberty'],
      // People
      'washington': ['washington', 'george washington'],
      'jefferson': ['jefferson', 'thomas jefferson'],
      'lincoln': ['lincoln', 'abraham lincoln'],
      'franklin': ['franklin', 'benjamin franklin', 'ben franklin'],
      // Places
      'britain': ['britain', 'british', 'england', 'english', 'great britain'],
      'america': ['america', 'american', 'united states', 'us', 'usa'],
      'new york': ['new york', 'nyc', 'world trade center', 'wtc'],
      'washington dc': ['washington dc', 'washington', 'pentagon', 'dc'],
      // Events
      'terrorists attacked': ['terrorists attacked', 'terrorist attack', '911', '9/11', 'september 11'],
    };

    const fillerWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
         'have', 'has', 'had', 'do', 'does', 'did', 'for', 'and', 'but', 'or',
         'because', 'that', 'this', 'there', 'their', 'they', 'them', 'can',
         'will', 'would', 'could', 'should', 'one', 'each', 'every', 'of'];

    // Check each acceptable answer SEPARATELY
    for (const answer of acceptableAnswers) {
      const words = this.normalizeAnswer(answer).split(' ');
      const keywords = words.filter(w => w.length > 2 && !fillerWords.includes(w));

      if (keywords.length === 0) continue;

      let matchedConcepts = 0;

      for (const keyword of keywords) {
        // Check if user's answer contains this keyword
        if (userAnswer.includes(keyword)) {
          matchedConcepts++;
          continue;
        }

        // Check synonyms
        let foundSynonym = false;
        for (const [concept, synonyms] of Object.entries(synonymGroups)) {
          if (synonyms.includes(keyword)) {
            for (const syn of synonyms) {
              if (userAnswer.includes(syn)) {
                matchedConcepts++;
                foundSynonym = true;
                break;
              }
            }
            break;
          }
        }
      }

      // If user matched 60%+ of THIS answer's keywords, accept it
      const matchRatio = matchedConcepts / keywords.length;
      if (matchRatio >= 0.6 || (matchedConcepts >= 2 && keywords.length <= 3)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Normalize an answer for comparison
   */
  normalizeAnswer(answer) {
    return answer
      .toLowerCase()
      .replace(/^the\s+/i, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  /**
   * Simple fuzzy matching (Levenshtein distance)
   */
  fuzzyMatch(str1, str2, maxDistance) {
    if (Math.abs(str1.length - str2.length) > maxDistance) return false;

    const matrix = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length] <= maxDistance;
  },

  /**
   * Navigate to previous question
   */
  previousQuestion() {
    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--;
      const question = this.state.studyQuestions[this.state.currentQuestionIndex];
      const progress = this.state.studyOneAtATime ? {
        current: this.state.currentQuestionIndex + 1,
        total: this.state.studyQuestions.length,
        correct: this.state.studySessionCorrect,
        incorrect: this.state.studySessionIncorrect
      } : null;
      UI.renderQuestion(question, this.state.answerMode, progress);
    }
  },

  /**
   * Navigate to next question
   */
  nextQuestion() {
    if (this.state.currentQuestionIndex < this.state.studyQuestions.length - 1) {
      this.state.currentQuestionIndex++;
      const question = this.state.studyQuestions[this.state.currentQuestionIndex];
      const progress = this.state.studyOneAtATime ? {
        current: this.state.currentQuestionIndex + 1,
        total: this.state.studyQuestions.length,
        correct: this.state.studySessionCorrect,
        incorrect: this.state.studySessionIncorrect
      } : null;
      UI.renderQuestion(question, this.state.answerMode, progress);
    } else {
      // End of questions - go back to list
      this.state.studyOneAtATime = false;
      UI.renderQuestionsList(this.state.studyQuestions, this.state.questionStats);
      UI.showQuestionsList();
    }
  },

  // ==================
  // Exam Mode
  // ==================

  /**
   * Start exam mode
   */
  startExamMode() {
    const allQuestions = this.getQuestions();
    const is2025 = this.state.testVersion === '2025';

    // 2025 test: 20 questions, need 12 correct
    // 2008 test: 10 questions, need 6 correct
    const examSize = is2025 ? 20 : 10;

    // Categories differ between versions
    const categories = is2025
      ? ['American Government', 'American History', 'Symbols and Holidays']
      : ['American Government', 'American History', 'Integrated Civics'];

    const selectedQuestions = [];
    const usedIds = new Set();

    // Helper to shuffle an array
    const shuffle = (arr) => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    // Select questions from each category proportionally
    const questionsPerCategory = Math.floor(examSize / categories.length);
    for (const category of categories) {
      const categoryQuestions = shuffle(allQuestions.filter(q => q.category === category));
      for (let i = 0; i < questionsPerCategory && i < categoryQuestions.length; i++) {
        selectedQuestions.push(categoryQuestions[i]);
        usedIds.add(categoryQuestions[i].id);
      }
    }

    // Fill remaining slots with random questions from any category
    const remainingSlots = examSize - selectedQuestions.length;
    const remaining = shuffle(allQuestions.filter(q => !usedIds.has(q.id)));
    for (let i = 0; i < remainingSlots && i < remaining.length; i++) {
      selectedQuestions.push(remaining[i]);
    }

    // Shuffle the final selection so categories aren't grouped
    this.state.examQuestions = shuffle(selectedQuestions);
    this.state.examCurrentIndex = 0;
    this.state.examAnswers = [];
    this.state.examScore = 0;
    this.state.examInProgress = true;

    this.showScreen('exam');
    this.renderCurrentExamQuestion();
  },

  /**
   * Render current exam question
   */
  renderCurrentExamQuestion() {
    const question = this.state.examQuestions[this.state.examCurrentIndex];
    const totalQuestions = this.state.testVersion === '2025' ? 20 : 10;
    UI.renderExamQuestion(question, this.state.examCurrentIndex + 1, this.state.answerMode, totalQuestions);
  },

  /**
   * Handle exam choice selection
   */
  examSelectChoice(button, choiceIndex, isCorrect) {
    const question = this.state.examQuestions[this.state.examCurrentIndex];

    // Record answer
    this.state.examAnswers.push({
      questionId: question.id,
      correct: isCorrect
    });

    if (isCorrect) {
      this.state.examScore++;
    }

    // Record to stats
    SheetsAPI.recordAnswer(question.id, isCorrect);

    // Update UI
    UI.updateChoiceStates(button, isCorrect, 'exam-choices-container');
    UI.showExamFeedback(isCorrect, question.answers);
  },

  /**
   * Submit exam typed answer
   */
  submitExamAnswer() {
    const input = document.getElementById('exam-typed-input');

    // If input is disabled, answer was already submitted - advance instead
    if (input?.disabled) {
      this.nextExamQuestion();
      return;
    }

    const userAnswer = input?.value.trim();

    if (!userAnswer) return;

    const question = this.state.examQuestions[this.state.examCurrentIndex];
    const isCorrect = this.validateAnswer(userAnswer, question.answers);

    // Record answer
    this.state.examAnswers.push({
      questionId: question.id,
      correct: isCorrect
    });

    if (isCorrect) {
      this.state.examScore++;
    }

    // Record to stats
    SheetsAPI.recordAnswer(question.id, isCorrect);

    // Show feedback
    UI.showExamFeedback(isCorrect, question.answers);

    // Disable and blur input so next Enter goes to document handler
    if (input) {
      input.disabled = true;
      input.blur();
    }
  },

  /**
   * Move to next exam question
   */
  nextExamQuestion() {
    this.state.examCurrentIndex++;
    const examSize = this.state.testVersion === '2025' ? 20 : 10;

    if (this.state.examCurrentIndex >= examSize) {
      // Exam complete
      this.completeExam();
    } else {
      this.renderCurrentExamQuestion();
    }
  },

  /**
   * Complete the exam
   */
  completeExam() {
    const is2025 = this.state.testVersion === '2025';
    const passingScore = is2025 ? 12 : 6;
    const totalQuestions = is2025 ? 20 : 10;

    const passed = this.state.examScore >= passingScore;
    const questionsAsked = this.state.examQuestions.map(q => q.id);
    const questionsMissed = this.state.examAnswers
      .filter(a => !a.correct)
      .map(a => a.questionId);

    // Record exam with version info
    SheetsAPI.recordExam(
      this.state.examScore,
      passed,
      questionsAsked,
      questionsMissed,
      this.state.testVersion
    );

    // Get missed question details
    const allQuestions = this.getQuestions();
    const missedQuestions = questionsMissed.map(id =>
      allQuestions.find(q => q.id === id)
    );

    // Show results
    this.state.examInProgress = false;
    UI.renderExamResults(this.state.examScore, passed, missedQuestions, totalQuestions, passingScore);
    this.showScreen('exam-results');

    // Update home stats
    this.updateHomeStats();
  },

  /**
   * Confirm exit exam
   */
  confirmExitExam() {
    if (this.state.examInProgress) {
      UI.showModal(
        'Exit Exam?',
        'Your progress will be lost. Are you sure you want to exit?',
        () => {
          this.state.examInProgress = false;
          this.showScreen('home');
        }
      );
    } else {
      this.showScreen('home');
    }
  },

  /**
   * Review missed questions from exam
   */
  reviewMissedQuestions() {
    const missedIds = this.state.examAnswers
      .filter(a => !a.correct)
      .map(a => a.questionId);

    if (missedIds.length === 0) {
      this.showScreen('home');
      return;
    }

    const allQuestions = this.getQuestions();
    this.state.studyQuestions = allQuestions.filter(q => missedIds.includes(q.id));
    this.state.currentQuestionIndex = 0;
    this.state.studyOneAtATime = true;
    this.state.studySessionCorrect = 0;
    this.state.studySessionIncorrect = 0;

    this.showScreen('study');
    const progress = {
      current: 1,
      total: this.state.studyQuestions.length,
      correct: 0,
      incorrect: 0
    };
    UI.renderQuestion(this.state.studyQuestions[0], this.state.answerMode, progress);
  },

  // ==================
  // Weak Areas Mode
  // ==================

  /**
   * Start weak areas mode
   */
  startWeakAreasMode() {
    const weakQuestions = SheetsAPI.getWeakQuestions(this.state.weakThreshold);
    this.state.weakQuestions = weakQuestions;
    this.state.weakCurrentIndex = 0;

    UI.renderWeakAreasIntro(weakQuestions);
    this.showScreen('weak');
  },

  /**
   * Start practicing weak areas
   */
  startWeakAreasPractice() {
    if (this.state.weakQuestions.length === 0) {
      UI.showWeakComplete();
      return;
    }

    this.state.weakCurrentIndex = 0;
    this.renderCurrentWeakQuestion();
  },

  /**
   * Render current weak area question
   */
  renderCurrentWeakQuestion() {
    const weakInfo = this.state.weakQuestions[this.state.weakCurrentIndex];
    const allQuestions = this.getQuestions();
    const question = allQuestions.find(q => q.id === weakInfo.questionId);

    if (!question) {
      this.nextWeakQuestion();
      return;
    }

    UI.renderWeakQuestion(question, weakInfo, this.state.answerMode);
  },

  /**
   * Handle weak area choice selection
   */
  weakSelectChoice(button, choiceIndex, isCorrect) {
    const weakInfo = this.state.weakQuestions[this.state.weakCurrentIndex];
    const allQuestions = this.getQuestions();
    const question = allQuestions.find(q => q.id === weakInfo.questionId);

    // Record answer with version
    SheetsAPI.recordAnswer(question.id, isCorrect, this.state.testVersion);

    // Update UI
    UI.updateChoiceStates(button, isCorrect, 'weak-choices-container');
    UI.showFeedback(isCorrect, question.answers, 'weak-feedback', 'weak-correct-answers');
  },

  /**
   * Check weak area typed answer
   */
  checkWeakAnswer() {
    const input = document.getElementById('weak-typed-input');

    // If input is disabled, answer was already submitted - advance instead
    if (input?.disabled) {
      this.nextWeakQuestion();
      return;
    }

    const userAnswer = input?.value.trim();

    if (!userAnswer) return;

    const weakInfo = this.state.weakQuestions[this.state.weakCurrentIndex];
    const allQuestions = this.getQuestions();
    const question = allQuestions.find(q => q.id === weakInfo.questionId);
    const isCorrect = this.validateAnswer(userAnswer, question.answers);

    // Record answer with version
    SheetsAPI.recordAnswer(question.id, isCorrect, this.state.testVersion);

    // Show feedback
    UI.showFeedback(isCorrect, question.answers, 'weak-feedback', 'weak-correct-answers');

    // Disable and blur input so next Enter advances
    if (input) {
      input.disabled = true;
      input.blur();
    }
  },

  /**
   * Move to next weak question
   */
  nextWeakQuestion() {
    this.state.weakCurrentIndex++;

    if (this.state.weakCurrentIndex >= this.state.weakQuestions.length) {
      UI.showWeakComplete();
    } else {
      this.renderCurrentWeakQuestion();
    }
  },

  // ==================
  // Statistics
  // ==================

  /**
   * Load statistics screen
   */
  loadStatsScreen() {
    const overallStats = SheetsAPI.getOverallStats();
    const categoryStats = SheetsAPI.getCategoryStats();
    const examHistory = this.state.examHistory || [];
    const mostMissed = SheetsAPI.getMostMissedQuestions();

    UI.renderStats(overallStats, categoryStats, examHistory, mostMissed);
  },

  // ==================
  // Settings
  // ==================

  /**
   * Update a setting
   */
  updateSetting(key, value) {
    this.state.settings[key] = value;

    // Apply immediately
    switch (key) {
      case 'answerMode':
        this.state.answerMode = value;
        break;
      case 'weakThreshold':
        this.state.weakThreshold = parseInt(value);
        break;
      case 'sheetsUrl':
        SheetsAPI.setDeploymentUrl(value);
        break;
    }

    // Save to storage
    SheetsAPI.updateSetting(key, value);
  },

  /**
   * Toggle 65/20 mode
   */
  toggleAge65Mode() {
    const checkbox = document.getElementById('age-65-mode');
    const enabled = checkbox?.checked || false;

    this.state.age65Mode = enabled;
    localStorage.setItem('age65Mode', enabled.toString());
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const checkbox = document.getElementById('dark-mode-toggle');
    const enabled = checkbox?.checked || false;

    this.state.darkMode = enabled;
    UI.toggleDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    this.updateDarkModeButton();
  },

  toggleDarkModeFromFooter() {
    this.state.darkMode = !this.state.darkMode;
    UI.toggleDarkMode(this.state.darkMode);
    localStorage.setItem('darkMode', this.state.darkMode.toString());

    // Sync checkbox in settings if present
    const checkbox = document.getElementById('dark-mode-toggle');
    if (checkbox) {
      checkbox.checked = this.state.darkMode;
    }

    this.updateDarkModeButton();
  },

  updateDarkModeButton() {
    // Icon changes automatically via CSS based on [data-theme]
  },

  /**
   * Test Google Sheets connection
   */
  async testSheetsConnection() {
    UI.showLoading('Testing connection...');

    const result = await SheetsAPI.testConnection();

    UI.hideLoading();
    UI.showConnectionStatus(
      result.success,
      result.success ? 'Connected!' : `Error: ${result.error}`
    );

    if (result.success) {
      // Initialize sheets if needed
      await SheetsAPI.initializeSheets();
    }
  },

  /**
   * Confirm reset statistics
   */
  confirmResetStats() {
    UI.showModal(
      'Reset Statistics?',
      'This will permanently delete all your progress and statistics. This cannot be undone.',
      async () => {
        UI.showLoading('Resetting...');
        await SheetsAPI.resetStats();
        await this.loadData();
        this.updateHomeStats();
        UI.hideLoading();
        this.showScreen('home');
      }
    );
  },

  /**
   * Close modal (exposed for HTML onclick)
   */
  closeModal() {
    UI.closeModal();
  }
};

// Override selectChoice functions to use App methods
window.App = App;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Handle exam choice selection (called from HTML)
App.selectChoice = function(button, choiceIndex, isCorrect) {
  const currentScreen = this.state.currentScreen;

  if (currentScreen === 'exam') {
    this.examSelectChoice(button, choiceIndex, isCorrect);
  } else if (currentScreen === 'weak') {
    this.weakSelectChoice(button, choiceIndex, isCorrect);
  } else {
    // Study mode
    const question = this.state.studyQuestions[this.state.currentQuestionIndex];
    SheetsAPI.recordAnswer(question.id, isCorrect, this.state.testVersion);
    UI.updateChoiceStates(button, isCorrect, 'choices-container');
    UI.showFeedback(isCorrect, question.answers);
  }
};
