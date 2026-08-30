BANK APP — README
==================

WHAT THIS IS
------------
A front-end-only bank app built to match the provided mockup exactly:
a Home screen (balance, Send/Recieve/Swap, quick payments, transactions,
bottom nav) and a Send Money screen (recipient, keypad, quick amounts,
swipe-to-send).

This is a static prototype. There is no server, database, or real
banking connection — balances and transactions live in memory in your
browser tab and reset when you reload the page.

FILES
-----
index.html      Page structure / markup for both screens
style.css       All visual styling (colors, layout, spacing)
script.js       App logic: state, rendering, and interactions
manifest.json   PWA manifest, so the app can be "installed" to a
                phone/desktop home screen from a browser
README.txt      This file

HOW TO RUN IT
-------------
Easiest option:
1. Unzip / place all five files together in the same folder
   (they must stay next to each other — script.js and style.css
   are loaded relative to index.html).
2. Double-click index.html to open it in your browser.

That's it — no build step, no install, no dependencies.

Optional (for the "Add to Home Screen" / installable app experience):
1. Serve the folder over local http instead of opening the file
   directly, e.g. from a terminal in that folder run:
       python3 -m http.server 8000
   then open http://localhost:8000 in your browser.
2. On mobile Safari/Chrome, use "Add to Home Screen" — manifest.json
   lets it launch full-screen like a native app.

WHAT WORKS
----------
- Tap "Send" on Home to open the Send Money screen (matches mockup)
- Type an amount on the keypad, or tap a quick-amount chip
  ($1,000 / $2,000 / $5,000 / $10,000)
- Drag the red circle all the way across "Swipe to send" to confirm
- On confirm: balance is deducted, a new transaction appears at the
  top of the list, you're returned to Home, and a toast confirms it
- Tap the eye icon to mask/unmask the balance
- Back arrow / the X on the recipient card cancel back to Home with
  no charge
- Sending more than the available balance, or with $0 entered, is
  blocked with a toast message

WHAT'S INTENTIONALLY STUBBED
-----------------------------
The mockup only designed two screens. Everything else visible on
Home (Recieve, Swap, Airtime/Data/Electricity/All, the wallet
selector, notifications bell, See all, and the Cards/Profile/Settings
tabs) is present and tappable, but shows a small "coming soon" toast
instead of a fabricated screen, so nothing was invented beyond what
was actually designed.

CUSTOMIZING
-----------
- Starting balance, transaction history, and recipient details are
  set at the top of script.js (the `state` object and the
  `RECIPIENT` constant).
- Colors and spacing are all in style.css under the CSS variables
  at the top (:root) and the section comments below it.
