/**
 * UI Module
 *
 * Handles all DOM manipulation and rendering for the citizenship test app.
 */

const UI = {
  /**
   * Show a specific screen
   */
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Show the target screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.screen === screenId) {
        btn.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Show loading overlay
   */
  showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.querySelector('p').textContent = message;
      overlay.style.display = 'flex';
    }
  },

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },

  /**
   * Show confirmation modal
   */
  showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    titleEl.textContent = title;
    messageEl.textContent = message;

    // Remove old event listeners and add new one
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.addEventListener('click', () => {
      this.closeModal();
      if (onConfirm) onConfirm();
    });

    modal.style.display = 'flex';
  },

  /**
   * Close modal
   */
  closeModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  /**
   * Update home screen stats
   */
  updateHomeStats(stats) {
    const totalPracticed = document.getElementById('home-total-practiced');
    const accuracy = document.getElementById('home-accuracy');

    if (totalPracticed) totalPracticed.textContent = `${stats.questionsPracticedToday || 0}/100`;
    if (accuracy) accuracy.textContent = `${(stats.accuracy || 0).toFixed(0)}%`;
  },

  /**
   * Render questions list
   */
  renderQuestionsList(questions, stats) {
    const container = document.getElementById('questions-list');
    if (!container) return;

    container.innerHTML = questions.map(q => {
      const stat = stats.find(s => s.questionId === q.id) || {};
      // successRate may be decimal (0-1) or percentage (0-100) depending on source
      let accuracy = stat.timesAsked > 0 ? stat.successRate : null;
      // Convert decimal to percentage if needed
      if (accuracy !== null && accuracy <= 1 && stat.timesAsked > 0) {
        accuracy = accuracy * 100;
      }

      let badgeClass = 'new';
      let badgeText = 'New';

      if (accuracy !== null) {
        if (accuracy >= 70) {
          badgeClass = 'strong';
          badgeText = `${accuracy.toFixed(0)}%`;
        } else if (accuracy >= 50) {
          badgeClass = 'moderate';
          badgeText = `${accuracy.toFixed(0)}%`;
        } else {
          badgeClass = 'weak';
          badgeText = `${accuracy.toFixed(0)}%`;
        }
      }

      return `
        <div class="question-item" onclick="App.selectQuestion(${q.id})">
          <span class="question-item-number">${q.id}</span>
          <span class="question-item-text">${q.question}</span>
          <div class="question-item-status">
            <span class="accuracy-badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render a question for practice
   */
  renderQuestion(question, mode = 'typed', progress = null) {
    const questionsList = document.getElementById('questions-list');
    const questionPractice = document.getElementById('question-practice');
    const studyProgress = document.getElementById('study-progress');

    if (questionsList) questionsList.style.display = 'none';
    if (questionPractice) questionPractice.style.display = 'block';

    // Show/hide and update progress bar
    if (studyProgress) {
      if (progress) {
        studyProgress.style.display = 'flex';
        document.getElementById('study-current').textContent = progress.current;
        document.getElementById('study-total').textContent = progress.total;
        document.getElementById('study-progress-fill').style.width = `${(progress.current / progress.total) * 100}%`;
        document.getElementById('session-correct').textContent = progress.correct || 0;
        document.getElementById('session-incorrect').textContent = progress.incorrect || 0;
      } else {
        studyProgress.style.display = 'none';
      }
    }

    document.getElementById('practice-q-num').textContent = question.id;
    document.getElementById('practice-q-category').textContent = question.subcategory;
    document.getElementById('practice-q-text').textContent = question.question;

    // Clear previous feedback
    const feedback = document.getElementById('answer-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.className = 'feedback';
    }

    // Show correct answer mode
    const multipleContainer = document.getElementById('multiple-choice-container');
    const typedContainer = document.getElementById('typed-answer-container');

    if (mode === 'multiple') {
      multipleContainer.style.display = 'block';
      typedContainer.style.display = 'none';
      this.renderMultipleChoice(question);
    } else {
      multipleContainer.style.display = 'none';
      typedContainer.style.display = 'block';
      const input = document.getElementById('typed-answer-input');
      input.disabled = false;
      input.value = '';
      input.focus();

      // Reset check button
      const checkBtn = document.getElementById('study-check-btn');
      if (checkBtn) {
        checkBtn.textContent = 'Check Answer';
        checkBtn.onclick = () => App.checkTypedAnswer();
      }
    }
  },

  /**
   * Render multiple choice options
   */
  renderMultipleChoice(question, containerId = 'choices-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Generate choices: 1 correct + 3 wrong
    const choices = this.generateChoices(question);

    container.innerHTML = choices.map((choice, index) => `
      <button class="choice-btn" onclick="App.selectChoice(this, ${index}, ${choice.correct})">
        ${choice.text}
      </button>
    `).join('');
  },

  /**
   * Fisher-Yates shuffle for truly random ordering
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * Generate multiple choice options for a question
   */
  generateChoices(question) {
    // Get one correct answer
    const correctAnswer = question.answers[Math.floor(Math.random() * question.answers.length)];

    // Generate wrong answers from other questions in same category
    const wrongAnswers = [];
    const sameCategory = QUESTIONS.filter(q =>
      q.id !== question.id && q.category === question.category
    );

    // Shuffle and pick wrong answers
    const shuffled = this.shuffle(sameCategory);
    for (const q of shuffled) {
      if (wrongAnswers.length >= 3) break;
      const wrongAnswer = q.answers[0];
      if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    // If not enough wrong answers from same category, add generic ones
    const genericWrong = [
      'The Declaration of Rights',
      'The President',
      'Congress',
      'The Senate',
      'George Washington',
      'Thomas Jefferson',
      'Benjamin Franklin',
      'The Supreme Court',
      'The Bill of Rights',
      'Washington, D.C.',
      '1776',
      '1787',
      'freedom of speech',
      'vote in federal elections'
    ];

    const shuffledGeneric = this.shuffle(genericWrong);
    for (const wrong of shuffledGeneric) {
      if (wrongAnswers.length >= 3) break;
      if (wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }

    // Combine and shuffle
    const choices = [
      { text: correctAnswer, correct: true },
      ...wrongAnswers.map(w => ({ text: w, correct: false }))
    ];

    return this.shuffle(choices);
  },

  /**
   * Show answer feedback
   */
  showFeedback(isCorrect, correctAnswers, feedbackId = 'answer-feedback', answersId = 'correct-answers') {
    const feedback = document.getElementById(feedbackId);
    const answersEl = document.getElementById(answersId);

    if (!feedback) return;

    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';

    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    if (icon) icon.textContent = isCorrect ? '✓' : '✗';
    if (text) text.textContent = isCorrect ? 'Correct!' : 'Incorrect';

    if (answersEl && correctAnswers && correctAnswers.length > 0) {
      answersEl.innerHTML = `
        <strong>Official answers:</strong>
        ${correctAnswers.map(a => `<div>• ${a}</div>`).join('')}
      `;
    }
  },

  /**
   * Update choice button states
   */
  updateChoiceStates(selectedBtn, isCorrect, containerId = 'choices-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll('.choice-btn');
    buttons.forEach((btn, index) => {
      btn.disabled = true;

      if (btn === selectedBtn) {
        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      }

      // Show correct answer
      if (!isCorrect && btn.onclick && btn.onclick.toString().includes('true')) {
        // This is the correct answer button
      }
    });

    // Highlight correct answer if wrong selection
    if (!isCorrect) {
      buttons.forEach(btn => {
        const onclickStr = btn.getAttribute('onclick') || '';
        if (onclickStr.includes('true')) {
          btn.classList.add('correct');
        }
      });
    }
  },

  /**
   * Show questions list
   */
  showQuestionsList() {
    const questionsList = document.getElementById('questions-list');
    const questionPractice = document.getElementById('question-practice');
    const studyProgress = document.getElementById('study-progress');

    if (questionsList) questionsList.style.display = 'grid';
    if (questionPractice) questionPractice.style.display = 'none';
    if (studyProgress) studyProgress.style.display = 'none';
  },

  /**
   * Update study session score display
   */
  updateStudySessionScore(correct, incorrect) {
    const correctEl = document.getElementById('session-correct');
    const incorrectEl = document.getElementById('session-incorrect');

    if (correctEl) correctEl.textContent = correct;
    if (incorrectEl) incorrectEl.textContent = incorrect;
  },

  /**
   * Render exam question
   */
  renderExamQuestion(question, questionNum, mode = 'typed') {
    document.getElementById('exam-current').textContent = questionNum;
    document.getElementById('exam-progress-fill').style.width = `${(questionNum / 10) * 100}%`;
    document.getElementById('exam-q-text').textContent = question.question;

    // Clear feedback
    const feedback = document.getElementById('exam-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.className = 'feedback';
    }

    // Show correct mode
    const multipleContainer = document.getElementById('exam-multiple-choice');
    const typedContainer = document.getElementById('exam-typed-answer');

    if (mode === 'multiple') {
      multipleContainer.style.display = 'block';
      typedContainer.style.display = 'none';
      this.renderMultipleChoice(question, 'exam-choices-container');
    } else {
      multipleContainer.style.display = 'none';
      typedContainer.style.display = 'block';
      const input = document.getElementById('exam-typed-input');
      input.disabled = false;
      input.value = '';
      input.focus();
    }
  },

  /**
   * Show exam feedback
   */
  showExamFeedback(isCorrect, correctAnswers) {
    const feedback = document.getElementById('exam-feedback');
    const answersEl = document.getElementById('exam-correct-answers');
    if (!feedback) return;

    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';

    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    if (icon) icon.textContent = isCorrect ? '✓' : '✗';
    if (text) text.textContent = isCorrect ? 'Correct!' : 'Incorrect';

    if (answersEl && correctAnswers && correctAnswers.length > 0) {
      answersEl.innerHTML = `
        <strong>Official answers:</strong>
        ${correctAnswers.map(a => `<div>• ${a}</div>`).join('')}
      `;
    }
  },

  /**
   * Render exam results
   */
  renderExamResults(score, passed, missedQuestions) {
    const header = document.getElementById('results-header');
    const scoreEl = document.getElementById('exam-score');
    const missedContainer = document.getElementById('missed-questions-container');
    const missedList = document.getElementById('missed-questions-list');

    if (header) {
      header.className = `results-header ${passed ? 'passed' : 'failed'}`;
      header.querySelector('.result-icon').textContent = passed ? '✓' : '✗';
      header.querySelector('h2').textContent = passed ? 'Congratulations!' : 'Keep Practicing';
      header.querySelector('.result-subtitle').textContent = passed
        ? 'You passed the practice exam'
        : 'You need 6/10 to pass';
    }

    if (scoreEl) {
      scoreEl.textContent = score;
    }

    if (missedContainer && missedList) {
      if (missedQuestions.length > 0) {
        missedContainer.style.display = 'block';
        missedList.innerHTML = missedQuestions.map(q => `
          <div class="missed-item">
            <span class="missed-item-number">Q${q.id}:</span>
            ${q.question}
          </div>
        `).join('');
      } else {
        missedContainer.style.display = 'none';
      }
    }

    // Hide "Review Missed Questions" button if perfect score
    const reviewBtn = document.getElementById('review-missed-btn');
    if (reviewBtn) {
      reviewBtn.style.display = missedQuestions.length > 0 ? 'block' : 'none';
    }
  },

  /**
   * Render weak areas intro
   */
  renderWeakAreasIntro(weakQuestions) {
    const intro = document.getElementById('weak-intro');
    const practice = document.getElementById('weak-practice');
    const complete = document.getElementById('weak-complete');
    const countEl = document.getElementById('weak-count');

    if (intro) intro.style.display = 'block';
    if (practice) practice.style.display = 'none';
    if (complete) complete.style.display = 'none';
    if (countEl) countEl.textContent = weakQuestions.length;
  },

  /**
   * Render weak area question
   */
  renderWeakQuestion(question, weakInfo, mode = 'typed') {
    const intro = document.getElementById('weak-intro');
    const practice = document.getElementById('weak-practice');

    if (intro) intro.style.display = 'none';
    if (practice) practice.style.display = 'block';

    document.getElementById('weak-q-num').textContent = question.id;
    document.getElementById('weak-reason').textContent = weakInfo.reason;
    document.getElementById('weak-q-text').textContent = question.question;

    // Clear feedback
    const feedback = document.getElementById('weak-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.className = 'feedback';
    }

    // Show correct mode
    const multipleContainer = document.getElementById('weak-multiple-choice');
    const typedContainer = document.getElementById('weak-typed-answer');

    if (mode === 'multiple') {
      multipleContainer.style.display = 'block';
      typedContainer.style.display = 'none';
      this.renderMultipleChoice(question, 'weak-choices-container');
    } else {
      multipleContainer.style.display = 'none';
      typedContainer.style.display = 'block';
      const input = document.getElementById('weak-typed-input');
      input.disabled = false;
      input.value = '';
      input.focus();
    }
  },

  /**
   * Show weak areas complete
   */
  showWeakComplete() {
    const intro = document.getElementById('weak-intro');
    const practice = document.getElementById('weak-practice');
    const complete = document.getElementById('weak-complete');

    if (intro) intro.style.display = 'none';
    if (practice) practice.style.display = 'none';
    if (complete) complete.style.display = 'block';
  },

  /**
   * Render statistics page
   */
  renderStats(overallStats, categoryStats, examHistory, mostMissed) {
    // Overall stats
    document.getElementById('stats-total-asked').textContent = overallStats.totalAsked;
    document.getElementById('stats-total-correct').textContent = overallStats.totalCorrect;
    document.getElementById('stats-accuracy').textContent = `${overallStats.accuracy.toFixed(0)}%`;

    // Category bars
    const categoryBars = document.getElementById('category-bars');
    if (categoryBars) {
      categoryBars.innerHTML = Object.keys(categoryStats).map(cat => {
        const c = categoryStats[cat];
        return `
          <div class="category-bar">
            <div class="category-label">
              <span>${cat}</span>
              <span>${c.accuracy.toFixed(0)}%</span>
            </div>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${c.accuracy}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Exam history
    const historyList = document.getElementById('exam-history-list');
    if (historyList) {
      if (examHistory.length === 0) {
        historyList.innerHTML = '<p class="text-muted">No exams taken yet</p>';
      } else {
        historyList.innerHTML = examHistory.slice(0, 10).map(exam => {
          const date = new Date(exam.date).toLocaleDateString();
          return `
            <div class="exam-history-item">
              <span class="exam-history-date">${date}</span>
              <span class="exam-history-score ${exam.passed ? 'passed' : 'failed'}">
                ${exam.score}/10 ${exam.passed ? '(Passed)' : '(Failed)'}
              </span>
            </div>
          `;
        }).join('');
      }
    }

    // Most missed questions
    const missedList = document.getElementById('most-missed-list');
    if (missedList) {
      if (mostMissed.length === 0) {
        missedList.innerHTML = '<p class="text-muted">No missed questions yet</p>';
      } else {
        missedList.innerHTML = mostMissed.map(m => {
          const question = QUESTIONS.find(q => q.id === m.questionId);
          return `
            <div class="missed-item">
              <span class="missed-item-number">Q${m.questionId}:</span>
              ${question ? question.question : 'Unknown question'}
              <span class="accuracy-badge weak">${m.missRate.toFixed(0)}% miss rate</span>
            </div>
          `;
        }).join('');
      }
    }
  },

  /**
   * Update settings UI
   */
  updateSettingsUI(settings) {
    // Weak threshold
    const weakThreshold = document.getElementById('weak-threshold');
    if (weakThreshold) {
      weakThreshold.value = settings.weakThreshold || '70';
    }

    // 65/20 mode
    const age65Mode = document.getElementById('age-65-mode');
    if (age65Mode) {
      age65Mode.checked = settings.age65Mode === 'true' || settings.age65Mode === true;
    }

    // Dark mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.checked = settings.darkMode === 'true' || settings.darkMode === true;
    }

    // Sheets URL
    const sheetsUrl = document.getElementById('sheets-url');
    if (sheetsUrl) {
      sheetsUrl.value = SheetsAPI.config.deploymentUrl || '';
    }
  },

  /**
   * Show connection status
   */
  showConnectionStatus(success, message) {
    const status = document.getElementById('sheets-status');
    if (status) {
      status.className = `connection-status ${success ? 'success' : 'error'}`;
      status.textContent = message;
    }
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode(enabled) {
    document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
  },

  /**
   * Update answer mode toggle buttons
   */
  updateAnswerModeToggle(mode) {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });
  }
};
