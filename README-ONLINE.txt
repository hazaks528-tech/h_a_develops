H_A_DEVELOPS SNAKE ARCADE — ONLINE ROOM SETUP

Important: online rooms need a Firebase project and internet access. The game cannot connect to real online rooms until firebase-config.js has your Firebase Web App config.

1) Open https://console.firebase.google.com/ and create a project.
2) In Project settings, create/register a Web app and copy its config values into firebase-config.js. Replace every placeholder.
3) In Build > Authentication > Sign-in method, enable Anonymous sign-in.
4) In Build > Realtime Database, create a database and copy its database URL into firebase-config.js.
5) For a quick friends-only test, set Realtime Database rules to the following (not secure against cheating; do not use for valuable currency):

{
  "rules": {
    "snakeRooms": {
      "$room": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}

6) Host the folder on an HTTPS static host (for example Netlify) or test on localhost. Do not just double-click index.html if Firebase auth blocks the local file origin.
7) Both players open the same hosted URL. Host clicks Online Room Competition > Create Room, then shares the 6-character code. Guest enters the same entry fee and joins. Host starts when both players are listed.

Match rules: both pay the same entry fee from their local browser coin balance; first to 20 apples wins and gets the combined entry fee. Coins are currently browser-local and the Firebase rules above are intentionally simple for testing. This is a friendly prototype, not a secure competitive economy. For public tournaments, a trusted backend/Cloud Functions and stricter rules are needed to prevent cheating. If a room is abandoned after paying entry, refund handling is not automatic in this prototype.
