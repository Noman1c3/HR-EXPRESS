// ===== GLOBAL NAVIGATION MENU =====
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    }));
  }

  // ===== ACTIVE PAGE LINK HIGHLIGHTING =====
  // Extract filename (e.g. "about.html") from path, default to "index.html"
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ===== ACCORDION (EXPAND/COLLAPSE) CONTROLLER =====
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  // Set initial expanded states if elements have an 'active' class by default
  document.querySelectorAll('.accordion-item.active').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (content) content.style.maxHeight = content.scrollHeight + 'px';
  });

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close other items if part of a single-expand accordion group
      const group = trigger.closest('[data-accordion-group]');
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
            const otherIcon = otherItem.querySelector('.accordion-icon');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });
      }
      
      // Toggle active classes and max-height for smooth transitions
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        if (content) content.style.maxHeight = null;
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '-';
      }
    });
  });
  
  // Re-calculate heights on window resize to prevent layout breaking
  window.addEventListener('resize', () => {
    document.querySelectorAll('.accordion-item.active .accordion-content').forEach(content => {
      content.style.maxHeight = content.scrollHeight + 'px';
    });
  });
});

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.newsletter-form');
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzClEjePs1U1OvoBiL14KiuLpbWcOuuy6dY0X7MVng6syVhb3wDyolV0wjE8GJiTJTE/exec";

  forms.forEach(form => {
    // Remove the inline onsubmit attribute if it exists
    form.removeAttribute('onsubmit');
    
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      const email = emailInput.value.trim();
      if (!email) return;
      
      submitBtn.textContent = 'Signing up...';
      submitBtn.disabled = true;
      
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email)
      })
      .then(response => {
        // Because of Google Apps Script redirects, response might be opaque or redirect
        return response.json();
      })
      .then(data => {
        if (data.status === 'already_subscribed') {
          submitBtn.textContent = 'Already Subscribed';
          submitBtn.style.backgroundColor = '#facc15'; // yellow
          submitBtn.style.color = '#000';
        } else {
          submitBtn.textContent = 'Subscribed!';
          submitBtn.style.backgroundColor = 'var(--lime-500)';
          submitBtn.style.color = 'var(--navy-900)';
        }
        emailInput.value = '';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style = '';
        }, 4000);
      })
      .catch(error => {
        console.error('Error:', error);
        submitBtn.textContent = 'Error';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  });
});

// ── Review Carousel ────────────────────────────────────────────────
(function() {
  const track  = document.getElementById('reviewTrack');
  const dots   = document.querySelectorAll('.review-dot');
  const prev   = document.getElementById('reviewPrev');
  const next   = document.getElementById('reviewNext');
  if (!track) return;

  const total  = track.children.length;
  let current  = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  startAuto();
})();
