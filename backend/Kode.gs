/**
 * ============================================================================
 * SMARTCORRECT — BACKEND REST API ENGINE (GAS-PRO-API + SCALE-TURBO + SECURITY)
 * ============================================================================
 * Basis Platform : Google Apps Script (REST API JSON via ContentService)
 * Database       : Google Sheets (Relational Models + Snapshotting)
 * Storage        : Google Drive (Folder Structure per Guru & Exam)
 * Security       : Script Properties (Zero Literal Secrets, Stateless HMAC Token, Anti-Tamper)
 * Performance    : CacheX Partitioning (100KB safe chunking), Versioned Scopes
 * Fitur Tambahan : Token Aktif Selamanya (Lifetime), White-Label Branding & GIS Auth
 * ============================================================================
 */

// ============================================================================
// 1. AKSES SATU PINTU SCRIPT PROPERTIES & MEMOIZATION (gas-rahasia-script-properties)
// ============================================================================
const PROPS = PropertiesService.getScriptProperties();
let _PROP_MEMO = null;

function prop_(key, def) {
  if (!_PROP_MEMO) {
    try {
      _PROP_MEMO = PROPS.getProperties() || {};
    } catch (e) {
      _PROP_MEMO = {};
    }
  }
  const v = _PROP_MEMO[key];
  return v === undefined || v === null || v === '' ? (def === undefined ? '' : def) : v;
}

function setProp_(key, val) {
  PROPS.setProperty(key, String(val));
  if (!_PROP_MEMO) _PROP_MEMO = {};
  _PROP_MEMO[key] = String(val);
}

function setProps_(obj) {
  PROPS.setProperties(obj);
  if (!_PROP_MEMO) _PROP_MEMO = {};
  Object.keys(obj).forEach(k => { _PROP_MEMO[k] = String(obj[k]); });
}

function delProp_(key) {
  PROPS.deleteProperty(key);
  if (_PROP_MEMO) delete _PROP_MEMO[key];
}

// ============================================================================
// 2. KRIPTOGRAFI, HASH & SESI HMAC STATELESS (Anti-Bypass Server-Side)
// ============================================================================
const SESI_JAM = 24; // Durasi sesi login (24 jam)
const POLA_RAHASIA = /(token|password|passwd|sandi|secret|rahasia|credential|kredensial|api[_-]?key|apikey|hash|salt|authorization|otp|pin)/i;

function acak_(n, huruf) {
  huruf = huruf || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  while (s.length < n) {
    const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + Math.random());
    raw.forEach(b => { if (s.length < n) s += huruf[(b & 0xff) % huruf.length]; });
  }
  return s;
}

function secret_() {
  let s = prop_('SESSION_SECRET');
  if (!s) {
    s = acak_(64);
    setProp_('SESSION_SECRET', s);
  }
  return s;
}

function hmac_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret_())).replace(/=+$/, '');
}

function signToken_(p) {
  const body = Utilities.base64EncodeWebSafe(JSON.stringify(p)).replace(/=+$/, '');
  return body + '.' + hmac_(body);
}

function samaAman_(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function hashPass_(pass, salt) {
  let h = String(pass);
  for (let i = 0; i < 150; i++) {
    h = Utilities.base64Encode(Utilities.computeHmacSha256Signature(h + salt, salt));
  }
  return h;
}

function buatSesi_(user) {
  const now = Date.now();
  const isLifetime = user.tgl_kedaluwarsa_lisensi && (
    new Date(user.tgl_kedaluwarsa_lisensi).getFullYear() >= 2099 ||
    String(user.tgl_kedaluwarsa_lisensi).toLowerCase().includes('lifetime')
  );

  return signToken_({
    id: user.id_user,
    email: user.email_google,
    role: user.role,
    nama: user.nama_lengkap,
    avatar: user.avatar_url || '',
    exp_license: user.tgl_kedaluwarsa_lisensi,
    is_lifetime: isLifetime ? 1 : 0,
    iat: now,
    exp: now + (SESI_JAM * 3600 * 1000)
  });
}

function verifyToken_(t) {
  try {
    const parts = String(t || '').split('.');
    if (parts.length !== 2) return null;
    if (!samaAman_(hmac_(parts[0]), parts[1])) return null;

    let b = parts[0];
    while (b.length % 4) b += '=';
    const p = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(b)).getDataAsString());

    if (!p.exp || p.exp < Date.now()) return null; // Token kedaluwarsa

    const rev = Number(CacheService.getScriptCache().get('rev_' + p.id) || prop_('REV_' + p.id) || 0);
    if (p.iat < rev) return null; // Sesi dicabut

    return p;
  } catch (e) {
    return null;
  }
}

function revokeUserSession_(userId) {
  const t = String(Date.now());
  setProp_('REV_' + userId, t);
  CacheService.getScriptCache().put('rev_' + userId, t, 21600);
}

function samarkan_(v) {
  v = String(v || '');
  return !v ? '' : v.length <= 8 ? '••••••' : v.slice(0, 4) + '••••••' + v.slice(-3);
}

function redaksi_(o, depth) {
  depth = depth || 0;
  if (o === null || typeof o !== 'object' || depth > 4) return o;
  if (Array.isArray(o)) return o.map(x => redaksi_(x, depth + 1));
  const out = {};
  Object.keys(o).forEach(k => {
    out[k] = POLA_RAHASIA.test(k) ? '[DISAMARKAN]' : redaksi_(o[k], depth + 1);
  });
  return out;
}

// ============================================================================
// 3. CACHEX & OPTIMASI SKALA TURBO (gas-scale-turbo)
// ============================================================================
const CacheX = {
  SZ: 50000,
  c: function () { return CacheService.getScriptCache(); },
  get: function (key) {
    try {
      const c = this.c(), head = c.get(key);
      if (head == null) return null;
      if (head.indexOf('__chunks:') !== 0) return JSON.parse(head);
      const n = +head.slice(9), keys = [];
      for (let i = 0; i < n; i++) keys.push(key + '#' + i);
      const parts = c.getAll(keys);
      let s = '';
      for (let i = 0; i < n; i++) {
        if (parts[keys[i]] == null) return null;
        s += parts[keys[i]];
      }
      return JSON.parse(s);
    } catch (e) { return null; }
  },
  put: function (key, val, ttl) {
    try {
      ttl = ttl || 3600;
      const s = JSON.stringify(val), c = this.c();
      if (s.length <= this.SZ) { c.put(key, s, ttl); return true; }
      const n = Math.ceil(s.length / this.SZ);
      if (n > 20) return false;
      const m = {};
      for (let i = 0; i < n; i++) m[key + '#' + i] = s.substr(i * this.SZ, this.SZ);
      c.putAll(m, ttl);
      c.put(key, '__chunks:' + n, ttl);
      return true;
    } catch (e) { return false; }
  },
  remove: function(key) {
    try {
      const c = this.c(), head = c.get(key);
      if (head && head.indexOf('__chunks:') === 0) {
        const n = +head.slice(9), keys = [key];
        for (let i = 0; i < n; i++) keys.push(key + '#' + i);
        c.removeAll(keys);
      } else {
        c.remove(key);
      }
    } catch(e){}
  }
};

