/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - PAVILION GAME SCRIPT (GAME.JS)
 * Royal Tic-Tac-Toe (👑 vs 💖) & 3D Flippable Romantic Love Cards
 * ============================================================================
 */

(function () {
  'use strict';

  // --- TAB SWITCHER ---
  const gameTabBtns = document.querySelectorAll('.game-tab-btn');
  const gameTabPanels = document.querySelectorAll('.game-tab-panel');

  gameTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-game-tab');
      gameTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      gameTabPanels.forEach(panel => {
        if (panel.id === `game-tab-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(560, 0.08);
      }
    });
  });

  // --- GAME 1: TIC-TAC-TOE CONTROLLER ---
  const boardCells = document.querySelectorAll('.board-cell');
  const turnCardP1 = document.getElementById('turn-card-p1');
  const turnCardP2 = document.getElementById('turn-card-p2');
  const gameStatusText = document.getElementById('game-status-text');
  const scoreP1El = document.getElementById('score-p1');
  const scoreP2El = document.getElementById('score-p2');
  const scoreDrawEl = document.getElementById('score-draw');
  const gameRewardCard = document.getElementById('game-reward-card');
  const rewardWinnerText = document.getElementById('reward-winner-text');
  const rewardContentText = document.getElementById('reward-content-text');
  const winStrikeLine = document.getElementById('win-strike-line');
  const resetBoardBtn = document.getElementById('reset-board-btn');
  const resetScoreBtn = document.getElementById('reset-score-btn');

  let tttBoard = Array(9).fill(null);
  let tttCurrentPlayer = 'P1';
  let tttStartingPlayer = 'P1';
  let tttP1Score = 0;
  let tttP2Score = 0;
  let tttDrawCount = 0;
  let tttGameOver = false;

  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const ROMANTIC_REWARDS = [
    'Pemenang berhak minta 1 pelukan erat & ciuman hangat!',
    'Yang kalah harus traktir minuman / makanan manis favorit pemenang! ☕',
    'Pemenang boleh minta dipijit bahunya selama 5 menit!',
    'Yang kalah harus bisikin 3 hal yang paling disukai dari pemenang! 🤎',
    'Pemenang berhak minta 1 permintaan bebas hari ini!',
    'Yang kalah harus foto pose lucu bareng pemenang! 📸'
  ];

  function getPlayerName(player) {
    if (player === 'P1') {
      const el = document.getElementById('name-p1');
      return el ? el.textContent.trim() : 'Aku';
    } else {
      const el = document.getElementById('name-p2');
      return el ? el.textContent.trim() : 'Kamu';
    }
  }

  function updateTTTTurnUI() {
    if (tttGameOver) return;
    const isP1 = tttCurrentPlayer === 'P1';
    const sym = isP1 ? '👑' : '💖';
    const name = getPlayerName(tttCurrentPlayer);

    if (turnCardP1) turnCardP1.classList.toggle('active', isP1);
    if (turnCardP2) turnCardP2.classList.toggle('active', !isP1);

    if (gameStatusText) {
      gameStatusText.innerHTML = `Giliran <strong>${name} (${sym})</strong> &mdash; Pilih kotakmu!`;
    }
  }

  function handleCellClick(e) {
    const cell = e.currentTarget;
    const index = parseInt(cell.getAttribute('data-index'), 10);

    if (tttGameOver || tttBoard[index] !== null) return;

    tttBoard[index] = tttCurrentPlayer;
    cell.setAttribute('data-symbol', tttCurrentPlayer);
    cell.innerHTML = `<span>${tttCurrentPlayer === 'P1' ? '👑' : '💖'}</span>`;

    if (window.AnnivCore && window.AnnivCore.playChime) {
      window.AnnivCore.playChime(tttCurrentPlayer === 'P1' ? 660 : 780, 0.08);
    }

    const winData = checkTTTWin();
    if (winData) {
      handleTTTWin(winData);
    } else if (tttBoard.every(c => c !== null)) {
      handleTTTDraw();
    } else {
      tttCurrentPlayer = tttCurrentPlayer === 'P1' ? 'P2' : 'P1';
      updateTTTTurnUI();
    }
  }

  function checkTTTWin() {
    for (let i = 0; i < WIN_COMBOS.length; i++) {
      const [a, b, c] = WIN_COMBOS[i];
      if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
        return { winner: tttBoard[a], comboIndex: i, combo: [a, b, c] };
      }
    }
    return null;
  }

  function handleTTTWin(winData) {
    tttGameOver = true;
    const isP1 = winData.winner === 'P1';
    const winnerName = getPlayerName(winData.winner);
    const sym = isP1 ? '👑' : '💖';

    if (isP1) {
      tttP1Score++;
      if (scoreP1El) scoreP1El.textContent = tttP1Score;
    } else {
      tttP2Score++;
      if (scoreP2El) scoreP2El.textContent = tttP2Score;
    }

    winData.combo.forEach(idx => {
      const cell = document.querySelector(`.board-cell[data-index="${idx}"]`);
      if (cell) cell.classList.add('win-cell');
    });

    if (gameStatusText) {
      gameStatusText.innerHTML = `🎉 <strong>${winnerName} (${sym}) Menang Ronde Ini!</strong>`;
    }

    // Show Reward Announcement
    if (gameRewardCard) {
      if (rewardWinnerText) rewardWinnerText.textContent = `Selamat, ${winnerName} Menang! 🎉`;
      if (rewardContentText) {
        const randomReward = ROMANTIC_REWARDS[Math.floor(Math.random() * ROMANTIC_REWARDS.length)];
        rewardContentText.textContent = randomReward;
      }
      gameRewardCard.classList.remove('hidden');
    }

    if (window.AnnivCore && window.AnnivCore.playSuccessFanfare) {
      window.AnnivCore.playSuccessFanfare();
    }
  }

  function handleTTTDraw() {
    tttGameOver = true;
    tttDrawCount++;
    if (scoreDrawEl) scoreDrawEl.textContent = `Seri: ${tttDrawCount}`;
    if (gameStatusText) {
      gameStatusText.innerHTML = `🤝 <strong>Sama-sama Kuat! Hasil Seri yang Romantis!</strong>`;
    }
    if (window.AnnivCore && window.AnnivCore.playChime) {
      window.AnnivCore.playChime(420, 0.15);
    }
  }

  function resetTTTBoard() {
    tttBoard = Array(9).fill(null);
    boardCells.forEach(cell => {
      cell.removeAttribute('data-symbol');
      cell.classList.remove('win-cell');
      cell.innerHTML = '';
    });

    if (gameRewardCard) gameRewardCard.classList.add('hidden');
    if (winStrikeLine) winStrikeLine.classList.add('hidden');

    tttStartingPlayer = tttStartingPlayer === 'P1' ? 'P2' : 'P1';
    tttCurrentPlayer = tttStartingPlayer;
    tttGameOver = false;

    updateTTTTurnUI();
    if (window.AnnivCore && window.AnnivCore.playChime) {
      window.AnnivCore.playChime(500, 0.08);
    }
  }

  function resetTTTScores() {
    tttP1Score = 0;
    tttP2Score = 0;
    tttDrawCount = 0;
    if (scoreP1El) scoreP1El.textContent = '0';
    if (scoreP2El) scoreP2El.textContent = '0';
    if (scoreDrawEl) scoreDrawEl.textContent = 'Seri: 0';
    resetTTTBoard();
  }

  boardCells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  if (resetBoardBtn) resetBoardBtn.addEventListener('click', resetTTTBoard);
  if (resetScoreBtn) resetScoreBtn.addEventListener('click', resetTTTScores);

  // --- GAME 2: KARTU RAHASIA CINTA BERDUA ---
  const lovecard3d = document.getElementById('lovecard-3d');
  const cardTurnName = document.getElementById('card-turn-name');
  const cardCategoryBadge = document.getElementById('card-category-badge');
  const cardPromptText = document.getElementById('card-prompt-text');
  const nextCardBtn = document.getElementById('next-card-btn');

  let cardCurrentPlayer = 'P1';
  let isCardFlipped = false;

  const ROMANTIC_CARDS = [
    { cat: '✨ Momen Indah', prompt: 'Apa hal pertama yang terlintas di pikiranmu saat pertama kali kita memutuskan untuk kembali bersama?' },
    { cat: '💖 Tantangan Manis', prompt: 'Tatap mata pasanganmu selama 10 detik tanpa tertawa, lalu peluk erat-erat!' },
    { cat: '🍂 Deep Talk', prompt: 'Menurutmu, apa perubahan paling dewasa dan terbaik dari hubungan kita selama 4 tahun ini?' },
    { cat: '✨ Momen Indah', prompt: 'Sebutkan satu lagu yang kalau kamu dengar, langsung bikin kamu kangen dan teringat padaku.' },
    { cat: '💖 Tantangan Manis', prompt: 'Kecup kening pasanganmu dan bisikkan satu doa terbaikmu buat masa depan kita berdua.' },
    { cat: '🍂 Deep Talk', prompt: 'Kapan terakhir kali kamu merasa sangat bangga dan bersyukur memiliki aku di hidupmu?' },
    { cat: '👑 Tebak Pasangan', prompt: 'Sebutkan satu makanan atau kebiasaan kecil dariku yang paling bikin kamu gemas!' },
    { cat: '💖 Tantangan Manis', prompt: 'Pegang kedua tangan pasanganmu dan sebutkan 3 hal yang paling kamu sukai dari senyumannya.' },
    { cat: '🍂 Deep Talk', prompt: 'Kalau kita dikasih 1 hari libur tanpa HP dan tugas sama sekali, kencan seperti apa yang paling kamu impikan?' },
    { cat: '✨ Momen Indah', prompt: 'Ceritakan momen lucu atau konyol kita berdua yang sampai sekarang masih bikin kamu tersenyum sendiri.' },
    { cat: '💖 Tantangan Manis', prompt: 'Katakan "Aku sayang banget sama kamu" dengan 3 nada bicara berbeda: manja, tegas, dan bisikan lembut!' },
    { cat: '🍂 Deep Talk', prompt: 'Apa satu impian masa depan kita berdua yang paling ingin kamu wujudkan bersama aku?' },
    { cat: '👑 Tebak Pasangan', prompt: 'Menurutmu, hal apa yang paling bisa bikin aku langsung luluh dan ceria saat lagi ngambek atau capek?' },
    { cat: '✨ Momen Indah', prompt: 'Dari semua tempat yang pernah kita datangi berdua, mana tempat yang paling berkesan di hatimu?' },
    { cat: '💖 Tantangan Manis', prompt: 'Berikan pelukan hangat dari belakang (backhug) dan sebutkan satu panggilan sayang paling tulus.' },
    { cat: '🍂 Deep Talk', prompt: 'Hal kecil apa yang sering aku lakukan tanpa sadar, tapi ternyata bikin hatimu hangat?' },
    { cat: '👑 Tebak Pasangan', prompt: 'Kapan momen di mana kamu merasa paling jatuh cinta sedalam-dalamnya padaku?' },
    { cat: '💖 Tantangan Manis', prompt: 'Tiru ekspresi wajah lucuku saat lagi ngambek atau merajuk, lalu kecup pipiku!' }
  ];

  let unvisitedCardIndices = [];

  function drawNextCardPrompt() {
    if (unvisitedCardIndices.length === 0) {
      unvisitedCardIndices = ROMANTIC_CARDS.map((_, i) => i);
    }
    const randomIndex = Math.floor(Math.random() * unvisitedCardIndices.length);
    const cardIdx = unvisitedCardIndices.splice(randomIndex, 1)[0];
    const cardData = ROMANTIC_CARDS[cardIdx];

    if (cardCategoryBadge) cardCategoryBadge.textContent = cardData.cat;
    if (cardPromptText) cardPromptText.textContent = `"${cardData.prompt}"`;
  }

  function updateCardTurnUI() {
    const currentName = getPlayerName(cardCurrentPlayer);
    if (cardTurnName) cardTurnName.textContent = currentName;
  }

  if (lovecard3d) {
    lovecard3d.addEventListener('click', () => {
      isCardFlipped = !isCardFlipped;
      if (isCardFlipped) {
        lovecard3d.classList.add('flipped');
        if (window.AnnivCore && window.AnnivCore.playSealPopSound) {
          window.AnnivCore.playSealPopSound();
        }
      } else {
        lovecard3d.classList.remove('flipped');
        if (window.AnnivCore && window.AnnivCore.playChime) {
          window.AnnivCore.playChime(480, 0.08);
        }
      }
    });
  }

  if (nextCardBtn) {
    nextCardBtn.addEventListener('click', () => {
      if (isCardFlipped && lovecard3d) {
        lovecard3d.classList.remove('flipped');
        isCardFlipped = false;
      }

      cardCurrentPlayer = cardCurrentPlayer === 'P1' ? 'P2' : 'P1';
      updateCardTurnUI();

      setTimeout(() => {
        drawNextCardPrompt();
      }, 250);

      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(620, 0.1);
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    drawNextCardPrompt();
    updateTTTTurnUI();
    updateCardTurnUI();
  });
})();
