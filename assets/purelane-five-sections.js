/* Purelane five-section behavior. Load once in assets/theme.js or a dedicated asset. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-pl-hero-rotator]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.pl-hero-slide'));
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-slide-button]'));
    if (slides.length < 2) return;

    var index = 0, timer = null;
    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      buttons.forEach(function (button, i) {
        var active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function play() {
      if (reduce || timer) return;
      timer = window.setInterval(function () { go(index + 1); }, 3800);
    }

    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () {
        stop(); go(i); play();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play();
          else stop();
        });
      }, { threshold: 0.2 }).observe(root);
    } else {
      play();
    }
  });
})();