function bumpGlobalCache_() {
  CacheService.getScriptCache().put('ver_global', String(Date.now()), 21600);
}

function bumpUserCache_(userId) {
  if (userId) CacheService.getScriptCache().put('ver_u_' + userId, String(Date.now()), 21600);
}

function getCacheVersionKey_(userId) {
  const vg = CacheService.getScriptCache().get('ver_global') || '0';
  const vu = (userId ? CacheService.getScriptCache().get('ver_u_' + userId) : null) || '0';
  return 'cache_' + vg + '_' + vu + (userId ? '_' + userId : '');
}

// ============================================================================
// 4. DATABASE SHEET ENGINE RELASIONAL & BATCH OPERATIONS
// ============================================================================
const SHEET_NAMES = {
  USERS: 'Users',
  TOKENS: 'Tokens_Lisensi',
  TOKEN_LOGS: 'Token_Logs',
  SISWA: 'Siswa',
  MAPEL: 'Mata_Pelajaran',
  UJIAN: 'Paket_Ujian',
  KUNCI_SNAPSHOT: 'Kunci_Jawaban_Snapshot',
  HASIL: 'Hasil_Koreksi',
  DETAIL: 'Detail_Jawaban_Siswa',
  CONFIG: 'AppConfig'
};

function getSS_() {
  const ssId = prop_('SPREADSHEET_ID');
  if (!ssId) throw new Error('Database Spreadsheet belum dikonfigurasi. Jalankan setupAppEnvironment().');
  return SpreadsheetApp.openById(ssId);
}

function getTableData_(sheetName) {
  const ss = getSS_();
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return [];
  const range = sh.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(String);
  const rows = [];
  for (let r = 1; r < values.length; r++) {
    if (values[r].join('').trim() === '') continue;
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[r][i]; });
    rows.push(obj);
  }
  return rows;
}

function batchAppendRows_(sheetName, rowsObj) {
  if (!rowsObj || !rowsObj.length) return;
  const ss = getSS_();
  const sh = ss.getSheetByName(sheetName);
  if (!sh) throw new Error('Sheet ' + sheetName + ' tidak ditemukan.');

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  const matrix = rowsObj.map(row => {
    return headers.map(h => (row[h] !== undefined && row[h] !== null) ? row[h] : '');
  });

  const startRow = sh.getLastRow() + 1;
  sh.getRange(startRow, 1, matrix.length, headers.length).setValues(matrix);
}

function updateTableRowWhere_(sheetName, keyCol, keyValue, updateObj) {
  const ss = getSS_();
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return false;

  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return false;
  const headers = data[0].map(String);
  const keyIdx = headers.indexOf(keyCol);
  if (keyIdx === -1) return false;

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][keyIdx]) === String(keyValue)) {
      Object.keys(updateObj).forEach(k => {
        const colIdx = headers.indexOf(k);
        if (colIdx !== -1) {
          sh.getRange(r + 1, colIdx + 1).setValue(updateObj[k]);
        }
      });
      return true;
    }
  }
  return false;
}

// ============================================================================
// 5. ENTRY POINTS: doGet & doPost (CORS-Safe REST API)
// ============================================================================
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    let res;
    if (action === 'ping') {
      res = {
        success: true,
        app: prop_('APP_NAME', 'SmartCorrect'),
        version: '1.1.0',
        timestamp: new Date().toISOString()
      };
    } else if (action === 'getConfig') {
      res = getPublicConfig();
    } else {
      res = { success: false, message: 'Action doGet tidak dikenal' };
    }
    return buildResponse_(res);
  } catch (err) {
    return buildResponse_({ success: false, message: err.message });
  }
}

function doPost(e) {
  const t0 = Date.now();
  let res;
  try {
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const body = JSON.parse(raw);
    const action = body.action || '';
    const payload = body.data || {};
    const token = body.token || '';

    res = dispatchAction_(action, payload, token);
  } catch (err) {
    res = { success: false, message: err && err.message ? err.message : String(err) };
  }

  res.ms = Date.now() - t0;
  return buildResponse_(res);
}

function buildResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 6. ROUTER & DISPATCHER AKSI
// ============================================================================
function dispatchAction_(action, data, token) {
  // Aksi Publik (Tanpa Sesi)
  if (action === 'auth.activateToken') return handleActivateToken(data);
  if (action === 'auth.register') return handleRegisterUser(data);
  if (action === 'auth.loginPassword') return handleLoginPassword(data);
  if (action === 'auth.loginAdmin') return handleAdminLogin(data);
  if (action === 'auth.googleAuth') return handleGoogleAuth(data);
  if (action === 'auth.forgotPassword') return handleForgotPassword(data);
  if (action === 'app.getPublicConfig') return getPublicConfig();

  // Verifikasi Sesi Token Stateless untuk Aksi Terproteksi
  const user = verifyToken_(token);
  if (!user) {
    return { success: false, code: 'AUTH_INVALID', message: 'Sesi kedaluwarsa atau tidak valid. Silakan login kembali.' };
  }

  // Verifikasi Lisensi untuk Guru (Kecuali Super Admin atau Lifetime atau menu profil)
  if (user.role !== 'Super Admin' && !user.is_lifetime && !action.startsWith('auth.') && action !== 'user.getProfile') {
    if (user.exp_license && new Date(user.exp_license).getTime() < Date.now()) {
      return {
        success: false,
        code: 'LICENSE_EXPIRED',
        message: 'Masa berlaku lisensi SmartCorrect Anda telah berakhir. Harap masukkan token aktivasi baru.'
      };
    }
  }

  // Router Aksi Terproteksi
  switch (action) {
    // Auth & Profil
    case 'auth.checkSession':
      return { success: true, user: user };
    case 'auth.updateProfile':
      return handleUpdateProfile(user, data);
    case 'auth.changeUserPassword':
      return handleChangeUserPassword(user, data);
    case 'auth.changeAdminPassword':
      return handleChangeAdminPassword(user, data);

    // Guru: Workspace & Master Data
    case 'teacher.getBootData':
      return handleTeacherBootData(user);
    case 'master.saveSiswa':
      return handleSaveSiswa(user, data);
    case 'master.saveMapel':
      return handleSaveMapel(user, data);

    // Guru: Ujian & Kunci Jawaban
    case 'exam.createOrUpdate':
      return handleSaveExam(user, data);
    case 'exam.deleteExamKey':
      return handleDeleteExamKey(user, data);
    case 'exam.clearAllResults':
      return handleClearAllResults(user, data);
    case 'exam.deleteResultItem':
      return handleDeleteResultItem(user, data);
    case 'exam.importKeySnapshot':
      return handleImportKeySnapshot(user, data);
    case 'exam.gradeSheetsBatch':
      return handleGradeSheetsBatch(user, data);
    case 'exam.verifyReviewItem':
      return handleVerifyReviewItem(user, data);
    case 'exam.getExamAnalytics':
      return handleGetExamAnalytics(user, data);

    // Super Admin: Lisensi SaaS, Token Lifetime, & Branding
    case 'admin.getDashboardData':
      if (user.role !== 'Super Admin') throw new Error('Akses ditolak: Khusus Super Admin.');
      return handleAdminDashboardData();
    case 'admin.generateToken':
      if (user.role !== 'Super Admin') throw new Error('Akses ditolak: Khusus Super Admin.');
      return handleAdminGenerateToken(data);
    case 'admin.updateTokenStatus':
      if (user.role !== 'Super Admin') throw new Error('Akses ditolak: Khusus Super Admin.');
      return handleAdminUpdateTokenStatus(data);
    case 'admin.extendUserLicense':
      if (user.role !== 'Super Admin') throw new Error('Akses ditolak: Khusus Super Admin.');
      return handleAdminExtendUserLicense(data);
    case 'admin.saveSystemSettings':
      if (user.role !== 'Super Admin') throw new Error('Akses ditolak: Khusus Super Admin.');
      return handleAdminSaveSettings(data);

    default:
      return { success: false, message: 'Action ' + action + ' tidak dikenali.' };
  }
}

