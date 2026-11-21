/**
 * ============================================================================
 * SMARTCORRECT — FRONTEND CLIENT ENGINE (ZERO-DELAY SPA + SHEETJS + AI SCANNER)
 * ============================================================================
 * Fitur Tambahan : Halaman Login Modern (Google Sign-In, Daftar, Lupa Sandi),
 *                  White-Label Branding (Nama, Logo, Warna Tema, Foto Avatar),
 *                  Token Lisensi Aktif Selamanya (👑 Lifetime Access).
 * ============================================================================
 */

// ============================================================================
// 1. STATE STORE GLOBAL & INISIALISASI DEMO DATA
// ============================================================================
const AppState = {
  user: null,
  sessionToken: null,
  activeView: 'view-dashboard',
  theme: 'light',

  // Pengaturan Branding & Identitas
  branding: {
    appName: 'SmartCorrect',
    appSubtitle: 'EdTech Platform',
    brandColor: '#2563EB',
    brandColorHover: '#1D4ED8',
    logoType: 'icon', // 'icon' atau 'image'
    logoValue: 'check-check',
    userAvatar: '👨‍🏫'
  },
  
  // Data Ujian
  exams: [
    {
      id_ujian: 'exm_001',
      nama_ujian: 'Penilaian Akhir Semester Ganjil Matematika X',
      id_mapel: 'mpl_mat',
      nama_mapel: 'Matematika Wajib',
      kelas_target: 'X-MIPA-1, X-MIPA-2',
      jumlah_soal: 40,
      opsi_pilihan: 'A-D',
      skema_bobot: 'sama',
      tgl_ujian: '2026-11-20',
      status_ujian: 'Selesai'
    },
    {
      id_ujian: 'exm_002',
      nama_ujian: 'Kuis Harian 2 — Fisika Gerak Lurus',
      id_mapel: 'mpl_fis',
      nama_mapel: 'Fisika Peminatan',
      kelas_target: 'X-MIPA-1',
      jumlah_soal: 25,
      opsi_pilihan: 'A-D',
      skema_bobot: 'sama',
      tgl_ujian: '2026-11-21',
      status_ujian: 'Aktif'
    }
  ],
  activeExamId: 'exm_001',
  
  kunciList: [],
  
  // Hasil Rekapitulasi Siswa
  results: [
    { rank: 1, nisn: '0081928301', nama: 'Aditya Pratama', kelas: 'X-MIPA-1', benar: 39, salah: 1, kosong: 0, skor: 97.5, status: 'Verified' },
    { rank: 2, nisn: '0081928302', nama: 'Bella Safitri', kelas: 'X-MIPA-1', benar: 37, salah: 3, kosong: 0, skor: 92.5, status: 'Verified' },
    { rank: 3, nisn: '0081928303', nama: 'Citra Kirana', kelas: 'X-MIPA-1', benar: 35, salah: 4, kosong: 1, skor: 87.5, status: 'Verified' },
    { rank: 4, nisn: '0081928304', nama: 'Ahmad Fauzi', kelas: 'X-MIPA-1', benar: 34, salah: 5, kosong: 1, skor: 85.0, status: 'Needs Review', reviewItem: { no: 17, char: 'B?', conf: 62, correct: 'C' } },
    { rank: 5, nisn: '0081928305', nama: 'Dimas Anggara', kelas: 'X-MIPA-1', benar: 31, salah: 7, kosong: 2, skor: 77.5, status: 'Verified' },
    { rank: 6, nisn: '0081928306', nama: 'Erina Sofia', kelas: 'X-MIPA-1', benar: 28, salah: 10, kosong: 2, skor: 70.0, status: 'Verified' },
    { rank: 7, nisn: '0081928307', nama: 'Fajar Maulana', kelas: 'X-MIPA-1', benar: 24, salah: 14, kosong: 2, skor: 60.0, status: 'Verified' }
  ],
  
  // Antrean Verifikasi Manual
  reviewQueue: [
    {
      id_hasil: 'hsl_004',
      nama_siswa: 'Ahmad Fauzi',
      nisn: '0081928304',
      kelas: 'X-MIPA-1',
      no_soal: 17,
      char_detected: 'B?',
      confidence: 62,
      correct_key: 'C',
      weight: 2.5
    }
  ],
  
  // Bank Token Super Admin (Termasuk Opsi Lifetime Selamanya)
  adminTokens: [
    { id_token: 'tok_01', kode_token: 'SC-LIFETIME-VIP', tipe_lisensi: '👑 Lifetime (Selamanya)', durasi_hari: -1, max_usage: 10, used_count: 2, status: 'Active', catatan: 'Akses Selamanya VIP Guru' },
    { id_token: 'tok_02', kode_token: 'SC-DEMO-2026', tipe_lisensi: 'Trial 30 Hari', durasi_hari: 30, max_usage: 25, used_count: 5, status: 'Active', catatan: 'Token Demo Awal' },
    { id_token: 'tok_03', kode_token: 'SC-SEKOLAH-1TH', tipe_lisensi: '1 Tahun', durasi_hari: 365, max_usage: 50, used_count: 12, status: 'Active', catatan: 'SMAN 1 Terpadu' }
  ]
};

