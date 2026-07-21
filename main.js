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
