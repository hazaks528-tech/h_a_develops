(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const screen = $('online-menu');
  const status = $('room-status');
  const lobby = $('room-lobby');
  const codeDisplay = $('room-code-display');
  const playersDisplay = $('room-players-display');
  const scoreDisplay = $('room-score-display');
  let db = null, uid = null, roomCode = null, roomRef = null, roomListener = null;
  let myRole = null, entryFee = 20, active = false, winnerHandled = false, roomData = null, gameStarted = false;

  function say(message, error = false) { status.textContent = message; status.classList.toggle('room-error', error); }
  function configReady() {
    const c = window.SNAKE_FIREBASE_CONFIG;
    return c && c.apiKey && c.apiKey !== 'PASTE_YOUR_API_KEY_HERE' && c.projectId && c.projectId !== 'YOUR_PROJECT_ID' && c.databaseURL && !c.databaseURL.includes('YOUR_PROJECT_ID');
  }
  async function connect() {
    if (!configReady()) throw new Error('Firebase setup required. Open README-ONLINE.txt and add your Firebase config first.');
    if (!window.firebase) throw new Error('Firebase scripts could not load. Check your internet connection.');
    if (!firebase.apps.length) firebase.initializeApp(window.SNAKE_FIREBASE_CONFIG);
    await firebase.auth().signInAnonymously();
    uid = firebase.auth().currentUser.uid;
    db = firebase.database();
  }
  function code() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
  function name() { return ($('online-player-name').value.trim() || 'Player').slice(0, 18); }
  function fee() { const n = Number($('online-entry-fee').value); return Number.isInteger(n) && n >= 0 && n <= 10000 ? n : null; }
  function showLobby(data) {
    lobby.classList.remove('is-hidden');
    codeDisplay.textContent = roomCode || '------';
    const p1 = data && data.players && data.players.p1;
    const p2 = data && data.players && data.players.p2;
    playersDisplay.textContent = `${p1 ? p1.name + ' (P1)' : 'Waiting for Player 1'}  •  ${p2 ? p2.name + ' (P2)' : 'Waiting for opponent'}`;
    scoreDisplay.textContent = `Entry: ${data ? data.entryFee : entryFee} coins each • First to 20 apples wins • Prize pool: ${data ? data.entryFee * 2 : entryFee * 2} coins`;
    $('room-start').disabled = !(p1 && p2) || !!(data && data.status === 'playing');
    if (data && data.status === 'playing') { say('Match is live! First to 20 apples wins.'); active = true; if (!gameStarted) { gameStarted = true; setTimeout(() => { if (window.snakeMultiplayerStartGame) window.snakeMultiplayerStartGame(); }, 50); } }
    else if (data && data.status === 'finished') { say(`Match finished. Winner: ${data.winnerName || 'Player'}!`); active = false; }
    else say(p1 && p2 ? 'Both players joined. Host can start the match.' : 'Room ready. Share the code with your opponent.');
  }
  function watchRoom() {
    if (roomListener && roomRef) roomRef.off('value', roomListener);
    roomListener = (snap) => { roomData = snap.val(); if (!roomData) { say('Room no longer exists.', true); return; } showLobby(roomData); };
    roomRef.on('value', roomListener);
  }
  async function createRoom() {
    const f = fee(); if (f === null) return say('Entry coins must be a whole number from 0 to 10000.', true);
    try {
      say('Connecting to online service…'); await connect();
      if (!window.snakeEconomy || !window.snakeEconomy.spendCoins(f)) return say(`Not enough coins! You need ${f} coins to enter.`, true);
      entryFee = f; myRole = 'p1'; roomCode = code(); roomRef = db.ref('snakeRooms/' + roomCode);
      await roomRef.set({ code: roomCode, hostUid: uid, entryFee: f, target: 20, status: 'waiting', createdAt: firebase.database.ServerValue.TIMESTAMP,
        players: { p1: { uid, name: name(), score: 0, paid: true }, p2: null }, scores: { p1: 0, p2: 0 } });
      localStorage.setItem('snake-online-room', roomCode); localStorage.setItem('snake-online-role', myRole);
      $('room-back').disabled = true; watchRoom();
    } catch (e) { say(e.message || 'Could not create room.', true); }
  }
  async function joinRoom() {
    const wanted = $('online-room-code').value.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(wanted)) return say('Enter the 6-character room code.', true);
    try {
      say('Connecting to online service…'); await connect();
      const ref = db.ref('snakeRooms/' + wanted); const snap = await ref.get(); const data = snap.val();
      if (!data) return say('Room not found. Check the code.', true);
      if (data.status !== 'waiting') return say('This room has already started or finished.', true);
      if (data.players && data.players.p1 && data.players.p1.uid === uid) { roomCode = wanted; roomRef = ref; myRole = 'p1'; entryFee = data.entryFee; watchRoom(); return; }
      if (data.players && data.players.p2) return say('This room is full.', true);
      const f = fee(); if (f === null || f !== data.entryFee) return say(`Entry fee must match host: ${data.entryFee} coins.`, true);
      if (!window.snakeEconomy || !window.snakeEconomy.spendCoins(f)) return say(`Not enough coins! You need ${f} coins to enter.`, true);
      const result = await ref.transaction(current => {
        if (!current || current.status !== 'waiting' || (current.players && current.players.p2)) return;
        current.players = current.players || {}; current.players.p2 = { uid, name: name(), score: 0, paid: true }; return current;
      });
      if (!result.committed) { window.snakeEconomy.addCoins(f); return say('Room filled just now. Try another room.', true); }
      roomCode = wanted; roomRef = ref; myRole = 'p2'; entryFee = f;
      localStorage.setItem('snake-online-room', roomCode); localStorage.setItem('snake-online-role', myRole); watchRoom();
    } catch (e) { say(e.message || 'Could not join room.', true); }
  }
  async function startMatch() {
    if (!roomRef || myRole !== 'p1') return say('Only the room host can start the match.', true);
    try {
      const snap = await roomRef.get(); const data = snap.val();
      if (!data || !data.players.p1 || !data.players.p2) return say('Wait until both players have joined.', true);
      await roomRef.update({ status: 'playing', startedAt: firebase.database.ServerValue.TIMESTAMP, scores: { p1: 0, p2: 0 } });
      active = true; winnerHandled = false; $('online-menu').classList.add('is-hidden');
      document.querySelector('#main-menu').classList.add('is-hidden');
    } catch (e) { say(e.message || 'Could not start match.', true); }
  }
  let scoreWriteAt = 0;
  async function onApple(score) {
    if (!active || !roomRef || !myRole) return;
    const now = Date.now(); if (now - scoreWriteAt < 250) return; scoreWriteAt = now;
    try { await roomRef.child('scores/' + myRole).set(score); await roomRef.child('players/' + myRole + '/score').set(score); } catch (_) {}
  }
  async function finishIfWinner(score) {
    if (!active || score < 20 || !roomRef || winnerHandled) return;
    winnerHandled = true; active = false;
    try {
      const snap = await roomRef.get(); const data = snap.val();
      if (data && data.status === 'playing') {
        await roomRef.transaction(current => { if (!current || current.status !== 'playing') return; current.status = 'finished'; current.winnerUid = uid; current.winnerRole = myRole; current.winnerName = current.players && current.players[myRole] ? current.players[myRole].name : name(); current.finishedAt = firebase.database.ServerValue.TIMESTAMP; return current; });
      }
      const latest = (await roomRef.get()).val();
      if (latest && latest.winnerUid === uid && !localStorage.getItem('snake-room-awarded-' + roomCode)) {
        const prize = Number(latest.entryFee) * 2;
        if (window.snakeEconomy) window.snakeEconomy.addCoins(prize);
        localStorage.setItem('snake-room-awarded-' + roomCode, 'yes');
        say(`You won! ${prize} coins added to your wallet.`);
      } else if (latest) say(`Match over. ${latest.winnerName || 'Opponent'} won.`);
      const overlay = document.querySelector('#game-overlay');
      document.querySelector('#overlay-icon').textContent = latest && latest.winnerUid === uid ? '🏆' : '🏁';
      document.querySelector('#overlay-eyebrow').textContent = 'ONLINE MATCH';
      document.querySelector('#overlay-title').textContent = latest && latest.winnerUid === uid ? 'You won!' : 'Match finished';
      document.querySelector('#overlay-message').textContent = latest && latest.winnerUid === uid ? `You collected 20 apples first and won ${Number(latest.entryFee)*2} coins!` : `${latest && latest.winnerName || 'The opponent'} reached 20 apples first.`;
      document.querySelector('#start-button').textContent = 'Back to menu'; overlay.classList.remove('is-hidden');
    } catch (e) { say('Match ended, but winner sync failed. ' + e.message, true); }
  }
  function leave() { if (roomRef && roomListener) roomRef.off('value', roomListener); roomRef = null; roomListener = null; roomCode = null; myRole = null; active = false; winnerHandled = false; gameStarted = false; lobby.classList.add('is-hidden'); $('room-back').disabled = false; say('You left the room.'); }
  $('room-create').addEventListener('click', createRoom);
  $('room-join').addEventListener('click', joinRoom);
  $('room-start').addEventListener('click', startMatch);
  $('room-leave').addEventListener('click', leave);
  $('room-back').addEventListener('click', () => { screen.classList.add('is-hidden'); document.querySelector('#main-menu').classList.remove('is-hidden'); });
  window.snakeMultiplayer = { open() { if (!configReady()) say('Setup needed: follow README-ONLINE.txt to connect Firebase.', true); }, isMatchActive: () => active, onApple, finishIfWinner };
  // Start a match from the regular game loop while preserving the room's target rules.
  window.snakeMultiplayerStartGame = () => { if (gameStarted && document.querySelector('#status-text').textContent === 'PLAYING') return; gameStarted = true; active = true; winnerHandled = false; document.querySelector('#main-menu').classList.add('is-hidden'); document.querySelector('#online-menu').classList.add('is-hidden'); document.querySelector('#menu-start').click(); };
})();
