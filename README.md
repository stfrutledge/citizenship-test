# US Citizenship Naturalization Test Practice App

A web-based study application for the USCIS Naturalization Test based on the official M-1122 (rev. 07/2024) document. Features multiple study modes, progress tracking, and Google Sheets integration for persistent statistics.

## Features

- **100 Official Civics Questions** - Complete question bank from USCIS
- **Multiple Study Modes**:
  - Study All Questions - Browse by category
  - Sample Exam - 10 random questions (6/10 to pass)
  - Weak Areas - Focus on questions you've struggled with
  - 65/20 Questions - Study the 20 questions for 65+ applicants
- **Answer Modes** - Multiple choice or typed answers
- **Progress Tracking** - Statistics saved to Google Sheets or localStorage
- **Mobile-Friendly** - Responsive design works on all devices
- **Dark Mode** - Easy on the eyes for late-night studying

## Quick Start

### Option 1: Use Locally (No Setup Required)

1. Open `index.html` in your web browser
2. Statistics will be saved to your browser's localStorage
3. Start practicing!

### Option 2: Deploy to GitHub Pages

1. Fork this repository or create a new one
2. Push the files to your repository
3. Go to Settings > Pages > Enable GitHub Pages
4. Your app will be available at `https://yourusername.github.io/repository-name/`

### Option 3: Use with Google Sheets (Recommended for Cross-Device Sync)

Follow the setup instructions below to enable Google Sheets integration.

## Google Sheets Setup

Google Sheets integration allows your progress to sync across devices.

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Citizenship Test Stats"
3. Create 3 sheets (tabs) at the bottom:
   - `QuestionStats`
   - `ExamHistory`
   - `Settings`

### Step 2: Set Up Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the contents of `google-apps-script/Code.gs` from this project
4. Paste it into the Apps Script editor
5. Click **Save** (Ctrl+S)

### Step 3: Deploy the Web App

1. In Apps Script, click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set these options:
   - **Description**: "Citizenship Test API"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the app when prompted (click through security warnings)
6. **Copy the deployment URL** - it looks like: `https://script.google.com/macros/s/ABC123.../exec`

### Step 4: Configure the App

1. Open the citizenship test app in your browser
2. Go to **Settings**
3. Paste the deployment URL into the "Apps Script Deployment URL" field
4. Click **Test Connection**
5. If successful, your data will now sync to Google Sheets!

## Configuration

### State-Specific Answers

This app is pre-configured for **New Jersey (ZIP 07946, Congressional District 7)**:

| Question | Answer |
|----------|--------|
| Q20: Your Senators | Cory Booker, Andy Kim |
| Q23: Your Representative | Thomas Kean Jr. |
| Q43: Your Governor | Mikie Sherrill |
| Q44: State Capital | Trenton |

To customize for your state, edit `js/questions.js` and update questions 20, 23, 43, and 44.

### Current Officials (as of early 2025)

| Question | Answer |
|----------|--------|
| Q28: President | Donald Trump |
| Q29: Vice President | JD Vance |
| Q40: Chief Justice | John Roberts |
| Q46: President's Party | Republican |
| Q47: Speaker of House | Mike Johnson |

These may need to be updated over time. Edit `js/questions.js` to update.

## Project Structure

```
citizenship-test/
├── index.html              # Main application
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── questions.js        # 100 questions database
│   ├── app.js              # Main application logic
│   ├── sheets-api.js       # Google Sheets integration
│   └── ui.js               # UI rendering
├── google-apps-script/
│   └── Code.gs             # Apps Script backend
└── README.md               # This file
```

## Answer Validation

For typed answers, the app uses flexible matching:

- Case-insensitive ("the constitution" = "The Constitution")
- Ignores "the" at the start ("Constitution" = "the Constitution")
- Partial matches for long answers
- Fuzzy matching for minor typos (2-character tolerance)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Offline Usage

The app works offline after the first load. Statistics are saved to localStorage and will sync to Google Sheets when online.

## Privacy

- All data is stored in your own Google Drive (if using Sheets)
- No third-party tracking or analytics
- No account required (localStorage works without setup)

## Contributing

Feel free to submit issues and pull requests. Areas for improvement:

- Audio pronunciation for questions
- Progress sharing/export
- Additional language support
- Flashcard mode

## License

This project is open source. The civics questions are from the public domain USCIS materials.

## Disclaimer

This is an unofficial study aid. Always refer to the official USCIS materials at [uscis.gov](https://www.uscis.gov/citizenship) for the most current and accurate information.

## Resources

- [Official USCIS Civics Test Study Materials](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test)
- [M-1122 Civics Test Questions (PDF)](https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf)
- [USCIS Reading and Writing Vocabulary](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test/reading-vocabulary-flash-cards)
