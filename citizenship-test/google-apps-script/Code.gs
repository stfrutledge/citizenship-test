/**
 * US Citizenship Test - Google Apps Script Backend
 *
 * This script provides a web API for the citizenship test app to
 * read and write statistics data to Google Sheets.
 *
 * SETUP:
 * 1. Create a new Google Sheet named "Citizenship Test Stats"
 * 2. Create three sheets (tabs): "QuestionStats", "ExamHistory", "Settings"
 * 3. Open Extensions > Apps Script
 * 4. Paste this code
 * 5. Deploy > New deployment > Web app
 * 6. Execute as: Me, Who has access: Anyone
 * 7. Copy the deployment URL and paste it in the web app settings
 */

// Sheet names
const SHEET_QUESTION_STATS = 'QuestionStats';
const SHEET_EXAM_HISTORY = 'ExamHistory';
const SHEET_SETTINGS = 'Settings';

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action || 'ping';
  let result;

  try {
    switch (action) {
      case 'ping':
        result = { success: true, message: 'Connection successful' };
        break;
      case 'getQuestionStats':
        result = getQuestionStats();
        break;
      case 'getExamHistory':
        result = getExamHistory();
        break;
      case 'getSettings':
        result = getSettings();
        break;
      case 'getAllData':
        result = getAllData();
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }
  } catch (error) {
    result = { success: false, error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  let result;

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'recordAnswer':
        result = recordAnswer(data.questionId, data.correct);
        break;
      case 'recordExam':
        result = recordExam(data.score, data.passed, data.questionsAsked, data.questionsMissed);
        break;
      case 'updateSetting':
        result = updateSetting(data.key, data.value);
        break;
      case 'resetStats':
        result = resetStats();
        break;
      case 'initializeSheets':
        result = initializeSheets();
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }
  } catch (error) {
    result = { success: false, error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize the sheets with headers if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Initialize QuestionStats sheet
  let statsSheet = ss.getSheetByName(SHEET_QUESTION_STATS);
  if (!statsSheet) {
    statsSheet = ss.insertSheet(SHEET_QUESTION_STATS);
  }
  if (statsSheet.getLastRow() === 0) {
    statsSheet.appendRow(['QuestionID', 'TimesAsked', 'TimesCorrect', 'LastAsked', 'SuccessRate']);
    // Initialize all 100 questions
    for (let i = 1; i <= 100; i++) {
      statsSheet.appendRow([i, 0, 0, '', '0%']);
    }
  }

  // Initialize ExamHistory sheet
  let historySheet = ss.getSheetByName(SHEET_EXAM_HISTORY);
  if (!historySheet) {
    historySheet = ss.insertSheet(SHEET_EXAM_HISTORY);
  }
  if (historySheet.getLastRow() === 0) {
    historySheet.appendRow(['Date', 'Score', 'Passed', 'QuestionsAsked', 'QuestionsMissed']);
  }

  // Initialize Settings sheet
  let settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
  }
  if (settingsSheet.getLastRow() === 0) {
    settingsSheet.appendRow(['Setting', 'Value']);
    settingsSheet.appendRow(['answerMode', 'multiple']);
    settingsSheet.appendRow(['weakThreshold', '70']);
    settingsSheet.appendRow(['darkMode', 'false']);
  }

  return { success: true, message: 'Sheets initialized' };
}

/**
 * Get all question statistics
 */
function getQuestionStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_QUESTION_STATS);

  if (!sheet || sheet.getLastRow() <= 1) {
    return { success: true, data: [] };
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const stats = data.map(row => ({
    questionId: row[0],
    timesAsked: row[1],
    timesCorrect: row[2],
    lastAsked: row[3] ? new Date(row[3]).toISOString() : null,
    successRate: parseFloat(row[4]) || 0
  }));

  return { success: true, data: stats };
}

/**
 * Get exam history
 */
function getExamHistory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_EXAM_HISTORY);

  if (!sheet || sheet.getLastRow() <= 1) {
    return { success: true, data: [] };
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const history = data.map(row => ({
    date: row[0] ? new Date(row[0]).toISOString() : null,
    score: row[1],
    passed: row[2],
    questionsAsked: row[3] ? row[3].split(',').map(Number) : [],
    questionsMissed: row[4] ? row[4].split(',').map(Number) : []
  }));

  // Return most recent first
  return { success: true, data: history.reverse() };
}

