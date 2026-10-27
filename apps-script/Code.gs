/**
 * Guest Shift RSVP — Google Sheets backend.
 *
 * Paste this into the Google Sheet's Apps Script editor
 * (Extensions → Apps Script), then Deploy → New deployment → Web app.
 * See README.md for the full steps.
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'ID Number', 'RSVP', 'Updated'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);

    const name = clean(data.name);
    const phone = clean(data.phone);
    const email = clean(data.email).toLowerCase();
    const idNumber = clean(data.idNumber);
    const rsvp = data.rsvp === 'Yes' ? 'Yes' : data.rsvp === 'No' ? 'No' : '';

    if (!name || !phone || !email || !idNumber || !rsvp) {
      return json({ ok: false, error: 'Please fill in every field.' });
    }

    const sheet = getSheet();
    const now = new Date();

    // Same email RSVPs again → update their row instead of adding a duplicate.
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      for (let i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === email) {
          const row = i + 2;
          sheet.getRange(row, 2, 1, 6).setValues([[name, phone, email, idNumber, rsvp, now]]);
          return json({ ok: true, updated: true });
        }
      }
    }

    sheet.appendRow([now, name, phone, email, idNumber, rsvp, '']);
    return json({ ok: true, updated: false });
  } catch (err) {
    return json({ ok: false, error: 'Something went wrong. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web-app URL in a browser to check it's live.
function doGet() {
  return json({ ok: true, status: 'RSVP endpoint is running' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Keep phone / ID as plain text so leading zeros and + signs survive.
    sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange('E:E').setNumberFormat('@');
  }
  return sheet;
}

function clean(v) {
  return String(v == null ? '' : v).trim().slice(0, 200);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
