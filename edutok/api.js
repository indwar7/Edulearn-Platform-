/* ============================================================
   EduLearn — shared frontend API helper
   Connects the static pages to the EduLearn backend.
   ============================================================ */
(function (global) {
  // Backend base URL. Defaults to the deployed backend (served over HTTPS via
  // CloudFront — the EC2 origin is HTTP and would be blocked as mixed content).
  // For local dev, override it: localStorage.setItem('edulearn_api','http://localhost:4000')
  var API_BASE =
    localStorage.getItem('edulearn_api') ||
    'https://d3cxm67a2ygkx3.cloudfront.net';

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
      var err = new Error(data.error || 'Request failed (' + res.status + ')');
      err.status = res.status;
      err.code = data.code;
      err.userId = data.userId;
      err.email = data.email;
      err.phone = data.phone;
      throw err;
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

  // Full profile (includes role-specific fields + preferences).
  async function getProfile() {
    return request('/api/users/me');
  }

  // Update profile + preferences. Returns the updated user.
  async function updateProfile(fields) {
    var data = await request('/api/users/me/profile', {
      method: 'PUT',
      body: fields,
    });
    if (data.user) {
      // Keep the cached session user fresh.
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }

  function logout() {
    request('/api/auth/logout', { method: 'POST' }).catch(function () {});
    clearSession();
    window.location.href = 'login.html';
  }

  // ---- OTP calls ----
  async function sendOtp(channel, emailOrPhone, userId) {
    var body = { channel: channel };
    if (userId) body.userId = userId;
    else if (emailOrPhone) body.email = emailOrPhone;
    return request('/api/auth/send-otp', {
      method: 'POST',
      body: body,
    });
  }

  async function verifyOtp(channel, code, emailOrPhone, userId) {
    var body = { channel: channel, code: code };
    if (userId) body.userId = userId;
    else if (emailOrPhone) body.email = emailOrPhone;
    return request('/api/auth/verify-otp', {
      method: 'POST',
      body: body,
    });
  }

  // ---- Live class calls ----
  // List the live sessions the current user is eligible for.
  // Student → live classes for their class+section+subjects.
  // Teacher → their own live sessions.
  async function listLive() {
    var data = await request('/api/live');
    return data.sessions || [];
  }

  // Teacher only: start a targeted live class. Returns the created session.
  async function createLive(fields) {
    var data = await request('/api/live', { method: 'POST', body: fields });
    return data.session;
  }

  // Eligibility-checked join. Returns room info ({ ok, session }).
  async function joinLive(id) {
    return request('/api/live/' + id + '/join', { method: 'POST' });
  }

  // Teacher only: end the session (tears down the video room for everyone).
  async function endLive(id) {
    return request('/api/live/' + id + '/end', { method: 'POST' });
  }

  // Teacher only: full class roster with live presence ({ roster, joined, total }).
  async function liveRoster(id) {
    return request('/api/live/' + id + '/roster');
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
    getProfile: getProfile,
    updateProfile: updateProfile,
    getDashboard: getDashboard,
    getUser: getUser,
    getToken: getToken,
    requireAuth: requireAuth,
    clearSession: clearSession,
    listLive: listLive,
    createLive: createLive,
    joinLive: joinLive,
    endLive: endLive,
    liveRoster: liveRoster,
    sendOtp: sendOtp,
    verifyOtp: verifyOtp,
  };
})(window);