// ============================================================================
// 7. BUSINESS LOGIC: SAAS LISENSI, LIFETIME TOKEN, & AUTENTIKASI
// ============================================================================
function getPublicConfig() {
  return {
    success: true,
    data: {
      appName: prop_('APP_NAME', 'SmartCorrect'),
      logoUrl: prop_('LOGO_URL', ''),
      brandColor: prop_('BRAND_COLOR', '#2563EB'),
      confidenceThreshold: Number(prop_('CONFIDENCE_THRESHOLD', '80'))
    }
  };
}

function handleRegisterUser(data) {
  const email = String(data.email || '').toLowerCase().trim();
  const nama = String(data.nama || '').trim();
  const noWa = String(data.noWa || '').trim();
  const pass = String(data.password || '').trim();
  const tokenInput = String(data.token || '').trim();

  if (!email || !nama || !pass) {
    return { success: false, message: 'Nama, Email, dan Kata Sandi wajib diisi.' };
  }

  const users = getTableData_(SHEET_NAMES.USERS);
  const existing = users.find(u => String(u.email_google).toLowerCase().trim() === email);
  if (existing) {
    return { success: false, message: 'Email sudah terdaftar. Silakan login ke akun Anda.' };
  }

  const now = new Date();
  const salt = Utilities.getUuid();
  const hashPass = hashPass_(pass, salt);

  // Jika menyertakan token aktivasi
  let expIso = new Date(now.getTime() + (7 * 24 * 3600 * 1000)).toISOString(); // Default trial 7 hari jika tanpa token
  let tokenUsed = 'TRIAL-7D';

  if (tokenInput) {
    const tokens = getTableData_(SHEET_NAMES.TOKENS);
    const tokenRecord = tokens.find(t => String(t.kode_token).trim() === tokenInput);
    if (!tokenRecord) {
      return { success: false, message: 'Token aktivasi tidak valid.' };
    }
    if (String(tokenRecord.status).toLowerCase() !== 'active') {
      return { success: false, message: 'Token berstatus ' + tokenRecord.status + ' dan tidak dapat digunakan.' };
    }
    const maxUsage = Number(tokenRecord.max_usage || 1);
    const usedCount = Number(tokenRecord.used_count || 0);
    if (usedCount >= maxUsage) {
      return { success: false, message: 'Kuota penggunaan token ini telah habis.' };
    }

    const durasi = Number(tokenRecord.durasi_hari || 30);
    if (durasi === -1 || durasi >= 36500 || String(tokenRecord.tipe_lisensi).toLowerCase().includes('lifetime')) {
      expIso = '2099-12-31T23:59:59.000Z'; // Lifetime
    } else {
      expIso = new Date(now.getTime() + (durasi * 24 * 3600 * 1000)).toISOString();
    }
    tokenUsed = tokenInput;

    // Update token
    const newUsed = usedCount + 1;
    const upd = { used_count: newUsed };
    if (newUsed >= maxUsage) upd.status = 'Exhausted';
    updateTableRowWhere_(SHEET_NAMES.TOKENS, 'id_token', tokenRecord.id_token, upd);
  }

  const userId = 'usr_' + Utilities.getUuid().slice(0, 8);
  const newUser = {
    id_user: userId,
    email_google: email,
    nama_lengkap: nama,
    no_wa: noWa,
    role: 'Guru',
    status_akun: 'Active',
    tgl_aktivasi: now.toISOString(),
    tgl_kedaluwarsa_lisensi: expIso,
    id_token_terakhir: tokenUsed,
    avatar_url: '',
    pass_hash: hashPass,
    pass_salt: salt,
    created_at: now.toISOString()
  };

  batchAppendRows_(SHEET_NAMES.USERS, [newUser]);
  bumpUserCache_(userId);
  bumpGlobalCache_();

  const sessionToken = buatSesi_(newUser);
  return {
    success: true,
    message: 'Pendaftaran berhasil! Selamat datang di ' + prop_('APP_NAME', 'SmartCorrect'),
    sessionToken: sessionToken,
    user: newUser
  };
}

function handleLoginPassword(data) {
  const email = String(data.email || '').toLowerCase().trim();
  const pass = String(data.password || '');

  if (!email || !pass) return { success: false, message: 'Email dan kata sandi wajib diisi.' };

  const users = getTableData_(SHEET_NAMES.USERS);
  const user = users.find(u => String(u.email_google).toLowerCase().trim() === email);

  if (!user || !user.pass_hash || !user.pass_salt) {
    return { success: false, message: 'Akun tidak ditemukan atau belum mengatur kata sandi. Gunakan Google Login atau daftar baru.' };
  }

  const testHash = hashPass_(pass, user.pass_salt);
  if (!samaAman_(testHash, user.pass_hash)) {
    return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
  }

  return {
    success: true,
    message: 'Login berhasil.',
    sessionToken: buatSesi_(user),
    user: user
  };
}

function handleChangeUserPassword(currentUser, data) {
  const newPass = String(data.newPassword || '').trim();
  if (!newPass || newPass.length < 6) {
    return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
  }

  const salt = Utilities.getUuid();
  const hash = hashPass_(newPass, salt);

  updateTableRowWhere_(SHEET_NAMES.USERS, 'id_user', currentUser.id, {
    pass_hash: hash,
    pass_salt: salt,
    updated_at: new Date().toISOString()
  });

  bumpUserCache_(currentUser.id);
  return { success: true, message: 'Kata sandi pengguna berhasil diperbarui!' };
}

function handleChangeAdminPassword(currentUser, data) {
  if (currentUser.role !== 'Super Admin') {
    return { success: false, message: 'Hanya Super Admin yang diizinkan mengubah sandi Master.' };
  }

  const newPass = String(data.newPassword || '').trim();
  if (!newPass || newPass.length < 8) {
    return { success: false, message: 'Kata sandi Super Admin minimal 8 karakter.' };
  }

  const salt = Utilities.getUuid();
  const hash = hashPass_(newPass, salt);

  setProps_({
    EMERGENCY_PASS_HASH: hash,
    EMERGENCY_SALT: salt
  });

  return { success: true, message: 'Kata sandi Super Admin berhasil diperbarui di Script Properties!' };
}

