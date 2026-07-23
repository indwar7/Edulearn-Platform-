/* Generated from edulearn-frontend/challenge.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function ChallengeMarkup() {
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
        <section className="hero">
          <div className="mono rv" style={{ animationDelay: ".05s" }}>
            <span style={{ color: "var(--cream)" }}>
              Arena
            </span>
          </div>
          <h1 className="rv" style={{ animationDelay: ".12s", marginTop: "14px" }}>
            {"One question. "}
            <em>
              Every hour.
            </em>
          </h1>
          <p className="hero__sub rv" style={{ animationDelay: ".2s" }}>
            The whole school sees the same question at the same time. 45 seconds on the clock — nobody can google that fast.
          </p>
          <div className="hero__chips rv" style={{ animationDelay: ".28s" }}>
            <span className="chip">
              <span className="dot" />
              Next drop at the top of every hour
            </span>
            {' '}
            <span className="chip">
              <span className="dot" />
              45s window — too fast to cheat
            </span>
          </div>
        </section>
        <section className="split">
          <div>
            <div className="play rv" style={{ animationDelay: ".34s" }} id="playCard" />
            <div className="hist" id="histWrap" style={{ display: "none" }}>
              <h3>
                Past drops
              </h3>
              <div id="histList" />
            </div>
          </div>
          <aside className="panel">
            <div className="pcard rv" style={{ animationDelay: ".42s" }}>
              <div className="pcard__eyebrow">
                Your stats
              </div>
              <div className="bignum" id="statPoints">
                0
              </div>
              <div className="mono" style={{ margin: "2px 0 14px" }}>
                Total points
              </div>
              <div className="statrow">
                <span>
                  Current streak
                </span>
                <b id="statStreak">
                  0
                </b>
              </div>
              <div className="statrow">
                <span>
                  Best streak
                </span>
                <b id="statBest">
                  0
                </b>
              </div>
              <div className="statrow">
                <span>
                  Accuracy
                </span>
                <b id="statAcc">
                  —
                </b>
              </div>
              <div className="statrow">
                <span>
                  Hours played
                </span>
                <b id="statPlayed">
                  0
                </b>
              </div>
            </div>
            <div className="pcard rv" style={{ animationDelay: ".5s" }}>
              <div className="pcard__eyebrow" id="lbEyebrow">
                This hour’s leaderboard
              </div>
              <div className="lb" id="lbList" />
            </div>
            <div className="pcard rv" style={{ animationDelay: ".58s" }}>
              <div className="pcard__eyebrow">
                How it works
              </div>
              <div className="how">
                <div className="how__row">
                  <span className="how__num">
                    1
                  </span>
                  <span>
                    A question drops every hour — the same one for everyone.
                  </span>
                </div>
                <div className="how__row">
                  <span className="how__num">
                    2
                  </span>
                  <span>
                    45 seconds to answer. Speed is the anti-cheat.
                  </span>
                </div>
                <div className="how__row">
                  <span className="how__num">
                    3
                  </span>
                  <span>
                    Points for speed, streak bonus for showing up every hour.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>
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
    </>
  );
}
