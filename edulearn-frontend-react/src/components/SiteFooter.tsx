import { Link } from 'react-router-dom';

/**
 * Marketing footer for the public landing page (the logged-out home — Landing
 * redirects signed-in visitors to the dashboard, so this is only ever seen
 * logged out). Ported from the static site's site footer but self-contained:
 * its own `sf-` classes and hard-coded colours, so it does not depend on any
 * page's CSS variables and cannot be restyled by another page's stylesheet.
 * The feature links point at /login since the visitor isn't signed in yet.
 */
const PRODUCT = [
  ['Learn', '/login'],
  ['Live', '/login'],
  ['Arena', '/login'],
  ['Tests', '/login'],
  ['PAL AI', '/login'],
  ['Dashboard', '/login'],
];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9'];
const COMPANY = ['About', 'Careers', 'For schools', 'Contact'];
const LANGUAGES = ['हिंदी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ગુજરાતી'];

export default function SiteFooter() {
  return (
    <footer className="sf">
      <style>{SF_CSS}</style>
      <div className="sf__inner">
        <div className="sf__mark" aria-hidden="true">EduLearn</div>
        <div className="sf__cols">
          <div className="sf__brand">
            <Link className="sf__logo" to="/" aria-label="EduLearn home">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z" fill="url(#auroraGrad)" />
              </svg>
              <span className="sf__word">EduLearn</span>
            </Link>
            <p className="sf__tag">Made for Bharat. Works fully offline.</p>
            <p className="sf__boards">CBSE · NCERT · 20+ State Boards</p>
          </div>

          <div className="sf__col">
            <h4>Product</h4>
            <ul>
              {PRODUCT.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
              <li><Link to="/login">Pricing — ₹299/mo</Link></li>
            </ul>
          </div>

          <div className="sf__col">
            <h4>Classes</h4>
            <ul>
              {CLASSES.map((c) => (
                <li key={c}><Link to="/login">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div className="sf__col">
            <h4>Company</h4>
            <ul>
              {COMPANY.map((c) => (
                <li key={c}><a href="/#features">{c}</a></li>
              ))}
            </ul>
          </div>

          <div className="sf__col">
            <h4>Languages</h4>
            <ul>
              {LANGUAGES.map((l) => (
                <li key={l}><span>{l}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sf__base">
          <span className="sf__mono">© 2026 EduLearn Learning Pvt. Ltd. · Bengaluru, Bharat</span>
          <span className="sf__mono">
            <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

const SF_CSS = `
.sf{position:relative;overflow:hidden;background:#fff;border-top:1px solid rgba(15,23,42,.08);}
.sf__inner{max-width:1280px;margin:0 auto;padding:64px 40px 40px;position:relative;}
.sf__mark{position:absolute;left:8px;bottom:-40px;font-family:'Fraunces',serif;font-weight:600;font-size:clamp(90px,14vw,210px);line-height:1;letter-spacing:-.03em;color:rgba(14,15,20,.05);pointer-events:none;user-select:none;white-space:nowrap;}
.sf__cols{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1fr;gap:32px;position:relative;z-index:2;margin-bottom:56px;}
.sf__brand{display:flex;flex-direction:column;gap:14px;align-items:flex-start;}
.sf__logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none;}
.sf__word{font-family:'Fraunces',serif;font-weight:800;font-size:20px;letter-spacing:-.02em;color:#0B1224;}
.sf__tag{font-size:14.5px;color:#5B6472;max-width:260px;line-height:1.6;margin:0;}
.sf__boards{font-family:'Fragment Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#5B6472;margin:0;}
.sf__col h4{font-family:'Fragment Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:400;color:#5B6472;margin:0 0 16px;}
.sf__col ul{list-style:none;display:flex;flex-direction:column;gap:11px;margin:0;padding:0;}
.sf__col a,.sf__col span{font-size:14.5px;color:#0B1224;text-decoration:none;font-weight:600;}
.sf__col a:hover{color:#3F5BE0;text-decoration:underline;}
.sf__base{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;position:relative;z-index:2;padding-top:22px;border-top:1px solid rgba(15,23,42,.08);}
.sf__mono{font-family:'Fragment Mono',monospace;font-size:11px;letter-spacing:.06em;color:#5B6472;}
.sf__base a{color:#3F5BE0;text-decoration:none;}
.sf__base a:hover{text-decoration:underline;}
@media (max-width:900px){.sf__cols{grid-template-columns:1fr 1fr;row-gap:36px;}}
@media (max-width:520px){.sf__cols{grid-template-columns:1fr;}.sf__inner{padding:48px 22px 32px;}}
`;
