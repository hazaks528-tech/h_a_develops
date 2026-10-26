(() => {
  'use strict';

  const canvas = document.querySelector('#game-canvas');
  const context = canvas.getContext('2d');
  const overlay = document.querySelector('#game-overlay');
  const overlayIcon = document.querySelector('#overlay-icon');
  const overlayEyebrow = document.querySelector('#overlay-eyebrow');
  const overlayTitle = document.querySelector('#overlay-title');
  const overlayMessage = document.querySelector('#overlay-message');
  const startButton = document.querySelector('#start-button');
  const levelPicker = document.querySelector('#level-picker');
  const pauseButton = document.querySelector('#pause-button');
  const pauseIcon = document.querySelector('#pause-icon');
  const pauseLabel = document.querySelector('#pause-label');
  const scoreValue = document.querySelector('#score-value');
  const bestValue = document.querySelector('#best-value');
  const speedValue = document.querySelector('#speed-value');
  const levelValue = document.querySelector('#level-value');
  const speedControl = document.querySelector('#speed-control');
  const speedControlValue = document.querySelector('#speed-control-value');
  const statusText = document.querySelector('#status-text');
  const statusBadge = document.querySelector('.status');

  const MAX_LEVEL = 50;
  const BANANAS_PER_LEVEL = 5;
  const introScreen = document.querySelector('#intro-screen');
  const mainMenu = document.querySelector('#main-menu');
  const levelMenu = document.querySelector('#level-menu');
  const settingsMenu = document.querySelector('#settings-menu');
  const shopMenu = document.querySelector('#shop-menu');
  const extrasMenu = document.querySelector('#extras-menu');
  const themeGrid = document.querySelector('#theme-grid');
  const achievementList = document.querySelector('#achievement-list');
  const highscoreList = document.querySelector('#highscore-list');
  const dailyRewardInfo = document.querySelector('#daily-reward-info');
  const dailyClaimButton = document.querySelector('#daily-claim');
  const skinGrid = document.querySelector('#skin-grid');
  const shopMessage = document.querySelector('#shop-message');
  const menuCoins = document.querySelector('#menu-coins');
  const shopCoins = document.querySelector('#shop-coins');
  const gameCoins = document.querySelector('#game-coins');
  const gameApp = document.querySelector('#game-app');
  const menuLevelPicker = document.querySelector('#menu-level-picker');
  const menuLevelStart = document.querySelector('#menu-level-start');
  const selectedLevelNote = document.querySelector('#selected-level-note');
  const unlockSummary = document.querySelector('#unlock-summary');
  const menuSpeedControl = document.querySelector('#menu-speed-control');
  const menuSpeedValue = document.querySelector('#menu-speed-value');
  const backgroundMusicToggle = document.querySelector('#background-music-toggle');
  const customSongFiles = document.querySelector('#custom-song-files');
  const customSongStatus = document.querySelector('#custom-song-status');
  const customSongPlayButton = document.querySelector('#custom-song-play');
  const customSongNextButton = document.querySelector('#custom-song-next');
  const customSongVolume = document.querySelector('#custom-song-volume');
  const customSongVolumeValue = document.querySelector('#custom-song-volume-value');
  const customAudio = new Audio();
  customAudio.preload = 'metadata';
  let customSongs = [];
  let customSongIndex = 0;
  let customSongPlaying = false;
  const gridSize = 20;
  const cellSize = canvas.width / gridSize;
  const baseStep = 145;
  const minimumStep = 45;
  const snakeStart = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  let snake = [];
  let direction = directions.right;
  let queuedDirection = direction;
  let food = null;
  let powerUp = null;
  let shieldCharges = 0;
  let slowMoves = 0;
  let magnetMoves = 0;
  let obstacles = [];
  let currentLevel = loadUnlockedLevel();
  let selectedLevel = currentLevel;
  let score = 0;
  let best = loadBestScore();
  let coins = loadNumber('snake-coins', 0);
  const skins = [
    { id: 'classic', name: 'Classic Green', price: 0, head: '#b6f58b', body: '#8edb68', style: 'Classic' },
    { id: 'flame', name: 'Flame', price: 40, head: '#ffb347', body: '#ff5b35', style: 'Hot orange' },
    { id: 'ocean', name: 'Ocean', price: 70, head: '#79e7ff', body: '#258bd8', style: 'Cool blue' },
    { id: 'royal', name: 'Royal Purple', price: 110, head: '#e2a6ff', body: '#9945d5', style: 'Purple' },
    { id: 'neon', name: 'Neon Cyber', price: 160, head: '#fbff63', body: '#42f5c5', style: 'Neon' },
    { id: 'gold', name: 'Golden VIP', price: 250, head: '#fff0a1', body: '#d6a526', style: 'Gold' },
    { id: 'ruby', name: 'Ruby Red', price: 300, head: '#ff8a9b', body: '#c9184a', style: 'Ruby' },
    { id: 'ice', name: 'Arctic Ice', price: 350, head: '#e0fbfc', body: '#98c1d9', style: 'Ice' },
    { id: 'toxic', name: 'Toxic Slime', price: 400, head: '#d8ff3e', body: '#71b340', style: 'Toxic' },
    { id: 'sunset', name: 'Sunset', price: 450, head: '#ffd166', body: '#ef476f', style: 'Sunset' },
    { id: 'galaxy', name: 'Galaxy', price: 500, head: '#cdb4db', body: '#5a189a', style: 'Galaxy' },
    { id: 'mint', name: 'Mint Fresh', price: 550, head: '#caffbf', body: '#52b788', style: 'Mint' },
    { id: 'lava', name: 'Lava Core', price: 600, head: '#ffea00', body: '#d00000', style: 'Lava' },
    { id: 'pink', name: 'Pink Pop', price: 650, head: '#ffc6ff', body: '#f15bb5', style: 'Pink' },
    { id: 'shadow', name: 'Shadow', price: 700, head: '#adb5bd', body: '#343a40', style: 'Shadow' },
    { id: 'candy', name: 'Candy Stripe', price: 750, head: '#ffffff', body: '#ff70a6', style: 'Candy' },
    { id: 'emerald', name: 'Emerald', price: 800, head: '#b7efc5', body: '#2d6a4f', style: 'Emerald' },
    { id: 'sapphire', name: 'Sapphire', price: 900, head: '#a2d2ff', body: '#2255cc', style: 'Sapphire' },
    { id: 'plasma', name: 'Plasma', price: 1000, head: '#f7aef8', body: '#7b2cbf', style: 'Plasma' },
    { id: 'diamond', name: 'Diamond Elite', price: 1200, head: '#ffffff', body: '#64dfdf', style: 'Diamond' },
  ];
  let ownedSkins = loadOwnedSkins();
  let equippedSkin = loadEquippedSkin();
  let state = 'ready';
  let lastFrame = 0;
  let timeSinceStep = 0;
  let touchStart = null;
  let soundContext = null;
  let musicTimer = null;
  let musicNoteIndex = 0;
  let musicEnabled = loadMusicSetting();
  const arenaThemes = [
    { id: 'forest', name: '🌲 Forest', bg: '#15211c', grid: 'rgba(191,221,197,.05)' },
    { id: 'space', name: '🌌 Space', bg: '#11162e', grid: 'rgba(137,155,255,.09)' },
    { id: 'lava', name: '🌋 Lava', bg: '#301714', grid: 'rgba(255,126,71,.08)' },
    { id: 'ice', name: '❄️ Ice', bg: '#102a38', grid: 'rgba(151,225,255,.09)' },
    { id: 'candy', name: '🍬 Candy', bg: '#30182b', grid: 'rgba(255,164,220,.09)' },
    { id: 'desert', name: '🏜️ Desert', bg: '#302719', grid: 'rgba(255,220,145,.08)' }
  ];
  let selectedTheme = loadTheme();

  backgroundMusicToggle.checked = musicEnabled;
  bestValue.textContent = formatScore(best);
  selectedLevel = 1;
  updateCoinDisplays();
  renderSkinShop();
  window.snakeEconomy = {
    getCoins: () => coins,
    spendCoins: (amount) => { if (!Number.isFinite(amount) || amount < 0 || coins < amount) return false; coins -= amount; saveEconomy(); updateCoinDisplays(); renderSkinShop(); return true; },
    addCoins: (amount) => { if (!Number.isFinite(amount) || amount < 0) return; coins += amount; saveEconomy(); updateCoinDisplays(); renderSkinShop(); }
  };
  resetGame();
  gameApp.classList.remove('is-visible');
  setTimeout(() => { introScreen.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden'); }, 2800);
  requestAnimationFrame(gameLoop);

  function playAppleSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!soundContext) soundContext = new AudioContextClass();
      if (soundContext.state === 'suspended') soundContext.resume();
      const now = soundContext.currentTime;
      // A small original two-note arcade chime, generated locally (no audio file needed).
      [660, 990].forEach((frequency, index) => {
        const oscillator = soundContext.createOscillator();
        const gain = soundContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
        gain.gain.setValueAtTime(0.0001, now + index * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.055 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.055 + 0.19);
        oscillator.connect(gain);
        gain.connect(soundContext.destination);
        oscillator.start(now + index * 0.055);
        oscillator.stop(now + index * 0.055 + 0.2);
      });
    } catch (error) {
      // Audio is optional; the game still works if the browser blocks it.
    }
  }

  function loadMusicSetting() {
    try { return window.localStorage.getItem('snake-background-music') !== 'off'; } catch (error) { return true; }
  }

  function startBackgroundMusic() {
    if (!musicEnabled) return;
    if (customSongs.length) {
      if (customAudio.src !== customSongs[customSongIndex]?.url) customAudio.src = customSongs[customSongIndex].url;
      customAudio.volume = Number(customSongVolume.value);
      customAudio.play().then(() => { customSongPlaying = true; customSongPlayButton.textContent = 'Ⅱ Pause'; }).catch(() => {});
      return;
    }
    if (musicTimer) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!soundContext) soundContext = new AudioContextClass();
      if (soundContext.state === 'suspended') soundContext.resume();
      // Original, locally generated arcade melody; no external audio file required.
      const notes = [392, 494, 587, 494, 440, 523, 659, 523, 392, 494, 587, 784, 659, 587, 494, 440];
      musicNoteIndex = 0;
      const playNote = () => {
        if (!musicEnabled || !soundContext || soundContext.state !== 'running') return;
        const now = soundContext.currentTime;
        const osc = soundContext.createOscillator();
        const gain = soundContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[musicNoteIndex % notes.length], now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
        osc.connect(gain);
        gain.connect(soundContext.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        musicNoteIndex += 1;
      };
      playNote();
      musicTimer = window.setInterval(playNote, 220);
    } catch (error) {
      // Audio is optional; the game still works if the browser blocks it.
    }
  }

  function stopBackgroundMusic() {
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    if (customSongs.length) {
      customAudio.pause();
      customSongPlaying = false;
      customSongPlayButton.textContent = '▶ Play';
    }
  }

  function loadCustomSong(index, autoplay = false) {
    if (!customSongs.length) return;
    customSongIndex = (index + customSongs.length) % customSongs.length;
    customAudio.src = customSongs[customSongIndex].url;
    customAudio.volume = Number(customSongVolume.value);
    customSongStatus.textContent = `Song ${customSongIndex + 1}/${customSongs.length}: ${customSongs[customSongIndex].name}`;
    if (autoplay && musicEnabled) {
      customAudio.play().then(() => { customSongPlaying = true; customSongPlayButton.textContent = 'Ⅱ Pause'; }).catch(() => {
        customSongStatus.textContent = 'Press Play to start: ' + customSongs[customSongIndex].name;
      });
    }
  }

  customSongFiles.addEventListener('change', () => {
    customSongs.forEach(song => URL.revokeObjectURL(song.url));
    customSongs = Array.from(customSongFiles.files || []).filter(file => file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)).map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
    customSongIndex = 0;
    if (!customSongs.length) {
      customAudio.pause(); customAudio.removeAttribute('src');
      customSongStatus.textContent = 'No songs selected — arcade music will play.';
      customSongPlayButton.textContent = '▶ Play';
      return;
    }
    if (musicTimer) { window.clearInterval(musicTimer); musicTimer = null; }
    loadCustomSong(0, false);
    customSongStatus.textContent = `${customSongs.length} song(s) selected. Press Play or start the game.`;
  });
  customSongPlayButton.addEventListener('click', () => {
    if (!customSongs.length) { customSongStatus.textContent = 'First choose one or more songs.'; return; }
    if (customSongPlaying && !customAudio.paused) {
      customAudio.pause(); customSongPlaying = false; customSongPlayButton.textContent = '▶ Play';
    } else {
      if (customAudio.ended) customAudio.currentTime = 0;
      customAudio.volume = Number(customSongVolume.value);
      customAudio.play().then(() => { customSongPlaying = true; customSongPlayButton.textContent = 'Ⅱ Pause'; }).catch(() => { customSongStatus.textContent = 'Could not play this file. Try another audio file.'; });
    }
  });
  customSongNextButton.addEventListener('click', () => {
    if (!customSongs.length) { customSongStatus.textContent = 'First choose one or more songs.'; return; }
    loadCustomSong(customSongIndex + 1, true);
  });
  customSongVolume.addEventListener('input', () => {
    customAudio.volume = Number(customSongVolume.value);
    customSongVolumeValue.textContent = `${Math.round(Number(customSongVolume.value) * 100)}%`;
  });
  customAudio.addEventListener('ended', () => {
    if (customSongs.length > 1 && musicEnabled) loadCustomSong(customSongIndex + 1, true);
    else { customSongPlaying = false; customSongPlayButton.textContent = '▶ Play'; }
  });

  function loadTheme() {
    try { const id = localStorage.getItem('snake-arena-theme') || 'forest'; return arenaThemes.some(t => t.id === id) ? id : 'forest'; } catch (e) { return 'forest'; }
  }
  function saveTheme(id) { selectedTheme = id; try { localStorage.setItem('snake-arena-theme', id); } catch (e) {} draw(); renderExtras(); }
  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
  function loadDaily() { try { return JSON.parse(localStorage.getItem('snake-daily-reward') || '{"date":"","streak":0}'); } catch(e) { return {date:'',streak:0}; } }
  function renderExtras() {
    if (!themeGrid) return;
    themeGrid.innerHTML = '';
    arenaThemes.forEach(theme => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'theme-choice' + (selectedTheme === theme.id ? ' is-selected' : '');
      b.textContent = theme.name; b.style.setProperty('--theme-preview', theme.bg);
      b.addEventListener('click', () => saveTheme(theme.id)); themeGrid.appendChild(b);
    });
    const daily = loadDaily(); const claimed = daily.date === todayKey();
    dailyRewardInfo.textContent = claimed ? `Today's reward claimed! Current streak: ${daily.streak} day(s). Come back tomorrow.` : `Claim ${25 + ((daily.streak || 0) % 7) * 5} coins today. 7-day streak gives bigger rewards. Current streak: ${daily.streak || 0} day(s).`;
    dailyClaimButton.disabled = claimed; dailyClaimButton.textContent = claimed ? '✓ Already Claimed Today' : 'Claim Daily Coins';
    const achievements = [
      ['First Apple','Collect your first apple',score >= 1 || best >= 1],
      ['Apple Collector','Collect 25 apples in one run',best >= 25],
      ['Century Snake','Reach a score of 100',best >= 100],
      ['Level Climber','Unlock level 5',loadUnlockedLevel() >= 5],
      ['Big Spender','Own 5 snake skins',ownedSkins.length >= 5],
      ['Coin Collector','Save 500 coins',coins >= 500],
      ['Theme Explorer','Try a non-Forest theme',selectedTheme !== 'forest'],
      ['Power Player','Collect a power-up',loadNumber('snake-powerups-used',0) > 0]
    ];
    achievementList.innerHTML = '';
    achievements.forEach(([name, desc, unlocked]) => { const row = document.createElement('div'); row.className = 'achievement-row' + (unlocked ? ' unlocked' : ''); row.innerHTML = `<span>${unlocked ? '🏆' : '🔒'}</span><div><strong></strong><small></small></div><b>${unlocked ? 'UNLOCKED' : 'LOCKED'}</b>`; row.querySelector('strong').textContent = name; row.querySelector('small').textContent = desc; achievementList.appendChild(row); });
    let scores = []; try { scores = JSON.parse(localStorage.getItem('snake-high-scores') || '[]'); } catch(e) {}
    highscoreList.innerHTML = '';
    if (!scores.length) { highscoreList.textContent = 'Finish a run to save your first score.'; }
    else scores.slice(0,5).forEach((entry,i) => { const row=document.createElement('div'); row.className='highscore-row'; row.textContent=`${i+1}.  ${entry.score} apples  •  Level ${entry.level}  •  ${entry.date}`; highscoreList.appendChild(row); });
  }
  function recordHighScore() {
    let scores=[]; try { scores=JSON.parse(localStorage.getItem('snake-high-scores') || '[]'); } catch(e) {}
    scores.push({score, level:currentLevel, date:new Date().toLocaleDateString()});
    scores.sort((a,b)=>b.score-a.score); scores=scores.slice(0,5);
    try { localStorage.setItem('snake-high-scores', JSON.stringify(scores)); } catch(e) {}
  }
  function claimDailyReward() {
    const daily=loadDaily(); if (daily.date === todayKey()) return;
    const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1); const ykey=`${yesterday.getFullYear()}-${yesterday.getMonth()+1}-${yesterday.getDate()}`;
    daily.streak = daily.date === ykey ? (daily.streak || 0)+1 : 1;
    const reward=25+((daily.streak-1)%7)*5; daily.date=todayKey(); coins+=reward; saveEconomy(); updateCoinDisplays();
    try { localStorage.setItem('snake-daily-reward', JSON.stringify(daily)); } catch(e) {}
    renderExtras(); dailyRewardInfo.textContent=`You claimed ${reward} coins! Streak: ${daily.streak} day(s).`;
  }
  function spawnPowerUp() {
    const choices = ['🛡️','🐌','🧲'];
    for (let i=0;i<100;i++) { const cell={x:Math.floor(Math.random()*gridSize),y:Math.floor(Math.random()*gridSize)};
      if (!snake.some(s=>s.x===cell.x&&s.y===cell.y) && !obstacles.some(o=>o.x===cell.x&&o.y===cell.y) && !(food&&food.x===cell.x&&food.y===cell.y)) { powerUp={...cell,type:choices[Math.floor(Math.random()*choices.length)]}; return; }
    }
  }
  function collectPowerUp() {
    if (!powerUp) return;
    if (powerUp.type==='🛡️') { shieldCharges++; overlayMessage.textContent='Shield collected! It will protect you from one collision.'; }
    else if (powerUp.type==='🐌') { slowMoves=35; overlayMessage.textContent='Slow motion activated for 35 moves!'; }
    else { magnetMoves=25; const h=snake[0]; food={x:Math.max(0,Math.min(gridSize-1,h.x+(Math.random()<.5?-1:1))),y:Math.max(0,Math.min(gridSize-1,h.y+(Math.random()<.5?-1:1)))}; overlayMessage.textContent='Apple magnet activated! Collect apples nearby for 25 moves.'; }
    try { localStorage.setItem('snake-powerups-used', String(loadNumber('snake-powerups-used',0)+1)); } catch(e) {}
    powerUp=null; renderExtras();
  }

  function loadNumber(key, fallback) {
    try { const n = Number(window.localStorage.getItem(key)); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback; } catch (error) { return fallback; }
  }

  function loadOwnedSkins() {
    try { const saved = JSON.parse(window.localStorage.getItem('snake-owned-skins') || '["classic"]'); return Array.isArray(saved) ? Array.from(new Set(['classic', ...saved.filter(id => skins.some(skin => skin.id === id))])) : ['classic']; } catch (error) { return ['classic']; }
  }

  function loadEquippedSkin() {
    try { const saved = window.localStorage.getItem('snake-equipped-skin') || 'classic'; return skins.some(skin => skin.id === saved) ? saved : 'classic'; } catch (error) { return 'classic'; }
  }

  function saveEconomy() {
    try {
      localStorage.setItem('snake-coins', String(coins));
      localStorage.setItem('snake-owned-skins', JSON.stringify(ownedSkins));
      localStorage.setItem('snake-equipped-skin', equippedSkin);
    } catch (error) { console.warn('Could not save coins or skins.', error); }
  }

  function updateCoinDisplays() {
    if (menuCoins) menuCoins.textContent = String(coins);
    if (shopCoins) shopCoins.textContent = String(coins);
    if (gameCoins) gameCoins.textContent = formatScore(coins);
  }

  function renderSkinShop() {
    if (!skinGrid) return;
    skinGrid.innerHTML = '';
    skins.forEach(skin => {
      const owned = ownedSkins.includes(skin.id);
      const equipped = equippedSkin === skin.id;
      const card = document.createElement('div');
      card.className = 'skin-card' + (equipped ? ' is-equipped' : '');
      const preview = document.createElement('div');
      preview.className = 'skin-preview';
      preview.style.setProperty('--skin-head', skin.head);
      preview.style.setProperty('--skin-body', skin.body);
      preview.innerHTML = '<span></span><span></span><span></span>';
      const name = document.createElement('strong'); name.textContent = skin.name;
      const price = document.createElement('p'); price.className = 'skin-price'; price.textContent = skin.price === 0 ? 'FREE' : `🪙 ${skin.price} coins`;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button ' + (equipped ? 'button-primary' : 'button-secondary') + ' skin-action';
      button.textContent = equipped ? 'Equipped ✓' : owned ? 'Equip Skin' : `Buy · ${skin.price}`;
      button.disabled = equipped;
      button.setAttribute('aria-label', owned ? `Equip ${skin.name}` : `Buy ${skin.name} for ${skin.price} coins`);
      button.addEventListener('click', () => {
        if (!owned) {
          if (coins < skin.price) {
            shopMessage.textContent = `Not enough coins! You need ${skin.price - coins} more coins for ${skin.name}. Complete levels to earn coins.`;
            shopMessage.classList.add('shop-message-warning');
            return;
          }
          coins -= skin.price; ownedSkins.push(skin.id);
        }
        equippedSkin = skin.id; saveEconomy(); updateCoinDisplays(); renderSkinShop();
        shopMessage.textContent = `${skin.name} ${owned ? 'equipped' : 'purchased and equipped'}!`;
        shopMessage.classList.remove('shop-message-warning');
        draw();
      });
      card.append(preview, name, price, button); skinGrid.appendChild(card);
    });
    updateCoinDisplays();
  }

  function awardLevelCoins(level) {
    const reward = 20 + level * 5;
    coins += reward; saveEconomy(); updateCoinDisplays(); renderSkinShop();
    return reward;
  }

  function loadBestScore() {
    try {
      const storedScore = Number(window.localStorage.getItem('snake-best-score'));
      return Number.isFinite(storedScore) && storedScore > 0 ? Math.floor(storedScore) : 0;
    } catch (error) {
      console.warn('Could not read the saved best score.', error);
      return 0;
    }
  }

  function loadUnlockedLevel() {
    try {
      const savedLevel = Number(window.localStorage.getItem('snake-unlocked-level'));
      return Number.isFinite(savedLevel) && savedLevel > 1 ? Math.min(MAX_LEVEL, Math.floor(savedLevel)) : 1;
    } catch (error) {
      return 1;
    }
  }

  function saveUnlockedLevel() {
    try {
      window.localStorage.setItem('snake-unlocked-level', String(currentLevel));
    } catch (error) {
      console.warn('Could not save the unlocked level.', error);
    }
  }

  function saveBestScore() {
    try {
      window.localStorage.setItem('snake-best-score', String(best));
    } catch (error) {
      console.warn('Could not save the best score.', error);
    }
  }

  function formatScore(value) {
    return String(value).padStart(3, '0');
  }

  function showLevelPicker() {
    const unlocked = loadUnlockedLevel();
    selectedLevel = Math.min(selectedLevel, unlocked);
    menuLevelPicker.innerHTML = '';
    unlockSummary.textContent = `You have unlocked ${unlocked} of ${MAX_LEVEL} levels.`;
    for (let level = 1; level <= MAX_LEVEL; level += 1) {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'level-choice' + (level === selectedLevel ? ' is-selected' : '');
      choice.textContent = level <= unlocked ? `Level ${level}` : `🔒 ${level}`;
      choice.disabled = level > unlocked;
      choice.addEventListener('click', () => {
        selectedLevel = level;
        menuLevelPicker.querySelectorAll('.level-choice').forEach((item) => item.classList.remove('is-selected'));
        choice.classList.add('is-selected');
        menuLevelStart.disabled = false;
        selectedLevelNote.textContent = `Level ${level} selected — ${bananasNeededBeforeLevel(level) + BANANAS_PER_LEVEL * level} apples total progress to clear it.`;
      });
      menuLevelPicker.appendChild(choice);
    }
    menuLevelStart.disabled = selectedLevel > unlocked;
    selectedLevelNote.textContent = `Selected level: ${selectedLevel}`;
    levelPicker.classList.add('is-hidden');
  }

  function resetGame() {
    snake = snakeStart.map((segment) => ({ ...segment }));
    direction = directions.right;
    queuedDirection = direction;
    currentLevel = selectedLevel;
    score = bananasNeededBeforeLevel(currentLevel);
    obstacles = [];
    powerUp = null; shieldCharges = 0; slowMoves = 0; magnetMoves = 0;
    document.body.classList.remove('level-2', 'level-3', 'level-4', 'level-5');
    timeSinceStep = 0;
    food = placeFood();
    if (currentLevel > 1) createObstacles();
    updateScore();
    draw();
  }

  function placeFood() {
    const emptyCells = [];
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        if (!snake.some((segment) => segment.x === x && segment.y === y) &&
            !obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y) &&
            !(powerUp && powerUp.x === x && powerUp.y === y)) {
          emptyCells.push({ x, y });
        }
      }
    }
    if (emptyCells.length === 0) {
      return null;
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function bananasNeededBeforeLevel(level) {
    return BANANAS_PER_LEVEL * (level - 1) * level / 2;
  }

  function getLevelForScore(value) {
    let level = 1;
    while (level < MAX_LEVEL && value >= bananasNeededBeforeLevel(level + 1)) level += 1;
    return level;
  }

  function updateScore() {
    scoreValue.textContent = formatScore(score);
    bestValue.textContent = formatScore(best);
    const level = getLevelForScore(score);
    levelValue.textContent = String(level).padStart(2, '0');
    const themeLevel = Math.min(level, 5);
    document.body.classList.remove('level-2', 'level-3', 'level-4', 'level-5');
    if (themeLevel >= 2) document.body.classList.add(`level-${themeLevel}`);
    const levelMultiplier = 1 + Math.min(level - 1, 10) * 0.15;
    const manualMultiplier = Number(speedControl.value) || 1;
    speedValue.innerHTML = `${(levelMultiplier * manualMultiplier).toFixed(2)}<span class="stat-unit">×</span>`;
    speedControlValue.textContent = `${manualMultiplier.toFixed(2)}×`;
  }

  function getStepDuration() {
    const level = getLevelForScore(score);
    const levelDuration = Math.max(minimumStep, baseStep - (level - 1) * 10);
    const manualMultiplier = Number(speedControl.value) || 1;
    return Math.max(25, (levelDuration / manualMultiplier) * (slowMoves > 0 ? 1.65 : 1));
  }

  function startGame() {
    if (state === 'ready' || state === 'over' || state === 'won' || state === 'levelup') {
      if (state !== 'levelup') resetGame();
    }
    introScreen.classList.add('is-hidden');
    mainMenu.classList.add('is-hidden'); levelMenu.classList.add('is-hidden'); settingsMenu.classList.add('is-hidden'); shopMenu.classList.add('is-hidden');
    gameApp.classList.add('is-visible');
    levelPicker.classList.add('is-hidden');
    state = 'running';
    startBackgroundMusic();
    timeSinceStep = 0;
    overlay.classList.add('is-hidden');
    pauseButton.disabled = false;
    statusText.textContent = 'PLAYING';
    statusBadge.classList.remove('is-paused', 'is-over');
  }

  function pauseGame() {
    if (state === 'running') {
      state = 'paused';
      stopBackgroundMusic();
      overlayIcon.textContent = 'Ⅱ';
      overlayEyebrow.textContent = 'TAKE YOUR TIME';
      overlayTitle.textContent = 'Paused.';
      overlayMessage.textContent = 'Your snake is waiting right where you left it.';
      startButton.innerHTML = 'Resume game <span aria-hidden="true">→</span>';
      overlay.classList.remove('is-hidden');
      pauseIcon.textContent = '▶';
      pauseLabel.textContent = 'Resume game';
      statusText.textContent = 'PAUSED';
      statusBadge.classList.add('is-paused');
      return;
    }
    if (state === 'paused') {
      state = 'running';
      startBackgroundMusic();
      timeSinceStep = 0;
      overlay.classList.add('is-hidden');
      pauseIcon.textContent = 'Ⅱ';
      pauseLabel.textContent = 'Pause game';
      statusText.textContent = 'PLAYING';
      statusBadge.classList.remove('is-paused');
    }
  }

  function finishGame(won) {
    stopBackgroundMusic();
    recordHighScore();
    state = won ? 'won' : 'over';
    pauseButton.disabled = true;
    statusText.textContent = won ? 'YOU WIN' : 'GAME OVER';
    statusBadge.classList.remove('is-paused');
    statusBadge.classList.add('is-over');
    overlayIcon.textContent = won ? '✳' : '↻';
    overlayEyebrow.textContent = won ? 'BOARD CLEARED' : 'NICE RUN';
    overlayTitle.textContent = won ? 'Incredible.' : 'Game over.';
    overlayMessage.textContent = won
      ? `You filled the board with a score of ${score}. Your unlocked level is ${currentLevel}.`
      : `You reached level ${currentLevel} and collected ${score} apples. Play again from level ${currentLevel}?`;
    selectedLevel = Math.min(currentLevel, loadUnlockedLevel());
    gameApp.classList.remove('is-visible');
    showLevelPicker();
    mainMenu.classList.add('is-hidden');
    levelMenu.classList.remove('is-hidden');
  }

  function changeDirection(nextDirection) {
    if (state !== 'running') {
      return;
    }
    if (nextDirection.x === -direction.x && nextDirection.y === -direction.y) {
      return;
    }
    queuedDirection = nextDirection;
  }

  function createObstacles() {
    const level = currentLevel;
    const wanted = Math.min(4 + (level - 2) * 4, 28);
    const next = [];
    let attempts = 0;
    while (next.length < wanted && attempts < 2000) {
      attempts += 1;
      const cell = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
      const tooCloseToSnake = snake.some((segment) =>
        Math.abs(segment.x - cell.x) + Math.abs(segment.y - cell.y) < 3
      );
      const onFood = food && food.x === cell.x && food.y === cell.y;
      if (!tooCloseToSnake && !onFood &&
          !next.some((item) => item.x === cell.x && item.y === cell.y)) next.push(cell);
    }
    obstacles = next;
  }

  function moveSnake() {
    direction = queuedDirection;
    const head = snake[0];
    const nextHead = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };
    const eating = food && nextHead.x === food.x && nextHead.y === food.y;
    if (eating) playAppleSound();
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    const hitsObstacle = obstacles.some((obstacle) => obstacle.x === nextHead.x && obstacle.y === nextHead.y);

    const collision = nextHead.x < 0 || nextHead.x >= gridSize || nextHead.y < 0 || nextHead.y >= gridSize || bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y) || hitsObstacle;
    if (collision) {
      if (shieldCharges > 0) {
        shieldCharges -= 1;
        queuedDirection = direction.x !== 0 ? directions[direction.x > 0 ? 'left' : 'right'] : directions[direction.y > 0 ? 'up' : 'down'];
        direction = queuedDirection; timeSinceStep = 0;
        return;
      }
      finishGame(false); return;
    }

    snake.unshift(nextHead);
    if (powerUp && nextHead.x === powerUp.x && nextHead.y === powerUp.y) collectPowerUp();
    if (slowMoves > 0) slowMoves -= 1;
    if (magnetMoves > 0) { magnetMoves -= 1; if (food && Math.abs(nextHead.x-food.x)+Math.abs(nextHead.y-food.y) <= 2) { /* magnet pulls attention toward nearby apples */ } }
    if (eating) {
      score += 1;
      if (window.snakeMultiplayer && window.snakeMultiplayer.isMatchActive()) {
        window.snakeMultiplayer.onApple(score);
        if (score >= 20) { food = placeFood(); updateScore(); window.snakeMultiplayer.finishIfWinner(score); return; }
      }
      if (score % 5 === 0 && !powerUp) spawnPowerUp();
      const nextLevel = (window.snakeMultiplayer && window.snakeMultiplayer.isMatchActive()) ? 1 : getLevelForScore(score);
      if (nextLevel > currentLevel) {
        const completedLevel = currentLevel;
        const coinReward = awardLevelCoins(completedLevel);
        currentLevel = nextLevel;
        saveUnlockedLevel();
        createObstacles();
        overlayIcon.textContent = '◆';
        overlayEyebrow.textContent = `LEVEL ${currentLevel} UNLOCKED`;
        overlayTitle.textContent = currentLevel === 2 ? 'Obstacle zone!' : `Level ${currentLevel}!`;
        overlayMessage.textContent = `Level ${completedLevel} complete! You earned ${coinReward} coins. ${obstacles.length} obstacles added for the next level.`;
        levelPicker.classList.add('is-hidden');
        startButton.innerHTML = 'Continue <span aria-hidden="true">→</span>';
        overlay.classList.remove('is-hidden');
        state = 'levelup';
      }
      if (currentLevel === MAX_LEVEL && score >= bananasNeededBeforeLevel(MAX_LEVEL + 1)) {
        const finalReward = awardLevelCoins(MAX_LEVEL);
        overlayMessage.textContent = `All 50 levels completed! You earned ${finalReward} coins for Level 50.`;
        if (score > best) { best = score; saveBestScore(); }
        food = placeFood();
        updateScore();
        finishGame(true);
        return;
      }
      if (score > best) {
        best = score;
        saveBestScore();
      }
      food = placeFood();
      updateScore();
      if (!food) {
        finishGame(true);
      }
    } else {
      snake.pop();
    }
  }

  function gameLoop(timestamp) {
    if (state === 'running') {
      const elapsed = lastFrame ? Math.min(timestamp - lastFrame, 250) : 0;
      timeSinceStep += elapsed;
      const stepDuration = getStepDuration();
      if (timeSinceStep >= stepDuration) {
        timeSinceStep %= stepDuration;
        moveSnake();
        draw();
      }
    }
    lastFrame = timestamp;
    requestAnimationFrame(gameLoop);
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const level = Math.min(MAX_LEVEL, getLevelForScore(score));
    const theme = arenaThemes.find(t => t.id === selectedTheme) || arenaThemes[0];
    const backgrounds = ['#15211c', '#17172a', '#241a16', '#10242b', '#291629', '#142a35', '#302018', '#1c283d', '#29202f', '#182c24', '#302323', '#162b3a', '#332515', '#202044', '#2d1b28', '#16352f', '#38202a', '#1d3045', '#29341b', '#32203c'];
    context.fillStyle = selectedTheme === 'forest' ? backgrounds[(level - 1) % backgrounds.length] : theme.bg;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = theme.grid;
    context.lineWidth = 1;
    for (let line = 1; line < gridSize; line += 1) {
      const position = line * cellSize;
      context.beginPath();
      context.moveTo(position, 0);
      context.lineTo(position, canvas.height);
      context.moveTo(0, position);
      context.lineTo(canvas.width, position);
      context.stroke();
    }

    obstacles.forEach((obstacle) => {
      const inset = 2;
      const x = obstacle.x * cellSize + inset;
      const y = obstacle.y * cellSize + inset;
      context.fillStyle = level >= 3 ? '#ff6b6b' : '#e58b48';
      context.strokeStyle = '#ffd0a6';
      context.lineWidth = 1.5;
      context.beginPath();
      context.roundRect(x, y, cellSize - inset * 2, cellSize - inset * 2, 5);
      context.fill();
      context.stroke();
      context.strokeStyle = 'rgba(35, 20, 10, 0.55)';
      context.beginPath();
      context.moveTo(x + 5, y + 5);
      context.lineTo(x + cellSize - 5, y + cellSize - 5);
      context.moveTo(x + cellSize - 5, y + 5);
      context.lineTo(x + 5, y + cellSize - 5);
      context.stroke();
    });
    if (food) drawFood(food);
    if (powerUp) { const px=powerUp.x*cellSize+cellSize/2, py=powerUp.y*cellSize+cellSize/2; context.fillStyle='rgba(255,255,255,.14)'; context.beginPath(); context.arc(px,py,cellSize*.48,0,Math.PI*2); context.fill(); context.font='22px sans-serif'; context.textAlign='center'; context.textBaseline='middle'; context.fillText(powerUp.type,px,py); }
    snake.forEach((segment, index) => drawSnakeSegment(segment, index));
  }

  function drawFood(position) {
    const centerX = position.x * cellSize + cellSize / 2;
    const centerY = position.y * cellSize + cellSize / 2;
    // Glowing red apple with two lobes, a stem, and a green leaf.
    context.fillStyle = 'rgba(255, 65, 80, 0.18)';
    context.beginPath();
    context.arc(centerX, centerY + 1, cellSize * 0.43, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#ff4058';
    context.beginPath();
    context.moveTo(centerX, centerY - 3);
    context.bezierCurveTo(centerX - 2, centerY - 9, centerX - 9, centerY - 7, centerX - 8, centerY + 1);
    context.bezierCurveTo(centerX - 7, centerY + 9, centerX - 2, centerY + 10, centerX, centerY + 7);
    context.bezierCurveTo(centerX + 3, centerY + 10, centerX + 8, centerY + 7, centerX + 8, centerY + 1);
    context.bezierCurveTo(centerX + 9, centerY - 7, centerX + 2, centerY - 9, centerX, centerY - 3);
    context.fill();
    context.strokeStyle = '#7b4b2a';
    context.lineWidth = 1.8;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(centerX, centerY - 4);
    context.lineTo(centerX + 1, centerY - 9);
    context.stroke();
    context.fillStyle = '#8ef06b';
    context.beginPath();
    context.ellipse(centerX + 4, centerY - 8, 4, 2, -0.55, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = 'rgba(255,255,255,0.65)';
    context.beginPath();
    context.arc(centerX - 4, centerY - 1, 1.5, 0, Math.PI * 2);
    context.fill();
  }

  function drawSnakeSegment(segment, index) {
    const inset = index === 0 ? 3 : 4;
    const x = segment.x * cellSize + inset;
    const y = segment.y * cellSize + inset;
    const size = cellSize - inset * 2;
    const skin = skins.find(item => item.id === equippedSkin) || skins[0];
    context.fillStyle = index === 0 ? skin.head : skin.body;
    context.beginPath();
    context.roundRect(x, y, size, size, index === 0 ? 8 : 6);
    context.fill();

    if (index > 0 && equippedSkin === 'neon') {
      context.strokeStyle = '#efff77'; context.lineWidth = 1.5; context.strokeRect(x + 3, y + 3, size - 6, size - 6);
    }
    if (index === 0) {
      if (equippedSkin === 'gold') { context.strokeStyle = '#fff6cc'; context.lineWidth = 2; context.strokeRect(x + 1, y + 1, size - 2, size - 2); }
      drawSnakeEyes(x, y, size);
    }
  }

  function drawSnakeEyes(x, y, size) {
    const eyes = direction.x !== 0
      ? [
          { x: x + size * 0.63, y: y + size * 0.3 },
          { x: x + size * 0.63, y: y + size * 0.7 },
        ]
      : [
          { x: x + size * 0.3, y: y + size * 0.36 },
          { x: x + size * 0.7, y: y + size * 0.36 },
        ];
    context.fillStyle = '#233b27';
    eyes.forEach((eye) => {
      context.beginPath();
      context.arc(eye.x, eye.y, 2, 0, Math.PI * 2);
      context.fill();
    });
  }

  function handleDirectionInput(value) {
    if (directions[value]) {
      changeDirection(directions[value]);
    }
  }

  speedControl.addEventListener('input', () => {
    menuSpeedControl.value = speedControl.value; menuSpeedValue.textContent = `${Number(speedControl.value).toFixed(2)}×`;
    updateScore();
    timeSinceStep = 0;
  });

  document.querySelector('#menu-start').addEventListener('click', () => {
    selectedLevel = Math.min(loadUnlockedLevel(), MAX_LEVEL);
    startGame();
  });
  document.querySelector('#menu-online').addEventListener('click', () => { mainMenu.classList.add('is-hidden'); document.querySelector('#online-menu').classList.remove('is-hidden'); if (window.snakeMultiplayer) window.snakeMultiplayer.open(); });
  document.querySelector('#menu-levels').addEventListener('click', () => {
    selectedLevel = Math.min(selectedLevel, loadUnlockedLevel());
    showLevelPicker(); mainMenu.classList.add('is-hidden'); levelMenu.classList.remove('is-hidden');
  });
  document.querySelector('#menu-shop').addEventListener('click', () => {
    shopMessage.textContent = 'Choose a skin to buy or equip.';
    shopMessage.classList.remove('shop-message-warning');
    renderSkinShop();
    mainMenu.classList.add('is-hidden');
    levelMenu.classList.add('is-hidden');
    settingsMenu.classList.add('is-hidden');
    shopMenu.classList.remove('is-hidden');
  });
  document.querySelector('#shop-back').addEventListener('click', () => { shopMenu.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden'); updateCoinDisplays(); });
  document.querySelector('#menu-extras').addEventListener('click', () => { renderExtras(); mainMenu.classList.add('is-hidden'); extrasMenu.classList.remove('is-hidden'); });
  document.querySelector('#extras-back').addEventListener('click', () => { extrasMenu.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden'); });
  dailyClaimButton.addEventListener('click', claimDailyReward);
  document.querySelector('#menu-settings').addEventListener('click', () => {
    menuSpeedControl.value = speedControl.value; menuSpeedValue.textContent = `${Number(speedControl.value).toFixed(2)}×`;
    mainMenu.classList.add('is-hidden'); settingsMenu.classList.remove('is-hidden');
  });
  document.querySelector('#levels-back').addEventListener('click', () => { levelMenu.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden'); });
  document.querySelector('#settings-back').addEventListener('click', () => { settingsMenu.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden'); });
  document.querySelector('#settings-save').addEventListener('click', () => {
    speedControl.value = menuSpeedControl.value;
    musicEnabled = backgroundMusicToggle.checked;
    try { window.localStorage.setItem('snake-background-music', musicEnabled ? 'on' : 'off'); } catch (error) {}
    if (!musicEnabled) stopBackgroundMusic();
    updateScore(); settingsMenu.classList.add('is-hidden'); mainMenu.classList.remove('is-hidden');
  });
  menuSpeedControl.addEventListener('input', () => { menuSpeedValue.textContent = `${Number(menuSpeedControl.value).toFixed(2)}×`; });
  menuLevelStart.addEventListener('click', () => { if (!menuLevelStart.disabled) startGame(); });

  startButton.addEventListener('click', () => {
    if (state === 'paused') {
      pauseGame();
    } else {
      startGame();
    }
  });

  pauseButton.addEventListener('click', pauseGame);
  speedControl.addEventListener('input', updateScore);

  document.addEventListener('keydown', (event) => {
    const keyDirections = {
      ArrowUp: 'up',
      w: 'up',
      W: 'up',
      ArrowDown: 'down',
      s: 'down',
      S: 'down',
      ArrowLeft: 'left',
      a: 'left',
      A: 'left',
      ArrowRight: 'right',
      d: 'right',
      D: 'right',
    };
    const nextDirection = keyDirections[event.key];
    if (nextDirection) {
      event.preventDefault();
      if (state === 'running') handleDirectionInput(nextDirection);
      return;
    }
    if (event.code === 'Space') {
      event.preventDefault();
      if (state === 'running' || state === 'paused') {
        pauseGame();
      }
    }
  });

  document.querySelectorAll('.control-button').forEach((button) => {
    button.addEventListener('click', () => {
      if (state === 'running') handleDirectionInput(button.dataset.direction);
    });
  });

  canvas.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  canvas.addEventListener('touchend', (event) => {
    if (!touchStart) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 20) {
      return;
    }
    if (state === 'ready' || state === 'over' || state === 'won') {
      startGame();
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      handleDirectionInput(deltaX > 0 ? 'right' : 'left');
    } else {
      handleDirectionInput(deltaY > 0 ? 'down' : 'up');
    }
  }, { passive: true });
})();