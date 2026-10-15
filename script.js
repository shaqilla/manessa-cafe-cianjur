/**
 * Manessa Cafe & Restaurant — Core Interaction Script
 * Features: Mobile Nav, Menu Filter, Lightbox, Validation, Back to Top
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Hamburger Navigation
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNavigation');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('open');
    });

    // Close mobile nav when clicking a navigation anchor
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('open')) {
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. Active Nav Link Highlighter on Scroll
  const sections = document.querySelectorAll('main section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const targetAnchor = document.querySelector(`.primary-nav a[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (targetAnchor) targetAnchor.classList.add('active');
      }
    });
  }, { passive: true });

  // 4. Menu Filtering Logic
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  if (filterTabs.length && menuCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab accessibility & styling
        filterTabs.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const chosenCategory = tab.getAttribute('data-category');

        menuCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (chosenCategory === 'all' || chosenCategory === cardCat) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // 5. Accessible Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentGalleryIndex = 0;
  const gallerySources = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-full'),
    alt: item.querySelector('img').getAttribute('alt')
  }));

  const openLightbox = (index) => {
    currentGalleryIndex = index;
    const target = gallerySources[currentGalleryIndex];
    modalImg.src = target.src;
    modalImg.alt = target.alt;
    if (typeof lightboxModal.showModal === 'function') {
      lightboxModal.showModal();
    } else {
      lightboxModal.setAttribute('open', '');
    }
  };

  const closeLightbox = () => {
    if (typeof lightboxModal.close === 'function') {
      lightboxModal.close();
    } else {
      lightboxModal.removeAttribute('open');
    }
    modalImg.src = '';
  };

  galleryItems.forEach((btn, idx) => {
    btn.addEventListener('click', () => openLightbox(idx));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    // Backdrop click closes dialog
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (modalPrev && modalNext) {
    modalPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + gallerySources.length) % gallerySources.length;
      openLightbox(currentGalleryIndex);
    });

    modalNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % gallerySources.length;
      openLightbox(currentGalleryIndex);
    });
  }

  // 6. Interactive Contact Form with Validation
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formNotification = document.getElementById('formNotification');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.classList.add('visible');
        isValid = false;
      } else {
        nameError.classList.remove('visible');
      }

      // Validate Email (Optional, but check format if provided)
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailVal && !emailRegex.test(emailVal)) {
        emailError.classList.add('visible');
        isValid = false;
      } else {
        emailError.classList.remove('visible');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.classList.add('visible');
        isValid = false;
      } else {
        messageError.classList.remove('visible');
      }

      if (isValid) {
        // Feedback explaining state accurately
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';

        setTimeout(() => {
          formNotification.className = 'form-alert form-alert-success';
          formNotification.innerHTML = `
            <strong>Terima kasih, ${escapeHtml(nameInput.value.trim())}!</strong><br>
            Pesan Anda telah tervalidasi di antarmuka frontend ini. Untuk konfirmasi reservasi mendesak, silakan gunakan tautan WhatsApp langsung di sebelah kiri.
          `;
          formNotification.style.display = 'block';

          // Reset inputs
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim Pesan';
        }, 600);
      } else {
        formNotification.className = 'form-alert form-alert-error';
        formNotification.textContent = 'Mohon lengkapi formulir dengan benar sebelum mengirim.';
        formNotification.style.display = 'block';
      }
    });
  }

  // Helper utility to sanitize user inputs in UI feedback
  function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function(s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[s];
    });
  }

  // 7. Back to Top Button Behavior
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});