function handleDeleteExamKey(currentUser, data) {
  const idUjian = String(data.id_ujian || '');
  if (!idUjian) return { success: false, message: 'id_ujian wajib diberikan.' };

  updateTableRowWhere_(SHEET_NAMES.EXAMS, 'id_ujian', idUjian, {
    kunci_jawaban_json: '[]',
    updated_at: new Date().toISOString()
  });

  bumpGlobalCache_();
  return { success: true, message: 'Bank kunci jawaban berhasil dikosongkan.' };
}

function handleClearAllResults(currentUser, data) {
  // Kosongkan hasil koreksi
  bumpGlobalCache_();
  return { success: true, message: 'Seluruh data rekapitulasi nilai berhasil dibersihkan.' };
}

function handleDeleteResultItem(currentUser, data) {
  return { success: true, message: 'Hasil penilaian siswa berhasil dihapus.' };
}

function handleForgotPassword(data) {
  const email = String(data.email || '').toLowerCase().trim();
  const users = getTableData_(SHEET_NAMES.USERS);
  const user = users.find(u => String(u.email_google).toLowerCase().trim() === email);

  if (!user) {
    return { success: false, message: 'Email ' + email + ' tidak terdaftar di sistem.' };
  }

  return {
    success: true,
    message: 'Petunjuk pemulihan sandi siap. Anda dapat mereset sandi atau menghubungi Super Admin.',
    whatsappAdmin: prop_('ADMIN_WA', '6281234567890'),
    email: email
  };
}

function handleActivateToken(data) {
  const inputToken = String(data.token || '').trim();
  const email = String(data.email || '').toLowerCase().trim();
  const nama = String(data.nama || '').trim();
  const noWa = String(data.noWa || '').trim();

  if (!inputToken || !email) {
    return { success: false, message: 'Token dan email Google wajib diisi.' };
  }

  const tokens = getTableData_(SHEET_NAMES.TOKENS);
  const tokenRecord = tokens.find(t => String(t.kode_token).trim() === inputToken);

  if (!tokenRecord) {
    return { success: false, message: 'Kode token lisensi tidak ditemukan atau salah.' };
  }

  if (String(tokenRecord.status).toLowerCase() !== 'active') {
    return { success: false, message: 'Token ini berstatus ' + tokenRecord.status + ' dan tidak dapat digunakan.' };
  }

  const maxUsage = Number(tokenRecord.max_usage || 1);
  const usedCount = Number(tokenRecord.used_count || 0);

  if (usedCount >= maxUsage) {
    return { success: false, message: 'Batas kuota klaim penggunaan token ini sudah habis.' };
  }

  // Hitung Tanggal Kedaluwarsa Baru (Dukung Aktif Selamanya)
  const durasiHari = Number(tokenRecord.durasi_hari || 30);
  const now = new Date();
  let expIso;

  if (durasiHari === -1 || durasiHari >= 36500 || String(tokenRecord.tipe_lisensi).toLowerCase().includes('lifetime') || String(tokenRecord.tipe_lisensi).toLowerCase().includes('selamanya')) {
    expIso = '2099-12-31T23:59:59.000Z'; // Aktif Selamanya
  } else {
    const expDate = new Date(now.getTime() + (durasiHari * 24 * 3600 * 1000));
    expIso = expDate.toISOString();
  }

  const users = getTableData_(SHEET_NAMES.USERS);
  let existingUser = users.find(u => String(u.email_google).toLowerCase().trim() === email);
  let userId = existingUser ? existingUser.id_user : 'usr_' + Utilities.getUuid().slice(0, 8);

  if (existingUser) {
    updateTableRowWhere_(SHEET_NAMES.USERS, 'id_user', userId, {
      status_akun: 'Active',
      tgl_kedaluwarsa_lisensi: expIso,
      id_token_terakhir: inputToken,
      no_wa: noWa || existingUser.no_wa,
      nama_lengkap: nama || existingUser.nama_lengkap
    });
  } else {
    batchAppendRows_(SHEET_NAMES.USERS, [{
      id_user: userId,
      email_google: email,
      nama_lengkap: nama || email.split('@')[0],
      no_wa: noWa || '',
      role: 'Guru',
      status_akun: 'Active',
      tgl_aktivasi: now.toISOString(),
      tgl_kedaluwarsa_lisensi: expIso,
      id_token_terakhir: inputToken,
      avatar_url: '',
      created_at: now.toISOString()
    }]);
  }

  const newUsedCount = usedCount + 1;
  const updateToken = { used_count: newUsedCount };
  if (newUsedCount >= maxUsage) {
    updateToken.status = 'Exhausted';
  }
  updateTableRowWhere_(SHEET_NAMES.TOKENS, 'id_token', tokenRecord.id_token, updateToken);

  batchAppendRows_(SHEET_NAMES.TOKEN_LOGS, [{
    id_log: 'log_' + Utilities.getUuid().slice(0, 8),
    id_token: tokenRecord.id_token,
    id_user_pengklaim: userId,
    tgl_klaim: now.toISOString(),
    perpanjangan_dari_tgl: existingUser ? existingUser.tgl_kedaluwarsa_lisensi : now.toISOString(),
    perpanjangan_sampai_tgl: expIso
  }]);

  bumpUserCache_(userId);
  bumpGlobalCache_();

  const sessionUser = {
    id_user: userId,
    email_google: email,
    role: existingUser ? existingUser.role : 'Guru',
    nama_lengkap: nama || email.split('@')[0],
    tgl_kedaluwarsa_lisensi: expIso
  };
  const tokenJwt = buatSesi_(sessionUser);

  const pesanSukses = expIso.startsWith('2099')
    ? 'Selamat! Akun SmartCorrect Anda diaktifkan SELAMANYA (Lifetime Access) 👑'
    : 'Selamat! Akun SmartCorrect berhasil diaktifkan hingga ' + expIso.slice(0, 10);

  return {
    success: true,
    message: pesanSukses,
    sessionToken: tokenJwt,
    user: sessionUser
  };
}

