/* ============================================================
   EduLearn — Feature Showcase Panel
   A floating button + slide-out panel listing every feature,
   so nothing is missed during a demo/presentation.
   Every section AND every feature row links to the right page.
   Injected on every page. Self-contained.
   ============================================================ */
(function () {
  'use strict';
  if (window.__eduFeaturePanel) return;
  window.__eduFeaturePanel = true;

  var BASE = (function () {
    var p = location.pathname;
    var i = p.indexOf('/edutok/');
    return i !== -1 ? p.slice(0, i + 8) : (p.replace(/[^/]*$/, ''));
  })();
  function href(file) { return BASE + file; }

  /* each item: [label, status('done'|'plan'), targetFile] */
  var SECTIONS = [
    {
      title: 'Live Classes & Tutors', link: 'live.html', color: '#3DE8C5',
      items: [
        ['Small-group live classes with real tutors', 'done', 'live.html'],
        ['Seat booking + .ics calendar invite', 'done', 'live.html'],
        ['In-app classroom — stage, chat, controls', 'done', 'live.html'],
        ['Zoom Video SDK / self-hosted LiveKit', 'plan', 'live.html']
      ]
    },
    {
      title: 'AI Attention Monitoring', link: 'live.html', color: '#FF7AA2',
      items: [
        ['Real webcam gaze detection (eyes-on-screen %)', 'done', 'live.html'],
        ['Consent-first; video stays on device', 'done', 'live.html'],
        ['Tab-focus / idle fallback', 'done', 'live.html'],
        ['Post-session report → parent & teacher', 'done', 'live.html'],
        ['Parent dashboard attention card', 'done', 'dashboard.html']
      ]
    },
    {
      title: 'PAL — AI Assistant', link: 'pal.html', color: '#7C9BFF',
      items: [
        ['GPT-style chat: Student / Parent / Teacher', 'done', 'pal.html'],
        ['Student: doubts, notes, summaries, quizzes', 'done', 'pal.html'],
        ['Parent: progress, weak areas, attention', 'done', 'pal.html'],
        ['Teacher: worksheets + class analytics', 'done', 'pal.html'],
        ['Hinglish input, streaming, chat history', 'done', 'pal.html'],
        ['Connect to a live LLM API', 'plan', 'pal.html']
      ]
    },
    {
      title: 'Arena — Hourly Challenge', link: 'challenge.html', color: '#FFB454',
      items: [
        ['One question every hour, same for all', 'done', 'challenge.html'],
        ['45-second window — speed is anti-cheat', 'done', 'challenge.html'],
        ['Speed points, streaks, leaderboard', 'done', 'challenge.html']
      ]
    },
    {
      title: 'Progressive Mock Tests', link: 'mocktest.html', color: '#3DE8C5',
      items: [
        ['Adaptive: right → harder, wrong → easier', 'done', 'mocktest.html'],
        ['Visible difficulty ladder + journey chart', 'done', 'mocktest.html'],
        ['Mastery score weighted by difficulty', 'done', 'mocktest.html'],
        ['Full review + PAL recommendation', 'done', 'mocktest.html']
      ]
    },
    {
      title: 'Learn — Course Library', link: 'learn.html', color: '#7C9BFF',
      items: [
        ['Classes 6–9 × 5 subjects, ~190 chapters', 'done', 'learn.html'],
        ['Live search, progress bars, badges', 'done', 'learn.html'],
        ['AI animated video lectures', 'plan', 'lesson.html'],
        ['Notes, practice, tests, eBook per chapter', 'plan', 'lesson.html']
      ]
    },
    {
      title: 'Dashboards', link: 'dashboard.html', color: '#FFB454',
      items: [
        ['Student: streaks, mastery, recommendations', 'done', 'dashboard.html'],
        ['Parent: progress, alerts, attention', 'done', 'dashboard.html'],
        ['Teacher: class average, weak topics, roster', 'done', 'dashboard.html'],
        ['School admin view', 'plan', 'dashboard.html']
      ]
    },
    {
      title: 'Platform', link: 'index.html', color: '#FF7AA2',
      items: [
        ['Dark / light theme across all pages', 'done', 'index.html'],
        ['Bilingual UI — English / हिंदी', 'done', 'learn.html'],
        ['Character-driven animated landing', 'done', 'index.html'],
        ['Offline-first PWA + Android app', 'plan', 'index.html'],
        ['Phone-OTP auth, UPI payments', 'plan', 'login.html']
      ]
    }
  ];

  var NAV = [
    ['Home', 'index.html'], ['Learn', 'learn.html'], ['Live', 'live.html'],
    ['Arena', 'challenge.html'], ['Tests', 'mocktest.html'],
    ['PAL AI', 'pal.html'], ['Dashboard', 'dashboard.html']
  ];

  var css = [
    '#efp-btn{position:fixed;right:18px;bottom:18px;z-index:99998;display:inline-flex;align-items:center;gap:9px;',
    'background:linear-gradient(115deg,#3DE8C5,#7C9BFF 55%,#FFB454);color:#0B1224;font-family:"Schibsted Grotesk",system-ui,sans-serif;',
    'font-weight:700;font-size:14px;border:none;cursor:pointer;border-radius:999px;padding:12px 18px;',
    'box-shadow:0 12px 34px rgba(61,232,197,.4);transition:transform .25s cubic-bezier(.22,1,.36,1)}',
    '#efp-btn:hover{transform:translateY(-2px) scale(1.03)}',
    '#efp-btn svg{display:block}',
    '@media(max-width:600px){#efp-btn span{display:none}#efp-btn{padding:13px;right:14px;bottom:14px}}',
    '#efp-ov{position:fixed;inset:0;z-index:99998;background:rgba(8,12,22,.55);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .3s ease}',
    '#efp-ov.open{opacity:1;pointer-events:auto}',
    '#efp{position:fixed;top:0;right:0;height:100%;width:420px;max-width:92vw;z-index:99999;background:#0E1626;color:#F2EDE3;',
    'font-family:"Schibsted Grotesk",system-ui,sans-serif;box-shadow:-24px 0 60px rgba(0,0,0,.5);transform:translateX(100%);',
    'transition:transform .36s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;border-left:1px solid rgba(242,237,227,.1)}',
    '#efp.open{transform:translateX(0)}',
    '#efp *{box-sizing:border-box}',
    '#efp-hd{flex:none;padding:22px 22px 18px;border-bottom:1px solid rgba(242,237,227,.1);position:relative}',
    '#efp-hd h2{font-family:"Fraunces",Georgia,serif;font-size:21px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em;color:#F2EDE3}',
    '#efp-hd p{margin:0;font-size:12.5px;color:#A7B0C2;line-height:1.5}',
    '#efp-x{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(242,237,227,.14);',
    'background:transparent;color:#F2EDE3;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}',
    '#efp-x:hover{background:rgba(242,237,227,.08)}',
    '#efp-meter{display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid rgba(242,237,227,.1)}',
    '#efp-bar{flex:1;height:7px;border-radius:5px;background:rgba(242,237,227,.12);overflow:hidden}',
    '#efp-bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#3DE8C5,#7C9BFF)}',
    '#efp-meter b{font-family:"Fraunces",serif;font-size:15px;font-weight:600;white-space:nowrap;color:#F2EDE3}',
    '#efp-bd{flex:1;overflow-y:auto;padding:8px 22px 26px}',
    '.efp-sec{padding:16px 0;border-bottom:1px solid rgba(242,237,227,.07)}',
    '.efp-sec:last-child{border-bottom:none}',
    '.efp-sh{display:flex;align-items:center;gap:10px;margin-bottom:11px}',
    '.efp-dot{width:9px;height:9px;border-radius:50%;flex:none}',
    '.efp-sh h3{font-size:15px;font-weight:700;margin:0;flex:1;color:#F2EDE3}',
    '.efp-open{font-family:"Fragment Mono",ui-monospace,monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;',
    'color:#A7B0C2;text-decoration:none;border:1px solid rgba(242,237,227,.16);border-radius:6px;padding:4px 8px;transition:all .2s;white-space:nowrap;cursor:pointer}',
    '.efp-open:hover{color:#0B1224;background:#3DE8C5;border-color:transparent}',
    '.efp-it{display:flex;align-items:center;gap:10px;font-size:13.5px;line-height:1.4;padding:7px 8px;margin:1px -8px;color:#DDD8CE;text-decoration:none;border-radius:9px;cursor:pointer;transition:background .18s}',
    '.efp-it:hover{background:rgba(242,237,227,.06)}',
    '.efp-it:hover .efp-go{opacity:1;transform:translateX(0)}',
    '.efp-ck{width:18px;height:18px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center}',
    '.efp-ck.done{background:rgba(61,232,197,.18);color:#3DE8C5}',
    '.efp-ck.plan{background:rgba(124,155,255,.18);color:#7C9BFF}',
    '.efp-it .lbl{flex:1}',
    '.efp-it .pl{font-family:"Fragment Mono",monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#9DB0FF;border:1px solid rgba(124,155,255,.34);border-radius:5px;padding:2px 6px}',
    '.efp-go{flex:none;color:#A7B0C2;opacity:0;transform:translateX(-4px);transition:all .2s}',
    '#efp-nav{flex:none;border-top:1px solid rgba(242,237,227,.1);padding:14px 22px;display:flex;flex-wrap:wrap;gap:7px;background:#0B1220}',
    '#efp-nav a{font-size:12px;font-weight:600;color:#DDD8CE;text-decoration:none;border:1px solid rgba(242,237,227,.16);border-radius:999px;padding:6px 13px;transition:all .2s}',
    '#efp-nav a:hover{color:#0B1224;background:#3DE8C5;border-color:transparent}',
    '#efp-nav a.cur{background:rgba(61,232,197,.16);border-color:rgba(61,232,197,.5);color:#3DE8C5}',
    '#efp-foot{font-size:10.5px;color:#7C879B;text-align:center;padding:0 22px 14px;background:#0B1220}'
  ].join('');

  var totDone = 0, tot = 0;
  SECTIONS.forEach(function (s) { s.items.forEach(function (it) { tot++; if (it[1] === 'done') totDone++; }); });
  var pct = Math.round(totDone / tot * 100);

  var ckDone = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"/></svg>';
  var ckPlan = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var goArrow = '<svg class="efp-go" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var hereFile = (location.pathname.split('/').pop() || 'index.html');

  var secHTML = SECTIONS.map(function (s) {
    var items = s.items.map(function (it) {
      var done = it[1] === 'done';
      return '<a class="efp-it" href="' + href(it[2]) + '"><span class="efp-ck ' + (done ? 'done' : 'plan') + '">' +
        (done ? ckDone : ckPlan) + '</span><span class="lbl">' + esc(it[0]) + '</span>' +
        (done ? '' : '<span class="pl">Planned</span>') + goArrow + '</a>';
    }).join('');
    return '<div class="efp-sec"><div class="efp-sh"><span class="efp-dot" style="background:' + s.color + '"></span>' +
      '<h3>' + esc(s.title) + '</h3><a class="efp-open" href="' + href(s.link) + '">Open</a></div>' + items + '</div>';
  }).join('');

  var navHTML = NAV.map(function (n) {
    var cur = n[1] === hereFile ? ' class="cur"' : '';
    return '<a' + cur + ' href="' + href(n[1]) + '">' + esc(n[0]) + '</a>';
  }).join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'efp-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Show feature list');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg><span>Features</span>';

  var ov = document.createElement('div');
  ov.id = 'efp-ov';

  var panel = document.createElement('aside');
  panel.id = 'efp';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Feature showcase');
  panel.innerHTML =
    '<div id="efp-hd"><h2>EduLearn — Feature Tour</h2>' +
    '<p>Every module and feature. Click any row to jump straight to it — your live presentation checklist.</p>' +
    '<button id="efp-x" type="button" aria-label="Close">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button></div>' +
    '<div id="efp-meter"><div id="efp-bar"><i style="width:' + pct + '%"></i></div><b>' + totDone + ' live</b></div>' +
    '<div id="efp-bd">' + secHTML + '</div>' +
    '<div id="efp-nav">' + navHTML + '</div>' +
    '<div id="efp-foot">' + totDone + ' built · ' + (tot - totDone) + ' planned · click a row to open it</div>';

  document.body.appendChild(btn);
  document.body.appendChild(ov);
  document.body.appendChild(panel);

  function open() { ov.classList.add('open'); panel.classList.add('open'); }
  function close() { ov.classList.remove('open'); panel.classList.remove('open'); }
  btn.addEventListener('click', open);
  ov.addEventListener('click', close);
  document.getElementById('efp-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
