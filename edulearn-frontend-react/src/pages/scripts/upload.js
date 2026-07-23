/* Lifted verbatim from edulearn-frontend/upload.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{document.documentElement.classList.remove('dark-mode');localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


    var API = (window.EduAPI && EduAPI.API_BASE) || (localStorage.getItem('edulearn_api') || '/backend-api');
    var user = EduAPI.getUser();
    // Only teachers (admin role-as-teacher) may upload.
    if (!user || user.role !== 'teacher') {
      document.getElementById('form').style.display = 'none';
      document.getElementById('gate').style.display = 'block';
    }

    // Pre-select the teacher's OWN class + subject so a lecture is uploaded for
    // the class they actually teach — students of that class then see it.
    (function preselectTeacherClass(){
      if (!user || user.role !== 'teacher') return;
      var teaches = (user.teaches && user.teaches.length) ? user.teaches
                  : (user.className ? [{ className: user.className, subject: user.subject }] : []);
      if (!teaches.length) return;
      var t = teaches[0];
      function setSelect(id, val){
        var sel = document.getElementById(id);
        if (!sel || !val) return;
        var want = String(val).trim().toLowerCase();
        for (var i = 0; i < sel.options.length; i++){
          if (sel.options[i].text.trim().toLowerCase() === want){ sel.selectedIndex = i; return; }
        }
      }
      setSelect('className', t.className);
      setSelect('subject', t.subject);
      // If the teacher teaches multiple subjects/classes, let them pick — but
      // limit the class dropdown to classes they actually teach.
      var classSel = document.getElementById('className');
      if (classSel){
        var myClasses = {};
        teaches.forEach(function(x){ if (x.className) myClasses[String(x.className).trim().toLowerCase()] = true; });
        Array.prototype.slice.call(classSel.options).forEach(function(o){
          if (!myClasses[o.text.trim().toLowerCase()]) o.disabled = true;
        });
        setSelect('className', t.className);
      }
    })();

    var fileInput = document.getElementById('file');
    var drop = document.getElementById('drop');
    drop.addEventListener('click', function(){ fileInput.click(); });
    fileInput.addEventListener('change', function(){
      if (fileInput.files[0]) document.getElementById('fileName').textContent = '✓ ' + fileInput.files[0].name;
    });
    ['dragover','dragenter'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave','drop'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function(ev){
      if (ev.dataTransfer.files[0]){ fileInput.files = ev.dataTransfer.files; document.getElementById('fileName').textContent = '✓ ' + ev.dataTransfer.files[0].name; }
    });

    function msg(text, ok){ var m = document.getElementById('msg'); m.textContent = text; m.className = 'msg ' + (ok?'ok':'err'); }

    document.getElementById('submit').addEventListener('click', function(){
      var title = document.getElementById('title').value.trim();
      var file = fileInput.files[0];
      if (!title){ msg('Please enter a title.', false); return; }
      if (!file){ msg('Please choose a video file.', false); return; }

      var fd = new FormData();
      fd.append('title', title);
      fd.append('className', document.getElementById('className').value);
      fd.append('subject', document.getElementById('subject').value);
      fd.append('topic', document.getElementById('topic').value.trim());
      fd.append('description', document.getElementById('description').value.trim());
      fd.append('uploaderName', user.name || '');
      fd.append('video', file);

      var btn = document.getElementById('submit'); btn.disabled = true; btn.textContent = 'Uploading…';
      var bar = document.getElementById('bar'); bar.style.display = 'block';
      var fill = document.getElementById('barFill');

      // XHR for real upload progress.
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API + '/api/videos');
      xhr.setRequestHeader('Authorization', 'Bearer ' + EduAPI.getToken());
      xhr.upload.onprogress = function(e){ if (e.lengthComputable) fill.style.width = Math.round(e.loaded/e.total*100) + '%'; };
      xhr.onload = function(){
        btn.disabled = false; btn.textContent = 'Upload Lecture';
        if (xhr.status === 201){
          msg('✓ Uploaded! Students in this class can now watch it.', true);
          document.getElementById('title').value=''; document.getElementById('fileName').textContent=''; fileInput.value='';
          setTimeout(function(){ fill.style.width='0'; bar.style.display='none'; }, 1200);
        } else {
          try { msg(JSON.parse(xhr.responseText).error || 'Upload failed', false); } catch(e){ msg('Upload failed ('+xhr.status+')', false); }
        }
      };
      xhr.onerror = function(){ btn.disabled=false; btn.textContent='Upload Lecture'; msg('Cannot reach server. Is the backend running?', false); };
      xhr.send(fd);
    });
  
}
