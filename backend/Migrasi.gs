/**
 * ============================================================================
 * SMARTCORRECT — UTILITY MIGRASI & SINKRONISASI DATABASE (gas-migrasi-database)
 * ============================================================================
 * Pola migrasi data antar-spreadsheet tanpa menyentuh spreadsheet lama.
 * Fitur: Batch memory reading, header-based mapping, idempotent upsert, dry-run scan.
 * ============================================================================
 */

function openSourceSS_(idOrUrl) {
  const m = String(idOrUrl).match(/\/d\/([A-Za-z0-9_-]{20,})/);
  const id = m ? m[1] : String(idOrUrl).trim();
  const currentId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id === currentId) {
    throw new Error('Spreadsheet yang dimasukkan adalah spreadsheet SmartCorrect saat ini. Harap masukkan ID spreadsheet sumber LAMA.');
  }
  try {
    return SpreadsheetApp.openById(id);
  } catch (e) {
    throw new Error('Spreadsheet tidak dapat dibuka. Pastikan ID benar dan berada di akun Google yang sama.');
  }
}

function readSourceSheet_(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return [];
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return [];
  const h = v[0].map(String);
  return v.slice(1).filter(r => r.join('').trim() !== '')
    .map(r => {
      const o = {};
      h.forEach((k, i) => { if (k) o[k] = r[i]; });
      return o;
    });
}

/**
 * Jalankan migrasi data Siswa dari spreadsheet lama
 * @param {string} sourceIdOrUrl - URL atau ID spreadsheet lama
 * @param {boolean} dryRun - Jika true, hanya mensimulasikan tanpa menulis data
 */
function migrasiDataSiswa(sourceIdOrUrl, dryRun) {
  const sourceSS = openSourceSS_(sourceIdOrUrl);
  const oldData = readSourceSheet_(sourceSS, 'Siswa');
  Logger.log('🔍 Ditemukan ' + oldData.length + ' baris data siswa pada spreadsheet lama.');

  const targetSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  const targetSh = targetSS.getSheetByName('Siswa');
  const targetValues = targetSh.getDataRange().getValues();
  const headers = targetValues[0].map(String);

  // Buat index pencarian berdasarkan NIS/NISN atau Nama
  const existingMap = {};
  for (let i = 1; i < targetValues.length; i++) {
    const nisn = String(targetValues[i][headers.indexOf('nis_nisn')] || '').trim();
    if (nisn) existingMap[nisn] = true;
  }

  const toInsert = [];
  let skipped = 0;

  oldData.forEach(row => {
    // Normalisasi nama kolom lama
    const nisn = String(row.nis_nisn || row.NISN || row.NIS || '').trim();
    const nama = String(row.nama_siswa || row.Nama || row.NAMA || '').trim();
    const kelas = String(row.kelas || row.Kelas || row.KELAS || '').trim();
    const guru = String(row.id_guru_pemilik || row.Guru || 'admin_root').trim();

    if (nisn && existingMap[nisn]) {
      skipped++;
    } else {
      toInsert.push([
        'sis_' + Utilities.getUuid().slice(0, 8),
        nisn,
        nama,
        kelas,
        guru
      ]);
      if (nisn) existingMap[nisn] = true;
    }
  });

  if (!dryRun && toInsert.length > 0) {
    const startRow = targetSh.getLastRow() + 1;
    targetSh.getRange(startRow, 1, toInsert.length, headers.length).setValues(toInsert);
    Logger.log('✅ Berhasil memasukkan ' + toInsert.length + ' data siswa baru ke SmartCorrect.');
  }

  Logger.log('📊 Ringkasan: Ditambahkan=' + toInsert.length + ', Dilewati (Duplikat)=' + skipped + (dryRun ? ' (DRY RUN SIMULASI)' : ''));
  return { inserted: toInsert.length, skipped: skipped, dryRun: !!dryRun };
}
