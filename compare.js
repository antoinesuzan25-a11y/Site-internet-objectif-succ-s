(function () {
  'use strict';

  // Open data officiel du ministère (Licence Ouverte) — API Explore v2.1
  var API = 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records';
  var MAX = 4;
  var CRITERIA = [
    ['debouches', 'Débouchés'],
    ['cadre', 'Ville / cadre'],
    ['cout', 'Coût'],
    ['cours', 'Contenu des cours']
  ];
  var selected = [];

  var $ = function (id) { return document.getElementById(id); };
  var qInput = $('q'), qBtn = $('qBtn'), qStatus = $('qStatus'), qResults = $('qResults');
  var manualForm = $('manualForm'), manualName = $('manualName'), grid = $('compareResult');
  if (!qInput || !grid) return;

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  var nf = new Intl.NumberFormat('fr-FR');
  function num(v) { return typeof v === 'number' && isFinite(v) ? v : null; }

  // ---------- Recherche ----------
  function search(forced) {
    var raw = (typeof forced === 'string' ? forced : qInput.value).trim();
    if (typeof forced === 'string') qInput.value = raw;
    if (raw.length < 3) { qStatus.textContent = 'Écris au moins 3 lettres pour lancer la recherche.'; return; }
    var words = raw.replace(/["\\]/g, ' ').split(/\s+/).filter(Boolean);
    // Plusieurs syntaxes ODSQL essayées à la suite, jusqu'à ce qu'une fonctionne
    var attempts = [
      'search("' + words.join(' ') + '")',
      words.map(function (w) { return '"' + w + '"'; }).join(' and '),
      '"' + words.join(' ') + '"'
    ];
    qStatus.textContent = 'Recherche en cours…';
    qResults.textContent = '';
    qBtn.disabled = true;
    var lastErr = '';
    function run(i) {
      if (i >= attempts.length) throw new Error(lastErr || 'échec');
      return fetch(API + '?limit=8&where=' + encodeURIComponent(attempts[i]))
        .then(function (r) { if (!r.ok) { lastErr = 'HTTP ' + r.status; return run(i + 1); } return r.json(); });
    }
    Promise.resolve().then(function () { return run(0); })
      .then(function (d) {
        var rows = (d && d.results) || [];
        if (!rows.length) {
          qStatus.textContent = 'Aucune formation trouvée. Essaie avec moins de mots (ex. « BUT informatique ») ou ajoute-la à la main ci-dessous.';
          return;
        }
        qStatus.textContent = rows.length + ' résultat(s). Clique sur « Ajouter » pour comparer.';
        rows.forEach(function (r) { qResults.appendChild(resultItem(toFormation(r))); });
      })
      .catch(function (e) {
        qStatus.textContent = 'La base Parcoursup ne répond pas (' + (e && e.message ? e.message : 'erreur réseau') + '). Ajoute ta formation à la main ci-dessous : les onglets fonctionnent quand même.';
      })
      .then(function () { qBtn.disabled = false; });
  }

  function toFormation(r) {
    var name = r.form_lib_voe_acc || r.lib_for_voe_ins || r.fili || 'Formation';
    var school = r.g_ea_lib_vx || '';
    return {
      id: String(r.cod_aff_form || (school + '|' + name)),
      name: name,
      school: school,
      place: r.ville_etab || r.dep_lib || '',
      type: r.fili || '',
      places: num(r.capa_fin),
      voeux: num(r.voe_tot),
      taux: num(r.taux_acces_ens),
      session: r.session || '', admis: num(r.acc_tot), bg: num(r.acc_bg), bt: num(r.acc_bt), bp: num(r.acc_bp),
      ratings: { debouches: 3, cadre: 3, cout: 3, cours: 3 }
    };
  }

  function resultItem(f) {
    var li = el('li');
    var box = el('div');
    box.appendChild(el('strong', null, f.name));
    box.appendChild(el('small', null, [f.school, f.place].filter(Boolean).join(' — ')));
    var btn = el('button', { type: 'button' }, 'Ajouter');
    btn.addEventListener('click', function () { add(f, btn); });
    li.appendChild(box); li.appendChild(btn);
    return li;
  }

  function add(f, btn) {
    if (selected.some(function (s) { return s.id === f.id; })) { btn.disabled = true; btn.textContent = 'Déjà ajoutée'; return; }
    if (selected.length >= MAX) { qStatus.textContent = 'Maximum ' + MAX + ' formations : retire-en une pour en ajouter une autre.'; return; }
    selected.push(f);
    if (btn) { btn.disabled = true; btn.textContent = 'Ajoutée'; }
    render();
  }

  // ---------- Rendu des fiches ----------
  function score(f) {
    var t = 0; CRITERIA.forEach(function (c) { t += f.ratings[c[0]]; });
    return t / CRITERIA.length;
  }

  function stat(label, value) {
    var d = el('div'); d.appendChild(el('span', null, label)); d.appendChild(el('b', null, value)); return d;
  }

  // ---------- Tableau officiel (sans notes perso) ----------
  var tWrap = $('officialResult');
  function pct(part, tot) { return part !== null && part !== undefined && tot ? Math.round(part / tot * 100) + ' %' : null; }
  function ratio(f) { return f.voeux !== null && f.places ? f.voeux / f.places : null; }
  function renderTable() {
    tWrap.textContent = '';
    if (!selected.length) { tWrap.appendChild(el('p', { 'class': 'hint' }, 'Cherche puis ajoute au moins deux formations pour les comparer côte à côte.')); return; }
    var rows = [
      ['Établissement', function (f) { return f.school || null; }],
      ['Lieu', function (f) { return f.place || null; }],
      ['Filière', function (f) { return f.type || null; }],
      ['Places', function (f) { return f.places; }, null, nf],
      ['Vœux reçus', function (f) { return f.voeux; }, null, nf],
      ['Vœux par place', ratio, 'min', { format: function (v) { return v.toFixed(1).replace('.', ','); } }],
      ['Taux d’accès', function (f) { return f.taux; }, 'max', { format: function (v) { return Math.round(v) + ' %'; } }],
      ['Candidats admis', function (f) { return f.admis; }, null, nf],
      ['Admis bac général', function (f) { return f.admis ? pct(f.bg, f.admis) : null; }],
      ['Admis bac techno', function (f) { return f.admis ? pct(f.bt, f.admis) : null; }],
      ['Admis bac pro', function (f) { return f.admis ? pct(f.bp, f.admis) : null; }]
    ];
    var t = el('table', { 'class': 'otable' });
    var hr = el('tr'); hr.appendChild(el('th', { scope: 'col' }, ''));
    selected.forEach(function (f, i) {
      var th = el('th', { scope: 'col' }, f.name);
      var rm = el('button', { type: 'button', 'class': 'remove' }, 'Retirer');
      rm.addEventListener('click', function () { selected.splice(i, 1); render(); });
      th.appendChild(rm); hr.appendChild(th);
    });
    t.appendChild(el('thead')).appendChild(hr);
    var tb = el('tbody');
    rows.forEach(function (row) {
      var vals = selected.map(row[1]);
      if (vals.every(function (v) { return v === null || v === undefined; })) return;
      var target = null;
      if (row[2] && selected.length > 1) {
        var nums = vals.filter(function (v) { return typeof v === 'number'; });
        if (nums.length > 1) target = row[2] === 'max' ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
      }
      var tr = el('tr'); tr.appendChild(el('th', { scope: 'row' }, row[0]));
      vals.forEach(function (v) {
        var txt = '—';
        if (v !== null && v !== undefined) {
          var fm = row[3];
          txt = typeof v === 'number' ? (fm ? (fm.format ? fm.format(v) : fm.format(v)) : String(v)) : v;
        }
        var td = el('td', target !== null && v === target ? { 'class': 'top' } : null, txt);
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    tWrap.appendChild(t);
    if (selected.length > 1) tWrap.appendChild(el('p', { 'class': 'hint' }, 'Surligné : taux d’accès le plus élevé et moins de vœux par place. Un taux élevé ne dit rien de la qualité d’une formation.'));
  }

  function render() {
    renderTable();
    grid.textContent = '';
    if (!selected.length) grid.appendChild(el('p', { 'class': 'hint empty' }, 'Ajoute d’abord une formation (recherche ou saisie manuelle ci-dessus) : tu pourras alors la noter ici.'));
    var best = -1, bestScore = 0;
    selected.forEach(function (f, i) { var s = score(f); if (s > bestScore) { bestScore = s; best = i; } });
    var unique = selected.length > 1 && selected.filter(function (f) { return score(f) === bestScore; }).length === 1;

    selected.forEach(function (f, i) {
      var card = el('article', { 'class': 'fcard' + (unique && i === best ? ' best' : '') });
      if (unique && i === best) card.appendChild(el('span', { 'class': 'badge' }, 'Meilleur score perso'));
      card.appendChild(el('h3', null, f.name));
      var sub = [f.school, f.place].filter(Boolean).join(' — ');
      if (sub) card.appendChild(el('p', { 'class': 'sub' }, sub));

      var hasData = f.taux !== null || f.places !== null || f.voeux !== null;
      if (hasData) {
        var st = el('div', { 'class': 'stats' });
        if (f.type) st.appendChild(stat('Filière', f.type));
        if (f.places !== null) st.appendChild(stat('Places', nf.format(f.places)));
        if (f.voeux !== null) st.appendChild(stat('Vœux reçus', nf.format(f.voeux)));
        if (f.taux !== null) st.appendChild(stat('Taux d’accès', Math.round(f.taux) + ' %'));
        card.appendChild(st);
        if (f.taux !== null) {
          var bar = el('div', { 'class': 'bar', role: 'img', 'aria-label': 'Taux d’accès ' + Math.round(f.taux) + ' pour cent' });
          var fill = el('i'); fill.style.width = Math.min(100, Math.max(0, f.taux)) + '%';
          bar.appendChild(fill); card.appendChild(bar);
        }
      } else {
        card.appendChild(el('p', { 'class': 'sub' }, 'Formation ajoutée à la main : cherche ses chiffres sur sa fiche Parcoursup.'));
      }

      CRITERIA.forEach(function (c) {
        var lab = el('label', { 'class': 'rate' });
        var line = el('span'); line.appendChild(el('span', null, c[1]));
        var val = el('b', null, String(f.ratings[c[0]]) + '/5'); line.appendChild(val);
        var inp = el('input', { type: 'range', min: '1', max: '5', step: '1', value: String(f.ratings[c[0]]) });
        inp.addEventListener('input', function () { f.ratings[c[0]] = +inp.value; val.textContent = inp.value + '/5'; });
        inp.addEventListener('change', render);
        lab.appendChild(line); lab.appendChild(inp); card.appendChild(lab);
      });

      var sc = el('div', { 'class': 'score' });
      sc.appendChild(el('span', null, 'Ma note'));
      sc.appendChild(el('strong', null, score(f).toFixed(1).replace('.', ',') + '/5'));
      card.appendChild(sc);

      var rm = el('button', { type: 'button', 'class': 'remove' }, 'Retirer');
      rm.addEventListener('click', function () { selected.splice(i, 1); render(); });
      card.appendChild(rm);
      grid.appendChild(card);
    });
  }

  // ---------- Événements ----------
  qBtn.addEventListener('click', function () { search(); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-q]'), function (b) { b.addEventListener('click', function () { search(b.getAttribute('data-q')); }); });
  qInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); search(); } });
  manualForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = manualName.value.trim();
    if (!name) return;
    add({ id: 'manual-' + Date.now(), name: name, school: '', place: '', type: '', places: null, voeux: null, taux: null, ratings: { debouches: 3, cadre: 3, cout: 3, cours: 3 } });
    manualName.value = '';
  });

  // ---------- Onglets ----------
  var tabOff = $('tabOff'), tabPerso = $('tabPerso');
  function showTab(perso) {
    tabOff.setAttribute('aria-selected', String(!perso)); tabPerso.setAttribute('aria-selected', String(perso));
    tWrap.hidden = perso; grid.hidden = !perso;
  }
  tabOff.addEventListener('click', function () { showTab(false); });
  tabPerso.addEventListener('click', function () { showTab(true); });
  render();
})();