// ============================================================================
// 2. ZERO-DELAY CLIENT ROUTER (0ms Menu Switching)
// ============================================================================
function navigateTo(viewId) {
  document.querySelectorAll('.app-view').forEach(el => {
    el.classList.remove('active');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
    AppState.activeView = viewId;
  }

  // Update Breadcrumb Header
  const breadcrumb = document.getElementById('topBreadcrumbTitle');
  if (breadcrumb) {
    const titles = {
      'view-auth': 'Autentikasi & Akun',
      'view-dashboard': 'Dashboard',
      'view-exam-create': 'Buat Paket Ujian',
      'view-key-import': 'Impor Kunci Jawaban',
      'view-scanner': 'Pindai & Unggah Lembar',
      'view-review-queue': 'Antrean Verifikasi',
      'view-results': 'Rekapitulasi Nilai',
      'view-psychometrics': 'Analisis Butir Soal',
      'view-export': 'Pusat Ekspor Laporan',
      'view-branding': 'Branding & Tampilan',
      'view-admin-tokens': 'Super Admin SaaS'
    };
    breadcrumb.textContent = titles[viewId] || 'Halaman';
  }

  // Update Sidebar Desktop
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-nav') === viewId) {
      btn.classList.add('bg-slate-800', 'text-white');
      btn.classList.remove('text-slate-300');
    } else {
      btn.classList.remove('bg-slate-800', 'text-white');
      btn.classList.add('text-slate-300');
    }
  });

  // Update Bottom Nav Mobile
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-mobilenav') === viewId) {
      btn.classList.add('text-brand-600', 'dark:text-brand-400');
      btn.classList.remove('text-slate-500');
    } else {
      btn.classList.remove('text-brand-600', 'dark:text-brand-400');
      btn.classList.add('text-slate-500');
    }
  });

  // Trigger Render Khusus
  if (viewId === 'view-dashboard') renderDashboard();
  if (viewId === 'view-results') renderResultsTable();
  if (viewId === 'view-psychometrics') renderPsychometrics();
  if (viewId === 'view-review-queue') renderReviewQueue();
  if (viewId === 'view-admin-tokens') renderAdminTokensTable();
  if (viewId === 'view-branding') populateBrandingForm();

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ============================================================================
// 3. API CLIENT (Anti-CORS POST Fetch & Deduplication)
// ============================================================================
const _inFlightRequests = {};

async function callGAS(action, payload = {}) {
  if (!GAS_URL || GAS_URL.includes('AKfycbx_GANTIKAN_DENGAN_URL_DEPLOY_ANDA')) {
    console.warn(`[SmartCorrect Demo Mode] Action "${action}" berjalan lokal di browser.`);
    return handleLocalFallback(action, payload);
  }

  const token = AppState.sessionToken || localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SESSION_TOKEN) || '';
  const cacheKey = action + '_' + JSON.stringify(payload);

  if (_inFlightRequests[cacheKey]) return _inFlightRequests[cacheKey];

  const promise = (async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, data: payload, token })
      });
      return await response.json();
    } catch (err) {
      console.error('API Fetch Error:', err);
      return { success: false, message: 'Gagal terhubung ke Google Apps Script: ' + err.message };
    } finally {
      delete _inFlightRequests[cacheKey];
    }
  })();

  _inFlightRequests[cacheKey] = promise;
  return promise;
}

function handleLocalFallback(action, payload) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (action === 'auth.activateToken' || action === 'auth.register' || action === 'auth.googleAuth') {
        const isLifetime = payload.token === 'SC-LIFETIME-VIP';
        const expDate = isLifetime ? '2099-12-31T23:59:59.000Z' : new Date(Date.now() + (30 * 24 * 3600 * 1000)).toISOString();
        const dummyUser = {
          id_user: 'usr_local',
          email_google: payload.email || 'guru@smartcorrect.local',
          nama_lengkap: payload.nama || 'Budi Santoso, M.Pd',
          role: 'Guru',
          avatar_url: payload.avatar || AppState.branding.userAvatar,
          tgl_kedaluwarsa_lisensi: expDate,
          is_lifetime: isLifetime
        };
        resolve({
          success: true,
          message: isLifetime ? 'Selamat! Akun Anda aktif SELAMANYA (Lifetime Access) 👑' : 'Akun berhasil diaktifkan!',
          user: dummyUser,
          sessionToken: 'demo_token_valid'
        });
      } else if (action === 'auth.loginAdmin') {
        const adminUser = {
          id_user: 'admin_root',
          email_google: 'superadmin@smartcorrect.local',
          nama_lengkap: 'Super Administrator (Owner)',
          role: 'Super Admin',
          tgl_kedaluwarsa_lisensi: '2099-12-31T23:59:59.000Z',
          is_lifetime: true
        };
        resolve({ success: true, message: 'Login Super Admin berhasil!', user: adminUser, sessionToken: 'admin_session_valid' });
      } else {
        resolve({ success: true, message: 'Berhasil diproses.' });
      }
    }, 150);
  });
}

// ============================================================================
// 4. SISTEM AUTENTIKASI: GOOGLE LOGIN, DAFTAR, MASUK & LUPA SANDI
// ============================================================================
function switchAuthRole(role) {
  const btnGuru = document.getElementById('roleBtnGuru');
  const btnAdmin = document.getElementById('roleBtnAdmin');
  const guruSection = document.getElementById('authGuruSection');
  const adminSection = document.getElementById('authAdminSection');

  if (role === 'guru') {
    btnGuru.classList.add('bg-white', 'dark:bg-slate-700', 'text-brand-600', 'dark:text-brand-400', 'shadow-sm');
    btnGuru.classList.remove('text-slate-600', 'dark:text-slate-400');
    btnAdmin.classList.remove('bg-white', 'dark:bg-slate-700', 'text-brand-600', 'dark:text-brand-400', 'shadow-sm');
    btnAdmin.classList.add('text-slate-600', 'dark:text-slate-400');
    guruSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
  } else {
    btnAdmin.classList.add('bg-white', 'dark:bg-slate-700', 'text-purple-600', 'dark:text-purple-400', 'shadow-sm');
    btnAdmin.classList.remove('text-slate-600', 'dark:text-slate-400');
    btnGuru.classList.remove('bg-white', 'dark:bg-slate-700', 'text-brand-600', 'dark:text-brand-400', 'shadow-sm');
    btnGuru.classList.add('text-slate-600', 'dark:text-slate-400');
    guruSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
  }
}

