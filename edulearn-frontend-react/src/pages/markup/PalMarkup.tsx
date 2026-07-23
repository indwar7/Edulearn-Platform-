/* Generated from edulearn-frontend/pal.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function PalMarkup() {
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
      <div className="app">
        {/* ============ SIDEBAR ============ */}
        <aside className="side" id="sidebar">
          <div className="roles" role="group" aria-label="Who is asking" id="roleSwitcher">
            <button className="role r-student is-on" data-role="student" type="button">
              Student
            </button>
            {' '}
            <button className="role r-parent" data-role="parent" type="button">
              Parent
            </button>
            {' '}
            <button className="role r-teacher" data-role="teacher" type="button">
              Teacher
            </button>
          </div>
          <button className="btn-new" id="newChat" type="button">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {" New chat "}
          </button>
          {' '}
          <span className="mono side__label">
            Recent chats
          </span>
          <div className="chatlist" id="chatList" />
          <div className="side__foot">
            PAL answers from the EduLearn syllabus and your activity on this device. Prototype — answers are generated locally.
          </div>
        </aside>
        {/* ============ CHAT PANE ============ */}
        <section className="pane">
          <div className="pane__head">
            <span className="pane__title">
              PAL
            </span>
            {' '}
            <span className="rolebadge" id="roleBadge" style={{ background: "var(--teal)" }}>
              Student mode
            </span>
            {' '}
            <span className="pane__hint">
              Ask in English or Hinglish
            </span>
          </div>
          <div className="thread" id="thread" aria-live="polite">
            <div className="thread__inner" id="threadInner" />
          </div>
          <div className="composer">
            <div className="composer__inner">
              <div className="box">
                <textarea id="input" rows={1} placeholder="Ask PAL anything..." aria-label="Message PAL" />
                {' '}
                <button className="send" id="sendBtn" type="button" aria-label="Send">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="composer__note">
                PAL can make mistakes — verify with your textbook before exams.
              </div>
            </div>
          </div>
        </section>
      </div>
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
    </>
  );
}
