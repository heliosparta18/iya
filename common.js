/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - SHARED CORE SCRIPT (COMMON.JS)
 * Audio Engine, Particle Physics, Portal Navigation & Data Synchronization
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER CONTEXT (LIGHTWEIGHT WEB AUDIO API) ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.08) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio synthesis errors gracefully
    }
  }

  function playChime(freq = 520, duration = 0.1) {
    playTone(freq, duration, 'triangle', 0.08);
  }

  function playSuccessFanfare() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'triangle', 0.09);
      }, idx * 85);
    });
  }

  function playSealPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  }

  // --- BACKGROUND MUSIC MANAGER (MAGNOLIA.MP3) ---
  const STORAGE_KEY_MUSIC = 'anniv_music_playing_v4';
  let bgAudio = null;
  let isMusicPlaying = false;

  function initMusicPlayer() {
    bgAudio = document.getElementById('bg-audio');
    if (!bgAudio) {
      bgAudio = document.createElement('audio');
      bgAudio.id = 'bg-audio';
      bgAudio.src = 'magnolia.mp3';
      bgAudio.preload = 'auto';
      bgAudio.loop = true;
      document.body.appendChild(bgAudio);
    }

    const audioToggleBtn = document.getElementById('audio-toggle-btn');

    // Check if music was playing in previous page / session
    const savedMusicState = localStorage.getItem(STORAGE_KEY_MUSIC);
    if (savedMusicState === 'true') {
      tryStartMusic();
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
      });
    }

    // Auto-resume audio on first user gesture if it was previously playing
    const gestureResume = () => {
      if (localStorage.getItem(STORAGE_KEY_MUSIC) === 'true' && !isMusicPlaying) {
        tryStartMusic();
      }
      window.removeEventListener('click', gestureResume);
      window.removeEventListener('touchstart', gestureResume);
    };
    window.addEventListener('click', gestureResume, { once: true });
    window.addEventListener('touchstart', gestureResume, { once: true });
  }

  function tryStartMusic() {
    if (!bgAudio) return;
    bgAudio.volume = 0.8;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        localStorage.setItem(STORAGE_KEY_MUSIC, 'true');
        updateMusicUI();
      }).catch(err => {
        console.log('Audio autoplay prevented, waiting for user gesture.');
        isMusicPlaying = false;
        updateMusicUI();
      });
    }
  }

  function toggleMusic() {
    if (!bgAudio) return;
    if (isMusicPlaying) {
      bgAudio.pause();
      isMusicPlaying = false;
      localStorage.setItem(STORAGE_KEY_MUSIC, 'false');
      playChime(380, 0.08);
    } else {
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        localStorage.setItem(STORAGE_KEY_MUSIC, 'true');
        playChime(620, 0.08);
      }).catch(err => {
        console.warn('Playback error', err);
      });
    }
    updateMusicUI();
  }

  function updateMusicUI() {
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    if (audioToggleBtn) {
      const icon = audioToggleBtn.querySelector('i');
      if (isMusicPlaying) {
        audioToggleBtn.classList.remove('is-muted');
        if (icon) icon.className = 'fa-solid fa-volume-high';
        audioToggleBtn.title = 'Jeda Musik (Magnolia)';
      } else {
        audioToggleBtn.classList.add('is-muted');
        if (icon) icon.className = 'fa-solid fa-volume-xmark';
        audioToggleBtn.title = 'Putar Musik (Magnolia)';
      }
    }
  }

  // --- LIGHTWEIGHT ROSE PETAL & FIREFLY CANVAS ENGINE ---
  function initPetalCanvas() {
    const petalCanvas = document.getElementById('petal-canvas');
    if (!petalCanvas || !petalCanvas.getContext) return;
    const ctx = petalCanvas.getContext('2d');
    if (!ctx) return;

    let width = (petalCanvas.width = window.innerWidth);
    let height = (petalCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = petalCanvas.width = window.innerWidth;
      height = petalCanvas.height = window.innerHeight;
    });

    const petals = [];
    const petalCount = 26; // Silky smooth 60 FPS

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
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.8, this.size * 1.1, -this.size * 0.2, 0, this.size);
        ctx.bezierCurveTo(-this.size * 1.1, -this.size * 0.2, -this.size * 0.5, -this.size * 0.8, 0, 0);

        if (this.colorType > 0.6) {
          ctx.fillStyle = `rgba(198, 139, 89, ${this.opacity})`;  // Caramel
        } else if (this.colorType > 0.3) {
          ctx.fillStyle = `rgba(140, 83, 60, ${this.opacity})`;   // Cinnamon Mocha
        } else {
          ctx.fillStyle = `rgba(229, 169, 101, ${this.opacity})`; // Warm Amber
        }

        ctx.fill();
        ctx.restore();
      }
    }

    // Fireflies / Amber Sparkles
    const fireflies = [];
    for (let i = 0; i < 20; i++) {
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

      // Render Fireflies
      fireflies.forEach(f => {
        f.y += f.speedY;
        f.x += f.speedX;
        f.alpha += f.alphaSpeed;

        if (f.alpha > 0.85 || f.alpha < 0.15) {
          f.alphaSpeed = -f.alphaSpeed;
        }

        if (f.y < -10) f.y = height + 10;
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        ctx.save();
        ctx.fillStyle = `rgba(229, 169, 101, ${Math.max(0, f.alpha)})`;
        ctx.shadowColor = '#E5A965';
        ctx.shadowBlur = 8;

        if (f.isStar) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(253, 246, 238, ${Math.max(0, f.alpha * 0.8)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(f.x - f.glintSize, f.y);
          ctx.lineTo(f.x + f.glintSize, f.y);
          ctx.moveTo(f.x, f.y - f.glintSize);
          ctx.lineTo(f.x, f.y + f.glintSize);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Render Petals
      petals.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // --- FLOATING CLICK HEARTS ---
  function initClickHearts() {
    window.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('a')) return;

      const heart = document.createElement('div');
      const icons = ['🤎', '✨', '☕', '🍂', '🤍'];
      heart.textContent = icons[Math.floor(Math.random() * icons.length)];
      heart.className = 'floating-click-particle';
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.fontSize = `${Math.random() * 10 + 18}px`;

      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translate(-50%, -85px) scale(${Math.random() * 0.4 + 1.1}) rotate(${(Math.random() - 0.5) * 40}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 850);
    });
  }

  // --- UNIVERSAL PORTAL TELEPORTATION MODAL CONTROLLER ---
  function initPortalModal() {
    const modal = document.getElementById('portal-teleport-modal');
    if (!modal) return;

    const openTriggers = document.querySelectorAll('.portal-teleport-trigger-btn, [data-open-portal]');
    const closeBtn = document.getElementById('portal-modal-close-btn');

    openTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPortalModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closePortalModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePortalModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closePortalModal();
      }
    });
  }

  function openPortalModal() {
    const modal = document.getElementById('portal-teleport-modal');
    if (modal) {
      modal.classList.add('active');
      playChime(640, 0.12);
    }
  }

  function closePortalModal() {
    const modal = document.getElementById('portal-teleport-modal');
    if (modal) {
      modal.classList.remove('active');
      playChime(420, 0.08);
    }
  }

  // --- DATA SYNCHRONIZATION (CUSTOM TEXTS & PHOTOS FROM LOCALSTORAGE) ---
  const STORAGE_KEY_TEXT = 'anniv_custom_texts_v4';
  const STORAGE_KEY_PHOTOS = 'anniv_custom_photos_v4';

  function loadCustomizations() {
    try {
      const savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');
      for (const key in savedTexts) {
        const els = document.querySelectorAll(`.editable-text[data-key="${key}"]`);
        els.forEach(el => {
          if (key === 'slide1_title' && savedTexts[key]) {
            let val = savedTexts[key];
            if (!val.includes('title-primary')) {
              const tmp = document.createElement('div');
              tmp.innerHTML = val;
              const plain = (tmp.innerText || tmp.textContent || val).trim();
              if (plain.includes(',')) {
                const parts = plain.split(',');
                val = `<span class="title-primary">${parts[0].trim()}</span> <span class="title-accent">${parts.slice(1).join(',').trim()}</span>`;
              } else {
                const words = plain.split(' ');
                if (words.length > 2) {
                  const last = words.pop();
                  val = `<span class="title-primary">${words.join(' ')}</span> <span class="title-accent">${last}</span>`;
                } else {
                  val = `<span class="title-primary">${plain}</span>`;
                }
              }
            }
            el.innerHTML = val;
          } else {
            el.innerHTML = savedTexts[key];
          }
        });
      }
    } catch (e) {
      console.warn('Error loading custom texts', e);
    }

    try {
      const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
      for (const id in savedPhotos) {
        const imgs = document.querySelectorAll(`.gallery-photo[data-photo-id="${id}"]`);
        imgs.forEach(img => {
          img.src = savedPhotos[id];
        });
      }
    } catch (e) {
      console.warn('Error loading custom photos', e);
    }
  }

  // --- INITIALIZE ALL CORE SYSTEMS ---
  document.addEventListener('DOMContentLoaded', () => {
    initPetalCanvas();
    initMusicPlayer();
    initClickHearts();
    initPortalModal();
    loadCustomizations();
  });

  // Export Core API to Window for page-specific controllers
  window.AnnivCore = {
    playChime,
    playSuccessFanfare,
    playSealPopSound,
    tryStartMusic,
    toggleMusic,
    openPortalModal,
    closePortalModal,
    loadCustomizations,
    STORAGE_KEY_TEXT,
    STORAGE_KEY_PHOTOS
  };
})();
