/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - SCRIPT CONTROLLER
 * Full Presentation Choreography, Rose Petal Physics, Gate PIN Unlock,
 * Web Audio Romantic Melody, Live Love Counter & Customization Engine.
 * ============================================================================
 */

(function () {
  'use strict';

  // --- CONFIGURATION & STATE ---
  const ANNIV_DATE = new Date('2021-11-10T00:00:00');

  let currentSlide = 1;
  const totalSlides = 5;
  let isTransitioning = false;
  let isUnlocked = false;
  let isMusicPlaying = false;
  let isGateTransitioning = false;

  // --- DOM ELEMENTS ---
  const gateScreen = document.getElementById('gate-screen');
  const mainExperience = document.getElementById('main-experience');
  const flowerGateCurtain = document.getElementById('flower-gate-curtain');
  const openGateBtn = document.getElementById('open-gate-btn');

  const prevSlideBtn = document.getElementById('prev-slide-btn');
  const nextSlideBtn = document.getElementById('next-slide-btn');
  const dotButtons = document.querySelectorAll('.dot-btn');
  const slideCounterDisplay = document.getElementById('slide-number-display');
  const slides = document.querySelectorAll('.slide-item');

  const daysVal = document.getElementById('days-val');
  const hoursVal = document.getElementById('hours-val');
  const minutesVal = document.getElementById('minutes-val');
  const secondsVal = document.getElementById('seconds-val');

  const musicToggle = document.getElementById('music-toggle');
  const currentSongTitle = document.getElementById('current-song-title');

  const openLetterBtn = document.getElementById('open-letter-btn');
  const readLoveLetterBtn2 = document.getElementById('read-love-letter-btn2');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const letterModal = document.getElementById('letter-modal');

  const openEditModalBtn = document.getElementById('open-edit-modal');
  const closeEditBtn = document.getElementById('close-edit-btn');
  const editModal = document.getElementById('edit-modal');
  const triggerConfettiBtn = document.getElementById('trigger-confetti-btn');

  const petalCanvas = document.getElementById('petal-canvas');

  // ==========================================================================
  // 1. GERBANG BUNGA PEMBUKA (FLORAL CURTAIN TRANSITION KE WEB UTAMA)
  // ==========================================================================
  function openGateWithFlowerTransition() {
    if (isUnlocked || isGateTransitioning) return;
    isGateTransitioning = true;

    // Putar lagu magnolia.mp3 segera dari sentuhan tombol "Buka Pintu Kenangan"
    startRomanticAudio();

    // 1. Siapkan tirai di layer GPU & mulai animasi meluncur dari tepi luar secara mulus
    if (flowerGateCurtain) {
      flowerGateCurtain.style.display = 'block';
      flowerGateCurtain.classList.remove('opening');
      flowerGateCurtain.classList.add('active');

      // Double rAF memastikan browser mengecat frame awal di tepi layar sebelum transisi berjalan
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flowerGateCurtain.classList.add('closing');
        });
      });
    }

    // 2. Tirai menutup secara anggun (0.75s) lalu berhenti sejenak di tengah (~0.35s)
    setTimeout(() => {
      isUnlocked = true;
      if (gateScreen) gateScreen.style.display = 'none';
      if (mainExperience) {
        mainExperience.classList.remove('hidden');
        mainExperience.style.opacity = '1';
      }
      initLiveCounter();

      // 3. Setelah konten utama siap di belakang tirai, tirai membuka kembali ke samping secara manis
      setTimeout(() => {
        if (flowerGateCurtain) {
          flowerGateCurtain.classList.remove('closing');
          flowerGateCurtain.classList.add('opening');
        }

        // 4. Setelah tirai terbuka penuh, bersihkan overlay transisi
        setTimeout(() => {
          if (flowerGateCurtain) {
            flowerGateCurtain.classList.remove('active', 'opening');
            flowerGateCurtain.style.display = 'none';
          }
          isGateTransitioning = false;
        }, 900);
      }, 350);
    }, 850);
  }

  // HANYA tombol "Buka Pintu Kenangan" yang dapat membuka gerbang
  if (openGateBtn) {
    openGateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openGateWithFlowerTransition();
    });
  }

  // Physical Keyboard Support (Tombol Enter saat di gerbang)
  window.addEventListener('keydown', (e) => {
    if (!isUnlocked) {
      if (e.key === 'Enter') {
        openGateWithFlowerTransition();
      }
    } else {
      // Presentation Slides Controls
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      }
    }
  });

  // ==========================================================================
  // 2. PRESENTATION SLIDES & DYNAMIC MOTION (A -> B PADA TRANSISI, IDLE DIEM)
  // ==========================================================================
  function goToSlide(targetIndex, direction = 'next') {
    if (isTransitioning || targetIndex === currentSlide || targetIndex < 1 || targetIndex > totalSlides) {
      return;
    }

    isTransitioning = true;
    const currentSlideEl = document.querySelector(`.slide-item[data-slide="${currentSlide}"]`);
    const nextSlideEl = document.querySelector(`.slide-item[data-slide="${targetIndex}"]`);

    const leaveClass = direction === 'next' ? 'leaving-to-next' : 'leaving-to-prev';
    const enterClass = direction === 'next' ? 'entering-from-next' : 'entering-from-prev';

    // Reset any enlarged photo focus on slide change
    resetAllPhotoFocus();

    // 1. Initiate choreographed motion out on current slide
    currentSlideEl.classList.add(leaveClass);

    // 2. Prepare incoming slide
    if (nextSlideEl) nextSlideEl.scrollTop = 0;
    nextSlideEl.classList.add(enterClass, 'active');

    // Soft motion chime
    playChime(direction === 'next' ? 620 : 480, 0.12);

    // Update dots & UI indicators immediately
    updateIndicators(targetIndex);

    // 3. Complete transition and restore calm resting state ("diem")
    setTimeout(() => {
      currentSlideEl.classList.remove('active', leaveClass, 'leaving-to-next', 'leaving-to-prev');
      nextSlideEl.classList.remove(enterClass, 'entering-from-next', 'entering-from-prev');
      currentSlide = targetIndex;
      isTransitioning = false;

      // Climax effect on slide 5
      if (currentSlide === 5) {
        triggerGrandConfetti();
      }
    }, 850);
  }

  function goToNextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1, 'next');
    } else {
      // Loop to beginning or celebratory loop
      goToSlide(1, 'next');
    }
  }

  function goToPrevSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1, 'prev');
    } else {
      goToSlide(totalSlides, 'prev');
    }
  }

  function updateIndicators(index) {
    dotButtons.forEach(dot => {
      if (parseInt(dot.getAttribute('data-goto')) === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (slideCounterDisplay) {
      slideCounterDisplay.textContent = `Slide ${index} / ${totalSlides}`;
    }

    if (nextSlideBtn) {
      const nextBtnText = nextSlideBtn.querySelector('span');
      if (nextBtnText) {
        nextBtnText.textContent = index === totalSlides ? 'Ulangi Cerita 🌸' : 'Lanjut Cerita';
      }
    }
  }

  if (nextSlideBtn) nextSlideBtn.addEventListener('click', goToNextSlide);
  if (prevSlideBtn) prevSlideBtn.addEventListener('click', goToPrevSlide);

  dotButtons.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-goto'));
      if (target > currentSlide) {
        goToSlide(target, 'next');
      } else if (target < currentSlide) {
        goToSlide(target, 'prev');
      }
    });
  });

  // Touch Swipe Gesture Navigation (Mobile Friendly)
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isUnlocked) return;
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide(); // Swiped left -> next
      } else {
        goToPrevSlide(); // Swiped right -> prev
      }
    }
  }, { passive: true });

  // ==========================================================================
  // 2.5 INTERACTIVE PHOTO INSPECTION & FOCUS TRANSITIONS
  // Efek klik foto memperbesar (b besar), klik foto lain (a kecil, b besar)
  // ==========================================================================
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
        // Prevent trigger if user is double clicking editable caption in editor mode
        if (e.target.classList.contains('editable-text') && e.detail > 1) return;

        const comp = photo.closest('.photo-composition');
        const isAlreadyFocused = photo.classList.contains('photo-focused');

        if (!isAlreadyFocused) {
          // If another photo was enlarged (a), remove focus so it shrinks smoothly
          document.querySelectorAll('.motion-photo.photo-focused').forEach(p => {
            p.classList.remove('photo-focused');
          });

          // Enlarge the newly clicked photo (b) with smooth transition
          photo.classList.add('photo-focused');
          if (comp) comp.classList.add('has-focused-photo');
          playChime(640, 0.08);
        } else {
          // If clicked again, shrink back to normal
          resetAllPhotoFocus();
          playChime(430, 0.06);
        }
      });
    });

    // Reset when clicking background outside photos
    document.querySelectorAll('.slide-content-grid').forEach(grid => {
      grid.addEventListener('click', (e) => {
        if (!e.target.closest('.motion-photo')) {
          resetAllPhotoFocus();
        }
      });
    });
  }

  initPhotoZoomInteractions();

  // ==========================================================================
  // 3. REALTIME LOVE COUNTER (SINCE 10 NOVEMBER 2021)
  // ==========================================================================
  function initLiveCounter() {
    function updateCounter() {
      const now = new Date();
      const diffMs = now.getTime() - ANNIV_DATE.getTime();

      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (daysVal) daysVal.textContent = days.toLocaleString();
        if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
        if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
        if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
      }
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // ==========================================================================
  // 4. ROMANTIC MUSIC PLAYER (MAGNOLIA.MP3)
  // ==========================================================================
  const bgAudio = document.getElementById('bg-audio');

  function startRomanticAudio() {
    if (!bgAudio) return;
    bgAudio.src = 'magnolia.mp3';
    bgAudio.loop = true;
    bgAudio.volume = 0.8;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicButtonState();
      }).catch(err => {
        console.warn('Audio waiting for user gesture:', err);
        isMusicPlaying = false;
        updateMusicButtonState();
      });
    }
  }

  function stopRomanticAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    isMusicPlaying = false;
    updateMusicButtonState();
  }

  function updateMusicButtonState() {
    if (!musicToggle) return;
    const icon = musicToggle.querySelector('i');
    if (isMusicPlaying) {
      if (icon) icon.className = 'fa-solid fa-volume-high';
      musicToggle.style.color = '#FFF';
      if (currentSongTitle) currentSongTitle.textContent = 'Magnolia 🎵';
    } else {
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
      musicToggle.style.color = 'rgba(255,255,255,0.4)';
      if (currentSongTitle) currentSongTitle.textContent = 'Musik Dijeda';
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        stopRomanticAudio();
      } else {
        startRomanticAudio();
      }
    });
  }

  // Audio Context for subtle sound chimes
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', volume = 0.12) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  function playChime(freq = 520, duration = 0.2) {
    playTone(freq, duration, 'triangle', 0.14);
  }

  function playSuccessFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.45, 'sine', 0.18);
      }, i * 110);
    });
  }

  function playSealPopSound() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      setTimeout(() => playTone(720, 0.1, 'sine', 0.12), 40);
    } catch (e) {}
  }

  function playPaperRustleSound() {
    try {
      const ctx = getAudioContext();
      const bufferSize = Math.floor(ctx.sampleRate * 0.3); // 300ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(1.6, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
    } catch (e) {}
  }

  function playUnfoldChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'triangle', 0.1);
      }, idx * 90);
    });
  }

  // ==========================================================================
  // 5. LIGHTWEIGHT ROSE PETAL & FIREFLY PARTICLE ENGINE (CANVAS 60FPS)
  // ==========================================================================
  function initPetalCanvas() {
    if (!petalCanvas) return;
    const ctx = petalCanvas.getContext('2d');
    let width = (petalCanvas.width = window.innerWidth);
    let height = (petalCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = petalCanvas.width = window.innerWidth;
      height = petalCanvas.height = window.innerHeight;
    });

    const petals = [];
    const petalCount = 28; // Optimized for silky smooth performance

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 1.4;
        this.angle = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 2;
        this.wobble = Math.random() * 2 * Math.PI;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.opacity = Math.random() * 0.4 + 0.45;
        this.colorType = Math.random();
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 1.2 + this.speedX;
        this.y += this.speedY;
        this.angle += this.rotSpeed;

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.scale(Math.cos(this.wobble), 1);

        ctx.beginPath();
        // Rose Petal Organic Curve
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.8, this.size * 1.1, -this.size * 0.2, 0, this.size);
        ctx.bezierCurveTo(-this.size * 1.1, -this.size * 0.2, -this.size * 0.5, -this.size * 0.8, 0, 0);

        if (this.colorType > 0.6) {
          ctx.fillStyle = `rgba(198, 139, 89, ${this.opacity})`;  // Warm Caramel
        } else if (this.colorType > 0.3) {
          ctx.fillStyle = `rgba(140, 83, 60, ${this.opacity})`;   // Cinnamon Mocha
        } else {
          ctx.fillStyle = `rgba(229, 169, 101, ${this.opacity})`; // Warm Golden Latte
        }

        ctx.fill();
        ctx.restore();
      }
    }

    // Champagne Starlight & Diamond Bokeh Sparkles
    const fireflies = [];
    for (let i = 0; i < 22; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.35,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.015 + 0.008,
        isStar: Math.random() > 0.45,
        glintSize: Math.random() * 4 + 3
      });
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw Champagne Starlight & Twinkling Sparkles
      fireflies.forEach(f => {
        f.y += f.speedY;
        f.x += f.speedX;
        f.alpha += f.alphaSpeed;
        if (f.alpha > 1 || f.alpha < 0.15) f.alphaSpeed = -f.alphaSpeed;

        if (f.y < -12) f.y = height + 12;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;

        // Core soft glowing ember
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 238, 198, ${f.alpha * 0.85})`;
        ctx.shadowColor = 'rgba(229, 169, 101, 0.95)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Elegant 4-pointed diamond glint when particle shines bright
        if (f.isStar && f.alpha > 0.55) {
          const glintAlpha = (f.alpha - 0.55) * 1.8;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 248, 225, ${glintAlpha})`;
          ctx.lineWidth = 0.8;
          // Horizontal beam
          ctx.moveTo(f.x - f.glintSize, f.y);
          ctx.lineTo(f.x + f.glintSize, f.y);
          // Vertical beam
          ctx.moveTo(f.x, f.y - f.glintSize);
          ctx.lineTo(f.x, f.y + f.glintSize);
          ctx.stroke();
        }
      });

      // Draw petals
      petals.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  initPetalCanvas();

  // ==========================================================================
  // 6. CONFETTI CANNONS & CELEBRATIONS
  // ==========================================================================
  function triggerGrandConfetti() {
    if (typeof confetti !== 'function') return;

    // Elegant warm brown, caramel, latte & champagne confetti
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
      playSuccessFanfare();
    });
  }

  // Floating Heart on Click / Tap Anywhere (Hanya setelah web utama terbuka, tidak di transisi gerbang)
  window.addEventListener('click', (e) => {
    if (!isUnlocked || isGateTransitioning) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.modal-backdrop')) return;

    createClickHeart(e.clientX, e.clientY);
  });

  function createClickHeart(x, y) {
    const heart = document.createElement('div');
    const icons = ['🤎', '✨', '☕', '🍂', '🤍'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.pointerEvents = 'none';
    heart.style.fontSize = `${Math.random() * 12 + 18}px`;
    heart.style.zIndex = '9999';
    heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
    heart.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    heart.style.opacity = '1';

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(-50%, -80px) scale(${Math.random() * 0.4 + 1.1}) rotate(${(Math.random() - 0.5) * 40}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 850);
  }

  // ==========================================
  // 7. MODALS: LOVE LETTER (MODEL AMPLOP & KERTAS MENGINTIP) & CUSTOM EDITOR
  // ==========================================
  const envelopePreviewCard = document.getElementById('envelope-preview-card');
  const letterReadingCard = document.getElementById('letter-reading-card');
  const openPaperBtn = document.getElementById('open-paper-btn');
  const envEnvelope = document.getElementById('env-envelope');
  const envPeekingCard = document.getElementById('env-peeking-card');
  const refoldLetterBtn = document.getElementById('refold-letter-btn');
  const letterTopControls = document.querySelector('.letter-top-controls');

  let letterTimeouts = [];
  let isLetterAnimating = false;

  function clearLetterTimeouts() {
    letterTimeouts.forEach(t => clearTimeout(t));
    letterTimeouts = [];
  }

  // Tampilkan Amplop Awal dengan Ujung Surat Mengintip & Tombol di Bawah
  function showEnvelopeView() {
    clearLetterTimeouts();
    isLetterAnimating = false;

    if (letterReadingCard) {
      letterReadingCard.classList.remove('is-unfolding', 'is-refolding');
      letterReadingCard.classList.add('hidden');
    }
    if (envelopePreviewCard) {
      envelopePreviewCard.classList.remove('is-leaving');
      envelopePreviewCard.style.display = 'flex';
    }
    if (envPeekingCard) {
      envPeekingCard.classList.remove('is-pulling');
    }
    if (letterTopControls) {
      letterTopControls.classList.remove('show-replay');
    }
  }

  // Animasi Menarik Surat Keluar & Membuka Kertas secara 3D
  function triggerUnfoldLetter() {
    if (isLetterAnimating) return;
    clearLetterTimeouts();
    isLetterAnimating = true;

    // 1. Suara kertas ditarik & kartu mengintip meluncur naik keluar amplop
    playPaperRustleSound();
    if (envPeekingCard) {
      envPeekingCard.classList.add('is-pulling');
    }

    // 2. Amplop memudar halus
    letterTimeouts.push(setTimeout(() => {
      if (envelopePreviewCard) {
        envelopePreviewCard.classList.add('is-leaving');
      }
    }, 280));

    // 3. Masuk ke Tampilan Surat Membuka 3D
    letterTimeouts.push(setTimeout(() => {
      if (envelopePreviewCard) {
        envelopePreviewCard.style.display = 'none';
      }
      if (letterReadingCard) {
        letterReadingCard.classList.remove('hidden', 'is-refolding');
        letterReadingCard.classList.add('is-unfolding');
      }
      playPaperRustleSound();
      playUnfoldChime();

      // Confetti kilau emas romantis
      if (typeof confetti === 'function' && letterReadingCard) {
        const rect = letterReadingCard.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height * 0.45) / window.innerHeight;
        confetti({
          particleCount: 24,
          spread: 60,
          startVelocity: 16,
          origin: { x: originX, y: originY },
          colors: ['#E5A965', '#C68B59', '#FDF6EE', '#D45D2B'],
          disableForReducedMotion: true
        });
      }
    }, 480));

    // 4. Selesai membuka penuh
    letterTimeouts.push(setTimeout(() => {
      if (letterTopControls) {
        letterTopControls.classList.add('show-replay');
      }
      isLetterAnimating = false;
    }, 1200));
  }

  // Animasi Melipat Kembali ke Amplop
  function refoldLetterToEnvelope() {
    if (isLetterAnimating) return;
    clearLetterTimeouts();
    isLetterAnimating = true;

    playPaperRustleSound();

    if (letterTopControls) {
      letterTopControls.classList.remove('show-replay');
    }

    // 1. Kertas melipat kembali (animasi refold)
    if (letterReadingCard) {
      letterReadingCard.classList.remove('is-unfolding');
      letterReadingCard.classList.add('is-refolding');
    }

    // 2. Kembalikan ke tampilan amplop dengan ujung mengintip
    letterTimeouts.push(setTimeout(() => {
      showEnvelopeView();
      playTone(560, 0.12, 'sine', 0.1);
    }, 520));
  }

  function openSecretLetterModal() {
    if (!letterModal) return;
    clearLetterTimeouts();
    showEnvelopeView();
    letterModal.classList.remove('hidden');
    playChime(520, 0.15);
  }

  function closeSecretLetterModal() {
    if (!letterModal) return;
    clearLetterTimeouts();
    isLetterAnimating = false;
    letterModal.classList.add('hidden');
    showEnvelopeView();
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    playChime(500, 0.1);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
  }

  // Event Listeners for Letter
  if (openLetterBtn) openLetterBtn.addEventListener('click', openSecretLetterModal);
  if (readLoveLetterBtn2) readLoveLetterBtn2.addEventListener('click', openSecretLetterModal);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeSecretLetterModal);

  // Tombol Buka Surat di Bawah Amplop
  if (openPaperBtn) {
    openPaperBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnfoldLetter();
    });
  }

  // Klik langsung pada amplop / ujung kertas juga membuka surat
  if (envEnvelope) {
    envEnvelope.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnfoldLetter();
    });
  }

  // Tombol Lipat Kembali ke Amplop
  if (refoldLetterBtn) {
    refoldLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      refoldLetterToEnvelope();
    });
  }

  // Modal Backdrop Click
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        closeSecretLetterModal();
      }
    });
  }

  // Edit Modal controls
  if (openEditModalBtn) openEditModalBtn.addEventListener('click', () => {
    syncInputsFromDOM();
    openModal(editModal);
  });
  if (closeEditBtn) closeEditBtn.addEventListener('click', () => closeModal(editModal));
  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeModal(editModal);
    });
  }

  // Physical ESC key to close any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (letterModal && !letterModal.classList.contains('hidden')) {
        closeSecretLetterModal();
      }
      if (editModal && !editModal.classList.contains('hidden')) {
        closeModal(editModal);
      }
    }
  });

  // Tab switching inside Editor Modal
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ==========================================================================
  // 8. CUSTOMIZATION ENGINE & LOCALSTORAGE PERSISTENCE
  // ==========================================================================
  const STORAGE_KEY_TEXT = 'anniv_custom_texts_v4';
  const STORAGE_KEY_PHOTOS = 'anniv_custom_photos_v4';

  function loadCustomizations() {
    // 1. Load Custom Texts
    try {
      const savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');
      for (const key in savedTexts) {
        const el = document.querySelector(`.editable-text[data-key="${key}"]`);
        if (el) {
          el.innerHTML = savedTexts[key];
        }
      }
    } catch (e) {
      console.warn('Failed loading custom texts', e);
    }

    // 2. Load Custom Photos
    try {
      const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
      for (const id in savedPhotos) {
        const img = document.querySelector(`.gallery-photo[data-photo-id="${id}"]`);
        if (img) {
          img.src = savedPhotos[id];
        }
      }
    } catch (e) {
      console.warn('Failed loading custom photos', e);
    }
  }

  function syncInputsFromDOM() {
    const titleEl = document.querySelector('[data-key="slide1_title"]');
    const quoteEl = document.querySelector('[data-key="slide1_quote"]');
    const nameEl = document.querySelector('[data-key="partner_name"]');
    const letterEl = document.querySelector('[data-key="love_letter_content"]');

    const inputTitle = document.getElementById('input-slide1-title');
    const inputQuote = document.getElementById('input-slide1-quote');
    const inputName = document.getElementById('input-partner-name');
    const inputLetter = document.getElementById('input-letter');

    if (titleEl && inputTitle) inputTitle.value = titleEl.innerText.trim();
    if (quoteEl && inputQuote) inputQuote.value = quoteEl.innerText.trim();
    if (nameEl && inputName) inputName.value = nameEl.innerText.trim();
    if (letterEl && inputLetter) inputLetter.value = letterEl.innerText.trim();

    // Sync Photo Previews
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'].forEach(id => {
      const img = document.querySelector(`.gallery-photo[data-photo-id="${id}"]`);
      const preview = document.getElementById(`preview-${id}`);
      if (img && preview) {
        preview.src = img.src;
      }
    });
  }

  // Handle Photo File Uploading & URL insertion
  document.querySelectorAll('.file-uploader').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const targetId = input.getAttribute('data-target');
      if (file && targetId) {
        const reader = new FileReader();
        reader.onload = (event) => {
          applyPhotoChange(targetId, event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  document.querySelectorAll('.url-uploader').forEach(input => {
    input.addEventListener('input', () => {
      const url = input.value.trim();
      const targetId = input.getAttribute('data-target');
      if (url && targetId) {
        applyPhotoChange(targetId, url);
      }
    });
  });

  function applyPhotoChange(photoId, src) {
    const img = document.querySelector(`.gallery-photo[data-photo-id="${photoId}"]`);
    const preview = document.getElementById(`preview-${photoId}`);
    if (img) img.src = src;
    if (preview) preview.src = src;

    // Save to localStorage
    try {
      const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
      savedPhotos[photoId] = src;
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(savedPhotos));
    } catch (e) {
      console.warn('Storage limit reached for photos', e);
    }
  }

  // Save Modal Changes Button
  const saveEditorBtn = document.getElementById('save-editor-btn');
  if (saveEditorBtn) {
    saveEditorBtn.addEventListener('click', () => {
      const inputTitle = document.getElementById('input-slide1-title');
      const inputQuote = document.getElementById('input-slide1-quote');
      const inputName = document.getElementById('input-partner-name');
      const inputLetter = document.getElementById('input-letter');

      const savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');

      if (inputTitle && inputTitle.value) {
        const el = document.querySelector('[data-key="slide1_title"]');
        if (el) {
          el.textContent = inputTitle.value;
          savedTexts['slide1_title'] = inputTitle.value;
        }
      }

      if (inputQuote && inputQuote.value) {
        const el = document.querySelector('[data-key="slide1_quote"]');
        if (el) {
          el.textContent = inputQuote.value;
          savedTexts['slide1_quote'] = inputQuote.value;
        }
      }

      if (inputName && inputName.value) {
        const el = document.querySelector('[data-key="partner_name"]');
        if (el) {
          el.textContent = inputName.value;
          savedTexts['partner_name'] = inputName.value;
        }
      }

      if (inputLetter && inputLetter.value) {
        const el = document.querySelector('[data-key="love_letter_content"]');
        if (el) {
          el.innerHTML = `<p>${inputLetter.value.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
          savedTexts['love_letter_content'] = el.innerHTML;
        }
      }

      localStorage.setItem(STORAGE_KEY_TEXT, JSON.stringify(savedTexts));
      closeModal(editModal);
      triggerGrandConfetti();
    });
  }

  // Reset to Defaults Button
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Kembalikan semua teks dan foto ke template asli?')) {
        localStorage.removeItem(STORAGE_KEY_TEXT);
        localStorage.removeItem(STORAGE_KEY_PHOTOS);
        location.reload();
      }
    });
  }

  // Inline Click-to-Edit Support for all `.editable-text` elements
  document.querySelectorAll('.editable-text').forEach(el => {
    el.title = 'Klik ganda untuk mengedit teks ini';
    el.addEventListener('dblclick', () => {
      el.setAttribute('contenteditable', 'true');
      el.focus();
    });

    el.addEventListener('blur', () => {
      el.removeAttribute('contenteditable');
      const key = el.getAttribute('data-key');
      if (key) {
        const savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');
        savedTexts[key] = el.innerHTML;
        localStorage.setItem(STORAGE_KEY_TEXT, JSON.stringify(savedTexts));
      }
    });
  });

  // Fallback for image load failures (e.g. offline or blocked domains)
  document.querySelectorAll('.gallery-photo').forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23C68B59"/><stop offset="100%" stop-color="%232A1A12"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g)"/><text x="50%" y="46%" font-size="64" text-anchor="middle" fill="%23FDF6EE">🤎</text><text x="50%" y="56%" font-family="sans-serif" font-size="24" text-anchor="middle" fill="%23FDF6EE" font-weight="600">4 Years of Us</text></svg>';
    });
  });

  // Initialize Customizations on Boot
  loadCustomizations();

})();