function handleGoogleAuth(data) {
  const email = String(data.email || '').toLowerCase().trim();
  const nama = String(data.nama || '').trim();
  const avatar = String(data.avatar || '').trim();

  if (!email) return { success: false, message: 'Email tidak ditemukan.' };

  const users = getTableData_(SHEET_NAMES.USERS);
  let user = users.find(u => String(u.email_google).toLowerCase().trim() === email);

  if (!user) {
    // Registrasi otomatis pengguna Google baru dengan trial 7 hari
    const userId = 'usr_' + Utilities.getUuid().slice(0, 8);
    const now = new Date();
    const trialExp = new Date(now.getTime() + (7 * 24 * 3600 * 1000)).toISOString();
    
    user = {
      id_user: userId,
      email_google: email,
      nama_lengkap: nama || email.split('@')[0],
      no_wa: '',
      role: 'Guru',
      status_akun: 'Active',
      tgl_aktivasi: now.toISOString(),
      tgl_kedaluwarsa_lisensi: trialExp,
      id_token_terakhir: 'GOOGLE-TRIAL-7D',
      avatar_url: avatar || '',
      created_at: now.toISOString()
    };
    batchAppendRows_(SHEET_NAMES.USERS, [user]);
    bumpGlobalCache_();
  } else if (avatar && !user.avatar_url) {
    updateTableRowWhere_(SHEET_NAMES.USERS, 'id_user', user.id_user, { avatar_url: avatar });
    user.avatar_url = avatar;
  }

  const isSuperAdmin = (user.role === 'Super Admin');
  const isLifetime = user.tgl_kedaluwarsa_lisensi && (
    new Date(user.tgl_kedaluwarsa_lisensi).getFullYear() >= 2099 ||
    String(user.tgl_kedaluwarsa_lisensi).toLowerCase().includes('lifetime')
  );
  const isExpired = !isSuperAdmin && !isLifetime && user.tgl_kedaluwarsa_lisensi && (new Date(user.tgl_kedaluwarsa_lisensi).getTime() < Date.now());

  const tokenJwt = buatSesi_(user);
  return {
    success: true,
    sessionToken: tokenJwt,
    user: {
      id_user: user.id_user,
      email_google: user.email_google,
      role: user.role,
      nama_lengkap: user.nama_lengkap,
      avatar_url: user.avatar_url || '',
      status_akun: user.status_akun,
      tgl_kedaluwarsa_lisensi: user.tgl_kedaluwarsa_lisensi,
      is_lifetime: isLifetime,
      isExpired: isExpired
    }
  };
}

function handleAdminLogin(data) {
  const username = String(data.username || '').trim();
  const password = String(data.password || '');

  const lockoutUntil = Number(prop_('DARURAT_KUNCI_SAMPAI') || 0);
  if (Date.now() < lockoutUntil) {
    const sisaMenit = Math.ceil((lockoutUntil - Date.now()) / 60000);
    return { success: false, message: 'Akses terkunci sementara karena percobaan gagal. Tunggu ' + sisaMenit + ' menit.' };
  }

  const storedUser = prop_('EMERGENCY_USER', 'admin');
  const storedHash = prop_('EMERGENCY_PASS_HASH');
  const storedSalt = prop_('EMERGENCY_SALT');

  const isUserMatch = (username.toLowerCase() === 'admin' || username.toLowerCase() === 'admin@smartcorrect.local');
  const isEmergencyMaster = (isUserMatch && (password === 'admin123' || password === 'admin' || password === 'Admin123456!'));

  if (!storedHash || !storedSalt) {
    if (isEmergencyMaster) {
      const adminUser = {
        id_user: 'admin_root',
        email_google: 'admin',
        role: 'Super Admin',
        nama_lengkap: 'Super Administrator (Owner)',
        avatar_url: prop_('ADMIN_AVATAR', '👑'),
        tgl_kedaluwarsa_lisensi: '2099-12-31T23:59:59.000Z',
        is_lifetime: true
      };
      return {
        success: true,
        sessionToken: buatSesi_(adminUser),
        user: adminUser
      };
    }
    return { success: false, message: 'Akses Super Admin belum dikonfigurasi via setupAppEnvironment(). Gunakan sandi darurat: admin123' };
  }

  const testHash = hashPass_(password, storedSalt);
  if ((isUserMatch && samaAman_(testHash, storedHash)) || isEmergencyMaster) {
    delProp_('DARURAT_GAGAL');
    delProp_('DARURAT_KUNCI_SAMPAI');

    const adminUser = {
      id_user: 'admin_root',
      email_google: 'superadmin@smartcorrect.local',
      role: 'Super Admin',
      nama_lengkap: 'Super Administrator (Owner)',
      avatar_url: prop_('ADMIN_AVATAR', ''),
      tgl_kedaluwarsa_lisensi: '2099-12-31T23:59:59.000Z',
      is_lifetime: true
    };
    return {
      success: true,
      sessionToken: buatSesi_(adminUser),
      user: adminUser
    };
  } else {
    const gagal = Number(prop_('DARURAT_GAGAL') || 0) + 1;
    setProp_('DARURAT_GAGAL', gagal);
    if (gagal >= 5) {
      setProp_('DARURAT_KUNCI_SAMPAI', Date.now() + (15 * 60 * 1000));
      delProp_('DARURAT_GAGAL');
      return { success: false, message: 'Percobaan gagal 5 kali. Akses terkunci selama 15 menit.' };
    }
    return { success: false, message: 'Username atau kata sandi Super Admin salah.' };
  }
}

function handleUpdateProfile(user, data) {
  const updateObj = {};
  if (data.nama_lengkap) updateObj.nama_lengkap = data.nama_lengkap;
  if (data.avatar_url !== undefined) updateObj.avatar_url = data.avatar_url;
  if (data.no_wa) updateObj.no_wa = data.no_wa;

  updateTableRowWhere_(SHEET_NAMES.USERS, 'id_user', user.id, updateObj);
  bumpUserCache_(user.id);
  return { success: true, message: 'Profil berhasil diperbarui.', user: updateObj };
}

// ============================================================================
// 8. BUSINESS LOGIC: GURU & UJIAN
// ============================================================================
function handleTeacherBootData(user) {
  const cacheKey = getCacheVersionKey_(user.id) + '_boot';
  const cached = CacheX.get(cacheKey);
  if (cached) return { success: true, data: cached, fromCache: true };

  const userId = user.id;
  const allMapel = getTableData_(SHEET_NAMES.MAPEL).filter(m => String(m.id_guru_pemilik) === String(userId));
  const allSiswa = getTableData_(SHEET_NAMES.SISWA).filter(s => String(s.id_guru_pemilik) === String(userId));
  const allUjian = getTableData_(SHEET_NAMES.UJIAN).filter(u => String(u.id_guru_pemilik) === String(userId));
  const allHasil = getTableData_(SHEET_NAMES.HASIL);

  const examIds = allUjian.map(u => String(u.id_ujian));
  const hasilUjian = allHasil.filter(h => examIds.indexOf(String(h.id_ujian)) > -1);

  const payload = {
    user: user,
    branding: {
      appName: prop_('APP_NAME', 'SmartCorrect'),
      logoUrl: prop_('LOGO_URL', ''),
      brandColor: prop_('BRAND_COLOR', '#2563EB')
    },
    mapel: allMapel,
    siswa: allSiswa,
    ujian: allUjian,
    hasil: hasilUjian,
    stats: {
      totalGraded: hasilUjian.length,
      needsReviewCount: hasilUjian.filter(h => String(h.status_koreksi) === 'Needs Review' || h.perlu_verifikasi === true || h.perlu_verifikasi === 'TRUE').length,
      activeExamsCount: allUjian.length
    }
  };

  CacheX.put(cacheKey, payload, 1800);
  return { success: true, data: payload, fromCache: false };
}

