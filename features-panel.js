/* ============================================================
   EduLearn — Feature Showcase Panel
   A floating button + slide-out panel listing every feature,
   so nothing is missed during a demo/presentation.
   Injected on every page. Self-contained (styles + markup + logic).
   ============================================================ */
(function () {
  'use strict';
  if (window.__eduFeaturePanel) return;
  window.__eduFeaturePanel = true;

  var BASE = (function () {
    // resolve links relative to wherever the pages live (…/edutok/)
    var p = location.pathname;
    var i = p.indexOf('/edutok/');
    return i !== -1 ? p.slice(0, i + 8) : (p.replace(/[^/]*$/, ''));
  })();

  var SECTIONS = [
    {
      title: 'Live Classes & Tutors',
      tag: 'live.html',
      color: '#3DE8C5',
      items: [
        ['Small-group live classes with real tutors', 'done'],
        ['Seat booking + .ics calendar invite (Google/Outlook)', 'done'],
        ['In-app classroom — tutor stage, chat, controls', 'done'],
        ['Production path: Zoom Video SDK or self-hosted LiveKit', 'plan']
      ]
    },
    {
      title: 'AI Attention Monitoring',
      tag: 'live.html + dashboard',
      color: '#FF7AA2',
      items: [
        ['Real webcam gaze detection (eyes-on-screen %)', 'done'],
        ['Consent-first; video stays on device, only score saved', 'done'],
        ['Tab-focus / idle fallback when camera is off', 'done'],
        ['Post-session report → parent & teacher', 'done'],
        ['Parent dashboard "Live class attention" card', 'done']
      ]
    },
    {
      title: 'PAL — AI Assistant (3 roles)',
      tag: 'pal.html',
      color: '#7C9BFF',
      items: [
        ['GPT-style chat: Student / Parent / Teacher modes', 'done'],
        ['Student: doubt solving, notes, summaries, inline quizzes', 'done'],
        ['Parent: progress, weak areas, attention — in plain words', 'done'],
        ['Teacher: worksheets w/ answer key, class analytics', 'done'],
        ['Hinglish input, streaming replies, chat history', 'done'],
        ['Connect to a live LLM API', 'plan']
      ]
    },
    {
      title: 'Arena — Hourly Challenge',
      tag: 'challenge.html',
      color: '#FFB454',
      items: [
        ['One question every hour, same for all students', 'done'],
        ['45-second window — speed is the anti-cheat', 'done'],
        ['Speed points, streaks, live leaderboard', 'done']
      ]
    },
    {
      title: 'Progressive Mock Tests',
      tag: 'mocktest.html',
      color: '#3DE8C5',
      items: [
        ['Adaptive (CAT-style): right → harder, wrong → easier', 'done'],
        ['Visible difficulty ladder + journey chart', 'done'],
        ['Mastery score weighted by difficulty', 'done'],
        ['Full review + PAL recommendation', 'done']
      ]
    },
    {
      title: 'Learn — Course Library',
      tag: 'learn.html',
      color: '#7C9BFF',
      items: [
        ['Classes 6–9 × 5 subjects, ~190 NCERT chapters', 'done'],
        ['Live search, progress bars, mastery badges', 'done'],
        ['AI animated video lectures per chapter', 'plan'],
        ['Notes, practice, tests, eBook per chapter', 'plan']
      ]
    },
    {
      title: 'Dashboards (role-based)',
      tag: 'dashboard.html',
      color: '#FFB454',
      items: [
        ['Student: streaks, mastery, recommendations', 'done'],
        ['Parent: progress, alerts, attention, study time', 'done'],
        ['Teacher: class average, weak topics, roster', 'done'],
        ['School admin view', 'plan']
      ]
    },
    {
      title: 'Platform',
      tag: 'all pages',
      color: '#FF7AA2',
      items: [
        ['Dark / light theme across all pages', 'done'],
        ['Bilingual UI — English / हिंदी', 'done'],
        ['Character-driven landing (animated mascot)', 'done'],
        ['Offline-first PWA + Android app', 'plan'],
        ['Phone-OTP auth, payments (UPI ₹299/mo)', 'plan']
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
    '#efp-hd{flex:none;padding:22px 22px 18px;border-bottom:1px solid rgba(242,237,227,.1);position:relative}',
    '#efp-hd h2{font-family:"Fraunces",Georgia,serif;font-size:21px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em}',
    '#efp-hd p{margin:0;font-size:12.5px;color:#949DB0;line-height:1.5}',
    '#efp-x{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(242,237,227,.14);',
    'background:transparent;color:#F2EDE3;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}',
    '#efp-x:hover{background:rgba(242,237,227,.08)}',
    '#efp-meter{display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid rgba(242,237,227,.1)}',
    '#efp-bar{flex:1;height:7px;border-radius:5px;background:rgba(242,237,227,.1);overflow:hidden}',
    '#efp-bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#3DE8C5,#7C9BFF)}',
    '#efp-meter b{font-family:"Fraunces",serif;font-size:15px;font-weight:600;white-space:nowrap}',
    '#efp-bd{flex:1;overflow-y:auto;padding:8px 22px 26px}',
    '.efp-sec{padding:16px 0;border-bottom:1px solid rgba(242,237,227,.07)}',
    '.efp-sec:last-child{border-bottom:none}',
    '.efp-sh{display:flex;align-items:center;gap:10px;margin-bottom:11px}',
    '.efp-dot{width:9px;height:9px;border-radius:50%;flex:none}',
    '.efp-sh h3{font-size:15px;font-weight:700;margin:0;flex:1}',
    '.efp-sh a{font-family:"Fragment Mono",ui-monospace,monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;',
    'color:#949DB0;text-decoration:none;border:1px solid rgba(242,237,227,.14);border-radius:6px;padding:3px 7px;transition:all .2s;white-space:nowrap}',
    '.efp-sh a:hover{color:#3DE8C5;border-color:rgba(61,232,197,.5)}',
    '.efp-it{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;line-height:1.4;padding:5px 0;color:#D7D2C8}',
    '.efp-ck{width:18px;height:18px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;margin-top:1px}',
    '.efp-ck.done{background:rgba(61,232,197,.16);color:#3DE8C5}',
    '.efp-ck.plan{background:rgba(124,155,255,.16);color:#7C9BFF}',
    '.efp-it .lbl{flex:1}',
    '.efp-it .pl{font-family:"Fragment Mono",monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#7C9BFF;border:1px solid rgba(124,155,255,.3);border-radius:5px;padding:2px 6px;align-self:center}',
    '#efp-nav{flex:none;border-top:1px solid rgba(242,237,227,.1);padding:14px 22px;display:flex;flex-wrap:wrap;gap:7px;background:#0B1220}',
    '#efp-nav a{font-size:12px;font-weight:600;color:#D7D2C8;text-decoration:none;border:1px solid rgba(242,237,227,.14);border-radius:999px;padding:6px 13px;transition:all .2s}',
    '#efp-nav a:hover{color:#0B1224;background:#3DE8C5;border-color:transparent}',
    '#efp-foot{font-size:10.5px;color:#6B7280;text-align:center;padding:0 22px 14px;background:#0B1220}'
  ].join('');

  var totDone = 0, tot = 0;
  SECTIONS.forEach(function (s) { s.items.forEach(function (it) { tot++; if (it[1] === 'done') totDone++; }); });
  var pct = Math.round(totDone / tot * 100);

  var ckDone = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"/></svg>';
  var ckPlan = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var secHTML = SECTIONS.map(function (s) {
    var items = s.items.map(function (it) {
      var done = it[1] === 'done';
      return '<div class="efp-it"><span class="efp-ck ' + (done ? 'done' : 'plan') + '">' +
        (done ? ckDone : ckPlan) + '</span><span class="lbl">' + esc(it[0]) + '</span>' +
        (done ? '' : '<span class="pl">Planned</span>') + '</div>';
    }).join('');
    return '<div class="efp-sec"><div class="efp-sh"><span class="efp-dot" style="background:' + s.color + '"></span>' +
      '<h3>' + esc(s.title) + '</h3><a href="' + BASE + s.tag.split(' ')[0] + '">Open</a></div>' + items + '</div>';
  }).join('');

  var navHTML = NAV.map(function (n) {
    return '<a href="' + BASE + n[1] + '">' + esc(n[0]) + '</a>';
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
    '<p>Everything built so far, grouped by module. Use this as your presentation checklist.</p>' +
    '<button id="efp-x" type="button" aria-label="Close">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button></div>' +
    '<div id="efp-meter"><div id="efp-bar"><i style="width:' + pct + '%"></i></div><b>' + totDone + ' live</b></div>' +
    '<div id="efp-bd">' + secHTML + '</div>' +
    '<div id="efp-nav">' + navHTML + '</div>' +
    '<div id="efp-foot">Built features marked with a check · planned items dimmed</div>';

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
