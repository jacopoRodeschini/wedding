// Irene & Nicola — piccoli script della pagina (menu, countdown, copia IBAN, animazioni)
(function () {
  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    nav.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });

  // Bordo sotto l'header quando si scorre
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Immagini mancanti: nasconde l'immagine e lascia il riquadro colorato
  document.querySelectorAll('.photo img').forEach(function (img) {
    function hide() { img.style.visibility = 'hidden'; }
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  });

  // Countdown
  var cd = document.querySelector('.countdown');
  if (cd) {
    var target = new Date(cd.dataset.date).getTime();
    var units = {
      days: cd.querySelector('[data-unit="days"]'),
      hours: cd.querySelector('[data-unit="hours"]'),
      minutes: cd.querySelector('[data-unit="minutes"]')
    };
    var tick = function () {
      var diff = target - Date.now();
      if (isNaN(diff)) return;
      if (diff <= 0) {
        cd.innerHTML = '<p class="hero-date">È il grande giorno!</p>';
        return;
      }
      units.days.textContent = Math.floor(diff / 86400000);
      units.hours.textContent = Math.floor(diff / 3600000) % 24;
      units.minutes.textContent = Math.floor(diff / 60000) % 60;
      setTimeout(tick, 30000);
    };
    tick();
  }

  // Copia IBAN
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = document.querySelector(btn.dataset.copy).textContent.replace(/\s+/g, '');
      var done = function () {
        var label = btn.textContent;
        btn.textContent = 'Copiato ✓';
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        done();
      }
    });
  });

  // Comparsa morbida delle sezioni
  if ('IntersectionObserver' in window) {
    var els = document.querySelectorAll('.section > *, .photo--wide, .closing > *');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
