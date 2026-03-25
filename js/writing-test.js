/**
 * Writing Test Module
 *
 * Simulates the USCIS writing test where sentences are read aloud
 * and the user must write them correctly. Uses Web Speech API for TTS.
 */

const WritingTest = {
  // Official USCIS Writing Sentences (from M-1122)
  sentences: [
    "Adams was the second President.",
    "Alaska is the largest state.",
    "California has the most people.",
    "Citizens can vote.",
    "Citizens have the right to vote.",
    "Congress meets in Washington, D.C.",
    "Delaware was the first state.",
    "George Washington was the first President.",
    "Independence Day is in July.",
    "Lincoln was President during the Civil War.",
    "Memorial Day is in May.",
    "Presidents' Day is in February.",
    "The capital of the United States is Washington, D.C.",
    "The flag has fifty stars.",
    "The flag has red, white, and blue.",
    "The President lives in the White House.",
    "The United States has fifty states.",
    "The White House is in Washington, D.C.",
    "Washington is on the dollar bill.",
    "We pay taxes.",
    "We have freedom of speech.",
    "Lincoln freed the slaves.",
    "American Indians lived here first.",
    "Canada is north of the United States.",
    "Mexico is south of the United States.",
    "Labor Day is in September.",
    "Columbus Day is in October.",
    "Thanksgiving is in November.",
    "Flag Day is in June."
  ],

  // Test state
  state: {
    testSentences: [],
    currentIndex: 0,
    results: [],
    playsRemaining: 3,
    speechRate: 1,
    isSpeaking: false
  },

  enterHandlerBound: false,

  // Speech synthesis
  synth: window.speechSynthesis,
  voices: [],

  /**
   * Initialize the writing test module
   */
  init() {
    this.loadVoices();
    this.setupEventListeners();

    // Chrome needs a delay to load voices
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  },

  /**
   * Load available voices
   */
  loadVoices() {
    this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en'));
  },

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Speech rate slider
    const rateSlider = document.getElementById('writing-speech-rate');
    const rateDisplay = document.getElementById('writing-rate-display');

    if (rateSlider) {
      rateSlider.addEventListener('input', () => {
        this.state.speechRate = parseFloat(rateSlider.value);
        if (rateDisplay) {
          rateDisplay.textContent = rateSlider.value + 'x';
        }
      });
    }

    // Input field - enable check button when text entered
    const input = document.getElementById('writing-input');
    const checkBtn = document.getElementById('writing-check-btn');

    if (input) {
      input.addEventListener('input', () => {
        if (checkBtn) {
          checkBtn.disabled = input.value.trim() === '';
        }
      });

    }

    if (!this.enterHandlerBound) {
      document.addEventListener('keydown', (e) => this.handleEnterKey(e));
      this.enterHandlerBound = true;
    }
  },

  handleEnterKey(e) {
    if (e.key !== 'Enter') return;

    const writingScreen = document.getElementById('screen-writing');
    const testArea = document.getElementById('writing-test-area');
    const results = document.getElementById('writing-results');
    const input = document.getElementById('writing-input');
    const checkBtn = document.getElementById('writing-check-btn');

    if (!writingScreen || !writingScreen.classList.contains('active')) return;
    if (!testArea || testArea.style.display === 'none') return;
    if (results && results.style.display !== 'none') return;

    e.preventDefault();

    if (input && input.disabled) {
      if (this.state.currentIndex < 2) {
        this.next();
      } else {
        this.showResults();
      }
      return;
    }

    if (input && input.value.trim() !== '' && checkBtn && !checkBtn.disabled) {
      this.checkAnswer();
    }
  },

  /**
   * Start a new writing test
   */
  start() {
    // Select 3 random sentences
    this.state.testSentences = this.shuffleArray([...this.sentences]).slice(0, 3);
    this.state.currentIndex = 0;
    this.state.results = [];

    // Show test area, hide intro and results
    document.getElementById('writing-intro').style.display = 'none';
    document.getElementById('writing-test-area').style.display = 'block';
    document.getElementById('writing-results').style.display = 'none';

    // Reset UI for first sentence
    this.resetSentenceUI();
    this.updateProgress();
  },

  /**
   * Reset UI for a new sentence
   */
  resetSentenceUI() {
    this.synth.cancel();
    this.state.playsRemaining = 3;
    this.state.isSpeaking = false;

    // Update plays remaining
    const playsLeft = document.getElementById('writing-plays-left');
    if (playsLeft) playsLeft.textContent = '3';

    // Update current sentence number
    const current = document.getElementById('writing-current');
    if (current) current.textContent = this.state.currentIndex + 1;

    // Reset input
    const input = document.getElementById('writing-input');
    if (input) {
      input.value = '';
      input.disabled = false;
      input.focus();
    }

    // Reset buttons
    const checkBtn = document.getElementById('writing-check-btn');
    const skipBtn = document.getElementById('writing-skip-btn');
    const playBtn = document.getElementById('writing-play-btn');

    if (checkBtn) {
      checkBtn.disabled = true;
      checkBtn.textContent = 'Check Answer';
      checkBtn.onclick = () => WritingTest.checkAnswer();
    }
    if (skipBtn) skipBtn.disabled = false;
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.querySelector('.play-icon').textContent = '\u25B6';
    }

    // Hide feedback
    const feedback = document.getElementById('writing-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.classList.remove('correct', 'incorrect');
    }

    window.setTimeout(() => this.playSentence(), 150);
  },

  /**
   * Update progress dots
   */
  updateProgress() {
    const dots = document.querySelectorAll('.progress-dot');

    dots.forEach((dot, index) => {
      dot.classList.remove('active', 'correct', 'incorrect');

      if (index < this.state.results.length) {
        dot.classList.add(this.state.results[index].correct ? 'correct' : 'incorrect');
      } else if (index === this.state.currentIndex) {
        dot.classList.add('active');
      }
    });
  },

  /**
   * Play the current sentence using text-to-speech
   */
  playSentence() {
    if (this.state.playsRemaining <= 0 || this.state.isSpeaking) return;

    const sentence = this.state.testSentences[this.state.currentIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);

    // Configure speech
    utterance.rate = this.state.speechRate;
    utterance.pitch = 1;

    // Use first US English voice if available
    const usVoice = this.voices.find(v => v.lang === 'en-US');
    if (usVoice) {
      utterance.voice = usVoice;
    }

    // Update UI
    const playBtn = document.getElementById('writing-play-btn');
    if (playBtn) {
      playBtn.querySelector('.play-icon').textContent = '\u25A0'; // Stop symbol
      this.state.isSpeaking = true;
    }

    utterance.onend = () => {
      this.state.isSpeaking = false;
      this.state.playsRemaining--;

      const playsLeft = document.getElementById('writing-plays-left');
      if (playsLeft) playsLeft.textContent = this.state.playsRemaining;

      if (playBtn) {
        playBtn.querySelector('.play-icon').textContent = '\u25B6'; // Play symbol
        if (this.state.playsRemaining <= 0) {
          playBtn.disabled = true;
        }
      }
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      this.state.isSpeaking = false;
      if (playBtn) {
        playBtn.querySelector('.play-icon').textContent = '\u25B6';
      }
    };

    this.synth.speak(utterance);
  },

  /**
   * Check the user's answer
   */
  checkAnswer() {
    const input = document.getElementById('writing-input');
    const userAnswer = input ? input.value.trim() : '';
    const correctSentence = this.state.testSentences[this.state.currentIndex];
    const isCorrect = this.validateAnswer(userAnswer, correctSentence);

    // Store result
    this.state.results.push({
      sentence: correctSentence,
      userAnswer: userAnswer,
      correct: isCorrect
    });

    // Disable input and buttons
    if (input) input.disabled = true;

    const checkBtn = document.getElementById('writing-check-btn');
    const skipBtn = document.getElementById('writing-skip-btn');
    const playBtn = document.getElementById('writing-play-btn');

    if (skipBtn) skipBtn.disabled = true;
    if (playBtn) playBtn.disabled = true;

    // Show feedback
    this.showFeedback(isCorrect, correctSentence);

    // Update progress
    this.updateProgress();

    // Transform check button into next/results button
    if (checkBtn) {
      checkBtn.disabled = false;
      if (this.state.currentIndex < 2) {
        checkBtn.textContent = 'Next Sentence';
        checkBtn.onclick = () => WritingTest.next();
      } else {
        checkBtn.textContent = 'See Results';
        checkBtn.onclick = () => WritingTest.showResults();
      }
      checkBtn.focus();
    }
  },

  /**
   * Show feedback for the answer
   */
  showFeedback(isCorrect, correctSentence) {
    const feedback = document.getElementById('writing-feedback');
    const feedbackIcon = feedback?.querySelector('.feedback-icon');
    const feedbackText = feedback?.querySelector('.feedback-text');
    const correctAnswer = document.getElementById('writing-correct-answer');

    if (feedback) {
      feedback.style.display = 'block';
      feedback.classList.remove('correct', 'incorrect');
      feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    if (feedbackIcon) {
      feedbackIcon.textContent = isCorrect ? '\u2713' : '\u2717';
    }

    if (feedbackText) {
      feedbackText.textContent = isCorrect
        ? 'Correct! You wrote the sentence correctly.'
        : 'Not quite right. See the correct sentence below.';
    }

    if (correctAnswer) {
      correctAnswer.style.display = isCorrect ? 'none' : 'block';
      correctAnswer.innerHTML = `<strong>Correct:</strong> ${correctSentence}`;
    }
  },

  /**
   * Skip the current sentence
   */
  skip() {
    // Store as incorrect
    this.state.results.push({
      sentence: this.state.testSentences[this.state.currentIndex],
      userAnswer: '(skipped)',
      correct: false
    });

    this.updateProgress();

    if (this.state.currentIndex < 2) {
      this.next();
    } else {
      this.showResults();
    }
  },

  /**
   * Move to the next sentence
   */
  next() {
    this.state.currentIndex++;
    this.resetSentenceUI();
    this.updateProgress();
  },

  /**
   * Show the test results
   */
  showResults() {
    // Hide test area, show results
    document.getElementById('writing-test-area').style.display = 'none';
    document.getElementById('writing-results').style.display = 'block';

    const correctCount = this.state.results.filter(r => r.correct).length;
    const passed = correctCount >= 1;

    // Update results header
    const header = document.getElementById('writing-results-header');
    if (header) {
      header.classList.remove('passed', 'failed');
      header.classList.add(passed ? 'passed' : 'failed');

      const icon = header.querySelector('.result-icon');
      const title = header.querySelector('h2');
      const subtitle = header.querySelector('.result-subtitle');

      if (icon) icon.textContent = passed ? '\u2713' : '\u2717';
      if (title) title.textContent = passed ? 'You Passed!' : 'Keep Practicing';
      if (subtitle) subtitle.textContent = passed
        ? 'You wrote the sentences correctly'
        : 'You need at least 1 correct to pass';
    }

    // Update score
    const score = document.getElementById('writing-score');
    if (score) score.textContent = correctCount;

    // Build review list
    const reviewList = document.getElementById('writing-review-list');
    if (reviewList) {
      reviewList.innerHTML = this.state.results.map((result, index) => `
        <div class="review-item ${result.correct ? 'correct' : 'incorrect'}">
          <div class="review-icon">${result.correct ? '\u2713' : '\u2717'}</div>
          <div class="review-content">
            <div class="review-sentence"><strong>Sentence ${index + 1}:</strong> ${result.sentence}</div>
            <div class="review-answer">Your answer: ${result.userAnswer}</div>
          </div>
        </div>
      `).join('');
    }
  },

  /**
   * Restart the test
   */
  restart() {
    // Show intro, hide test area and results
    document.getElementById('writing-intro').style.display = 'block';
    document.getElementById('writing-test-area').style.display = 'none';
    document.getElementById('writing-results').style.display = 'none';

    // Reset progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
      dot.classList.remove('active', 'correct', 'incorrect');
    });
  },

  /**
   * Validate user's answer against correct sentence
   */
  validateAnswer(userAnswer, correctSentence) {
    const normalizedUser = this.normalizeText(userAnswer);
    const normalizedCorrect = this.normalizeText(correctSentence);

    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return true;
    }

    // Check for minor typos using Levenshtein distance
    const distance = this.levenshteinDistance(normalizedUser, normalizedCorrect);
    const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
    const similarity = 1 - (distance / maxLength);

    // Allow 90% similarity for minor typos
    return similarity >= 0.9;
  },

  /**
   * Normalize text for comparison
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .trim()
      // Remove punctuation
      .replace(/[.,!?;:'"]/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Common variations
      .replace(/washington d\.?c\.?/gi, 'washington dc')
      .replace(/u\.?s\.?/gi, 'us')
      .replace(/\bfifty\b/gi, '50')
      .replace(/\bone hundred\b/gi, '100');
  },

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
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

    return matrix[b.length][a.length];
  },

  /**
   * Shuffle an array (Fisher-Yates)
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  WritingTest.init();
});

// Export for use in App
window.WritingTest = WritingTest;