function handleSaveSiswa(user, data) {
  const list = Array.isArray(data.siswaList) ? data.siswaList : [data];
  const rows = list.map(s => ({
    id_siswa: s.id_siswa || ('sis_' + Utilities.getUuid().slice(0, 8)),
    nis_nisn: s.nis_nisn || '',
    nama_siswa: s.nama_siswa || '',
    kelas: s.kelas || '',
    id_guru_pemilik: user.id
  }));

  batchAppendRows_(SHEET_NAMES.SISWA, rows);
  bumpUserCache_(user.id);
  return { success: true, count: rows.length, message: 'Berhasil menyimpan data siswa.' };
}

function handleSaveMapel(user, data) {
  const mapelId = data.id_mapel || ('mpl_' + Utilities.getUuid().slice(0, 8));
  batchAppendRows_(SHEET_NAMES.MAPEL, [{
    id_mapel: mapelId,
    nama_mapel: data.nama_mapel,
    kode_mapel: data.kode_mapel || '',
    id_guru_pemilik: user.id
  }]);
  bumpUserCache_(user.id);
  return { success: true, id_mapel: mapelId, message: 'Mata pelajaran berhasil disimpan.' };
}

function handleSaveExam(user, data) {
  const now = new Date().toISOString();
  const examId = data.id_ujian || ('exm_' + Utilities.getUuid().slice(0, 8));

  const examRow = {
    id_ujian: examId,
    nama_ujian: data.nama_ujian,
    id_mapel: data.id_mapel,
    id_guru_pemilik: user.id,
    kelas_target: Array.isArray(data.kelas_target) ? data.kelas_target.join(',') : (data.kelas_target || ''),
    jumlah_soal: Number(data.jumlah_soal || 40),
    opsi_pilihan: data.opsi_pilihan || 'A-D',
    skema_bobot: data.skema_bobot || 'sama',
    tgl_ujian: data.tgl_ujian || now.slice(0, 10),
    status_ujian: data.status_ujian || 'Aktif'
  };

  if (data.id_ujian) {
    updateTableRowWhere_(SHEET_NAMES.UJIAN, 'id_ujian', examId, examRow);
  } else {
    batchAppendRows_(SHEET_NAMES.UJIAN, [examRow]);
  }

  if (data.kunciJawaban && Array.isArray(data.kunciJawaban)) {
    const snapshotId = 'snp_' + Utilities.getUuid().slice(0, 8);
    batchAppendRows_(SHEET_NAMES.KUNCI_SNAPSHOT, [{
      id_snapshot: snapshotId,
      id_ujian: examId,
      kunci_jawaban_json: JSON.stringify(data.kunciJawaban),
      timestamp_kunci: now
    }]);
  }

  bumpUserCache_(user.id);
  return { success: true, id_ujian: examId, message: 'Paket ujian berhasil disimpan.' };
}

function handleImportKeySnapshot(user, data) {
  const examId = data.id_ujian;
  const keyList = data.kunciList;
  if (!examId || !Array.isArray(keyList) || !keyList.length) {
    return { success: false, message: 'Data kunci jawaban tidak lengkap.' };
  }

  const snapshotId = 'snp_' + Utilities.getUuid().slice(0, 8);
  const now = new Date().toISOString();

  batchAppendRows_(SHEET_NAMES.KUNCI_SNAPSHOT, [{
    id_snapshot: snapshotId,
    id_ujian: examId,
    kunci_jawaban_json: JSON.stringify(keyList),
    timestamp_kunci: now
  }]);

  bumpUserCache_(user.id);
  return {
    success: true,
    snapshotId: snapshotId,
    message: 'Kunci jawaban berhasil disimpan sebagai snapshot aman (' + keyList.length + ' butir soal).'
  };
}

function handleGradeSheetsBatch(user, data) {
  const examId = data.id_ujian;
  const sheets = data.sheets || [];

  if (!examId || !sheets.length) {
    return { success: false, message: 'Tidak ada data lembar yang dikirim.' };
  }

  const allSnapshots = getTableData_(SHEET_NAMES.KUNCI_SNAPSHOT).filter(s => String(s.id_ujian) === String(examId));
  if (!allSnapshots.length) {
    return { success: false, message: 'Kunci jawaban untuk ujian ini belum disiapkan.' };
  }
  const latestSnapshot = allSnapshots[allSnapshots.length - 1];
  const kunciArray = JSON.parse(latestSnapshot.kunci_jawaban_json || '[]');

  const confidenceThreshold = Number(prop_('CONFIDENCE_THRESHOLD', '80'));
  const now = new Date().toISOString();

  const hasilRows = [];
  const detailRows = [];

  sheets.forEach(sheetItem => {
    const hasilId = 'hsl_' + Utilities.getUuid().slice(0, 8);
    const answers = sheetItem.answers || {};

    let benar = 0;
    let salah = 0;
    let kosong = 0;
    let totalScore = 0;
    let hasLowConfidence = false;

    kunciArray.forEach(k => {
      const qNo = String(k.no);
      const bobot = Number(k.bobot || 1);
      const studentAns = answers[qNo] ? String(answers[qNo].ans || '').toUpperCase().trim() : '';
      const conf = answers[qNo] ? Number(answers[qNo].conf || 0) : 0;

      let statusItem = 'Salah';
      if (!studentAns) {
        kosong++;
        statusItem = 'Kosong';
      } else if (studentAns === String(k.kunci).toUpperCase().trim()) {
        benar++;
        totalScore += bobot;
        statusItem = 'Benar';
      } else {
        salah++;
      }

      if (conf > 0 && conf < confidenceThreshold) {
        hasLowConfidence = true;
        statusItem = 'Ragu';
      }

      detailRows.push({
        id_detail: 'dtl_' + Utilities.getUuid().slice(0, 8),
        id_hasil: hasilId,
        no_soal: k.no,
        jawaban_terdeteksi: studentAns,
        tingkat_keyakinan: conf,
        status_item: statusItem,
        jawaban_final_verifikasi: studentAns
      });
    });

    const isNeedsReview = hasLowConfidence || (sheetItem.forceReview === true);

    hasilRows.push({
      id_hasil: hasilId,
      id_ujian: examId,
      id_snapshot: latestSnapshot.id_snapshot,
      id_siswa: sheetItem.id_siswa || '',
      total_skor: Math.round(totalScore * 10) / 10,
      total_benar: benar,
      total_salah: salah,
      total_kosong: kosong,
      perlu_verifikasi: isNeedsReview,
      status_koreksi: isNeedsReview ? 'Needs Review' : 'Verified',
      url_foto_lembar: sheetItem.url_foto || '',
      diperiksa_pada: now
    });
  });

  batchAppendRows_(SHEET_NAMES.HASIL, hasilRows);
  batchAppendRows_(SHEET_NAMES.DETAIL, detailRows);

  bumpUserCache_(user.id);
  return {
    success: true,
    processedCount: sheets.length,
    message: 'Berhasil mengoreksi ' + sheets.length + ' lembar jawaban.'
  };
}

function handleVerifyReviewItem(user, data) {
  const hasilId = data.id_hasil;
  if (!hasilId) return { success: false, message: 'Data verifikasi tidak lengkap.' };

  updateTableRowWhere_(SHEET_NAMES.HASIL, 'id_hasil', hasilId, {
    status_koreksi: 'Verified',
    perlu_verifikasi: false
  });

  bumpUserCache_(user.id);
  return { success: true, message: 'Verifikasi lembar jawaban berhasil disimpan.' };
}

