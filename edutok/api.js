/* ============================================================
   EduLearn — shared frontend API helper
   Connects the static pages to the EduLearn backend.
   ============================================================ */
(function (global) {
  // Backend base URL. Override by setting localStorage 'edulearn_api' if you
  // deploy the backend somewhere else (e.g. Render). Defaults to local dev.
  var API_BASE =
    localStorage.getItem('edulearn_api') || 'http://localhost:4000';

  var TOKEN_KEY = 'edulearn_token';
  var USER_KEY = 'edulearn_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }
  function setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Core fetch wrapper. Adds JSON headers + bearer token, parses errors nicely.
  async function request(path, options) {
    options = options || {};
    var headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var res;
    try {
      res = await fetch(API_BASE + path, {
        method: options.method || 'GET',
        headers: headers,
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (networkErr) {
      throw new Error(
        'Cannot reach the server. Is the backend running on ' + API_BASE + '?'
      );
    }

    var data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.error || 'Request failed (' + res.status + ')');
    }
    return data;
  }

  // ---- Auth calls ----
  async function login(email, password, role) {
    var data = await request('/api/auth/login', {
      method: 'POST',
      body: { email: email, password: password, role: role },
    });
    setSession(data.accessToken, data.user);
    return data.user;
  }

  async function signup(role, fields) {
    var data = await request('/api/auth/signup/' + role, {
      method: 'POST',
      body: fields,
    });
    setSession(data.accessToken, data.user);
    return data.user;
  }

  async function getDashboard() {
    return request('/api/dashboard');
  }

  async function me() {
    return request('/api/auth/me');
  }

  function logout() {
    request('/api/auth/logout', { method: 'POST' }).catch(function () {});
    clearSession();
    window.location.href = 'login.html';
  }

  // Guard: redirect to login if not authenticated. Optionally require a role.
  function requireAuth(requiredRole) {
    var user = getUser();
    if (!getToken() || !user) {
      window.location.href = 'login.html';
      return null;
    }
    if (requiredRole && user.role !== requiredRole) {
      // Logged in but wrong dashboard — send them to their own.
      window.location.href = 'dashboard.html';
      return null;
    }
    return user;
  }

  global.EduAPI = {
    API_BASE: API_BASE,
    login: login,
    signup: signup,
    logout: logout,
    me: me,
    getDashboard: getDashboard,
    getUser: getUser,
    getToken: getToken,
    requireAuth: requireAuth,
    clearSession: clearSession,
  };
})(window);
