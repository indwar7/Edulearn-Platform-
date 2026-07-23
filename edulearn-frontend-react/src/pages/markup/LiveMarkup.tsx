/* Generated from edulearn-frontend/live.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function LiveMarkup() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="48%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
        </defs>
      </svg>
      {' '}
      <main className="wrap">
        {/* ============ BROWSE ============ */}
        <div id="browseView">
          <section className="hero">
            <div className="mono rv" style={{ animationDelay: ".05s" }}>
              <span style={{ color: "var(--cream)" }}>
                Live
              </span>
            </div>
            <h1 className="rv" id="liveHero" style={{ animationDelay: ".12s", marginTop: "14px" }}>
              {"Learn live, "}
              <em>
                face to face.
              </em>
            </h1>
            <p className="hero__sub rv" style={{ animationDelay: ".2s" }}>
              Small-group classes with real tutors. Book a seat, get it on your calendar, join in one tap.
            </p>
            <div className="hero__chips rv" style={{ animationDelay: ".28s" }}>
              <span className="chip">
                <span className="dot" />
                Max 15 students per class
              </span>
              {' '}
              <span className="chip">
                <span className="dot" />
                AI camera attention report after every session
              </span>
            </div>
            <div className="hero__cta rv" style={{ animationDelay: ".34s" }}>
              <button className="btn-try" id="tryAttn" type="button">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {" Try AI attention monitoring "}
              </button>
              {' '}
              <span className="hero__cta-note">
                Joins a demo class and asks for camera permission
              </span>
            </div>
          </section>
          <section className="split">
            <div>
              {/* Teacher: start a real live class (shown only for teacher accounts) */}
              <div className="pcard rv composer" id="teacherComposer" style={{ animationDelay: ".3s" }}>
                <div className="pcard__eyebrow">
                  Start a live class
                </div>
                <form id="startForm" className="composer__form">
                  <input
                    id="startTitle"
                    type="text"
                    className="composer__field"
                    placeholder="Class topic, e.g. Photosynthesis"
                    required={true}
                   />
                  {' '}
                  <select id="startAssign" className="composer__field" required={true} />
                  {' '}
                  <input
                    id="startMeetLink"
                    type="url"
                    className="composer__field"
                    placeholder="Optional: paste a Google Meet link (meet.google.com/...) to use Meet instead of in-app video"
                    pattern="https://meet\\.google\\.com/.*"
                   />
                  {' '}
                  <button className="btn-try composer__go" type="submit">
                    Go live
                  </button>
                  {' '}
                  <span id="startMsg" className="empty-hint composer__msg" />
                </form>
              </div>
              {/* Join with a class code */}
              <div
                className="rv"
                id="joinCodeBox"
                style={{ animationDelay: ".30s", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "22px" }}
              >
                <input
                  id="joinCodeInput"
                  type="text"
                  className="composer__field"
                  style={{ flex: "1", minWidth: "180px", textTransform: "uppercase", letterSpacing: "1px" }}
                  placeholder="Have a code? e.g. SCI-7A-4821"
                  autoComplete="off"
                  spellCheck="false"
                 />
                {' '}
                <button className="btn-join" id="joinCodeBtn" type="button">
                  Join with code
                </button>
                {' '}
                <span id="joinCodeMsg" className="empty-hint" style={{ flexBasis: "100%", margin: "0" }} />
              </div>
              {/* Real backend sessions (live now, eligibility-checked) */}
              <h2
                className="sect-title rv"
                id="liveNowTitle"
                style={{ animationDelay: ".32s", display: "none" }}
              >
                Live now
              </h2>
              <div className="sessions" id="liveGrid" style={{ marginBottom: "26px" }} />
              <h2 className="sect-title rv" style={{ animationDelay: ".34s" }} id="todayTitle">
                Today’s sessions
              </h2>
              <div className="sessions" id="sessionGrid" />
            </div>
            <aside className="panel">
              <div className="pcard rv" style={{ animationDelay: ".4s" }}>
                <div className="pcard__eyebrow">
                  My sessions
                </div>
                <div id="myList">
                  <p className="empty-hint">
                    Nothing booked yet — grab a seat from today’s sessions.
                  </p>
                </div>
              </div>
              <div className="pcard rv" style={{ animationDelay: ".48s" }}>
                <div className="pcard__eyebrow">
                  Past session reports
                </div>
                <div id="reportList">
                  <p className="empty-hint">
                    Join a class and your attentiveness report will appear here — and on the parent dashboard.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
        {/* ============ CLASSROOM ============ */}
        <div id="classView">
          <div className="cls-head">
            <span className="tag tag--live">
              Live
            </span>
            <h2 id="clsTopic">
              Class
            </h2>
            <span className="mono" id="clsClock">
              00:00
            </span>
            {' '}
            <span className="mono" id="clsCount" style={{ display: "none" }} />
            <div className="attn">
              <div className="attn__ring">
                <svg width="54" height="54" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="22" fill="none" stroke="var(--line)" strokeWidth="5" />
                  <circle
                    id="attnArc"
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="138.2"
                    strokeDashoffset="0"
                   />
                </svg>
                {' '}
                <span className="attn__num" id="attnNum">
                  100
                </span>
              </div>
              <span className="attn__label">
                Attentiveness — tracked for your parent report
              </span>
            </div>
          </div>
          <div className="cam-consent" id="camConsent">
            <div className="cam-consent__ic">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="cam-consent__body">
              <b>
                Turn on camera attention monitoring
              </b>
              {' '}
              <span>
                PAL watches whether you're looking at the screen and shares a focus report with your parent and teacher. Video stays on your device — only the attention score is saved.
              </span>
            </div>
            <div className="cam-consent__acts">
              <button className="btn-cam" id="enableCam" type="button">
                Enable camera
              </button>
              {' '}
              <button className="btn-skip" id="skipCam" type="button">
                Not now
              </button>
            </div>
          </div>
          <div className="stagegrid">
            <div>
              <div className="stage">
                {/* Real LiveKit video stage (shown when connected) */}
                <div id="lkStage" style={{ display: "none", width: "100%" }}>
                  <video
                    id="lkMainVideo"
                    autoPlay={true}
                    playsInline={true}
                    style={{ width: "100%", borderRadius: "14px", background: "#000", maxHeight: "60vh" }}
                   />
                </div>
                {/* Real in-app lecture stage: plays an actual lecture video as the
                 class content (used when there's no live LiveKit broadcast).
                 Camera attention monitoring runs alongside in the same tab. */}
                <div id="lectureStage" style={{ display: "none", width: "100%", position: "relative" }}>
                  <video
                    id="lectureVideo"
                    playsInline={true}
                    controls={true}
                    controlsList="nodownload"
                    style={{ width: "100%", borderRadius: "14px", background: "#000", maxHeight: "60vh", display: "block" }}
                   />
                  <span
                    id="lectureTitle"
                    style={{ position: "absolute", top: "12px", left: "14px", background: "rgba(8,14,30,.6)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "6px 12px", borderRadius: "9px", maxWidth: "80%" }}
                   />
                </div>
                {/* Kept outside #lkStage so connection/permission errors stay
                 visible even when the stage is hidden (e.g. still showing the
                 placeholder avatar) instead of disappearing along with it. */}
                <div
                  id="lkStatus"
                  style={{ marginTop: "8px", fontFamily: "'Fragment Mono',monospace", fontSize: "12px", color: "var(--muted)" }}
                 />
                <div className="stage__avatar" id="simAvatar" style={{ display: "none" }}>
                  <div className="stage__circle" id="tutorCircle">
                    PS
                  </div>
                  <div className="wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                {/* Static chalkboard shown as the tutor's screen: polynomial formulas
                 written on a board (fallback when there's no live video). */}
                <div className="board" id="boardStage">
                  <div className="board__head">
                    {"Polynomials — Formula Board "}
                    <small>
                      Class 9 · Maths
                    </small>
                  </div>
                  <div className="board__grid">
                    <div>
                      p(x) = ax
                      <b>
                        ³
                      </b>
                      {" + bx"}
                      <b>
                        ²
                      </b>
                      {" + cx + d"}
                    </div>
                    <div>
                      (a + b)
                      <b>
                        ²
                      </b>
                      {" = a"}
                      <b>
                        ²
                      </b>
                      {" + 2ab + b"}
                      <b>
                        ²
                      </b>
                    </div>
                    <div>
                      (a − b)
                      <b>
                        ²
                      </b>
                      {" = a"}
                      <b>
                        ²
                      </b>
                      {" − 2ab + b"}
                      <b>
                        ²
                      </b>
                    </div>
                    <div>
                      a
                      <b>
                        ²
                      </b>
                      {" − b"}
                      <b>
                        ²
                      </b>
                      {" = (a + b)(a − b)"}
                    </div>
                    <div>
                      (x + a)(x + b) = x
                      <b>
                        ²
                      </b>
                      {" + (a+b)x + ab"}
                    </div>
                    <div>
                      (a + b)
                      <b>
                        ³
                      </b>
                      {" = a"}
                      <b>
                        ³
                      </b>
                      {" + 3a"}
                      <b>
                        ²
                      </b>
                      b + 3ab
                      <b>
                        ²
                      </b>
                      {" + b"}
                      <b>
                        ³
                      </b>
                    </div>
                    <div>
                      <span className="sub">
                        Factor thm:
                      </span>
                      {" p(a)=0 ⇒ (x−a) is a factor"}
                    </div>
                    <div>
                      <span className="sub">
                        Remainder thm:
                      </span>
                      {" p(x)÷(x−a) ⇒ rem = p(a)"}
                    </div>
                  </div>
                </div>
                <span className="stage__name" id="tutorName">
                  Priya Sharma · Tutor
                </span>
                {' '}
                <span className="handchip" id="handChip">
                  Hand raised
                </span>
                <div className="selftile" id="selfTile">
                  <video id="selfCam" autoPlay={true} muted={true} playsInline={true} />
                  <span className="self-fallback" id="selfFallback">
                    <span className="you" id="selfInitials">
                      You
                    </span>
                  </span>
                  {' '}
                  <span className="gaze-badge" id="gazeBadge">
                    Looking
                  </span>
                  {' '}
                  <span className="st" id="selfStatus">
                    mic on · cam on
                  </span>
                </div>
              </div>
              <div className="stage__note" id="stageNote">
                Prototype classroom — tutor tile simulated. Your tile uses your real camera for attention monitoring.
              </div>
              <div className="controls">
                <button className="ctl" id="micBtn" type="button">
                  Mic on
                </button>
                {' '}
                <button className="ctl" id="camBtn" type="button">
                  Camera on
                </button>
                {' '}
                <button className="ctl" id="handBtn" type="button">
                  Raise hand
                </button>
                {' '}
                <button className="ctl ctl--leave" id="leaveBtn" type="button">
                  Leave class
                </button>
              </div>
            </div>
            <div>
              {/* Teacher-only: live class roster (who has joined / who's missing) */}
              <div className="roster" id="roster">
                <div className="roster__head">
                  <span>
                    Class roster
                  </span>
                  <span className="roster__count" id="rosterCount">
                    0 / 0 joined
                  </span>
                </div>
                <div className="roster__list" id="rosterList" />
              </div>
              {/* Student-only: "you've been called on" prompt */}
              <div className="calledon" id="calledOn">
                <span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ display: "block" }}
                  >
                    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
                    <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
                    <path
                      d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
                     />
                  </svg>
                </span>
                {' '}
                <span>
                  <b id="calledByName">
                    Your teacher
                  </b>
                  {" called on you"}
                  <span id="calledText" />
                </span>
                {' '}
                <span className="calledon__x" id="calledOnClose">
                  Dismiss
                </span>
              </div>
              <div className="chat">
                <div className="chat__head">
                  <span>
                    Class chat
                  </span>
                  <span className="mono" id="chatHint">
                    +5 attention per question
                  </span>
                </div>
                <div className="chat__log" id="chatLog" aria-live="polite" />
                <div className="chat__tagged" id="chatTagged">
                  {"Tagging "}
                  <b id="chatTaggedName" style={{ margin: "0 2px" }} />
                  <button type="button" id="chatTaggedClear" aria-label="Clear tag">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ display: "block" }}
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <form className="chat__form" id="chatForm">
                  <input
                    type="text"
                    id="chatInput"
                    placeholder="Ask a doubt..."
                    autoComplete="off"
                    aria-label="Chat message"
                   />
                  {' '}
                  <button className="chat__send" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* ============ REPORT ============ */}
        <div id="reportView">
          <div className="report">
            <div className="mono">
              Session report
            </div>
            <h2 id="repTopic">
              Session
            </h2>
            <div className="mono" id="repDate" />
            <div className="report__top">
              <div className="bigring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="9" />
                  <circle
                    id="repArc"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#auroraGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="314.2"
                    strokeDashoffset="314.2"
                   />
                </svg>
                {' '}
                <span className="bigring__num" id="repScore">
                  0
                </span>
              </div>
              <div className="verdict" id="repVerdict" />
            </div>
            <div className="stats" id="repStats" />
            <div className="mono" style={{ marginTop: "18px" }}>
              Attention timeline
            </div>
            <div className="tl" id="repTimeline" />
            <div className="sentbanner">
              <span className="mono">
                Sent
              </span>
              {" Report sent to parent — visible on the Parent dashboard. "}
            </div>
            <div className="report__acts">
              <button className="btn-primary" id="backBtn" type="button">
                Back to live classes
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="wrap footer__base">
        <span className="mono">
          © 2026 EduLearn Learning Pvt. Ltd. · Bengaluru, Bharat
        </span>
      </footer>
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
    </>
  );
}