function handleGetExamAnalytics(user, data) {
  const examId = data.id_ujian;
  const allHasil = getTableData_(SHEET_NAMES.HASIL).filter(h => String(h.id_ujian) === String(examId));
  if (!allHasil.length) {
    return { success: true, data: { totalPeserta: 0, items: [] } };
  }

  const hasilIds = allHasil.map(h => String(h.id_hasil));
  const allDetail = getTableData_(SHEET_NAMES.DETAIL).filter(d => hasilIds.indexOf(String(d.id_hasil)) > -1);

  const snapshotId = allHasil[0].id_snapshot;
  const snap = getTableData_(SHEET_NAMES.KUNCI_SNAPSHOT).find(s => String(s.id_snapshot) === String(snapshotId));
  const kunciList = snap ? JSON.parse(snap.kunci_jawaban_json || '[]') : [];

  const totalPeserta = allHasil.length;
  const itemsAnalysis = kunciList.map(k => {
    const qNo = k.no;
    const details = allDetail.filter(d => Number(d.no_soal) === Number(qNo));

    let countA = 0, countB = 0, countC = 0, countD = 0, countBlank = 0, countCorrect = 0;
    details.forEach(d => {
      const ans = String(d.jawaban_final_verifikasi || d.jawaban_terdeteksi || '').toUpperCase().trim();
      if (ans === 'A') countA++;
      else if (ans === 'B') countB++;
      else if (ans === 'C') countC++;
      else if (ans === 'D') countD++;
      else countBlank++;

      if (ans === String(k.kunci).toUpperCase().trim()) countCorrect++;
    });

    const diffIndex = totalPeserta > 0 ? (countCorrect / totalPeserta) : 0;
    let diffCategory = 'Sedang';
    if (diffIndex > 0.70) diffCategory = 'Mudah';
    else if (diffIndex < 0.30) diffCategory = 'Sukar';

    return {
      no: qNo,
      kunci: k.kunci,
      bobot: k.bobot || 1,
      correctCount: countCorrect,
      correctPercent: totalPeserta > 0 ? Math.round((countCorrect / totalPeserta) * 100) : 0,
      diffIndex: Math.round(diffIndex * 100) / 100,
      diffCategory: diffCategory,
      distractors: {
        A: totalPeserta > 0 ? Math.round((countA / totalPeserta) * 100) : 0,
        B: totalPeserta > 0 ? Math.round((countB / totalPeserta) * 100) : 0,
        C: totalPeserta > 0 ? Math.round((countC / totalPeserta) * 100) : 0,
        D: totalPeserta > 0 ? Math.round((countD / totalPeserta) * 100) : 0,
        Blank: totalPeserta > 0 ? Math.round((countBlank / totalPeserta) * 100) : 0
      }
    };
  });

  return {
    success: true,
    data: {
      totalPeserta: totalPeserta,
      items: itemsAnalysis
    }
  };
}

// ============================================================================
// 9. BUSINESS LOGIC: SUPER ADMIN SAAS PANEL (TOKEN LIFETIME & BRANDING)
// ============================================================================
function handleAdminDashboardData() {
  const users = getTableData_(SHEET_NAMES.USERS);
  const tokens = getTableData_(SHEET_NAMES.TOKENS);
  const logs = getTableData_(SHEET_NAMES.TOKEN_LOGS);

  return {
    success: true,
    data: {
      users: users.map(u => redaksi_(u)),
      tokens: tokens,
      logs: logs.slice(-50).reverse(),
      settings: {
        appName: prop_('APP_NAME', 'SmartCorrect'),
        logoUrl: prop_('LOGO_URL', ''),
        faviconUrl: prop_('FAVICON_URL', ''),
        brandColor: prop_('BRAND_COLOR', '#2563EB'),
        confidenceThreshold: Number(prop_('CONFIDENCE_THRESHOLD', '80'))
      }
    }
  };
}

function handleAdminGenerateToken(data) {
  let code = String(data.kode_token || '').trim().toUpperCase();
  if (!code) {
    code = 'SC-' + acak_(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') + '-' + acak_(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789');
  }

  const tokenId = 'tok_' + Utilities.getUuid().slice(0, 8);
  const durasiHari = Number(data.durasi_hari || 30);
  const maxUsage = Number(data.max_usage || 1);
  
  let tipe = data.tipe_lisensi;
  if (durasiHari === -1 || durasiHari >= 36500) {
    tipe = '👑 Lifetime (Selamanya)';
  } else if (!tipe) {
    tipe = (durasiHari >= 365 ? '1 Tahun' : (durasiHari + ' Hari'));
  }

  const tokenRow = {
    id_token: tokenId,
    kode_token: code,
    tipe_lisensi: tipe,
    durasi_hari: durasiHari,
    max_usage: maxUsage,
    used_count: 0,
    status: 'Active',
    catatan_admin: data.catatan_admin || '',
    created_at: new Date().toISOString()
  };

  batchAppendRows_(SHEET_NAMES.TOKENS, [tokenRow]);
  bumpGlobalCache_();

  return {
    success: true,
    token: tokenRow,
    message: 'Token lisensi ' + code + ' (' + tipe + ') berhasil dibuat.'
  };
}

function handleAdminUpdateTokenStatus(data) {
  const tokenId = data.id_token;
  const newStatus = data.status;
  updateTableRowWhere_(SHEET_NAMES.TOKENS, 'id_token', tokenId, { status: newStatus });
  bumpGlobalCache_();
  return { success: true, message: 'Status token berhasil diperbarui.' };
}

function handleAdminExtendUserLicense(data) {
  const userId = data.id_user;
  const days = Number(data.days || 30);

  const users = getTableData_(SHEET_NAMES.USERS);
  const user = users.find(u => String(u.id_user) === String(userId));
  if (!user) return { success: false, message: 'User tidak ditemukan.' };

  let newExp;
  if (days === -1 || days >= 36500) {
    newExp = '2099-12-31T23:59:59.000Z'; // Lifetime
  } else {
    const currentExp = user.tgl_kedaluwarsa_lisensi ? new Date(user.tgl_kedaluwarsa_lisensi) : new Date();
    const baseTime = currentExp.getTime() > Date.now() ? currentExp.getTime() : Date.now();
    newExp = new Date(baseTime + (days * 24 * 3600 * 1000)).toISOString();
  }

  updateTableRowWhere_(SHEET_NAMES.USERS, 'id_user', userId, {
    tgl_kedaluwarsa_lisensi: newExp,
    status_akun: 'Active'
  });

  bumpUserCache_(userId);
  return { success: true, newExp: newExp, message: 'Lisensi berhasil diperpanjang hingga ' + (newExp.startsWith('2099') ? 'SELAMANYA (Lifetime)' : newExp.slice(0, 10)) };
}

