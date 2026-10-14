/**
 * ============================================================================
 * HAPPY 4TH ANNIVERSARY - EDITOR SCRIPT (EDITOR.JS)
 * Photo Dump Customizer & Live Typography Manager
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY_TEXT = 'anniv_custom_texts_v4';
  const STORAGE_KEY_PHOTOS = 'anniv_custom_photos_v4';

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const saveBtn = document.getElementById('save-editor-btn');
  const resetBtn = document.getElementById('reset-defaults-btn');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');

      if (window.AnnivCore && window.AnnivCore.playChime) {
        window.AnnivCore.playChime(540, 0.08);
      }
    });
  });

  // Populate inputs with current / saved data
  function populateForm() {
    let savedTexts = {};
    try {
      savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');
    } catch (e) {}

    const inputTitle = document.getElementById('input-slide1-title');
    const inputQuote = document.getElementById('input-slide1-quote');
    const inputName = document.getElementById('input-partner-name');
    const inputLetter = document.getElementById('input-letter');

    if (inputTitle) {
      const rawTitle = savedTexts['slide1_title'] || 'Happy 4th Anniversary, Sayangku';
      const tmpDiv = document.createElement('div');
      tmpDiv.innerHTML = rawTitle;
      inputTitle.value = tmpDiv.innerText || tmpDiv.textContent || 'Happy 4th Anniversary, Sayangku';
    }
    if (inputQuote) {
      inputQuote.value = savedTexts['slide1_quote'] || '"Empat tahun bukan sekadar perayaan angka, tapi bukti ribuan alasan kenapa aku selalu memilihmu setiap hari."';
    }
    if (inputName) {
      inputName.value = savedTexts['partner_name'] || 'Selalu Mencintaimu • 10.11.2021 ∞';
    }
    if (inputLetter) {
      inputLetter.value = savedTexts['love_letter_content'] || `Selamat ulang tahun hubungan kita yang ke-4 tahun, sayang. Melihat ke belakang, rasanya baru kemarin kita canggung mengobrol di awal pertemuan. Tapi hari ini, kamu sudah menjadi bagian paling penting dan rumah paling tenang dalam hidupku.

Terima kasih telah bertahan di saat sulit, terima kasih sudah selalu tersenyum bahkan di hari-hari yang melelahkan, dan terima kasih telah mencintaiku dengan tulus dan tanpa syarat.

Aku berjanji akan terus belajar menjadi pasangan yang lebih baik, menjaga hatimu, mendengarkan ceritamu, dan menggenggam tanganmu di setiap perjalanan yang akan kita tempuh di masa depan.

I love you today, tomorrow, and forever and always. ❤️`;
    }

    // Populate photo previews
    let savedPhotos = {};
    try {
      savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
    } catch (e) {}

    const defaultPhotos = {
      p1: 'foto3.jpg', p2: 'foto2.jpg', p3: 'foto4.jpg',
      p4: 'foto6.jpg', p5: 'foto5.jpg', p6: 'foto1.jpg',
      p7: 'foto10.jpg', p8: 'foto7.jpg', p9: 'foto9.jpg',
      p10: 'foto8.jpg', p11: 'foto11.jpg', p12: 'foto10.jpg', p13: 'foto13.jpg'
    };

    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'].forEach(id => {
      const preview = document.getElementById(`preview-${id}`);
      if (preview) {
        preview.src = savedPhotos[id] || defaultPhotos[id];
      }
    });
  }

  // File Upload Handlers
  document.querySelectorAll('.file-uploader').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const targetId = input.getAttribute('data-target');
      if (file && targetId) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotoPreview(targetId, event.target.result);
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
        setPhotoPreview(targetId, url);
      }
    });
  });

  function setPhotoPreview(id, src) {
    const preview = document.getElementById(`preview-${id}`);
    if (preview) {
      preview.src = src;
    }
  }

  // Save Changes
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const rawTitleInput = document.getElementById('input-slide1-title').value.trim();
      let formattedTitle = rawTitleInput;
      if (!rawTitleInput.includes('<span')) {
        if (rawTitleInput.includes(',')) {
          const parts = rawTitleInput.split(',');
          formattedTitle = `<span class="title-primary">${parts[0].trim()}</span> <span class="title-accent">${parts.slice(1).join(',').trim()}</span>`;
        } else {
          const words = rawTitleInput.split(' ');
          if (words.length > 2) {
            const last = words.pop();
            formattedTitle = `<span class="title-primary">${words.join(' ')}</span> <span class="title-accent">${last}</span>`;
          } else {
            formattedTitle = `<span class="title-primary">${rawTitleInput}</span>`;
          }
        }
      }

      const texts = {
        slide1_title: formattedTitle,
        slide1_quote: document.getElementById('input-slide1-quote').value,
        partner_name: document.getElementById('input-partner-name').value,
        love_letter_content: document.getElementById('input-letter').value
      };

      const photos = {};
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'].forEach(id => {
        const preview = document.getElementById(`preview-${id}`);
        if (preview && preview.src) {
          photos[id] = preview.src;
        }
      });

      localStorage.setItem(STORAGE_KEY_TEXT, JSON.stringify(texts));
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));

      showToast('Perubahan tersimpan dengan aman! 🤎');

      if (window.AnnivCore && window.AnnivCore.playSuccessFanfare) {
        window.AnnivCore.playSuccessFanfare();
      }
    });
  }

  // Reset to defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin mengembalikan semua teks dan foto ke pengaturan awal?')) {
        localStorage.removeItem(STORAGE_KEY_TEXT);
        localStorage.removeItem(STORAGE_KEY_PHOTOS);
        populateForm();
        showToast('Semua teks & foto kembali ke awal ✨');

        if (window.AnnivCore && window.AnnivCore.playChime) {
          window.AnnivCore.playChime(420, 0.15);
        }
      }
    });
  }

  function showToast(msg) {
    const existing = document.querySelector('.editor-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'editor-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    populateForm();
  });
})();
