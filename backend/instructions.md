# Survey Form Backend - Google Apps Script

To store survey responses in a Google Sheet, follow these steps:

1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Replace the code in `Code.gs` with the following:

```javascript
/**
 * Google Apps Script to handle survey form submissions.
 * Stores data in a Google Sheet.
 */

const SHEET_NAME = 'Sheet1'; // Change this if your sheet name is different

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); // wait 30 seconds for others' use of the script to end

    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME) || doc.getSheets()[0];
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const body = JSON.parse(e.postData.contents);
    const newRow = headers.map(function(header) {
      if (header === 'timestamp') return new Date();
      return body[header] || '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("GAS backend is live!");
}
```

4. Click **Deploy > New Deployment**.
5. Select **Web App**.
6. Set **Execute as** to "Me" and **Who has access** to "Anyone".
7. Copy the **Web App URL** and paste it into the `submitForm` function in `src/components/SurveyForm.jsx`.

### Google Sheet Headers
Make sure your Google Sheet has the following headers in the first row (A1, B1, C1, etc.):
`timestamp`, `name`, `email`, `phone`, `college`, `department`, `year`, `experience`, `relevance`, `satisfaction`, `recommend`, `valuable_learned`, `improvement_suggestions`
