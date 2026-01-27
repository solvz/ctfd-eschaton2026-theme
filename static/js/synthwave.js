/**
 * Synthwave Theme - Lightweight Interactive Effects
 * Minimal JS for button ripples only (no canvas animations)
 */

(function () {
  'use strict';

  function init() {
    initPersistentBackground();
    initInteractiveElements();
  }

  function initPersistentBackground() {
    // Persistent background animation hack
    try {
      let startTime = sessionStorage.getItem('synthwave_start_time');
      if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('synthwave_start_time', startTime);
      }

      const elapsed = Date.now() - parseInt(startTime, 10);

      // Calculate negative delays to "fast forward" the animation
      // glowBreath is approx 8s, riseStars is approx 12s
      const delayGlow = -(elapsed % 8000);
      const delayStars = -(elapsed % 12000);

      const style = document.createElement('style');
      style.textContent = `
        .synth-bg::before { animation-delay: ${delayGlow}ms !important; }
        .synth-bg::after { animation-delay: ${delayStars}ms !important; }
      `;
      document.head.appendChild(style);
    } catch (e) {
      console.log('Session storage not available for background persistence');
    }
  }

  function initInteractiveElements() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', createRipple);
    });

    // Re-init for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const buttons = node.querySelectorAll ? node.querySelectorAll('.btn') : [];
            buttons.forEach(btn => btn.addEventListener('click', createRipple));
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple-effect 0.6s ease-out;
    `;

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // Add ripple animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