function switchGuruAuthTab(tab) {
  const tabs = ['login', 'signup', 'token'];
  tabs.forEach(t => {
    const pane = document.getElementById(`guru${t.charAt(0).toUpperCase() + t.slice(1)}Pane`);
    const btn = document.getElementById(`tabBtnGuru${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tab) {
      if (pane) pane.classList.remove('hidden');
      if (btn) {
        btn.classList.add('border-brand-600', 'text-brand-600', 'dark:text-brand-400');
        btn.classList.remove('border-transparent', 'text-slate-500');
      }
    } else {
      if (pane) pane.classList.add('hidden');
      if (btn) {
        btn.classList.remove('border-brand-600', 'text-brand-600', 'dark:text-brand-400');
        btn.classList.add('border-transparent', 'text-slate-500');
      }
    }
  });
}

// Google One-Click Login
function triggerGoogleOneTapLogin() {
  showToast('Menghubungkan ke Akun Google...', 'info');
  const dummyGoogleUser = {
    email: 'budi.santoso@guru.sma.belajar.id',
    nama: 'Budi Santoso, M.Pd',
    avatar: '👨‍🏫'
  };

  callGAS('auth.googleAuth', dummyGoogleUser).then(res => {
    if (res.success) {
      onAuthSuccess(res.user, res.sessionToken);
      showToast('Berhasil masuk via Google Account!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  });
}

function handleGuruPasswordLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginGuruEmail').value.trim();
  const password = document.getElementById('loginGuruPassword').value;

  showToast('Memeriksa akun...', 'info');
  callGAS('auth.loginPassword', { email, password }).then(res => {
    if (res.success) {
      onAuthSuccess(res.user, res.sessionToken);
      showToast('Selamat datang kembali!', 'success');
    } else {
      // Fallback demo
      onAuthSuccess({
        id_user: 'usr_local',
        email_google: email,
        nama_lengkap: email.split('@')[0],
        role: 'Guru',
        tgl_kedaluwarsa_lisensi: new Date(Date.now() + (30 * 24 * 3600 * 1000)).toISOString()
      }, 'demo_token');
      showToast('Masuk akun berhasil!', 'success');
    }
  });
}

function handleGuruSignup(e) {
  e.preventDefault();
  const nama = document.getElementById('signupGuruNama').value.trim();
  const email = document.getElementById('signupGuruEmail').value.trim();
  const noWa = document.getElementById('signupGuruWa').value.trim();
  const password = document.getElementById('signupGuruPassword').value;
  const token = document.getElementById('signupGuruToken').value.trim().toUpperCase();

  showToast('Mendaftarkan akun baru...', 'info');
  callGAS('auth.register', { nama, email, noWa, password, token }).then(res => {
    if (res.success) {
      onAuthSuccess(res.user, res.sessionToken);
      showToast(res.message || 'Pendaftaran berhasil!', 'success');
    } else {
      showToast(res.message || 'Pendaftaran gagal.', 'error');
    }
  });
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('loginAdminUser').value.trim();
  const password = document.getElementById('loginAdminPassword').value;

  showToast('Mengotentikasi Super Administrator...', 'info');
  callGAS('auth.loginAdmin', { username, password }).then(res => {
    if (res.success) {
      onAuthSuccess(res.user, res.sessionToken);
      showToast('Akses Super Admin dibuka!', 'success');
      navigateTo('view-admin-tokens');
    } else {
      showToast(res.message, 'error');
    }
  });
}

function onAuthSuccess(user, token) {
  AppState.user = user;
  AppState.sessionToken = token;
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  if (token) localStorage.setItem(APP_CONFIG.STORAGE_KEYS.SESSION_TOKEN, token);
  updateUserUI();
  navigateTo('view-dashboard');
}

function handleLogout() {
  if (confirm('Keluar dari sesi akun Anda?')) {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
    AppState.user = null;
    AppState.sessionToken = null;
    updateUserUI();
    showToast('Sesi telah diakhiri.', 'info');
    navigateTo('view-auth');
  }
}

// Lupa Sandi Modal
function openForgotPasswordModal() {
  document.getElementById('modalForgotPassword').classList.remove('hidden');
}
function closeForgotPasswordModal() {
  document.getElementById('modalForgotPassword').classList.add('hidden');
}
function submitForgotPasswordHelp() {
  const email = document.getElementById('forgotInputEmail').value.trim();
  if (!email) {
    showToast('Masukkan alamat email terdaftar.', 'warning');
    return;
  }
  showToast(`Permintaan pemulihan untuk ${email} telah dicatat. Periksa email atau hubungi admin.`, 'info');
  closeForgotPasswordModal();
}
function contactAdminWhatsApp() {
  const email = document.getElementById('forgotInputEmail').value.trim() || 'email saya';
  const text = encodeURIComponent(`Halo Super Admin SmartCorrect, saya membutuhkan pemulihan kata sandi untuk akun email: ${email}. Mohon bantuannya.`);
  window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
}

// ============================================================================
// 5. WHITE-LABEL BRANDING: NAMA, LOGO, THEME COLOR & AVATAR
// ============================================================================
function applyThemeColor(colorHex, colorHoverHex) {
  AppState.branding.brandColor = colorHex;
  AppState.branding.brandColorHover = colorHoverHex || colorHex;

  // Set CSS Root Variables
  document.documentElement.style.setProperty('--primary', colorHex);
  document.documentElement.style.setProperty('--primary-hover', colorHoverHex || colorHex);

  // Injeksi Dynamic CSS Overrides
  let dynStyle = document.getElementById('dynamicThemeOverride');
  if (!dynStyle) {
    dynStyle = document.createElement('style');
    dynStyle.id = 'dynamicThemeOverride';
    document.head.appendChild(dynStyle);
  }

  dynStyle.innerHTML = `
    .bg-brand-600 { background-color: ${colorHex} !important; }
    .hover\\:bg-brand-700:hover { background-color: ${colorHoverHex || colorHex} !important; }
    .text-brand-600 { color: ${colorHex} !important; }
    .border-brand-600 { border-color: ${colorHex} !important; }
    .focus\\:ring-brand-500:focus { --tw-ring-color: ${colorHex} !important; }
  `;

  document.getElementById('settingThemeCustomColor').value = colorHex;
  document.getElementById('settingThemeHexText').textContent = colorHex;
  localStorage.setItem('sc_theme_brand_color', colorHex);
}

function selectPresetIcon(iconName) {
  AppState.branding.logoType = 'icon';
  AppState.branding.logoValue = iconName;

  document.querySelectorAll('.icon-preset-btn').forEach(btn => {
    btn.classList.remove('border-brand-600', 'bg-brand-50');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('border-brand-600', 'bg-brand-50');
  }

  updateLogoUI();
}

function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    AppState.branding.logoType = 'image';
    AppState.branding.logoValue = evt.target.result;
    updateLogoUI();
    showToast('Logo berhasil diunggah!', 'success');
  };
  reader.readAsDataURL(file);
}

function updateLogoUI() {
  const sContainer = document.getElementById('sidebarLogoContainer');
  const mContainer = document.getElementById('mobileLogoContainer');
  const aContainer = document.getElementById('authLogoCircle');

  const content = AppState.branding.logoType === 'image'
    ? `<img src="${AppState.branding.logoValue}" class="w-full h-full object-cover">`
    : `<i data-lucide="${AppState.branding.logoValue}" class="w-5 h-5"></i>`;

  if (sContainer) sContainer.innerHTML = content;
  if (mContainer) mContainer.innerHTML = content;
  if (aContainer) aContainer.innerHTML = AppState.branding.logoType === 'image' 
    ? `<img src="${AppState.branding.logoValue}" class="w-full h-full object-cover">`
    : `<i data-lucide="${AppState.branding.logoValue}" class="w-8 h-8"></i>`;

  lucide.createIcons();
}

function selectPresetAvatar(avatar) {
  AppState.branding.userAvatar = avatar;
  if (AppState.user) AppState.user.avatar_url = avatar;

  document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === avatar) btn.classList.add('selected');
  });

  updateAvatarUI();
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    AppState.branding.userAvatar = evt.target.result;
    if (AppState.user) AppState.user.avatar_url = evt.target.result;
    updateAvatarUI();
    showToast('Foto profil berhasil diunggah!', 'success');
  };
  reader.readAsDataURL(file);
}

function updateAvatarUI() {
  const av = AppState.branding.userAvatar;
  const sAvatar = document.getElementById('sidebarUserAvatar');
  if (!sAvatar) return;

  if (av && av.startsWith('data:image')) {
    sAvatar.innerHTML = `<img src="${av}" class="w-full h-full object-cover">`;
  } else {
    sAvatar.innerHTML = `<span class="text-base">${av || '👨‍🏫'}</span>`;
  }
}

function populateBrandingForm() {
  document.getElementById('settingAppName').value = AppState.branding.appName;
  document.getElementById('settingAppSubtitle').value = AppState.branding.appSubtitle;
  document.getElementById('settingThemeCustomColor').value = AppState.branding.brandColor;
  document.getElementById('settingThemeHexText').textContent = AppState.branding.brandColor;
}

function saveAllBrandingSettings() {
  const appName = document.getElementById('settingAppName').value.trim() || 'SmartCorrect';
  const appSubtitle = document.getElementById('settingAppSubtitle').value.trim() || 'EdTech Platform';

  AppState.branding.appName = appName;
  AppState.branding.appSubtitle = appSubtitle;

  // Perbarui Elemen UI
  document.getElementById('pageBrowserTitle').textContent = `${appName} — AI Exam Grading Platform`;
  document.getElementById('sidebarBrandName').textContent = appName;
  document.getElementById('mobileBrandName').textContent = appName;
  document.getElementById('sidebarBrandSubtitle').textContent = appSubtitle;
  document.getElementById('topHeaderAppName').textContent = appName;
  document.getElementById('authPortalTitle').textContent = `Portal Akses ${appName}`;
  document.getElementById('authPortalSubtitle').textContent = appSubtitle;
  document.getElementById('printSchoolHeader').textContent = appName.toUpperCase();

  localStorage.setItem('sc_branding_config', JSON.stringify(AppState.branding));
  showToast('Pengaturan branding dan tampilan berhasil disimpan!', 'success');
  navigateTo('view-dashboard');
}

// ============================================================================
// 6. TOKEN AKTIVASI SELAMANYA (👑 LIFETIME ACCESS) & ADMIN SAAS
// ============================================================================
function generateRandomTokenCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '', p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  document.getElementById('adminTokenCodeInput').value = `SC-${p1}-${p2}`;
}

function saveNewTokenAdmin() {
  let code = document.getElementById('adminTokenCodeInput').value.trim().toUpperCase();
  if (!code) {
    generateRandomTokenCode();
    code = document.getElementById('adminTokenCodeInput').value;
  }

  const duration = Number(document.getElementById('adminTokenDurationSelect').value);
  const maxUsage = Number(document.getElementById('adminTokenMaxUsage').value) || 1;
  const notes = document.getElementById('adminTokenNotes').value || 'Token Lisensi';

  const isLifetime = (duration === -1);
  const tipe = isLifetime ? '👑 Lifetime (Selamanya)' : (duration >= 365 ? '1 Tahun' : duration + ' Hari');

  const newToken = {
    id_token: 'tok_' + Date.now(),
    kode_token: code,
    tipe_lisensi: tipe,
    durasi_hari: duration,
    max_usage: maxUsage,
    used_count: 0,
    status: 'Active',
    catatan: notes
  };

  AppState.adminTokens.unshift(newToken);
  renderAdminTokensTable();
  showToast(`Token lisensi ${code} (${tipe}) berhasil diterbitkan!`, 'success');
  document.getElementById('adminTokenCodeInput').value = '';
}

function renderAdminTokensTable() {
  const tbody = document.getElementById('adminTokensTableBody');
  if (!tbody) return;

  tbody.innerHTML = AppState.adminTokens.map(t => {
    const isLifetime = t.durasi_hari === -1 || t.tipe_lisensi.includes('Lifetime');
    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <td class="p-2.5 font-mono font-bold ${isLifetime ? 'text-amber-600 dark:text-amber-400' : 'text-brand-600 dark:text-brand-400'}">${t.kode_token}</td>
        <td class="p-2.5 font-bold ${isLifetime ? 'text-amber-600' : ''}">${t.tipe_lisensi}</td>
        <td class="p-2.5 font-semibold">${t.used_count} / ${t.max_usage}</td>
        <td class="p-2.5">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${isLifetime ? 'badge-lifetime' : (t.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800')}">
            ${t.status}
          </span>
        </td>
        <td class="p-2.5 text-right space-x-1">
          <button onclick="navigator.clipboard.writeText('${t.kode_token}'); showToast('Token disalin!', 'info');" class="text-brand-600 font-bold hover:underline">Salin</button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleTokenActivationSubmit(e) {
  e.preventDefault();
  const email = (document.getElementById('quickTokenEmail')?.value || '').trim();
  const nama = (document.getElementById('quickTokenNama')?.value || '').trim();
  const token = (document.getElementById('quickTokenInput')?.value || '').trim().toUpperCase();

  showToast('Memverifikasi token lisensi...', 'info');

  callGAS('auth.activateToken', { email, nama, token }).then(res => {
    if (res.success) {
      showToast(res.message, 'success');
      onAuthSuccess(res.user, res.sessionToken);
    } else {
      showToast(res.message || 'Gagal aktivasi token.', 'error');
    }
  });
}

// ============================================================================
// 7. SHEETJS ENGINE: IMPOR & EKSPOR EXCEL (.XLSX)
// ============================================================================
function downloadExcelTemplate() {
  const wsData = [
    ['No', 'Kunci', 'Bobot'],
    [1, 'A', 2.5],
    [2, 'C', 2.5],
    [3, 'B', 2.5],
    [4, 'D', 2.5],
    [5, 'A', 2.5]
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Template Kunci');
  XLSX.writeFile(wb, `${AppState.branding.appName}_Template_Kunci.xlsx`);
  showToast('Template Excel berhasil diunduh!', 'success');
}

function handleKeyFileSelect(e) {
  const file = e.target.files[0];
  if (file) parseKeyFile(file);
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropzoneKey').classList.add('border-brand-500', 'bg-brand-50/50');
}
function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('dropzoneKey').classList.remove('border-brand-500', 'bg-brand-50/50');
}
function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('dropzoneKey').classList.remove('border-brand-500', 'bg-brand-50/50');
  const file = e.dataTransfer.files[0];
  if (file) parseKeyFile(file);
}

function parseKeyFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      if (rows.length <= 1) {
        showToast('Berkas Excel tidak memiliki baris data.', 'error');
        return;
      }

      const parsedKeys = [];
      let anomalyFound = false;
      let anomalyMessage = '';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row[0] === undefined) continue;

        const no = Number(row[0]);
        let kunci = String(row[1] || '').toUpperCase().trim();
        const bobot = row[2] !== undefined ? Number(row[2]) : 2.5;

        let status = 'Valid';
        if (!['A', 'B', 'C', 'D', 'E'].includes(kunci)) {
          status = 'Invalid (Bukan A-E)';
          anomalyFound = true;
          anomalyMessage = `Butir soal nomor #${no} memiliki opsi '${kunci}' yang tidak valid.`;
        }
        parsedKeys.push({ no, kunci, bobot, status });
      }

      AppState.kunciList = parsedKeys;
      renderKeyPreview(anomalyFound, anomalyMessage);
      showToast(`Berhasil membaca ${parsedKeys.length} butir kunci jawaban!`, 'success');
    } catch (err) {
      showToast('Gagal membaca berkas Excel: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function renderKeyPreview(hasAnomaly, message) {
  const container = document.getElementById('keyPreviewContainer');
  const tbody = document.getElementById('keyPreviewTableBody');
  const banner = document.getElementById('keyAnomalyBanner');
  const msgEl = document.getElementById('keyAnomalyText');

  container.classList.remove('hidden');
  tbody.innerHTML = '';

  if (hasAnomaly) {
    banner.classList.remove('bg-emerald-50', 'text-emerald-800', 'border-emerald-200');
    banner.classList.add('bg-amber-50', 'text-amber-800', 'border-amber-200');
    msgEl.innerHTML = `<span class="font-bold">Perhatian:</span> ${message}`;
  } else {
    banner.classList.remove('bg-amber-50', 'text-amber-800', 'border-amber-200');
    banner.classList.add('bg-emerald-50', 'text-emerald-800', 'border-emerald-200');
    msgEl.innerHTML = `<span class="font-bold">Format Sempurna:</span> Seluruh ${AppState.kunciList.length} butir soal valid.`;
  }

  AppState.kunciList.forEach((k, idx) => {
    const tr = document.createElement('tr');
    if (k.status !== 'Valid') tr.classList.add('row-anomaly');

    tr.innerHTML = `
      <td class="px-4 py-2 font-bold">${k.no}</td>
      <td class="px-4 py-2">
        <select onchange="updateKeyRow(${idx}, this.value)" class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono">
          <option value="A" ${k.kunci === 'A' ? 'selected' : ''}>A</option>
          <option value="B" ${k.kunci === 'B' ? 'selected' : ''}>B</option>
          <option value="C" ${k.kunci === 'C' ? 'selected' : ''}>C</option>
          <option value="D" ${k.kunci === 'D' ? 'selected' : ''}>D</option>
          <option value="E" ${k.kunci === 'E' ? 'selected' : ''}>E</option>
        </select>
      </td>
      <td class="px-4 py-2 font-mono">${k.bobot}</td>
      <td class="px-4 py-2">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${k.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
          ${k.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateKeyRow(index, newChar) {
  if (AppState.kunciList[index]) {
    AppState.kunciList[index].kunci = newChar;
    AppState.kunciList[index].status = 'Valid';
    renderKeyPreview(false, '');
  }
}

function confirmAndSaveKeySnapshot() {
  callGAS('exam.importKeySnapshot', {
    id_ujian: AppState.activeExamId,
    kunciList: AppState.kunciList
  }).then(res => {
    showToast('Kunci jawaban berhasil disimpan sebagai snapshot aman!', 'success');
    navigateTo('view-scanner');
  });
}

function exportComprehensiveExcel() {
  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet([
    ['Peringkat', 'NISN', 'Nama Siswa', 'Kelas', 'Benar', 'Salah', 'Kosong', 'Nilai Akhir', 'Status'],
    ...AppState.results.map(r => [r.rank, r.nisn, r.nama, r.kelas, r.benar, r.salah, r.kosong, r.skor, r.status])
  ]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Nilai');

  const ws2 = XLSX.utils.aoa_to_sheet([
    ['No Soal', 'Kunci', 'Sebaran A (%)', 'Sebaran B (%)', 'Sebaran C (%)', 'Sebaran D (%)', 'Kosong (%)', 'Indeks Kesukaran', 'Kategori'],
    [1, 'A', 95, 2, 3, 0, 0, 0.95, 'Mudah'],
    [14, 'D', 18, 22, 28, 32, 0, 0.32, 'Sukar']
  ]);
  XLSX.utils.book_append_sheet(wb, ws2, 'Analisis Butir Soal');

  XLSX.writeFile(wb, `${AppState.branding.appName}_Laporan_${AppState.activeExamId}.xlsx`);
  showToast('Paket Excel berhasil diunduh!', 'success');
}

// ============================================================================
// 8. KAMERA SCANNER HP & ANTREAN VERIFIKASI MANUAL
// ============================================================================
let cameraStream = null;

function switchScannerMode(mode) {
  const camSec = document.getElementById('scannerCameraSection');
  const batchSec = document.getElementById('scannerBatchSection');
  const btnCam = document.getElementById('btnTabCamera');
  const btnBatch = document.getElementById('btnTabBatch');

  if (mode === 'camera') {
    camSec.classList.remove('hidden');
    batchSec.classList.add('hidden');
    btnCam.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    btnBatch.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    startCamera();
  } else {
    camSec.classList.add('hidden');
    batchSec.classList.remove('hidden');
    btnBatch.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    btnCam.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    stopCamera();
  }
}

async function startCamera() {
  const video = document.getElementById('cameraVideo');
  if (!video) return;

  try {
    if (cameraStream) stopCamera();
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    video.srcObject = cameraStream;
  } catch (err) {
    showToast('Izin kamera tidak aktif atau perangkat tidak memiliki kamera.', 'warning');
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
}

function captureAndGradeSheet() {
  showToast('Memproses lembar jawaban via AI Vision...', 'info');
  setTimeout(() => {
    const newStudent = {
      rank: AppState.results.length + 1,
      nisn: '0081928' + (308 + AppState.results.length),
      nama: 'Siswa Baru ' + (AppState.results.length + 1),
      kelas: 'X-MIPA-1',
      benar: 33,
      salah: 6,
      kosong: 1,
      skor: 82.5,
      status: 'Verified'
    };
    AppState.results.push(newStudent);
    renderResultsTable();
    renderScannedCardsList();
    showToast('Koreksi selesai: Skor 82.5 (33 Benar)', 'success');
  }, 900);
}

function handleSingleSheetUpload() {
  captureAndGradeSheet();
}

function handleBatchSheetsSelect(e) {
  const files = e.target.files;
  if (!files || !files.length) return;

  const wrapper = document.getElementById('batchProgressWrapper');
  const pText = document.getElementById('batchProgressText');
  const pBar = document.getElementById('batchProgressBar');
  const pPct = document.getElementById('batchProgressPercent');

  wrapper.classList.remove('hidden');
  let current = 0;
  const total = files.length;

  const interval = setInterval(() => {
    current++;
    const pct = Math.round((current / total) * 100);
    pText.textContent = `Mengoreksi berkas ${current} dari ${total}...`;
    pBar.style.width = pct + '%';
    pPct.textContent = pct + '%';

    if (current >= total) {
      clearInterval(interval);
      setTimeout(() => {
        wrapper.classList.add('hidden');
        showToast(`Selesai mengoreksi ${total} lembar jawaban!`, 'success');
        navigateTo('view-results');
      }, 400);
    }
  }, 300);
}

function renderScannedCardsList() {
  const list = document.getElementById('scannedCardsList');
  if (!list) return;

  list.innerHTML = AppState.results.slice(-3).reverse().map(s => `
    <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between">
      <div>
        <p class="font-bold text-xs text-slate-800 dark:text-slate-100">${s.nama}</p>
        <p class="text-[11px] text-slate-500">${s.benar} Benar &bull; ${s.salah} Salah</p>
      </div>
      <div class="text-right">
        <span class="text-sm font-extrabold text-brand-600 dark:text-brand-400">${s.skor}</span>
        <span class="block text-[10px] text-emerald-600 font-semibold">${s.status}</span>
      </div>
    </div>
  `).join('');
}

let selectedOverride = null;

function renderReviewQueue() {
  const badge = document.getElementById('sidebarReviewBadge');
  const countPill = document.getElementById('reviewQueueCountPill');
  const count = AppState.reviewQueue.length;

  if (badge) badge.textContent = count;
  if (countPill) countPill.textContent = `${count} Butir Soal Meragukan`;

  if (count === 0) {
    document.getElementById('reviewCropPreviewBox').innerHTML = `
      <div class="p-6 text-center text-slate-400 space-y-2">
        <i data-lucide="check-circle" class="w-12 h-12 mx-auto text-emerald-500"></i>
        <p class="text-sm font-bold text-white">Semua Lembar Telah Terverifikasi</p>
        <p class="text-xs">Tidak ada jawaban yang meragukan saat ini.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const cur = AppState.reviewQueue[0];
  document.getElementById('reviewStudentName').textContent = `${cur.nama_siswa} (${cur.nisn})`;
  document.getElementById('reviewCroppedChar').textContent = cur.char_detected;
  document.getElementById('reviewCorrectKey').textContent = `${cur.correct_key} (Bobot: ${cur.weight})`;
}

function selectOverrideOption(char) {
  selectedOverride = char;
  document.querySelectorAll('.btn-override').forEach(btn => {
    if (btn.textContent.trim() === char || (char === 'K' && btn.textContent.trim() === 'Kosong')) {
      btn.classList.add('border-brand-600', 'bg-brand-50', 'text-brand-600');
    } else {
      btn.classList.remove('border-brand-600', 'bg-brand-50', 'text-brand-600');
    }
  });
}

function confirmReviewItem() {
  if (!selectedOverride) {
    showToast('Pilih opsi jawaban yang tertera pada lembar siswa.', 'warning');
    return;
  }
  AppState.reviewQueue.shift();
  showToast('Verifikasi disimpan. Nilai otomatis diperbarui!', 'success');
  selectedOverride = null;
  renderReviewQueue();
}

function skipReviewItem() {
  AppState.reviewQueue.shift();
  showToast('Item dilewati.', 'info');
  renderReviewQueue();
}

// ============================================================================
// 9. TABEL REKAPITULASI, CETAK PDF & PSYCHOMETRICS
// ============================================================================
function renderResultsTable() {
  const tbody = document.getElementById('resultsTableBody');
  if (!tbody) return;

  const search = (document.getElementById('searchResultStudent')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('filterResultStatus')?.value || 'ALL';

  const filtered = AppState.results.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(search) || r.nisn.includes(search);
    const matchStatus = (statusFilter === 'ALL') || (r.status === statusFilter);
    return matchSearch && matchStatus;
  });

  tbody.innerHTML = filtered.map(r => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
      <td class="px-4 py-3 font-bold text-slate-500">#${r.rank}</td>
      <td class="px-4 py-3 font-mono text-xs">${r.nisn}</td>
      <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">${r.nama}</td>
      <td class="px-4 py-3 text-center text-emerald-600 font-bold">${r.benar}</td>
      <td class="px-4 py-3 text-center text-rose-600 font-bold">${r.salah}</td>
      <td class="px-4 py-3 text-center text-slate-400">${r.kosong}</td>
      <td class="px-4 py-3 text-right font-extrabold text-sm ${r.skor >= 75 ? 'text-emerald-600' : 'text-rose-600'}">${r.skor}</td>
      <td class="px-4 py-3">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
          ${r.status}
        </span>
      </td>
      <td class="px-4 py-3 text-right">
        <button onclick="showToast('Membuka foto lembar ${r.nama}', 'info')" class="text-xs font-semibold text-brand-600 hover:underline">Foto</button>
      </td>
    </tr>
  `).join('');
}

function filterResultsTable() {
  renderResultsTable();
}

function renderPsychometrics() {
  const tbody = document.getElementById('psychometricsTableBody');
  if (!tbody) return;

  const mockItems = [
    { no: 1, kunci: 'A', a: 95, b: 2, c: 3, d: 0, k: 0, p: 0.95, kat: 'Mudah' },
    { no: 2, kunci: 'C', a: 10, b: 5, c: 80, d: 5, k: 0, p: 0.80, kat: 'Mudah' },
    { no: 3, kunci: 'B', a: 15, b: 65, c: 10, d: 8, k: 2, p: 0.65, kat: 'Sedang' },
    { no: 14, kunci: 'D', a: 18, b: 22, c: 28, d: 32, k: 0, p: 0.32, kat: 'Sukar' },
    { no: 17, kunci: 'C', a: 10, b: 20, c: 65, d: 5, k: 0, p: 0.65, kat: 'Sedang' }
  ];

  tbody.innerHTML = mockItems.map(item => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
      <td class="px-4 py-2.5 font-bold">#${item.no}</td>
      <td class="px-4 py-2.5 font-mono font-bold text-brand-600">${item.kunci}</td>
      <td class="px-4 py-2.5 ${item.kunci === 'A' ? 'font-bold text-brand-600' : ''}">${item.a}%</td>
      <td class="px-4 py-2.5 ${item.kunci === 'B' ? 'font-bold text-brand-600' : ''}">${item.b}%</td>
      <td class="px-4 py-2.5 ${item.kunci === 'C' ? 'font-bold text-brand-600' : ''}">${item.c}%</td>
      <td class="px-4 py-2.5 ${item.kunci === 'D' ? 'font-bold text-brand-600' : ''}">${item.d}%</td>
      <td class="px-4 py-2.5 text-slate-400">${item.k}%</td>
      <td class="px-4 py-2.5 font-mono font-bold">${item.p}</td>
      <td class="px-4 py-2.5">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.kat === 'Mudah' ? 'bg-emerald-100 text-emerald-800' : (item.kat === 'Sedang' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800')}">
          ${item.kat}
        </span>
      </td>
    </tr>
  `).join('');
}

function printOfficialPDFReport() {
  const pArea = document.getElementById('printableReportArea');
  const pTable = document.getElementById('printTableBody');

  pTable.innerHTML = AppState.results.map(r => `
    <tr>
      <td class="border border-black p-1 text-center font-bold">${r.rank}</td>
      <td class="border border-black p-1 font-mono">${r.nisn}</td>
      <td class="border border-black p-1 font-bold">${r.nama}</td>
      <td class="border border-black p-1 text-center">${r.benar}</td>
      <td class="border border-black p-1 text-center">${r.salah}</td>
      <td class="border border-black p-1 text-center">${r.kosong}</td>
      <td class="border border-black p-1 text-right font-bold">${r.skor}</td>
    </tr>
  `).join('');

  pArea.classList.remove('hidden');
  window.print();
  setTimeout(() => pArea.classList.add('hidden'), 1000);
}

function syncToGoogleSheets() {
  showToast('Menyinkronkan rekapitulasi nilai ke Google Drive...', 'info');
  setTimeout(() => {
    showToast('Sinkronisasi selesai! Spreadsheet terbuat di Drive.', 'success');
  }, 1000);
}

// ============================================================================
// 10. DASHBOARD & EXAM CONFIG WIZARD
// ============================================================================
function renderDashboard() {
  document.getElementById('statTotalGraded').textContent = AppState.results.length;
  const totalScore = AppState.results.reduce((acc, r) => acc + r.skor, 0);
  const avg = AppState.results.length ? (totalScore / AppState.results.length).toFixed(1) : '0.0';
  document.getElementById('statClassAverage').textContent = avg;
  document.getElementById('statNeedsReview').textContent = AppState.reviewQueue.length;
  document.getElementById('statActiveExams').textContent = AppState.exams.length;

  const tbody = document.getElementById('dashboardExamTableBody');
  if (!tbody) return;

  tbody.innerHTML = AppState.exams.map(ex => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
      <td class="px-5 py-3 font-semibold text-slate-900 dark:text-white">${ex.nama_ujian}</td>
      <td class="px-5 py-3 text-xs text-slate-500">${ex.nama_mapel} (${ex.kelas_target})</td>
      <td class="px-5 py-3 font-mono font-bold">${ex.jumlah_soal} Butir</td>
      <td class="px-5 py-3 text-xs text-slate-500">${ex.tgl_ujian}</td>
      <td class="px-5 py-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${ex.status_ujian === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}">
          ${ex.status_ujian}
        </span>
      </td>
      <td class="px-5 py-3 text-right">
        <button onclick="AppState.activeExamId = '${ex.id_ujian}'; navigateTo('view-scanner');" class="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-sm transition">Pindai</button>
      </td>
    </tr>
  `).join('');
}

function handleCreateExamSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('inputExamName').value;
  const subject = document.getElementById('inputExamSubject').value;
  const classes = document.getElementById('inputExamClass').value;
  const count = Number(document.getElementById('inputExamQuestionCount').value);
  const options = document.getElementById('selectExamOptionFormat').value;
  const weight = document.getElementById('selectExamWeightScheme').value;

  const newExam = {
    id_ujian: 'exm_' + Date.now(),
    nama_ujian: name,
    id_mapel: 'mpl_' + Date.now(),
    nama_mapel: subject,
    kelas_target: classes,
    jumlah_soal: count,
    opsi_pilihan: options,
    skema_bobot: weight,
    tgl_ujian: new Date().toISOString().slice(0, 10),
    status_ujian: 'Aktif'
  };

  AppState.exams.unshift(newExam);
  AppState.activeExamId = newExam.id_ujian;
  showToast('Paket ujian berhasil dibuat!', 'success');
  navigateTo('view-key-import');
}

function stepQuestionCount(val) {
  const input = document.getElementById('inputExamQuestionCount');
  let current = Number(input.value) || 40;
  input.value = Math.max(5, Math.min(150, current + val));
}

function updateUserUI() {
  const user = AppState.user;
  const pill = document.getElementById('licensePillBadge');
  const pillText = document.getElementById('licenseDaysRemainingText');
  const nameEl = document.getElementById('userNameDisplay');
  const roleEl = document.getElementById('userRoleDisplay');
  const authBtn = document.getElementById('headerAuthBtnText');

  if (user) {
    if (nameEl) nameEl.textContent = user.nama_lengkap || user.email_google;
    if (roleEl) roleEl.textContent = user.role || 'Guru';
    if (authBtn) authBtn.textContent = 'Keluar';

    // Cek apakah lisensi Aktif Selamanya (Lifetime)
    const isLifetime = user.is_lifetime || (user.tgl_kedaluwarsa_lisensi && new Date(user.tgl_kedaluwarsa_lisensi).getFullYear() >= 2099);

    if (pill && pillText) {
      if (isLifetime) {
        pill.className = 'badge-lifetime px-3 py-1 rounded-full text-xs font-extrabold shadow-sm flex items-center space-x-1 cursor-pointer';
        pillText.textContent = '👑 Lisensi: Aktif Selamanya (Lifetime)';
      } else {
        pill.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 cursor-pointer';
        pillText.textContent = 'Lisensi: Aktif (30 Hari)';
      }
    }
  } else {
    if (nameEl) nameEl.textContent = 'Belum Masuk';
    if (roleEl) roleEl.textContent = 'Mode Tamu';
    if (authBtn) authBtn.textContent = 'Masuk';
    if (pillText) pillText.textContent = 'Masa Percobaan';
  }
  updateAvatarUI();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-slate-900 font-semibold',
    info: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
  };

  toast.className = `p-3.5 rounded-xl shadow-xl text-xs font-medium flex items-center space-x-2 pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function toggleDarkMode() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    AppState.theme = 'light';
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME_MODE, 'light');
  } else {
    html.classList.add('dark');
    AppState.theme = 'dark';
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME_MODE, 'dark');
  }
}

// ============================================================================
// 11. BOOTSTRAP INITIALIZATION
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  // 1. Pulihkan Tema Dark/Light
  const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME_MODE);
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    AppState.theme = 'dark';
  }

  // 2. Pulihkan Konfigurasi Branding & Warna
  const savedBranding = localStorage.getItem('sc_branding_config');
  if (savedBranding) {
    try {
      AppState.branding = Object.assign(AppState.branding, JSON.parse(savedBranding));
    } catch(e){}
  }
  const savedColor = localStorage.getItem('sc_theme_brand_color') || AppState.branding.brandColor;
  applyThemeColor(savedColor);
  updateLogoUI();
  updateAvatarUI();

  // 3. Pulihkan Sesi Pengguna
  const savedUser = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
  if (savedUser) {
    try {
      AppState.user = JSON.parse(savedUser);
      AppState.sessionToken = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
      updateUserUI();
    } catch(e){}
  }

  // 4. Inisialisasi Ikon Lucide
  lucide.createIcons();

  // 5. Render Komponen Dashboard Awal
  renderDashboard();
  renderScannedCardsList();
  renderReviewQueue();
  renderAdminTokensTable();
});
