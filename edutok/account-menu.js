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

  // ---------- styles ----------
  var css = '' +
    '.acct-fab{position:fixed;top:18px;right:18px;z-index:9000;display:flex;gap:8px;}' +
    '.acct-btn{width:42px;height:42px;border-radius:12px;border:1px solid rgba(140,150,170,.35);background:rgba(20,24,34,.7);backdrop-filter:blur(8px);color:#e8ecf4;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:transform .15s ease,border-color .15s ease;}' +
    '.acct-btn:hover{transform:translateY(-2px);border-color:#3DE8C5;}' +
    '.acct-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9100;opacity:0;pointer-events:none;transition:opacity .2s ease;}' +
    '.acct-overlay.open{opacity:1;pointer-events:auto;}' +
    '.acct-panel{position:fixed;top:0;right:0;height:100%;width:380px;max-width:92vw;background:#11141d;color:#e8ecf4;z-index:9200;transform:translateX(100%);transition:transform .25s ease;box-shadow:-12px 0 40px rgba(0,0,0,.4);overflow-y:auto;}' +
    '.acct-panel.open{transform:translateX(0);}' +
    '.acct-panel h2{margin:0;padding:22px 22px 6px;font-size:20px;}' +
    '.acct-panel .sub{padding:0 22px 16px;color:#8a90a2;font-size:13px;}' +
    '.acct-sec{border-top:1px solid #232838;padding:18px 22px;}' +
    '.acct-sec h3{margin:0 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a90a2;}' +
    '.acct-field{margin-bottom:13px;}' +
    '.acct-field label{display:block;font-size:12px;color:#aab0c0;margin-bottom:5px;}' +
    '.acct-field input,.acct-field select{width:100%;padding:10px 12px;border-radius:9px;border:1px solid #2a3040;background:#0c0f17;color:#e8ecf4;font-size:14px;box-sizing:border-box;}' +
    '.acct-field input:disabled{opacity:.5;}' +
    '.acct-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;font-size:14px;}' +
    '.acct-save{margin:6px 22px 14px;width:calc(100% - 44px);padding:12px;border:none;border-radius:10px;background:#3DE8C5;color:#08221d;font-weight:700;font-size:15px;cursor:pointer;}' +
    '.acct-save:disabled{opacity:.6;cursor:default;}' +
    '.acct-logout{margin:0 22px 26px;width:calc(100% - 44px);padding:12px;border:1px solid #E5484D;border-radius:10px;background:transparent;color:#ff7a7e;font-weight:700;font-size:15px;cursor:pointer;}' +
    '.acct-msg{margin:0 22px 12px;font-size:13px;}' +
    '.acct-msg.ok{color:#3DE8C5;}.acct-msg.err{color:#ff7a7e;}';
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
  var prefs = user.preferences || { language: 'en', theme: 'system', emailNotifications: true };
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
    '<h2>Settings</h2>' +
    '<div class="sub">' + esc(user.name) + ' · ' + (user.role || '').toUpperCase() + '</div>' +
    '<div class="acct-msg" id="acctMsg" style="display:none"></div>' +
    '<div class="acct-sec"><h3>Profile</h3>' + fieldsForRole(user) + '</div>' +
    '<div class="acct-sec"><h3>Preferences</h3>' +
      '<div class="acct-field"><label>Language</label><select id="acctLang">' +
        '<option value="en"' + (prefs.language==='en'?' selected':'') + '>English</option>' +
        '<option value="hi"' + (prefs.language==='hi'?' selected':'') + '>हिन्दी</option>' +
      '</select></div>' +
      '<div class="acct-field"><label>Theme</label><select id="acctTheme">' +
        '<option value="system"' + (prefs.theme==='system'?' selected':'') + '>System</option>' +
        '<option value="light"' + (prefs.theme==='light'?' selected':'') + '>Light</option>' +
        '<option value="dark"' + (prefs.theme==='dark'?' selected':'') + '>Dark</option>' +
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

  document.getElementById('acctSave').addEventListener('click', async function(){
    var btn = this; btn.disabled = true; btn.textContent = 'Saving…';
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