/**
 * Get all settings
 */
function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SETTINGS);

  if (!sheet || sheet.getLastRow() <= 1) {
    return { success: true, data: {} };
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const settings = {};
  data.forEach(row => {
    if (row[0]) {
      settings[row[0]] = row[1];
    }
  });

  return { success: true, data: settings };
}

/**
 * Get all data (stats, history, settings)
 */
function getAllData() {
  const stats = getQuestionStats();
  const history = getExamHistory();
  const settings = getSettings();

  return {
    success: true,
    data: {
      questionStats: stats.data,
      examHistory: history.data,
      settings: settings.data
    }
  };
}

/**
 * Record an answer for a question
 */
function recordAnswer(questionId, correct) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_QUESTION_STATS);

  if (!sheet) {
    initializeSheets();
    return recordAnswer(questionId, correct);
  }

  // Find the row for this question (questionId is in column A, row = questionId + 1 because of header)
  const row = questionId + 1;

  // Get current values
  const currentData = sheet.getRange(row, 1, 1, 5).getValues()[0];
  const timesAsked = (currentData[1] || 0) + 1;
  const timesCorrect = (currentData[2] || 0) + (correct ? 1 : 0);
  const successRate = ((timesCorrect / timesAsked) * 100).toFixed(1) + '%';
  const now = new Date();

  // Update the row
  sheet.getRange(row, 2, 1, 4).setValues([[timesAsked, timesCorrect, now, successRate]]);

  return {
    success: true,
    data: {
      questionId: questionId,
      timesAsked: timesAsked,
      timesCorrect: timesCorrect,
      successRate: parseFloat(successRate)
    }
  };
}

/**
 * Record an exam result
 */
function recordExam(score, passed, questionsAsked, questionsMissed) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_EXAM_HISTORY);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_EXAM_HISTORY);
  }

  const now = new Date();
  const questionsAskedStr = questionsAsked.join(',');
  const questionsMissedStr = questionsMissed.join(',');

  sheet.appendRow([now, score, passed, questionsAskedStr, questionsMissedStr]);

  return {
    success: true,
    data: {
      date: now.toISOString(),
      score: score,
      passed: passed
    }
  };
}

/**
 * Update a setting
 */
function updateSetting(key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SETTINGS);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_SETTINGS);
  }

  // Find the row with this setting
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  let found = false;

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 2, 2).setValue(value);
      found = true;
      break;
    }
  }

  // If setting doesn't exist, add it
  if (!found) {
    sheet.appendRow([key, value]);
  }

  return { success: true, data: { key: key, value: value } };
}

/**
 * Reset all statistics
 */
function resetStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Reset QuestionStats
  const statsSheet = ss.getSheetByName(SHEET_QUESTION_STATS);
  if (statsSheet) {
    statsSheet.clear();
    statsSheet.appendRow(['QuestionID', 'TimesAsked', 'TimesCorrect', 'LastAsked', 'SuccessRate']);
    for (let i = 1; i <= 100; i++) {
      statsSheet.appendRow([i, 0, 0, '', '0%']);
    }
  }

  // Clear ExamHistory (keep headers)
  const historySheet = ss.getSheetByName(SHEET_EXAM_HISTORY);
  if (historySheet && historySheet.getLastRow() > 1) {
    historySheet.deleteRows(2, historySheet.getLastRow() - 1);
  }

  return { success: true, message: 'Statistics reset' };
}

/**
 * Test function - run this to verify the script is working
 */
function testScript() {
  // Initialize sheets
  const initResult = initializeSheets();
  Logger.log('Initialize: ' + JSON.stringify(initResult));

  // Record an answer
  const answerResult = recordAnswer(1, true);
  Logger.log('Record Answer: ' + JSON.stringify(answerResult));

  // Get stats
  const statsResult = getQuestionStats();
  Logger.log('Get Stats: ' + JSON.stringify(statsResult));

  // Record an exam
  const examResult = recordExam(8, true, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [3, 7]);
  Logger.log('Record Exam: ' + JSON.stringify(examResult));

  // Get history
  const historyResult = getExamHistory();
  Logger.log('Get History: ' + JSON.stringify(historyResult));

  // Get all data
  const allDataResult = getAllData();
  Logger.log('Get All Data: ' + JSON.stringify(allDataResult));
}
