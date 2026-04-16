/**
 * SecurifyHQ Cookie Consent
 * Lightweight, no dependencies. Blocks GA until accepted.
 * Preference stored in localStorage for 365 days.
 */
(function () {
  var PREF_KEY = 'shq_cookie_pref';
  var GA_ID = 'G-'; // placeholder — replace with actual GA4 Measurement ID if used

  function getPreference() {
    try { return localStorage.getItem(PREF_KEY); } catch (e) { return null; }
  }

  function setPreference(val) {
    try {
      localStorage.setItem(PREF_KEY, val);
      // Set a cookie too for server-side awareness
      var expires = new Date(Date.now() + 365 * 864e5).toUTCString();
      document.cookie = PREF_KEY + '=' + val + '; expires=' + expires + '; path=/; SameSite=Lax';
    } catch (e) {}
  }

  function loadGA() {
    if (!GA_ID || GA_ID === 'G-') return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function removeBanner() {
    var b = document.getElementById('shq-cookie-banner');
    if (b) b.parentNode.removeChild(b);
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'shq-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:#0a1825', 'border-top:2px solid rgba(255,165,0,0.4)',
      'padding:1rem 1.5rem', 'display:flex', 'align-items:center',
      'justify-content:space-between', 'gap:1rem', 'flex-wrap:wrap',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-size:0.85rem', 'color:rgba(255,255,255,0.85)', 'box-shadow:0 -4px 20px rgba(0,0,0,0.4)'
    ].join(';');

    banner.innerHTML = [
      '<span style="flex:1;min-width:200px;">',
        '🍪 We use cookies to understand how visitors use our site (analytics only — no advertising trackers). ',
        'See our <a href="/privacy-policy.html" style="color:#FFA500;text-decoration:underline;">Privacy Policy</a>.',
      '</span>',
      '<div style="display:flex;gap:0.75rem;flex-shrink:0;">',
        '<button id="shq-cookie-decline" style="background:transparent;border:1px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.7);padding:0.45rem 1.1rem;border-radius:50px;cursor:pointer;font-size:0.82rem;font-weight:600;">Decline</button>',
        '<button id="shq-cookie-accept" style="background:#FFA500;border:none;color:#0d1f2d;padding:0.45rem 1.3rem;border-radius:50px;cursor:pointer;font-size:0.82rem;font-weight:700;">Accept</button>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    document.getElementById('shq-cookie-accept').addEventListener('click', function () {
      setPreference('accepted');
      removeBanner();
      loadGA();
    });

    document.getElementById('shq-cookie-decline').addEventListener('click', function () {
      setPreference('declined');
      removeBanner();
    });
  }

  // Run on DOM ready
  function init() {
    var pref = getPreference();
    if (pref === 'accepted') {
      loadGA();
    } else if (!pref) {
      showBanner();
    }
    // if 'declined' — do nothing, GA never loads
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
