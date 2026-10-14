/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - CERITA KITA SCRIPT (CERITA.JS)
 * 5-Chapter Slides Engine, Photo Choreography & Live Love Counter
 * ============================================================================
 */

(function () {
  'use strict';

  const ANNIV_DATE = new Date('2021-11-10T00:00:00');
  let currentSlide = 1;
  const totalSlides = 5;
  let isTransitioning = false;
  const SLIDE_TRANSITION_MS = 800;

  // Preload photos for 60fps transitions
  const PHOTO_PRELOAD_LIST = [
    'foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg',
    'foto5.jpg', 'foto6.jpg', 'foto7.jpg', 'foto8.jpg',
    'foto9.jpg', 'foto10.jpg', 'foto11.jpg', 'foto12.jpg', 'foto13.jpg'
  ];
  PHOTO_PRELOAD_LIST.forEach(src => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });

  // DOM Elements
  const prevSlideBtn = document.getElementById('prev-slide-btn');
  const nextSlideBtn = document.getElementById('next-slide-btn');
  const dotButtons = document.querySelectorAll('.dot-btn');
  const slideCounterDisplay = document.getElementById('slide-number-display');
  const slides = document.querySelectorAll('.slide-item');
  const triggerConfettiBtn = document.getElementById('trigger-confetti-btn');

  // --- 1. SLIDE NAVIGATION CHOREOGRAPHY ---
  function goToSlide(targetIndex, direction = 'next') {
    if (isTransitioning || targetIndex === currentSlide || targetIndex < 1 || targetIndex > totalSlides) {
      return;
    }

    isTransitioning = true;
    const currentSlideEl = document.querySelector(`.slide-item[data-slide="${currentSlide}"]`);
    const nextSlideEl = document.querySelector(`.slide-item[data-slide="${targetIndex}"]`);

    const leaveClass = direction === 'next' ? 'leaving-to-next' : 'leaving-to-prev';
    const enterClass = direction === 'next' ? 'entering-from-next' : 'entering-from-prev';

    resetAllPhotoFocus();

    if (currentSlideEl) {
      currentSlideEl.classList.remove('active', 'entering-from-next', 'entering-from-prev');
      currentSlideEl.classList.add(leaveClass);
    }

    if (nextSlideEl) {
      nextSlideEl.classList.remove('leaving-to-next', 'leaving-to-prev');
      nextSlideEl.classList.add('active', enterClass);
    }

    // Play chime sound
    if (window.AnnivCore && window.AnnivCore.playChime) {
      window.AnnivCore.playChime(direction === 'next' ? 620 : 480, 0.08);
    }

    currentSlide = targetIndex;
    updateNavUI();

    setTimeout(() => {
      slides.forEach(s => {
        if (!s.classList.contains('active')) {
          s.classList.remove('leaving-to-next', 'leaving-to-prev', 'entering-from-next', 'entering-from-prev');
        }
      });
      if (nextSlideEl) {
        nextSlideEl.classList.remove('entering-from-next', 'entering-from-prev');
      }
      isTransitioning = false;
    }, SLIDE_TRANSITION_MS);
  }

  function goToNextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1, 'next');
    } else {
      // Loop or trigger celebration
      if (window.AnnivCore && window.AnnivCore.playSuccessFanfare) {
        window.AnnivCore.playSuccessFanfare();
      }
      triggerGrandConfetti();
    }
  }

  function goToPrevSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1, 'prev');
    }
  }

  function updateNavUI() {
    if (slideCounterDisplay) {
      slideCounterDisplay.textContent = `Slide ${currentSlide} / ${totalSlides}`;
    }

    dotButtons.forEach(btn => {
      const gotoIdx = parseInt(btn.getAttribute('data-goto'), 10);
      if (gotoIdx === currentSlide) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (prevSlideBtn) {
      prevSlideBtn.style.opacity = currentSlide === 1 ? '0.45' : '1';
      prevSlideBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'auto';
    }

    if (nextSlideBtn) {
      const nextBtnSpan = nextSlideBtn.querySelector('span');
      if (nextBtnSpan) {
        nextBtnSpan.textContent = currentSlide === totalSlides ? 'Rayakan! 🎉' : 'Lanjut Cerita';
      }
    }
  }

  // --- 2. PHOTO INSPECTION & ZOOM INTERACTION ---
  function resetAllPhotoFocus() {
    document.querySelectorAll('.motion-photo.photo-focused').forEach(p => {
      p.classList.remove('photo-focused');
    });
    document.querySelectorAll('.photo-composition.has-focused-photo').forEach(c => {
      c.classList.remove('has-focused-photo');
    });
  }

  function initPhotoZoomInteractions() {
    const allMotionPhotos = document.querySelectorAll('.motion-photo');
    allMotionPhotos.forEach(photo => {
      photo.addEventListener('click', (e) => {
        if (e.target.classList.contains('editable-text') && e.detail > 1) return;

        const comp = photo.closest('.photo-composition');
        const isAlreadyFocused = photo.classList.contains('photo-focused');

        if (!isAlreadyFocused) {
          document.querySelectorAll('.motion-photo.photo-focused').forEach(p => {
            p.classList.remove('photo-focused');
          });

          photo.classList.add('photo-focused');
          if (comp) comp.classList.add('has-focused-photo');
          if (window.AnnivCore && window.AnnivCore.playChime) {
            window.AnnivCore.playChime(640, 0.08);
          }
        } else {
          resetAllPhotoFocus();
          if (window.AnnivCore && window.AnnivCore.playChime) {
            window.AnnivCore.playChime(430, 0.06);
          }
        }
      });
    });

    document.querySelectorAll('.slide-content-grid').forEach(grid => {
      grid.addEventListener('click', (e) => {
        if (!e.target.closest('.motion-photo')) {
          resetAllPhotoFocus();
        }
      });
    });
  }

  // --- 3. REALTIME LIVE LOVE COUNTER ---
  function initLiveCounter() {
    const daysVal = document.getElementById('days-val');
    const hoursVal = document.getElementById('hours-val');
    const minutesVal = document.getElementById('minutes-val');
    const secondsVal = document.getElementById('seconds-val');

    function updateCounter() {
      const now = new Date();
      const diffMs = now.getTime() - ANNIV_DATE.getTime();

      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (daysVal) daysVal.textContent = String(days);
        if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
        if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
        if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
      }
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // --- 4. GRAND CELEBRATION CONFETTI ---
  function triggerGrandConfetti() {
    if (typeof confetti !== 'function') return;
    const colors = ['#C68B59', '#E5A965', '#8C533C', '#FDF6EE', '#D8C5B5', '#B87333'];

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors
      });
    }, 250);
  }

  if (triggerConfettiBtn) {
    triggerConfettiBtn.addEventListener('click', () => {
      triggerGrandConfetti();
      if (window.AnnivCore && window.AnnivCore.playSuccessFanfare) {
        window.AnnivCore.playSuccessFanfare();
      }
    });
  }

  // --- 5. EVENT LISTENERS FOR CONTROLS & GESTURES ---
  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', goToNextSlide);
  }
  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', goToPrevSlide);
  }

  dotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-goto'), 10);
      if (!isNaN(target)) {
        goToSlide(target, target > currentSlide ? 'next' : 'prev');
      }
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevSlide();
    }
  });

  // Mobile Touch Swipe
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  }, { passive: true });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initLiveCounter();
    initPhotoZoomInteractions();
    updateNavUI();
  });
})();
