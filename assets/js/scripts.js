var body = document.querySelector('body');
var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
var menuContainer = document.querySelector('#main-menu-mobile');

var _scrollY = 0;
if (menuTrigger && menuContainer) {
  menuTrigger.onclick = function() {
    var isOpen = menuContainer.classList.toggle('open');
    menuTrigger.classList.toggle('is-active');
    if (isOpen) {
      _scrollY = window.pageYOffset;
      body.classList.add('lock-scroll');
      body.style.top = '-' + _scrollY + 'px';
    } else {
      body.classList.remove('lock-scroll');
      body.style.top = '';
      window.scrollTo(0, _scrollY);
    }
  };
}

// Desktop dropdown (JS enhances CSS :hover with delayed close)
;(function () {
  var items = document.querySelectorAll('.main-menu .has-dropdown');
  var closeTimer = null;

  function closeAll() {
    items.forEach(function (el) {
      el.classList.remove('dropdown-open');
    });
  }

  items.forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      closeAll();
      li.classList.add('dropdown-open');
    });

    li.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () {
        li.classList.remove('dropdown-open');
        closeTimer = null;
      }, 150);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.main-menu .has-dropdown')) closeAll();
  });
})();

// Mobile dropdown toggle
;(function () {
  var links = document.querySelectorAll('.main-menu-mobile .has-dropdown > a');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var li = this.parentElement;
      if (li.classList.contains('sub-open')) return;
      e.preventDefault();
      document.querySelectorAll('.main-menu-mobile .has-dropdown.sub-open').forEach(function (el) {
        if (el !== li) el.classList.remove('sub-open');
      });
      li.classList.toggle('sub-open');
    });
  });
})()

// tsParticles (v2 API)
;(function () {
  // 모바일에서 입자 수 감소 (성능 최적화)
  var isMobile = window.innerWidth < 768;
  var particleCount = isMobile ? 30 : 60;
  var linkEnable = !isMobile;

  var particlesConfig = {
    fullScreen: { enable: false },
    fpsLimit: isMobile ? 30 : 60,
    particles: {
      number: { value: particleCount, density: { enable: true, area: 900 } },
      color: { value: '#2ECEC5' },
      opacity: { value: { min: 0.15, max: 0.45 }, random: true },
      size: { value: { min: 1, max: 3 }, random: true },
      links: { enable: linkEnable, distance: 150, color: '#2ECEC5', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 0.7, direction: 'none', outModes: { default: 'bounce' }, random: true }
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: { enable: !isMobile, mode: 'grab' },
        resize: true
      },
      modes: { grab: { distance: 160, links: { opacity: 0.35 } } }
    },
    detectRetina: true
  };

  function initParticles() {
    var el = document.getElementById('tsparticles');
    if (!el) return false;
    if (typeof tsParticles === 'undefined') return false;
    tsParticles.load('tsparticles', particlesConfig).catch(function() {});
    return true;
  }

  // 즉시 → DOMContentLoaded → window.load (Safari/Firefox CDN 타이밍 대응)
  if (!initParticles()) {
    document.addEventListener('DOMContentLoaded', function () {
      if (!initParticles()) {
        window.addEventListener('load', initParticles);
      }
    });
  }
})();

// Product gallery 3D carousel (Swiper)
;(function () {
  if (!document.querySelector('.product-swiper')) return;
  if (typeof Swiper === 'undefined') return;

  var slideCount = document.querySelectorAll('.product-swiper .swiper-slide').length;
  var swiper = new Swiper('.product-swiper', {
    effect: 'slide',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.3,
    spaceBetween: 0,
    loop: true,
    // default minus 'button', so slides can be dragged on the video poster (a button)
    focusableElements: 'input, select, option, textarea, video, label',
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  // Video slides: poster click → play in place and stop autoplay
  // (clicks inside a YouTube iframe never reach this page, so the poster is the only reliable signal)
  document.querySelectorAll('.product-swiper .video-poster').forEach(function (poster) {
    poster.addEventListener('click', function () {
      var wrap = poster.parentElement;
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube.com/embed/' + wrap.getAttribute('data-youtube-id') + '?autoplay=1&rel=0&playsinline=1';
      frame.title = wrap.getAttribute('data-title') || '';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      poster.hidden = true;
      wrap.appendChild(frame);
      swiper.autoplay.stop();
    });
  });

  // On slide change: end playback (back to poster) and resume autoplay
  swiper.on('slideChangeTransitionEnd', function () {
    document.querySelectorAll('.product-swiper .video-wrapper iframe').forEach(function (frame) {
      frame.parentElement.querySelector('.video-poster').hidden = false;
      frame.remove();
    });
    swiper.autoplay.start();
  });
})();

// Dark mode toggle (initial theme is applied inline in <head> to avoid FOUC)
;(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('dark-mode-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
})();
