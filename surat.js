/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - SURAT CINTA SCRIPT (SURAT.JS)
 * Realistic 3D Envelope Opening & Paper Unfolding Theater
 * ============================================================================
 */

(function () {
  'use strict';

  const envelopePreviewCard = document.getElementById('envelope-preview-card');
  const letterReadingCard = document.getElementById('letter-reading-card');
  const openPaperBtn = document.getElementById('open-paper-btn');
  const envEnvelope = document.getElementById('env-envelope');
  const refoldLetterBtn = document.getElementById('refold-letter-btn');
  const letterTopControls = document.querySelector('.letter-top-controls');

  let letterTimeouts = [];
  let isLetterAnimating = false;

  function clearLetterTimeouts() {
    letterTimeouts.forEach(t => clearTimeout(t));
    letterTimeouts = [];
  }

  // Show Envelope View (Initial state)
  function showEnvelopeView() {
    clearLetterTimeouts();
    isLetterAnimating = false;

    if (letterReadingCard) {
      letterReadingCard.classList.remove('is-unfolding', 'is-refolding');
      letterReadingCard.classList.add('hidden');
      letterReadingCard.style.display = 'none';
    }

    if (letterTopControls) {
      letterTopControls.classList.remove('show-replay');
    }

    if (envelopePreviewCard) {
      envelopePreviewCard.classList.remove('hidden', 'fade-out-preview');
      envelopePreviewCard.style.display = 'flex';
      envelopePreviewCard.style.opacity = '1';
    }
  }

  // Open & Unfold the Secret Letter Paper
  function triggerLetterUnfold() {
    if (isLetterAnimating) return;
    isLetterAnimating = true;

    if (window.AnnivCore && window.AnnivCore.playSealPopSound) {
      window.AnnivCore.playSealPopSound();
    }

    // 1. Fade out the envelope
    if (envelopePreviewCard) {
      envelopePreviewCard.classList.add('fade-out-preview');
    }

    // 2. Reveal unfolding paper
    letterTimeouts.push(setTimeout(() => {
      if (envelopePreviewCard) {
        envelopePreviewCard.style.display = 'none';
      }

      if (letterReadingCard) {
        letterReadingCard.style.display = 'flex';
        letterReadingCard.classList.remove('hidden', 'is-refolding');
        letterReadingCard.classList.add('is-unfolding');

        if (window.AnnivCore && window.AnnivCore.playChime) {
          window.AnnivCore.playChime(680, 0.2);
        }
      }

      // Show "Lipat Kembali" button
      letterTimeouts.push(setTimeout(() => {
        if (letterTopControls) {
          letterTopControls.classList.add('show-replay');
        }
        isLetterAnimating = false;
      }, 700));
    }, 280));
  }

  // Refold paper back into envelope
  function triggerLetterRefold() {
    if (isLetterAnimating) return;
    isLetterAnimating = true;

    if (window.AnnivCore && window.AnnivCore.playChime) {
      window.AnnivCore.playChime(420, 0.12);
    }

    if (letterTopControls) {
      letterTopControls.classList.remove('show-replay');
    }

    if (letterReadingCard) {
      letterReadingCard.classList.remove('is-unfolding');
      letterReadingCard.classList.add('is-refolding');
    }

    letterTimeouts.push(setTimeout(() => {
      showEnvelopeView();
      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(560, 0.08);
      }
    }, 550));
  }

  // Event Listeners
  if (openPaperBtn) openPaperBtn.addEventListener('click', triggerLetterUnfold);
  if (envEnvelope) envEnvelope.addEventListener('click', triggerLetterUnfold);
  if (refoldLetterBtn) refoldLetterBtn.addEventListener('click', triggerLetterRefold);

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    showEnvelopeView();
  });
})();
