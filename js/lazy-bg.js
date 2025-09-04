// lazy-bg.js
// Lightweight utility to lazy-load background images and <img> elements.
// Usage:
// - For background images: <div class="slide" data-bg="../../images/bg.jpg"></div>
// - For images: <img data-src="../../images/photo.webp" alt="..." width="..." height="...">

(function(){
  if (!('IntersectionObserver' in window)) return; // fallback: do nothing

  function loadBg(el) {
    const url = el.dataset.bg || el.dataset.src;
    if (!url) return;
    if (el.tagName.toLowerCase() === 'img') {
      el.src = url;
      el.removeAttribute('data-src');
    } else {
      const img = new Image();
      img.onload = function(){
        el.style.backgroundImage = `url('${url}')`;
        el.classList.add('bg-loaded');
      };
      img.src = url;
      el.removeAttribute('data-bg');
    }
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadBg(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {rootMargin: '200px'});

  document.addEventListener('DOMContentLoaded', () => {
    // find elements with data-bg or data-src
    document.querySelectorAll('[data-bg],[data-src]').forEach(el => {
      // set placeholder for images if none
      if (el.tagName.toLowerCase() === 'img') {
        if (!el.getAttribute('src')) el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        el.loading = el.loading || 'lazy';
      }
      io.observe(el);
    });
  });
})();
