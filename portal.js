/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - PORTAL UTAMA SCRIPT (PORTAL.JS)
 * Floral Curtain Gate Opener, Live Love Counter & Gateway Navigation
 * ============================================================================
 */

(function () {
  'use strict';

  const ANNIV_DATE = new Date('2021-11-10T00:00:00');
  const gateScreen = document.getElementById('gate-screen');
  const portalHubContent = document.getElementById('portal-hub-content');
  const flowerGateCurtain = document.getElementById('flower-gate-curtain');
  const openGateBtn = document.getElementById('open-gate-btn');

  let isGateTransitioning = false;
  let isUnlocked = false;

  // 1. GERBANG BUNGA PEMBUKA (FLORAL CURTAIN TRANSITION)
  function openGateWithTransition() {
    if (isUnlocked || isGateTransitioning) return;
    isGateTransitioning = true;

    // Start Magnolia audio immediately
    if (window.AnnivCore && window.AnnivCore.tryStartMusic) {
      window.AnnivCore.tryStartMusic();
    }

    const gateCard = document.querySelector('.luxury-gate-card');
    if (gateCard) {
      gateCard.classList.add('gate-card-opening');
    }

    // Ensure portal hub is rendered underneath the parting curtain
    if (portalHubContent) {
      portalHubContent.style.display = 'block';
      portalHubContent.style.opacity = '1';
    }

    if (flowerGateCurtain) {
      flowerGateCurtain.classList.add('active');
      requestAnimationFrame(() => {
        flowerGateCurtain.classList.add('opening');
      });
    }

    // Direct outward parting in 0.78s - zero stutter, pure 60fps
    setTimeout(() => {
      isUnlocked = true;
      sessionStorage.setItem('anniv_gate_unlocked', 'true');

      if (gateScreen) {
        gateScreen.classList.add('hidden');
        gateScreen.style.display = 'none';
      }

      if (flowerGateCurtain) {
        flowerGateCurtain.classList.remove('active', 'opening');
        flowerGateCurtain.style.display = 'none';
      }

      isGateTransitioning = false;

      if (window.AnnivCore && window.AnnivCore.playSuccessFanfare) {
        window.AnnivCore.playSuccessFanfare();
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C68B59', '#E5A965', '#8C533C', '#FFFDF9', '#F5DEB3']
        });
      }
    }, 780);
  }

  if (openGateBtn) {
    openGateBtn.addEventListener('click', openGateWithTransition);
  }

  // Check if previously unlocked in this session
  if (sessionStorage.getItem('anniv_gate_unlocked') === 'true') {
    if (gateScreen) gateScreen.style.display = 'none';
    if (flowerGateCurtain) flowerGateCurtain.style.display = 'none';
    if (portalHubContent) {
      portalHubContent.style.display = 'block';
      portalHubContent.style.opacity = '1';
    }
    isUnlocked = true;
  }

  // 2. REALTIME LOVE COUNTER WIDGET
  function initHubCounter() {
    const daysEl = document.getElementById('hub-days');
    const hoursEl = document.getElementById('hub-hours');
    const minutesEl = document.getElementById('hub-minutes');
    const secondsEl = document.getElementById('hub-seconds');

    function updateCounter() {
      const now = new Date();
      const diffMs = now.getTime() - ANNIV_DATE.getTime();

      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (daysEl) daysEl.textContent = String(days);
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      }
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // 3. SOUND EFFECTS ON CARD HOVER & CLICK
  document.querySelectorAll('.grand-portal-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(580, 0.05);
      }
    });
    card.addEventListener('click', () => {
      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(720, 0.1);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    initHubCounter();
  });
})();
