(function () {
  'use strict';

  /* ============ EASY SETTINGS (edit if you like) ============ */
  var CONFIG = {
    gifts: {
      title: 'My Gift To You, Uzma',
      text: 'A lifetime of my love, my promise to always choose you,\nand one wish from you that I will make come true. 💍❤️\n\nTell me what your heart wants, Meri Jaan. 🥹'
    },
    wishText: 'May every dua and every wish of yours come true, Meri Jaan. ❤️',
    photos: [
      { file: 'photos/photo1.jpg', caption: 'Us ❤️' },
      { file: 'photos/photo2.jpg', caption: 'My Uzma 🥹' },
      { file: 'photos/photo3.jpg', caption: 'Forever 💍' },
      { file: 'photos/photo4.jpg', caption: 'My Home 🏡' },
      { file: 'photos/photo5.jpg', caption: 'Meri Jaan 💖' },
      { file: 'photos/photo6.jpg', caption: 'Always & Forever ♾️' }
    ]
  };

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEARTS = ['❤️', '💖', '💗', '💕', '🌹', '✨', '💞'];

  /* ============ CANVAS: confetti + sparkles ============ */
  var cv = $('fx'), ctx = cv.getContext('2d'), parts = [], running = false;
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  size(); addEventListener('resize', size);
  var COLORS = ['#ff4d79', '#ffc9d6', '#f2c6b4', '#fff8f6', '#e8b4a0', '#c2204a', '#ffd166'];

  function confetti(n, x, y) {
    if (reduce) n = Math.floor(n / 3);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 9;
      parts.push({
        x: x == null ? innerWidth / 2 : x, y: y == null ? innerHeight * 0.4 : y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, g: 0.22, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: COLORS[(Math.random() * COLORS.length) | 0],
        life: 140 + Math.random() * 80, star: Math.random() < .25
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 60));
      ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if (p.star) { ctx.shadowColor = p.c; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, 7); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      if (p.life <= 0 || p.y > innerHeight + 40) parts.splice(i, 1);
    }
    if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function burst(times) {
    for (var i = 0; i < times; i++) setTimeout(function () {
      confetti(60, Math.random() * innerWidth, innerHeight * (.2 + Math.random() * .3));
    }, i * 350);
  }

  /* ============ floating hearts + petals ============ */
  var fl = $('floaters'), ambient = null;
  function heart() {
    var e = document.createElement('div');
    e.className = 'floater';
    e.textContent = HEARTS[(Math.random() * HEARTS.length) | 0];
    e.style.left = Math.random() * 100 + 'vw';
    e.style.fontSize = (14 + Math.random() * 26) + 'px';
    var dur = 7 + Math.random() * 7;
    e.style.animationDuration = dur + 's';
    e.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    e.style.setProperty('--rot', (Math.random() * 120 - 60) + 'deg');
    fl.appendChild(e); setTimeout(function () { e.remove(); }, dur * 1000);
  }
  function petal() {
    var e = document.createElement('div');
    e.className = 'petal';
    e.style.left = Math.random() * 100 + 'vw';
    var s = .6 + Math.random() * .9;
    e.style.transform = 'scale(' + s + ')';
    var dur = 8 + Math.random() * 8;
    e.style.animationDuration = dur + 's';
    e.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
    e.style.setProperty('--rot', (360 + Math.random() * 360) + 'deg');
    fl.appendChild(e); setTimeout(function () { e.remove(); }, dur * 1000);
  }
  function startAmbient() {
    if (ambient) return;
    var n = 0;
    ambient = setInterval(function () {
      if (document.hidden) return;
      heart(); if (n++ % 2 === 0) petal();
    }, reduce ? 1800 : 700);
  }

  /* ============ scroll reveal ============ */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .15 }) : null;
  function watch(el) { if (io) io.observe(el); else el.classList.add('in'); }

  /* ============ letter ============ */
  function buildLetter() {
    var raw = (window.UZMA_LETTER || '').replace(/^\n+|\s+$/g, '');
    var box = $('letterBody');
    raw.split(/\n\s*\n/).forEach(function (para) {
      if (!para.trim()) return;
      var p = document.createElement('p');
      p.textContent = para;           // textContent keeps every word & emoji exactly
      box.appendChild(p); watch(p);
    });
  }

  /* ============ gallery ============ */
  function buildGallery() {
    var g = $('gallery');
    CONFIG.photos.forEach(function (ph, i) {
      var d = document.createElement('div');
      d.className = 'photo';
      d.style.setProperty('--tilt', ((i % 2 ? 1 : -1) * (1 + (i % 3) * .6)) + 'deg');
      var img = new Image();
      img.alt = ph.caption;
      img.onload = function () {
        d.innerHTML = ''; d.appendChild(img);
        var c = document.createElement('div'); c.className = 'cap'; c.textContent = ph.caption; d.appendChild(c);
      };
      img.src = ph.file;
      d.innerHTML = '<div class="ph"><b>💗</b><span>Your photo here</span><small>' + ph.file + '</small></div>';
      g.appendChild(d); watch(d);
    });
  }

  /* ============ cake ============ */
  $('wishBtn').addEventListener('click', function () {
    var cake = $('cake');
    if (cake.classList.contains('out')) { cake.classList.remove('out'); $('wishMsg').textContent = ''; return; }
    cake.classList.add('out');
    var r = cake.getBoundingClientRect();
    confetti(110, r.left + r.width / 2, r.top);
    setTimeout(function () { burst(3); }, 300);
    typeInto($('wishMsg'), CONFIG.wishText);
    this.textContent = 'Light The Candles Again 🕯️';
    setTimeout(function () { $('wishBtn').textContent = 'Make a Wish, Uzma! 🎂'; }, 6000);
  });
  function typeInto(el, txt) {
    el.textContent = ''; var i = 0;
    (function step() { el.textContent = txt.slice(0, ++i); if (i < txt.length) setTimeout(step, 38); })();
  }

  /* ============ love meter ============ */
  var meterRunning = false;
  function runMeter() {
    if (meterRunning) return; meterRunning = true;
    var fill = $('meterFill'), pct = $('meterPct'), msg = $('meterMsg');
    msg.classList.remove('show'); msg.textContent = '';
    var t0 = null, dur = 3600;
    (function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3), v = Math.round(e * 100);
      fill.style.width = v + '%'; pct.textContent = v + '%';
      if (k < 1) requestAnimationFrame(step);
      else {
        meterRunning = false;
        msg.textContent = 'Meri Mohabbat Tumhare Liye Beinteha Hai, Uzma ❤️♾️';
        msg.classList.add('show');
        var r = $('meterHeart').getBoundingClientRect();
        confetti(80, r.left + r.width / 2, r.top);
      }
    })(performance.now());
  }
  $('meterBtn').addEventListener('click', runMeter);
  var meterObs = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { runMeter(); meterObs.disconnect(); }
  }, { threshold: .5 }) : null;
  if (meterObs) meterObs.observe($('meterSection')); else runMeter();

  /* ============ gift ============ */
  $('giftBtn').addEventListener('click', function () {
    var box = $('giftBox'); box.classList.add('shake');
    setTimeout(function () {
      box.classList.remove('shake');
      $('giftTitle').textContent = CONFIG.gifts.title;
      $('giftText').textContent = CONFIG.gifts.text;
      $('giftModal').classList.remove('hidden');
      confetti(140); burst(2);
    }, 500);
  });
  $('giftClose').addEventListener('click', function () { $('giftModal').classList.add('hidden'); });

  /* ============ finale ============ */
  $('finalBtn').addEventListener('click', function () {
    var f = $('finale'); f.classList.remove('hidden', 'go');
    void f.offsetWidth; f.classList.add('go');
    burst(6);
    setTimeout(function () { burst(5); }, 2600);
  });
  $('finaleClose').addEventListener('click', function () { $('finale').classList.add('hidden'); });

  /* ============ music ============ */
  var bgm = $('bgm'), playBtn = $('playBtn'), muteBtn = $('muteBtn'), label = $('playLabel');
  function setPlayUI() { playBtn.textContent = bgm.paused ? '▶' : '⏸'; }
  playBtn.addEventListener('click', function () {
    if (bgm.paused) {
      var pr = bgm.play();
      if (pr && pr.catch) pr.catch(function () { label.textContent = 'Add music/song.mp3 🎶'; });
    } else bgm.pause();
  });
  bgm.addEventListener('play', setPlayUI); bgm.addEventListener('pause', setPlayUI);
  bgm.addEventListener('error', function () { label.textContent = 'Add music/song.mp3 🎶'; }, true);
  muteBtn.addEventListener('click', function () { bgm.muted = !bgm.muted; muteBtn.textContent = bgm.muted ? '🔇' : '🔊'; });

  /* ============ open the surprise ============ */
  var opened = false;
  $('openBtn').addEventListener('click', function () {
    if (opened) return; opened = true;
    this.disabled = true; this.textContent = 'Opening… 💞';
    $('envelope').classList.add('open');
    confetti(60, innerWidth / 2, innerHeight * .45);
    setTimeout(function () {
      $('welcome').classList.add('leave');
      $('main').classList.remove('hidden');
      $('player').classList.remove('hidden');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      burst(5); startAmbient();
      document.querySelectorAll('#main .reveal').forEach(watch);
      var pr; try { pr = bgm.play(); } catch (e) {}
      if (pr && pr.catch) pr.catch(function () {});
    }, 1500);
    setTimeout(function () { $('welcome').classList.add('hidden'); }, 2800);
  });

  buildLetter(); buildGallery();
  /* gentle hearts on the welcome screen too */
  startAmbient();
})();
