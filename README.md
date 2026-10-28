# Guest Shift RSVP

A one-page RSVP form. Guests enter their name, bar name, phone, email and Yes/No. Each response goes into a Google Sheet.

- `index.html` is the page you host.
- `apps-script/Code.gs` is the small Google script that writes responses to the sheet.

If someone RSVPs again with the same email, their existing row is updated (and the **Updated** column gets the time), so you don't get duplicates.

## Setup (about 5 minutes)

### 1. Create the sheet and script
1. Create a new Google Sheet (e.g. "Guest Shift RSVPs").
2. In the sheet: **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the contents of `apps-script/Code.gs`. Save.

### 2. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then authorise it with your Google account. Google will show an "unverified app" warning because it's your own script: click **Advanced → Go to (project name)**.
5. Copy the **Web app URL** (it ends in `/exec`).

You can open that URL in a browser to check it: it should say `RSVP endpoint is running`.

### 3. Connect the page
1. Open `index.html` and find this line near the bottom:
   ```js
   const SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```
   Paste your `/exec` URL in its place.
2. Edit the event details near the top of `index.html`: bartender name, date, time, venue.

### 4. Host it
Upload `index.html` to your hosting. It's a single static file, so it works anywhere (your own server, Netlify, Vercel, GitHub Pages, etc.).

Submit one test RSVP and check that a new **RSVPs** tab appears in the sheet with the response.

## Changing the script later
If you edit `Code.gs`, go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. That keeps the same URL. Making a *new* deployment gives you a new URL, which you'd then have to paste into `index.html` again.

## Privacy
The sheet holds phone numbers and emails, so keep it private. The web app URL can only add rows; it can't read the sheet.
