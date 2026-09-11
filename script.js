const PASSWORD = '12092026';
const galleryImageSources = [
  '1651734787591.jpg',
  'image.png',
  'image5.jpeg',
  'image6.jpeg',
  'IMG-20220620-WA0018_1.jpg',
  'IMG-20230414-WA0050.jpg',
  'IMG-20230414-WA0051.jpg',
  'image3.jpeg'
];
const galleryCaptions = [
  'Our first memory ❤️',
  'Those college days',
  'Best moments together',
  'A beautiful memory to keep forever',
  'Laughing through every day',
  'Little moments that matter most',
  'A memory I will always cherish',
  'Forever grateful for you 💞'
];
const loader = document.querySelector('.loader');
const progressFill = document.getElementById('progressFill');
const panels = Array.from(document.querySelectorAll('.panel'));
const musicToggle = document.getElementById('musicToggle');
const birthdayAudio = document.getElementById('birthdayAudio');
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightboxButton = document.getElementById('closeLightbox');
const prevImageButton = document.getElementById('prevImage');
const nextImageButton = document.getElementById('nextImage');
const voicePopup = document.getElementById('voicePopup');
const voiceAudio = document.getElementById('voiceAudio');
const closeVoicePopupButton = document.getElementById('closeVoicePopup');
const passwordLock = document.getElementById('passwordLock');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const passwordError = document.getElementById('passwordError');
let photoCards = [];
const revealedSections = new Set(['opening']);

const showSectionSequence = (sectionId) => {
  const target = document.getElementById(sectionId);
  if (!target) return;

  revealedSections.add(sectionId);

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.style.display = revealedSections.has(panel.id) ? 'block' : 'none';
  });

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const showLoader = () => {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 700);
  });
};

const updateProgress = () => {
  let activeIndex = 0;
  const viewportMiddle = window.innerHeight * 0.42;

  panels.forEach((panel, index) => {
    const rect = panel.getBoundingClientRect();
    const panelCenter = rect.top + rect.height / 2;

    if (Math.abs(panelCenter - viewportMiddle) < Math.abs(panels[activeIndex].getBoundingClientRect().top + panels[activeIndex].getBoundingClientRect().height / 2 - viewportMiddle)) {
      activeIndex = index;
    }
  });

  const progress = ((activeIndex + 1) / panels.length) * 100;
  progressFill.style.width = `${progress}%`;
};

const revealOnScroll = () => {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const scrollToSection = (sectionId) => {
  showSectionSequence(sectionId);
};

const bindButtons = () => {
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetSection = button.getAttribute('data-scroll');
      if (targetSection) {
        scrollToSection(targetSection);
      }
    });
  });
};

const startMusic = async () => {
  try {
    birthdayAudio.src = 'audio/WhatsApp Audio 2026-09-11 at 2.57.12 PM.mpeg';
    birthdayAudio.load();
    await birthdayAudio.play();
    musicToggle.classList.add('playing');
    musicToggle.textContent = '♫';
  } catch (error) {
    console.info('Add your birthday music file in the audio folder to enable the music.');
    musicToggle.textContent = '♪';
  }
};

const toggleMusic = async () => {
  if (birthdayAudio.paused) {
    await startMusic();
  } else {
    birthdayAudio.pause();
    musicToggle.classList.remove('playing');
    musicToggle.textContent = '♫';
  }
};

const openVoicePopup = async () => {
  if (!voicePopup || !voiceAudio) return;

  voicePopup.classList.add('active');
  voicePopup.setAttribute('aria-hidden', 'false');

  try {
    voiceAudio.load();
    await voiceAudio.play();
  } catch (error) {
    console.info('Voice note audio could not autoplay. You can press play manually.');
  }
};

const closeVoicePopup = () => {
  if (!voicePopup || !voiceAudio) return;

  voicePopup.classList.remove('active');
  voicePopup.setAttribute('aria-hidden', 'true');
  voiceAudio.pause();
  voiceAudio.currentTime = 0;
};

const bindMusic = () => {
  musicToggle.addEventListener('click', toggleMusic);

  document.getElementById('openSurpriseBtn').addEventListener('click', async () => {
    document.body.classList.add('surprise-opened');

    if (!birthdayAudio.paused) {
      birthdayAudio.pause();
      musicToggle.classList.remove('playing');
      musicToggle.textContent = '♫';
    }

    await openVoicePopup();
  });

  closeVoicePopupButton.addEventListener('click', () => {
    closeVoicePopup();
    scrollToSection('message');
  });
};

const renderGallery = () => {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = galleryImageSources
    .map((src, index) => {
      const imagePath = src.startsWith('images/') ? src : `images/${src}`;
      return `
        <div class="photo-card" data-caption="${galleryCaptions[index]}">
          <div class="image-placeholder"><span>Photo ${index + 1}</span></div>
          <img src="${imagePath}" alt="${galleryCaptions[index]}" class="gallery-image" />
        </div>
      `;
    })
    .join('');

  photoCards = Array.from(document.querySelectorAll('.photo-card'));
};

const handleImageError = () => {
  photoCards.forEach((card) => {
    const image = card.querySelector('img');

    image.addEventListener('error', () => {
      card.classList.add('placeholder');
      image.style.display = 'none';
    });
  });
};

const getAvailablePhotos = () => {
  return photoCards.map((card) => ({
    node: card,
    caption: card.getAttribute('data-caption') || 'A beautiful memory',
    image: card.querySelector('img')
  }));
};

let currentPhotoIndex = 0;

const openLightbox = (index) => {
  const photos = getAvailablePhotos();
  const photo = photos[index];

  if (!photo) return;

  currentPhotoIndex = index;
  const fallbackImage = photo.image;
  const card = photo.node;

  if (card.classList.contains('placeholder')) {
    lightboxImage.src = '';
    lightboxImage.alt = 'Placeholder memory';
    lightboxImage.style.display = 'none';
    lightboxCaption.textContent = photo.caption;
  } else {
    lightboxImage.src = fallbackImage.src;
    lightboxImage.alt = fallbackImage.alt;
    lightboxImage.style.display = 'block';
    lightboxCaption.textContent = photo.caption;
  }

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
};

const updateLightbox = (direction) => {
  const photos = getAvailablePhotos();
  currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
  openLightbox(currentPhotoIndex);
};

const bindGallery = () => {
  photoCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  closeLightboxButton.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  });

  prevImageButton.addEventListener('click', () => updateLightbox(-1));
  nextImageButton.addEventListener('click', () => updateLightbox(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    if (event.key === 'ArrowLeft') {
      updateLightbox(-1);
    }

    if (event.key === 'ArrowRight') {
      updateLightbox(1);
    }
  });
};

const unlockPage = () => {
  const enteredPassword = passwordInput.value.trim();

  if (enteredPassword === PASSWORD) {
    passwordLock.classList.add('hidden');
    document.body.classList.remove('locked');
    document.body.classList.add('unlocked');
    document.body.classList.remove('surprise-opened');
    passwordError.textContent = '';
    passwordInput.value = '';
    return true;
  }

  passwordError.textContent = 'Wrong password. Please try again.';
  passwordInput.value = '';
  passwordInput.focus();
  return false;
};

const bindPasswordGate = () => {
  unlockBtn.addEventListener('click', unlockPage);
  passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      unlockPage();
    }
  });
};

const init = () => {
  renderGallery();
  bindPasswordGate();
  showLoader();
  bindButtons();
  bindMusic();
  revealOnScroll();
  updateProgress();
  handleImageError();
  bindGallery();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
};

init();
