/* ============================================================
   EduLearn — shared account menu (settings + logout)
   Self-injects a gear + logout button (fixed, top-right) and a
   slide-in Settings panel with role-specific fields + preferences.
   Works on every page. Must load AFTER api.js.
   ============================================================ */
(function () {
  if (!window.EduAPI) return; // api.js missing → skip silently
  var user = EduAPI.getUser();
  if (!user) return; // not logged in → no account menu

  // ---------- nav access control lives in role-guard.js ----------
  // Hiding the "Start free" CTA, rewriting the brand link, and hiding nav
  // links the current role may not use is now owned by role-guard.js (the
  // single source of truth, loaded in <head> before the body paints). This
  // file only renders the settings/logout panel below.

  // ---------- styles (theme-aware: light default + dark-mode override) ----------
  var css = '' +
    ':root{--am-bg:#FFFFFF;--am-bg2:#F5F7FA;--am-ink:#1A1F36;--am-muted:#6B7280;--am-line:rgba(15,23,42,.10);--am-aurora:linear-gradient(115deg,#3DE8C5 0%,#7C9BFF 48%,#FFB454 100%);}' +
    'html.dark-mode{--am-bg:#0F172A;--am-bg2:#1E293B;--am-ink:#F5F7FA;--am-muted:#94A3B8;--am-line:rgba(255,255,255,.12);}' +
    ".acct-fab{position:fixed;top:18px;right:18px;z-index:9000;display:flex;gap:8px;font-family:'Schibsted Grotesk',system-ui,sans-serif;}" +
    '.acct-btn{width:44px;height:44px;border-radius:13px;border:1px solid var(--am-line);background:var(--am-bg);backdrop-filter:blur(10px);color:var(--am-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 6px 20px rgba(15,23,42,.10);transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease;}' +
    '.acct-btn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 10px 28px rgba(61,232,197,.28);}' +
    '.acct-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);z-index:9100;opacity:0;pointer-events:none;transition:opacity .25s ease;}' +
    '.acct-overlay.open{opacity:1;pointer-events:auto;}' +
    ".acct-panel{position:fixed;top:0;right:0;height:100%;width:400px;max-width:92vw;background:var(--am-bg);color:var(--am-ink);z-index:9200;transform:translateX(102%);transition:transform .32s cubic-bezier(.22,1,.36,1);box-shadow:-16px 0 50px rgba(15,23,42,.22);overflow-y:auto;font-family:'Schibsted Grotesk',system-ui,sans-serif;}" +
    '.acct-panel.open{transform:translateX(0);}' +
    '.acct-panel .am-hd{padding:26px 24px 18px;background:var(--am-bg2);border-bottom:1px solid var(--am-line);position:relative;}' +
    '.acct-panel .am-hd::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--am-aurora);}' +
    ".acct-panel h2{margin:0;font-family:'Fraunces',serif;font-weight:480;font-size:24px;}" +
    '.acct-panel .sub{margin-top:6px;color:var(--am-muted);font-size:12px;font-family:"Fragment Mono",monospace;letter-spacing:.04em;}' +
    '.acct-sec{padding:20px 24px;border-bottom:1px solid var(--am-line);}' +
    '.acct-sec h3{margin:0 0 14px;font-family:"Fragment Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--am-muted);}' +
    '.acct-field{margin-bottom:14px;}' +
    '.acct-field label{display:block;font-size:12px;color:var(--am-muted);margin-bottom:6px;}' +
    '.acct-field input,.acct-field select{width:100%;padding:11px 13px;border-radius:11px;border:1px solid var(--am-line);background:var(--am-bg2);color:var(--am-ink);font-size:14px;box-sizing:border-box;font-family:inherit;transition:border-color .2s ease,box-shadow .2s ease;}' +
    '.acct-field input:focus,.acct-field select:focus{outline:none;border-color:#3DE8C5;box-shadow:0 0 0 3px rgba(61,232,197,.15);}' +
    '.acct-field input:disabled{opacity:.55;cursor:not-allowed;}' +
    '.acct-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;font-size:14px;}' +
    '.acct-save{margin:18px 24px 12px;width:calc(100% - 48px);padding:13px;border:none;border-radius:12px;background:var(--am-aurora);color:#0B1224;font-weight:700;font-size:15px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}' +
    '.acct-save:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(61,232,197,.3);}' +
    '.acct-save:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none;}' +
    '.acct-logout{margin:0 24px 28px;width:calc(100% - 48px);padding:12px;border:1px solid rgba(226,76,77,.4);border-radius:12px;background:transparent;color:#E2484D;font-weight:700;font-size:14px;cursor:pointer;transition:background .2s ease;}' +
    '.acct-logout:hover{background:rgba(226,76,77,.08);}' +
    '.acct-msg{margin:14px 24px 0;font-size:13px;padding:10px 12px;border-radius:10px;}' +
    '.acct-msg.ok{color:#0FA983;background:rgba(15,169,131,.1);}.acct-msg.err{color:#C2181C;background:rgba(226,76,77,.1);}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ---------- role-specific editable fields ----------
  function fieldsForRole(u) {
    var common =
      '<div class="acct-field"><label>Full Name</label><input id="acctName" value="' + esc(u.name || '') + '"></div>' +
      '<div class="acct-field"><label>Email (read-only)</label><input value="' + esc(u.email || '') + '" disabled></div>';
    if (u.role === 'student') {
      return common +
        '<div class="acct-field"><label>Class</label><select id="acctClass">' + classOpts(u.className) + '</select></div>' +
        '<div class="acct-field"><label>Section</label><select id="acctSection">' + secOpts(u.section) + '</select></div>' +
        '<div class="acct-field"><label>Board</label><select id="acctBoard">' + boardOpts(u.board) + '</select></div>' +
        '<div class="acct-field"><label>Roll Number (read-only)</label><input value="' + esc(u.rollNumber || '') + '" disabled></div>';
    }
    if (u.role === 'teacher') {
      return common +
        '<div class="acct-field"><label>Teacher ID (read-only)</label><input value="' + esc(u.teacherId || '') + '" disabled></div>';
    }
    // parent
    return common;
  }
  function classOpts(v){ return opts(['Class 6','Class 7','Class 8','Class 9'], v); }
  function secOpts(v){ return opts(['A','B','C'], v); }
  function boardOpts(v){ return opts(['CBSE','ICSE','State'], v); }
  function opts(arr, sel){ return arr.map(function(o){ return '<option'+(o===sel?' selected':'')+'>'+o+'</option>'; }).join(''); }
  function esc(s){ return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

  // ---------- build panel ----------
  var prefs = user.preferences || { language: 'en', theme: 'dark', emailNotifications: true };
  // The theme currently applied on this device (explicit choice only).
  var currentTheme = 'dark';
  try { currentTheme = localStorage.getItem('edulearn-theme') || (prefs.theme === 'light' ? 'light' : 'dark'); } catch (e) {}
  if (currentTheme !== 'light') currentTheme = 'dark';
  var fab = document.createElement('div');
  fab.className = 'acct-fab';
  fab.innerHTML =
    '<button class="acct-btn" id="acctGear" title="Settings" aria-label="Settings">⚙️</button>' +
    '<button class="acct-btn" id="acctQuickLogout" title="Logout" aria-label="Logout">🚪</button>';
  document.body.appendChild(fab);

  var overlay = document.createElement('div');
  overlay.className = 'acct-overlay';
  document.body.appendChild(overlay);

  var panel = document.createElement('aside');
  panel.className = 'acct-panel';
  panel.setAttribute('aria-label', 'Account settings');
  panel.innerHTML =
    '<div class="am-hd"><h2>Settings</h2>' +
    '<div class="sub">' + esc(user.name) + ' · ' + (user.role || '').toUpperCase() + '</div></div>' +
    '<div class="acct-msg" id="acctMsg" style="display:none"></div>' +
    '<div class="acct-sec"><h3>Profile</h3>' + fieldsForRole(user) + '</div>' +
    '<div class="acct-sec"><h3>Preferences</h3>' +
      // Hindi disabled platform-wide (learn.html's ~190 chapter titles have no
      // Hindi text yet) — English only, no switcher, not even here.
      '<div class="acct-field"><label>Language</label><select id="acctLang" disabled>' +
        '<option value="en" selected>English</option>' +
      '</select></div>' +
      // Theme is explicit-only (Dark / Light). No "System" option, so the theme
      // NEVER changes on its own with the OS — it only changes when the user
      // picks it here. Current value comes from the applied theme.
      '<div class="acct-field"><label>Theme</label><select id="acctTheme">' +
        '<option value="light"' + (currentTheme==='light'?' selected':'') + '>Light</option>' +
        '<option value="dark"' + (currentTheme!=='light'?' selected':'') + '>Dark</option>' +
      '</select></div>' +
      '<div class="acct-row"><span>Email notifications</span>' +
        '<input type="checkbox" id="acctEmail"' + (prefs.emailNotifications?' checked':'') + '></div>' +
    '</div>' +
    '<button class="acct-save" id="acctSave">Save changes</button>' +
    '<button class="acct-logout" id="acctLogout">Log out</button>';
  document.body.appendChild(panel);

  // ---------- behaviour ----------
  function open(){ overlay.classList.add('open'); panel.classList.add('open'); }
  function close(){ overlay.classList.remove('open'); panel.classList.remove('open'); }
  document.getElementById('acctGear').addEventListener('click', open);
  overlay.addEventListener('click', close);
  document.getElementById('acctQuickLogout').addEventListener('click', function(){ EduAPI.logout(); });
  document.getElementById('acctLogout').addEventListener('click', function(){ EduAPI.logout(); });

  function val(id){ var el = document.getElementById(id); return el ? el.value : undefined; }
  function msg(text, ok){
    var m = document.getElementById('acctMsg');
    m.textContent = text; m.className = 'acct-msg ' + (ok ? 'ok' : 'err'); m.style.display = 'block';
  }

  // ---------- theme: apply from Settings (replaces the removed auth-page toggle) ----------
  // Explicit only: the theme is exactly what the user picked (dark/light). It is
  // NEVER derived from the OS, so it never changes on its own — only when the
  // user changes it here. App pages theme via the `dark-mode` class (theme.js);
  // login/signup read the same 'edulearn-theme' key.
  function applyTheme(pref){
    var mode = (pref === 'light') ? 'light' : 'dark';
    var root = document.documentElement;
    root.classList.toggle('dark-mode', mode === 'dark');
    try { localStorage.setItem('edulearn-theme', mode); } catch (e) {}
    if (window.themeManager && typeof themeManager.setDarkMode === 'function') {
      // keep theme.js's toggle buttons/icons in sync where present
      try { themeManager.setDarkMode(mode === 'dark'); } catch (e) {}
    }
  }
  // live preview: apply as soon as the user changes the dropdown
  var themeSel = document.getElementById('acctTheme');
  if (themeSel) themeSel.addEventListener('change', function(){ applyTheme(themeSel.value); });

  document.getElementById('acctSave').addEventListener('click', async function(){
    var btn = this; btn.disabled = true; btn.textContent = 'Saving…';
    applyTheme(val('acctTheme')); // apply immediately on save too
    var body = { name: val('acctName'), preferences: {
      language: val('acctLang'), theme: val('acctTheme'),
      emailNotifications: document.getElementById('acctEmail').checked
    }};
    if (user.role === 'student'){
      body.className = val('acctClass');
      body.section = val('acctSection');
      body.board = val('acctBoard');
    }
    try {
      await EduAPI.updateProfile(body);
      msg('Saved! Your profile has been updated.', true);
    } catch (e){
      msg(e.message, false);
    }
    btn.disabled = false; btn.textContent = 'Save changes';
  });
})();
