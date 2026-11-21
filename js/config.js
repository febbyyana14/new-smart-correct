/**
 * ============================================================================
 * SMARTCORRECT — FRONTEND CONFIGURATION
 * ============================================================================
 * Masukkan URL Web App Google Apps Script hasil deploy Anda pada konstanta GAS_URL.
 * Format URL: https://script.google.com/macros/s/AKfycb.../exec
 * ============================================================================
 */

// Gantikan string di bawah dengan URL Deployment Web App Google Apps Script Anda:
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxg0E1Xeu5wPXcnMMaBJM7xrMmehSSaZLRSrsaWtN0PFd0l5EzGlzho88ilnEpEkiub6w/exec';

// Pengaturan Konfigurasi Klien
const APP_CONFIG = {
  APP_NAME: 'SmartCorrect',
  APP_SUBTITLE: 'AI Exam Grading & Psychometrics Platform',
  VERSION: '1.0.0',
  DEFAULT_BRAND_COLOR: '#2563EB',
  CONFIDENCE_THRESHOLD: 80, // Persentase ambang batas keyakinan (bawah 80% masuk Review Queue)
  STORAGE_KEYS: {
    SESSION_TOKEN: 'sc_session_token',
    USER_DATA: 'sc_user_data',
    BOOT_CACHE: 'sc_boot_cache',
    THEME_MODE: 'sc_theme_mode',
    ACTIVE_EXAM_ID: 'sc_active_exam_id'
  }
};
