(function () {
  var tabs = [].slice.call(document.querySelectorAll('[data-tab]'));
  var sections = [].slice.call(document.querySelectorAll('[data-section]'));
  var keys = tabs.map(function (t) { return t.getAttribute('data-tab'); });

  function showTab(key, push) {
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-tab') === key ? 'true' : 'false'); });
    sections.forEach(function (s) { s.hidden = !(key === 'all' || s.getAttribute('data-section') === key); });
    if (push) { try { history.replaceState(null, '', key === 'all' ? location.pathname + location.search : '#' + key); } catch (e) {} }
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showTab(t.getAttribute('data-tab'), true); window.scrollTo({ top: 0 }); });
  });
  var h = (location.hash || '').replace('#', '');
  if (keys.indexOf(h) > 0) showTab(h, false);

  [].slice.call(document.querySelectorAll('[data-jump]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var el = document.getElementById(a.getAttribute('data-jump'));
      if (!el) return;
      var sec = el.closest('[data-section]');
      var active = tabs.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; })[0];
      var key = active ? active.getAttribute('data-tab') : 'all';
      if (key !== 'all' && sec && sec.getAttribute('data-section') !== key) showTab(sec.getAttribute('data-section'), false);
      el.scrollIntoView({ block: 'start' });
    });
  });

  var items = [].slice.call(document.querySelectorAll('[data-open]'));
  var lb = document.getElementById('lb');
  var stage = document.getElementById('lbstage');
  var img = document.getElementById('lbimg');
  var title = document.getElementById('lbtitle');
  var count = document.getElementById('lbcount');
  var link = document.getElementById('lblink');
  var closeBtn = document.getElementById('lbclose');
  var prevBtn = document.getElementById('lbprev');
  var nextBtn = document.getElementById('lbnext');
  var list = [], idx = 0, lastFocus = null, token = 0;

  function render() {
    var b = list[idx];
    var full = b.getAttribute('data-full');
    var my = ++token;
    img.style.setProperty('--w', b.getAttribute('data-w') + 'px');
    img.src = b.getAttribute('data-thumb');
    img.alt = b.getAttribute('data-label');
    var pre = new Image();
    pre.onload = function () { if (my === token) img.src = full; };
    pre.src = full;
    title.textContent = b.getAttribute('data-label');
    count.textContent = 'Step ' + b.getAttribute('data-step') + ' of ' + b.getAttribute('data-total');
    link.href = full;
    stage.scrollTop = 0;
    [1, -1].forEach(function (d) {
      var n = list[(idx + d + list.length) % list.length];
      if (n) new Image().src = n.getAttribute('data-full');
    });
  }
  function open(btn) {
    lastFocus = btn;
    var j = btn.getAttribute('data-j');
    list = items.filter(function (b) { return b.getAttribute('data-j') === j; });
    idx = Math.max(0, list.indexOf(btn));
    render();
    lb.hidden = false;
    document.body.classList.add('lock');
    closeBtn.focus();
  }
  function close() {
    lb.hidden = true; token++;
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }
  function go(d) { idx = (idx + d + list.length) % list.length; render(); }

  items.forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === stage) close(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowRight') { go(1); }
    else if (e.key === 'ArrowLeft') { go(-1); }
    else if (e.key === 'Tab') {
      var f = [prevBtn, nextBtn, link, closeBtn];
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  var sx = 0, sy = 0;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 1.6 * Math.abs(dy)) go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
