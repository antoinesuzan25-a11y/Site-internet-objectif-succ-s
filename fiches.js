(function () {
  'use strict';
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var grid = $('bgrid'), q = $('bq'), chips = $('bchips'), lchips = $('blchips'), count = $('bcount'), packs = $('bpacks');
  if (!S || !grid) return;
  var group = 'Toutes', level = 'Toutes';
  var fmt = function (n) { return String(n).replace('.', ',') + ' €'; };
  function el(t, c, txt) { var n = document.createElement(t); if (c) n.className = c; if (txt != null) n.textContent = txt; return n; }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function makeChips(box, values, getCur, setCur) {
    values.forEach(function (v) {
      var b = el('button', 'bchip', v); b.type = 'button'; b.setAttribute('aria-pressed', String(v === getCur()));
      b.addEventListener('click', function () {
        setCur(v); Array.prototype.forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); }); render();
      });
      box.appendChild(b);
    });
  }
  var groups = ['Toutes'];
  S.SUBJECTS.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
  makeChips(lchips, ['Toutes', 'Première', 'Terminale'], function () { return level; }, function (v) { level = v; });
  makeChips(chips, groups, function () { return group; }, function (v) { group = v; });

  function soon() { var d = el('span', 'btn', 'Bientôt disponible'); d.setAttribute('aria-disabled', 'true'); return d; }
  function buy(item) {
    if (S.SALES_OPEN && item.stripe) { var a = el('a', 'btn primary', 'Acheter'); a.href = item.stripe; a.target = '_blank'; a.rel = 'noopener'; return a; }
    return soon();
  }

  function renderPacks() {
    packs.textContent = '';
    (S.PACKS || []).forEach(function (p) {
      var c = el('article', 'bcard bpack');
      c.appendChild(el('span', 'btag', 'Pack • ' + p.level));
      c.appendChild(el('h3', null, p.name));
      c.appendChild(el('p', null, p.desc));
      c.appendChild(el('small', null, '3 fiches pour ' + fmt(p.price) + ' au lieu de ' + fmt(S.PRICE * 3)));
      var row = el('div', 'brow'); row.appendChild(el('span', 'bprice', fmt(p.price))); row.appendChild(buy(p)); c.appendChild(row);
      packs.appendChild(c);
    });
  }

  function render() {
    var term = norm(q.value.trim());
    var list = S.SUBJECTS.filter(function (s) {
      return (group === 'Toutes' || s.group === group) && (level === 'Toutes' || s.level === level) && (!term || norm(s.name).indexOf(term) >= 0);
    });
    grid.textContent = '';
    count.textContent = list.length + ' fiche' + (list.length > 1 ? 's' : '') + ' • ' + fmt(S.PRICE) + ' par fiche';
    if (!list.length) { grid.appendChild(el('p', 'bempty', 'Aucune fiche ne correspond. Essaie un autre mot (ex. « maths », « philo ») ou change de niveau.')); return; }
    list.forEach(function (s) {
      var c = el('article', 'bcard');
      c.appendChild(el('span', 'btag', s.group + ' • ' + s.level));
      c.appendChild(el('h3', null, s.name));
      var row = el('div', 'brow'); row.appendChild(el('span', 'bprice', fmt(S.PRICE))); row.appendChild(buy(s)); c.appendChild(row);
      grid.appendChild(c);
    });
  }
  q.addEventListener('input', render);

  var n = $('bnotice'); if (n && S.SALES_OPEN) n.hidden = true;
  var st = $('bacStatus'); if (st) st.textContent = S.SALES_OPEN ? 'Disponible maintenant' : 'Ouverture prochaine';
  var w = $('bwaitlist'); if (w && S.WAITLIST_URL) { w.href = S.WAITLIST_URL; w.hidden = false; }
  renderPacks(); render();
})();
