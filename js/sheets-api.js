/**
 * Google Sheets API Client
 *
 * Handles communication with the Google Apps Script backend
 * for reading and writing statistics data.
 */

const SheetsAPI = {
  // Configuration
  config: {
    deploymentUrl: 'https://script.google.com/macros/s/AKfycbz4TMSQI78iQhJKNtAobN6aHp4xfxPzCOKJoD3dJYIMfrrFfH7FSNxd0iMy56tOHGiShg/exec',
    useLocalStorage: true, // Fallback to localStorage when no URL is set
    cacheTimeout: 5 * 60 * 1000 // 5 minutes cache
  },

  // Cache for data
  cache: {
    questionStats: null,
    examHistory: null,
    settings: null,
    lastFetch: null
  },

  /**
   * Initialize the API with deployment URL
   */
  init(deploymentUrl) {
    if (deploymentUrl) {
      this.config.deploymentUrl = deploymentUrl;
    } else {
      // Try to load from localStorage
      const savedUrl = localStorage.getItem('sheetsDeploymentUrl');
      if (savedUrl) {
        this.config.deploymentUrl = savedUrl;
      }
    }
    return this;
  },

  /**
   * Set the deployment URL
   */
  setDeploymentUrl(url) {
    this.config.deploymentUrl = url;
    localStorage.setItem('sheetsDeploymentUrl', url);
  },

  /**
   * Check if Google Sheets is configured
   */
  isConfigured() {
    return !!this.config.deploymentUrl;
  },

  /**
   * Test the connection to Google Sheets
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, error: 'No deployment URL configured' };
    }

    try {
      const response = await this.makeRequest('GET', { action: 'ping' });
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Make a GET request to the Apps Script
   */
  async makeGetRequest(params) {
    if (!this.isConfigured()) {
      return this.getLocalData(params.action);
    }

    const url = new URL(this.config.deploymentUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow'
      });

      if (!response.ok) {
        console.warn('Sheets API returned non-OK status:', response.status);
        return this.getLocalData(params.action);
      }

      const data = await response.json();

      // Verify we got valid data back
      if (!data || typeof data !== 'object') {
        console.warn('Sheets API returned invalid data');
        return this.getLocalData(params.action);
      }

      return data;
    } catch (error) {
      console.error('Sheets API GET error:', error);
      // Fallback to localStorage
      return this.getLocalData(params.action);
    }
  },

  /**
   * Make a POST request to the Apps Script
   */
  async makePostRequest(data) {
    if (!this.isConfigured()) {
      return this.saveLocalData(data);
    }

    try {
      const response = await fetch(this.config.deploymentUrl, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Also save to localStorage as backup
      this.saveLocalData(data);

      // Invalidate cache
      this.cache.lastFetch = null;

      return result;
    } catch (error) {
      console.error('Sheets API POST error:', error);
      // Fallback to localStorage
      return this.saveLocalData(data);
    }
  },

  /**
   * Generic request wrapper
   */
  async makeRequest(method, data) {
    if (method === 'GET') {
      return this.makeGetRequest(data);
    } else {
      return this.makePostRequest(data);
    }
  },

  /**
   * Get all data from the server
   */
  async getAllData(forceRefresh = false) {
    // Check cache
    if (!forceRefresh && this.cache.lastFetch &&
        (Date.now() - this.cache.lastFetch) < this.config.cacheTimeout) {
      return {
        success: true,
        data: {
          questionStats: this.cache.questionStats,
          examHistory: this.cache.examHistory,
          settings: this.cache.settings
        }
      };
    }

    const result = await this.makeGetRequest({ action: 'getAllData' });

    if (result.success) {
      this.cache.questionStats = result.data.questionStats;
      this.cache.examHistory = result.data.examHistory;
      this.cache.settings = result.data.settings;
      this.cache.lastFetch = Date.now();
    }

    return result;
  },

  /**
   * Get question statistics
   */
  async getQuestionStats() {
    if (this.cache.questionStats) {
      return { success: true, data: this.cache.questionStats };
    }

    const result = await this.makeGetRequest({ action: 'getQuestionStats' });

    if (result.success) {
      this.cache.questionStats = result.data;
    }

    return result;
  },

  /**
   * Get exam history
   */
  async getExamHistory() {
    if (this.cache.examHistory) {
      return { success: true, data: this.cache.examHistory };
    }

    const result = await this.makeGetRequest({ action: 'getExamHistory' });

    if (result.success) {
      this.cache.examHistory = result.data;
    }

    return result;
  },

  /**
   * Get settings
   */
  async getSettings() {
    if (this.cache.settings) {
      return { success: true, data: this.cache.settings };
    }

    const result = await this.makeGetRequest({ action: 'getSettings' });

    if (result.success) {
      this.cache.settings = result.data;
    }

    return result;
  },

  /**
   * Record an answer for a question
   */
  async recordAnswer(questionId, correct, version = '2008') {
    // Use version-prefixed ID to keep 2008 and 2025 stats separate
    const versionedId = `${version}-${questionId}`;

    const result = await this.makePostRequest({
      action: 'recordAnswer',
      questionId: versionedId,
      correct: correct,
      version: version
    });

    // Update local cache
    if (result.success && this.cache.questionStats) {
      const statIndex = this.cache.questionStats.findIndex(s => s.questionId === versionedId);
      if (statIndex >= 0) {
        this.cache.questionStats[statIndex] = result.data;
      }
    }

    return result;
  },

  /**
   * Record an exam result
   */
  async recordExam(score, passed, questionsAsked, questionsMissed, version = '2008') {
    const result = await this.makePostRequest({
      action: 'recordExam',
      score: score,
      passed: passed,
      questionsAsked: questionsAsked,
      questionsMissed: questionsMissed,
      version: version
    });

    // Update local cache
    if (result.success) {
      if (!this.cache.examHistory) {
        this.cache.examHistory = [];
      }
      this.cache.examHistory.unshift(result.data);
    }

    return result;
  },

  /**
   * Update a setting
   */
  async updateSetting(key, value) {
    const result = await this.makePostRequest({
      action: 'updateSetting',
      key: key,
      value: value
    });

    // Update local cache
    if (result.success) {
      if (!this.cache.settings) {
        this.cache.settings = {};
      }
      this.cache.settings[key] = value;
    }

    return result;
  },

  /**
   * Reset all statistics
   */
  async resetStats() {
    const result = await this.makePostRequest({
      action: 'resetStats'
    });

    // Clear cache
    if (result.success) {
      this.cache.questionStats = null;
      this.cache.examHistory = null;
      this.cache.lastFetch = null;

      // Clear localStorage
      localStorage.removeItem('questionStats');
      localStorage.removeItem('examHistory');
    }

    return result;
  },

  /**
   * Initialize sheets (first-time setup)
   */
  async initializeSheets() {
    return this.makePostRequest({
      action: 'initializeSheets'
    });
  },

  // ==================
  // localStorage Fallback Methods
  // ==================

  /**
   * Get data from localStorage
   */
  getLocalData(action) {
    let data;

    switch (action) {
      case 'getQuestionStats':
        data = JSON.parse(localStorage.getItem('questionStats') || '[]');
        if (data.length === 0) {
          // Initialize with empty stats for all 100 questions
          data = [];
          for (let i = 1; i <= 100; i++) {
            data.push({
              questionId: i,
              timesAsked: 0,
              timesCorrect: 0,
              lastAsked: null,
              successRate: 0
            });
          }
          localStorage.setItem('questionStats', JSON.stringify(data));
        }
        break;

      case 'getExamHistory':
        data = JSON.parse(localStorage.getItem('examHistory') || '[]');
        break;

      case 'getSettings':
        data = JSON.parse(localStorage.getItem('settings') || '{}');
        if (Object.keys(data).length === 0) {
          data = {
            weakThreshold: 70
          };
          localStorage.setItem('settings', JSON.stringify(data));
        }
        break;

      case 'getAllData':
        const stats = this.getLocalData('getQuestionStats');
        const history = this.getLocalData('getExamHistory');
        const settings = this.getLocalData('getSettings');
        return {
          success: true,
          data: {
            questionStats: stats.data,
            examHistory: history.data,
            settings: settings.data
          }
        };

      default:
        data = null;
    }

    return { success: true, data: data };
  },

  /**
   * Save data to localStorage
   */
  saveLocalData(requestData) {
    const action = requestData.action;

    switch (action) {
      case 'recordAnswer': {
        const stats = JSON.parse(localStorage.getItem('questionStats') || '[]');
        let stat = stats.find(s => s.questionId === requestData.questionId);

        if (!stat) {
          stat = {
            questionId: requestData.questionId,
            timesAsked: 0,
            timesCorrect: 0,
            lastAsked: null,
            successRate: 0
          };
          stats.push(stat);
        }

        stat.timesAsked++;
        if (requestData.correct) {
          stat.timesCorrect++;
        }
        stat.lastAsked = new Date().toISOString();
        stat.successRate = (stat.timesCorrect / stat.timesAsked) * 100;

        localStorage.setItem('questionStats', JSON.stringify(stats));

        return { success: true, data: stat };
      }

      case 'recordExam': {
        const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
        const exam = {
          date: new Date().toISOString(),
          score: requestData.score,
          passed: requestData.passed,
          questionsAsked: requestData.questionsAsked,
          questionsMissed: requestData.questionsMissed
        };
        history.unshift(exam);
        localStorage.setItem('examHistory', JSON.stringify(history));

        return { success: true, data: exam };
      }

      case 'updateSetting': {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings[requestData.key] = requestData.value;
        localStorage.setItem('settings', JSON.stringify(settings));

        return { success: true, data: { key: requestData.key, value: requestData.value } };
      }

      case 'resetStats': {
        localStorage.removeItem('questionStats');
        localStorage.removeItem('examHistory');
        return { success: true, message: 'Statistics reset' };
      }

      default:
        return { success: false, error: 'Unknown action' };
    }
  },

  /**
   * Get stats for a specific question
   */
  getQuestionStat(questionId, version = '2008') {
    const versionedId = `${version}-${questionId}`;

    if (this.cache.questionStats) {
      return this.cache.questionStats.find(s => s.questionId === versionedId) || {
        questionId: questionId,
        timesAsked: 0,
        timesCorrect: 0,
        lastAsked: null,
        successRate: 0
      };
    }

    const stats = JSON.parse(localStorage.getItem('questionStats') || '[]');
    return stats.find(s => s.questionId === versionedId) || {
      questionId: questionId,
      timesAsked: 0,
      timesCorrect: 0,
      lastAsked: null,
      successRate: 0
    };
  },

  /**
   * Get weak questions (below threshold accuracy)
   * @param {number} threshold - Accuracy threshold (default 70%)
   * @param {Array} questionIds - Array of question IDs to check (default 1-100 for 2008 test)
   * @param {string} version - Test version ('2008' or '2025')
   */
  getWeakQuestions(threshold = 70, questionIds = null, version = '2008') {
    const stats = this.cache.questionStats ||
                  JSON.parse(localStorage.getItem('questionStats') || '[]');

    // Default to 2008 test (1-100) if no IDs provided
    const idsToCheck = questionIds || Array.from({ length: 100 }, (_, i) => i + 1);

    const weakQuestions = [];

    for (const i of idsToCheck) {
      const versionedId = `${version}-${i}`;
      const stat = stats.find(s => s.questionId === versionedId);

      // Only include questions that have been practiced
      if (stat && stat.timesAsked > 0) {
        // Normalize successRate - handle both decimal (0-1) and percentage (0-100) formats
        let rate = stat.successRate;
        if (rate <= 1 && stat.timesAsked > 0) {
          rate = rate * 100; // Convert decimal to percentage
        }

        if (rate < threshold) {
          // Below threshold - struggled with this question
          weakQuestions.push({
            questionId: i,
            reason: `Low accuracy (${rate.toFixed(0)}%)`,
            successRate: rate
          });
        } else if (stat.lastAsked) {
          // Check if not practiced recently (30+ days)
          const lastAsked = new Date(stat.lastAsked);
          const daysSince = (Date.now() - lastAsked.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince > 30) {
            weakQuestions.push({
              questionId: i,
              reason: `Not practiced in ${Math.floor(daysSince)} days`,
              successRate: rate
            });
          }
        }
      }
    }

    // Sort by success rate (lowest first)
    weakQuestions.sort((a, b) => a.successRate - b.successRate);

    return weakQuestions;
  },

  /**
   * Get overall statistics
   * @param {string} version - Test version to filter by ('2008' or '2025')
   */
  getOverallStats(version = '2008') {
    const stats = this.cache.questionStats ||
                  JSON.parse(localStorage.getItem('questionStats') || '[]');
    const history = this.cache.examHistory ||
                    JSON.parse(localStorage.getItem('examHistory') || '[]');

    // Filter stats by version prefix
    const versionPrefix = `${version}-`;
    const versionStats = stats.filter(s =>
      String(s.questionId).startsWith(versionPrefix)
    );

    let totalAsked = 0;
    let totalCorrect = 0;
    let questionsPracticedToday = 0;

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    versionStats.forEach(stat => {
      totalAsked += stat.timesAsked || 0;
      totalCorrect += stat.timesCorrect || 0;

      // Check if question was practiced today
      if (stat.lastAsked) {
        const lastAsked = new Date(stat.lastAsked);
        lastAsked.setHours(0, 0, 0, 0);
        if (lastAsked.getTime() === today.getTime()) {
          questionsPracticedToday++;
        }
      }
    });

    // Filter exam history by version
    const versionHistory = history.filter(e => e.version === version);
    const examsPassed = versionHistory.filter(e => e.passed).length;
    const accuracy = totalAsked > 0 ? (totalCorrect / totalAsked) * 100 : 0;

    return {
      totalAsked: totalAsked,
      totalCorrect: totalCorrect,
      questionsPracticedToday: questionsPracticedToday,
      accuracy: accuracy,
      examsTaken: history.length,
      examsPassed: examsPassed
    };
  },

  /**
   * Get category statistics
   * @param {string} version - Test version ('2008' or '2025')
   */
  getCategoryStats(version = '2008') {
    const stats = this.cache.questionStats ||
                  JSON.parse(localStorage.getItem('questionStats') || '[]');

    // Use different categories based on version
    const categories = version === '2025' ? {
      'American Government': { questions: [], timesAsked: 0, timesCorrect: 0 },
      'American History': { questions: [], timesAsked: 0, timesCorrect: 0 },
      'Symbols and Holidays': { questions: [], timesAsked: 0, timesCorrect: 0 }
    } : {
      'American Government': { questions: [], timesAsked: 0, timesCorrect: 0 },
      'American History': { questions: [], timesAsked: 0, timesCorrect: 0 },
      'Integrated Civics': { questions: [], timesAsked: 0, timesCorrect: 0 }
    };

    // Use the correct questions array based on version
    const questions = version === '2025' ? QUESTIONS_2025 : QUESTIONS;

    // Map question IDs to categories based on questions data
    questions.forEach(q => {
      const versionedId = `${version}-${q.id}`;
      const stat = stats.find(s => s.questionId === versionedId);
      if (categories[q.category]) {
        categories[q.category].questions.push(q.id);
        if (stat) {
          categories[q.category].timesAsked += stat.timesAsked || 0;
          categories[q.category].timesCorrect += stat.timesCorrect || 0;
        }
      }
    });

    // Calculate accuracy for each category
    Object.keys(categories).forEach(cat => {
      const c = categories[cat];
      c.accuracy = c.timesAsked > 0 ? (c.timesCorrect / c.timesAsked) * 100 : 0;
    });

    return categories;
  },

  /**
   * Get most missed questions
   * @param {number} limit - Max number of questions to return
   * @param {string} version - Test version ('2008' or '2025')
   */
  getMostMissedQuestions(limit = 10, version = '2008') {
    const stats = this.cache.questionStats ||
                  JSON.parse(localStorage.getItem('questionStats') || '[]');

    // Filter by version prefix
    const versionPrefix = `${version}-`;
    const versionStats = stats.filter(s =>
      String(s.questionId).startsWith(versionPrefix)
    );

    // Calculate miss rate for each question
    const missStats = versionStats
      .filter(s => s.timesAsked > 0)
      .map(s => ({
        questionId: s.questionId.replace(versionPrefix, ''), // Remove prefix for display
        timesMissed: s.timesAsked - s.timesCorrect,
        missRate: ((s.timesAsked - s.timesCorrect) / s.timesAsked) * 100,
        timesAsked: s.timesAsked
      }))
      .filter(s => s.timesMissed > 0)
      .sort((a, b) => b.missRate - a.missRate)
      .slice(0, limit);

    return missStats;
  }
};

// Initialize on load
SheetsAPI.init();