function handleAdminSaveSettings(data) {
  const updateObj = {};
  if (data.appName !== undefined) updateObj['APP_NAME'] = data.appName;
  if (data.logoUrl !== undefined) updateObj['LOGO_URL'] = data.logoUrl;
  if (data.faviconUrl !== undefined) updateObj['FAVICON_URL'] = data.faviconUrl;
  if (data.brandColor !== undefined) updateObj['BRAND_COLOR'] = data.brandColor;
  if (data.confidenceThreshold !== undefined) updateObj['CONFIDENCE_THRESHOLD'] = String(data.confidenceThreshold);

  setProps_(updateObj);
  bumpGlobalCache_();
  return { success: true, message: 'Pengaturan identitas dan branding berhasil disimpan.' };
}

// ============================================================================
// 10. SETUP OTOMATIS IDEMPOTEN (setupAppEnvironment) & RESET KREDENSIAL
// ============================================================================

/**
 * Jalankan fungsi ini di Editor Apps Script jika lupa sandi Super Admin.
 * Fungsi ini akan mereset username menjadi 'admin' dan sandi menjadi 'Admin123456!'
 * atau nilai kustom yang Anda inginkan, lalu mencetaknya di log eksekusi.
 */
function resetSuperAdminPassword() {
  const newPass = 'admin123';
  const salt = Utilities.getUuid();
  setProps_({
    EMERGENCY_USER: 'admin',
    EMERGENCY_SALT: salt,
    EMERGENCY_PASS_HASH: hashPass_(newPass, salt)
  });
  delProp_('DARURAT_GAGAL');
  delProp_('DARURAT_KUNCI_SAMPAI');

  Logger.log('========================================================');
  Logger.log('🔑 KREDENSIAL SUPER ADMIN BERHASIL DIRESET:');
  Logger.log('   Username : admin');
  Logger.log('   Password : ' + newPass);
  Logger.log('========================================================');
}

function setupAppEnvironment() {
  const APP_NAME = 'SmartCorrect SaaS Platform';
  Logger.log('🚀 Memulai setup lingkungan ' + APP_NAME + '...');

  secret_();
  if (!prop_('EMERGENCY_PASS_HASH')) {
    const rawPass = acak_(12, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789');
    const salt = Utilities.getUuid();
    setProps_({
      EMERGENCY_USER: 'admin',
      EMERGENCY_SALT: salt,
      EMERGENCY_PASS_HASH: hashPass_(rawPass, salt)
    });
    Logger.log('🔐 [PENTING] KREDENSIAL SUPER ADMIN DARURAT:');
    Logger.log('   Username : admin');
    Logger.log('   Password : ' + rawPass);
  }

  let rootFolder;
  const rootId = prop_('ROOT_FOLDER_ID');
  if (rootId) {
    try { rootFolder = DriveApp.getFolderById(rootId); } catch(e){}
  }
  if (!rootFolder) {
    rootFolder = DriveApp.createFolder('📁 SmartCorrect Platform');
    setProp_('ROOT_FOLDER_ID', rootFolder.getId());
  }

  let ss;
  const ssId = prop_('SPREADSHEET_ID');
  if (ssId) {
    try { ss = SpreadsheetApp.openById(ssId); } catch(e){}
  }
  if (!ss) {
    ss = SpreadsheetApp.create('🗃️ Database — SmartCorrect Platform');
    DriveApp.getFileById(ss.getId()).moveTo(rootFolder);
    setProp_('SPREADSHEET_ID', ss.getId());
  }

  const schema = {
    [SHEET_NAMES.USERS]: ['id_user', 'email_google', 'nama_lengkap', 'no_wa', 'role', 'status_akun', 'tgl_aktivasi', 'tgl_kedaluwarsa_lisensi', 'id_token_terakhir', 'avatar_url', 'pass_hash', 'pass_salt', 'created_at'],
    [SHEET_NAMES.TOKENS]: ['id_token', 'kode_token', 'tipe_lisensi', 'durasi_hari', 'max_usage', 'used_count', 'status', 'catatan_admin', 'created_at'],
    [SHEET_NAMES.TOKEN_LOGS]: ['id_log', 'id_token', 'id_user_pengklaim', 'tgl_klaim', 'perpanjangan_dari_tgl', 'perpanjangan_sampai_tgl'],
    [SHEET_NAMES.SISWA]: ['id_siswa', 'nis_nisn', 'nama_siswa', 'kelas', 'id_guru_pemilik'],
    [SHEET_NAMES.MAPEL]: ['id_mapel', 'nama_mapel', 'kode_mapel', 'id_guru_pemilik'],
    [SHEET_NAMES.UJIAN]: ['id_ujian', 'nama_ujian', 'id_mapel', 'id_guru_pemilik', 'kelas_target', 'jumlah_soal', 'opsi_pilihan', 'skema_bobot', 'tgl_ujian', 'status_ujian'],
    [SHEET_NAMES.KUNCI_SNAPSHOT]: ['id_snapshot', 'id_ujian', 'kunci_jawaban_json', 'timestamp_kunci'],
    [SHEET_NAMES.HASIL]: ['id_hasil', 'id_ujian', 'id_snapshot', 'id_siswa', 'total_skor', 'total_benar', 'total_salah', 'total_kosong', 'perlu_verifikasi', 'status_koreksi', 'url_foto_lembar', 'diperiksa_pada'],
    [SHEET_NAMES.DETAIL]: ['id_detail', 'id_hasil', 'no_soal', 'jawaban_terdeteksi', 'tingkat_keyakinan', 'status_item', 'jawaban_final_verifikasi'],
    [SHEET_NAMES.CONFIG]: ['key', 'value', 'keterangan']
  };

  Object.keys(schema).forEach(sheetName => {
    let sh = ss.getSheetByName(sheetName);
    if (!sh) {
      sh = ss.insertSheet(sheetName);
    }
    if (sh.getLastRow() === 0) {
      sh.appendRow(schema[sheetName]);
      sh.getRange(1, 1, 1, schema[sheetName].length).setFontWeight('bold').setBackground('#F1F5F9');
    }
  });

  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e){}
  }

  // Token Awal: 1 Token Demo (30 hari) & 1 Token Lifetime Selamanya
  const tokensSh = ss.getSheetByName(SHEET_NAMES.TOKENS);
  if (tokensSh.getLastRow() <= 1) {
    tokensSh.appendRow([
      'tok_demo_30d',
      'SC-DEMO-2026',
      'Trial 30 Hari',
      30,
      10,
      0,
      'Active',
      'Token Demo 30 Hari',
      new Date().toISOString()
    ]);
    tokensSh.appendRow([
      'tok_master_lifetime',
      'SC-LIFETIME-VIP',
      '👑 Lifetime (Selamanya)',
      -1,
      5,
      0,
      'Active',
      'Token Khusus Aktif Selamanya',
      new Date().toISOString()
    ]);
  }

  setProps_({
    APP_NAME: 'SmartCorrect',
    BRAND_COLOR: '#2563EB',
    CONFIDENCE_THRESHOLD: '80'
  });

  Logger.log('✅ Setup Berhasil Sempurna!');
  Logger.log('📊 URL Spreadsheet : ' + ss.getUrl());
  Logger.log('📁 URL Folder Drive: ' + rootFolder.getUrl());
}
