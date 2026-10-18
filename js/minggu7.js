/**
 * Minggu7.js
 * Materi Decoder, Encoder, dan BCD 7-Segment (Pertemuan 7 ITERA)
 * Berdasarkan Silabus Resmi Dr. Swadexi Istiqphara, S.T., M.T.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   STATE & DATA: MINGGU 7
═══════════════════════════════════════════════════════════════ */

// State Decoder
let m7DecoderType = '2to4'; // '1to2' | '2to4' | '3to8'
let m7DecoderEn = 1;
let m7DecoderInputs = { X: 0, Y: 0, Z: 0 };
let m7AppScenario = 'mem'; // 'mem' | 'safe' | 'audio' | 'ic'
let m7SafePin = [1, 0, 1]; // PIN rahasia brankas 101 (Desimal 5)

// State Encoder
let m7EncoderMode = 'priority8to3'; // 'std4to2' | 'priority8to3'
let m7EncoderInputs = [0, 0, 0, 0, 0, 0, 0, 0]; // D0..D7
m7EncoderInputs[3] = 1; // Default D3 aktif

// State 7-Segment
let m7Polarity = 'CC'; // 'CC' (Common Cathode - Active High) | 'CA' (Common Anode - Active Low)
let m7BcdBits = [0, 1, 0, 1]; // Input BCD: A(8), B(4), C(2), D(1) -> Default 5 (0101)

// Tabel Segmen 7-Segment untuk Digit 0-9 (dan A-F HEX)
// a, b, c, d, e, f, g
const M7_SEVENSEG_TABLE = [
  { val: 0, bcd: [0,0,0,0], hex: '0', segs: { a:1, b:1, c:1, d:1, e:1, f:1, g:0 }, name: "Nol (0)" },
  { val: 1, bcd: [0,0,0,1], hex: '1', segs: { a:0, b:1, c:1, d:0, e:0, f:0, g:0 }, name: "Satu (1)" },
  { val: 2, bcd: [0,0,1,0], hex: '2', segs: { a:1, b:1, c:0, d:1, e:1, f:0, g:1 }, name: "Dua (2)" },
  { val: 3, bcd: [0,0,1,1], hex: '3', segs: { a:1, b:1, c:1, d:1, e:0, f:0, g:1 }, name: "Tiga (3)" },
  { val: 4, bcd: [0,1,0,0], hex: '4', segs: { a:0, b:1, c:1, d:0, e:0, f:1, g:1 }, name: "Empat (4)" },
  { val: 5, bcd: [0,1,0,1], hex: '5', segs: { a:1, b:0, c:1, d:1, e:0, f:1, g:1 }, name: "Lima (5)" },
  { val: 6, bcd: [0,1,1,0], hex: '6', segs: { a:1, b:0, c:1, d:1, e:1, f:1, g:1 }, name: "Enam (6)" },
  { val: 7, bcd: [0,1,1,1], hex: '7', segs: { a:1, b:1, c:1, d:0, e:0, f:0, g:0 }, name: "Tujuh (7)" },
  { val: 8, bcd: [1,0,0,0], hex: '8', segs: { a:1, b:1, c:1, d:1, e:1, f:1, g:1 }, name: "Delapan (8)" },
  { val: 9, bcd: [1,0,0,1], hex: '9', segs: { a:1, b:1, c:1, d:1, e:0, f:1, g:1 }, name: "Sembilan (9)" },
  { val: 10, bcd: [1,0,1,0], hex: 'A', segs: { a:1, b:1, c:1, d:0, e:1, f:1, g:1 }, name: "A (10)" },
  { val: 11, bcd: [1,0,1,1], hex: 'b', segs: { a:0, b:0, c:1, d:1, e:1, f:1, g:1 }, name: "b (11)" },
  { val: 12, bcd: [1,1,0,0], hex: 'C', segs: { a:1, b:0, c:0, d:1, e:1, f:1, g:0 }, name: "C (12)" },
  { val: 13, bcd: [1,1,0,1], hex: 'd', segs: { a:0, b:1, c:1, d:1, e:1, f:0, g:1 }, name: "d (13)" },
  { val: 14, bcd: [1,1,1,0], hex: 'E', segs: { a:1, b:0, c:0, d:1, e:1, f:1, g:1 }, name: "E (14)" },
  { val: 15, bcd: [1,1,1,1], hex: 'F', segs: { a:1, b:0, c:0, d:0, e:1, f:1, g:1 }, name: "F (15)" }
];

/* ═══════════════════════════════════════════════════════════════
   SUBMENU 1: DECODER & APLIKASINYA (SLIDE 7 - 21)
═══════════════════════════════════════════════════════════════ */
function renderMinggu7Decoder(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Rangkaian Decoder &amp; Aplikasinya</h1>
        <p>Berdasarkan silabus Pertemuan 7 Sistem Digital ITERA: Decoder adalah rangkaian logika kombinasional yang mengubah input biner n-bit menjadi satu jalur output aktif dari 2<sup>n</sup> kemungkinan output. Rangkaian ini menjadi fondasi addressing memori, seleksi channel, kunci digital, dan sistem kontrol periferal.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">n to 2<sup>n</sup> Line</span>
          <span class="tag tag-green">Enable Control (En)</span>
          <span class="tag tag-orange">Memory Addressing</span>
          <span class="tag tag-pink">IC 74138 Octal</span>
        </div>
      </div>
    </div>

    <!-- Review Singkat: Kombinasional vs Sekuensial (Slide 5-6) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Review: Rangkaian Kombinasional vs Sekuensial (Slide 5 &amp; 6)</h3>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
        <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.3);border-radius:var(--radius-md);padding:16px;">
          <div style="color:var(--accent-blue);font-weight:700;font-size:1rem;margin-bottom:6px;">Rangkaian Kombinasional (Topik Hari Ini)</div>
          <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:8px;">
            Output <strong>hanya bergantung pada kombinasi input saat itu juga</strong>. Tidak memiliki elemen memori penyimpan keadaan sebelumnya.
          </p>
          <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--font-mono);">Contoh: Decoder, Encoder, MUX, DEMUX, Adder, Subtractor.</div>
        </div>
        <div style="background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.3);border-radius:var(--radius-md);padding:16px;">
          <div style="color:var(--accent-pink);font-weight:700;font-size:1rem;margin-bottom:6px;">Rangkaian Sekuensial (Materi Lanjutan)</div>
          <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:8px;">
            Output bergantung pada input saat ini <strong>ditambah status/kondisi memori sebelumnya</strong> (memiliki umpan balik &amp; clock).
          </p>
          <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--font-mono);">Contoh: Flip-Flop, Register, Counter, RAM.</div>
        </div>
      </div>
    </div>

    <!-- Kamus Simbol & Logika Decoder -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Kamus Simbol &amp; Kaidah Logika Decoder</h3>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;">
        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-blue);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Input Biner (X, Y, Z / A)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Kode biner n-bit yang menentukan alamat nomor output.<br>
            <strong>Cara Baca:</strong> <em>"Input X, Y, Z"</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-green);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Enable Pin (En / E)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Saklar utama. Bila En=0, seluruh output mati. Bila En=1, decoder beroperasi.<br>
            <strong>Cara Baca:</strong> <em>"Enable aktif HIGH"</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-pink);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Output Aktif (F<sub>i</sub> / Y<sub>i</sub>)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Jalur ke-i yang bernilai 1 eksklusif sesuai minterm m<sub>i</sub>.<br>
            <strong>Cara Baca:</strong> <em>"Output F-nol hingga F-tujuh"</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-orange);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Active-Low (Ȳ / Ē)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Output aktif bernilai 0 (seperti pada IC 74138 Slide 15).<br>
            <strong>Cara Baca:</strong> <em>"Active-Low (aktif saat logika 0)"</em>
          </div>
        </div>
      </div>
    </div>

    <!-- Simulator Interaktif Decoder -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🧪 Simulator Interaktif Rangkaian Decoder (Slide 9 - 14)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Pilih arsitektur decoder di bawah, atur saklar <strong>Enable (En)</strong>, dan ubah kombinasi bit input. Amati gerbang logika AND internal dan lampu LED output yang menyala secara eksklusif!
      </p>

      <!-- Panel Kontrol Tipe Decoder -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding:14px;background:rgba(13,21,48,0.5);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span style="font-size:0.84rem;font-weight:700;color:var(--accent-blue);">Tipe Decoder:</span>
          <button class="btn btn-sm ${m7DecoderType === '1to2' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7DecoderType('1to2')">1 to 2 (Slide 9)</button>
          <button class="btn btn-sm ${m7DecoderType === '2to4' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7DecoderType('2to4')">2 to 4 (Slide 10-12)</button>
          <button class="btn btn-sm ${m7DecoderType === '3to8' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7DecoderType('3to8')">3 to 8 (Slide 13-14)</button>
        </div>

        <!-- Saklar Enable -->
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.84rem;font-weight:700;color:var(--accent-green);">Pin Enable (En):</span>
          <button class="gate-switch-btn ${m7DecoderEn === 1 ? 'on' : ''}" onclick="toggleM7DecoderEn()" id="m7-switch-en">
            ${m7DecoderEn}
          </button>
          <span style="font-size:0.75rem;color:var(--text-muted);">${m7DecoderEn === 1 ? '(Decoder AKTIF)' : '(Decoder OFF)'}</span>
        </div>
      </div>

      <!-- Saklar Input Logika -->
      <div style="display:flex;justify-content:center;align-items:center;gap:24px;margin-bottom:24px;padding:16px;background:rgba(10,14,30,0.6);border-radius:var(--radius-md);border:1px solid var(--border-subtle);flex-wrap:wrap;" id="m7-decoder-input-panel">
        <!-- Diisi oleh updateM7DecoderUI() -->
      </div>

      <!-- Visual Diagram Decoder & Output Pins -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;" id="m7-decoder-visual-grid">
        <!-- Diisi oleh updateM7DecoderUI() -->
      </div>

      <!-- Kotak Pelafalan Verbal -->
      <div class="pronounce-callout mb-24" id="m7-decoder-pronounce">
        <!-- Diisi oleh updateM7DecoderUI() -->
      </div>

      <!-- Tabel Kebenaran Decoder -->
      <div>
        <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:10px;color:var(--accent-blue);">
          📋 Tabel Kebenaran Decoder Lengkap (Active-High)
        </h4>
        <div style="overflow-x:auto;">
          <table class="truth-table" id="m7-decoder-truth-table" style="width:100%;text-align:center;">
            <!-- Diisi oleh updateM7DecoderUI() -->
          </table>
        </div>
      </div>
    </div>

    <!-- Laboratorium Aplikasi Nyata Decoder (Slide 18 - 21) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🏢 Laboratorium Aplikasi Nyata Decoder (Slide 18 - 21)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:16px;">
        Pilih skenario penerapan decoder pada dunia industri &amp; komputasi nyata:
      </p>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
        <button class="btn btn-sm ${m7AppScenario === 'mem' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7AppScenario('mem')">
          1. Address Decoder Memori (Slide 18)
        </button>
        <button class="btn btn-sm ${m7AppScenario === 'safe' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7AppScenario('safe')">
          2. Kunci Digital / Brankas (Slide 20)
        </button>
        <button class="btn btn-sm ${m7AppScenario === 'audio' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7AppScenario('audio')">
          3. Pemilih Channel Audio (Slide 19)
        </button>
        <button class="btn btn-sm ${m7AppScenario === 'ic' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7AppScenario('ic')">
          4. IC Standar 74LS138 (Slide 15-16)
        </button>
      </div>

      <div id="m7-app-scenario-content">
        <!-- Diisi oleh renderM7AppScenario() -->
      </div>
    </div>
  `;

  updateM7DecoderUI();
  renderM7AppScenario();
}

function setM7DecoderType(type) {
  m7DecoderType = type;
  renderMinggu7Decoder(document.getElementById('content-body'));
}

function toggleM7DecoderEn() {
  m7DecoderEn = m7DecoderEn === 1 ? 0 : 1;
  const btn = document.getElementById('m7-switch-en');
  if (btn) {
    btn.textContent = m7DecoderEn;
    btn.classList.toggle('on', m7DecoderEn === 1);
  }
  updateM7DecoderUI();
}

function toggleM7DecoderInput(pin) {
  m7DecoderInputs[pin] = m7DecoderInputs[pin] === 1 ? 0 : 1;
  const btn = document.getElementById(`m7-switch-${pin}`);
  if (btn) {
    btn.textContent = m7DecoderInputs[pin];
    btn.classList.toggle('on', m7DecoderInputs[pin] === 1);
  }
  updateM7DecoderUI();
}

function updateM7DecoderUI() {
  const inputPanel = document.getElementById('m7-decoder-input-panel');
  const visualGrid = document.getElementById('m7-decoder-visual-grid');
  const pronounceBox = document.getElementById('m7-decoder-pronounce');
  const truthTable = document.getElementById('m7-decoder-truth-table');
  if (!inputPanel || !visualGrid || !pronounceBox || !truthTable) return;

  // 1. Render Input Switches
  let inputHtml = '';
  if (m7DecoderType === '1to2') {
    inputHtml = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input A:</span>
        <button class="gate-switch-btn ${m7DecoderInputs.X === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('X')" id="m7-switch-X">${m7DecoderInputs.X}</button>
      </div>
    `;
  } else if (m7DecoderType === '2to4') {
    inputHtml = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input X (MSB):</span>
        <button class="gate-switch-btn ${m7DecoderInputs.X === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('X')" id="m7-switch-X">${m7DecoderInputs.X}</button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input Y (LSB):</span>
        <button class="gate-switch-btn ${m7DecoderInputs.Y === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('Y')" id="m7-switch-Y">${m7DecoderInputs.Y}</button>
      </div>
    `;
  } else {
    inputHtml = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input X (MSB):</span>
        <button class="gate-switch-btn ${m7DecoderInputs.X === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('X')" id="m7-switch-X">${m7DecoderInputs.X}</button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input Y:</span>
        <button class="gate-switch-btn ${m7DecoderInputs.Y === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('Y')" id="m7-switch-Y">${m7DecoderInputs.Y}</button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input Z (LSB):</span>
        <button class="gate-switch-btn ${m7DecoderInputs.Z === 1 ? 'on' : ''}" onclick="toggleM7DecoderInput('Z')" id="m7-switch-Z">${m7DecoderInputs.Z}</button>
      </div>
    `;
  }
  inputPanel.innerHTML = inputHtml;

  // 2. Hitung Alamat Desimal & Status Output
  let numOutputs = m7DecoderType === '1to2' ? 2 : (m7DecoderType === '2to4' ? 4 : 8);
  let activeIndex = -1;
  let activeBinary = '';

  if (m7DecoderEn === 1) {
    if (m7DecoderType === '1to2') {
      activeIndex = m7DecoderInputs.X;
      activeBinary = `${m7DecoderInputs.X}`;
    } else if (m7DecoderType === '2to4') {
      activeIndex = (m7DecoderInputs.X << 1) | m7DecoderInputs.Y;
      activeBinary = `${m7DecoderInputs.X}${m7DecoderInputs.Y}`;
    } else {
      activeIndex = (m7DecoderInputs.X << 2) | (m7DecoderInputs.Y << 1) | m7DecoderInputs.Z;
      activeBinary = `${m7DecoderInputs.X}${m7DecoderInputs.Y}${m7DecoderInputs.Z}`;
    }
  }

  // 3. Render Visual Grid (IC Block + Output Bars)
  let outBarsHtml = '';
  for (let i = 0; i < numOutputs; i++) {
    const isLit = (m7DecoderEn === 1 && i === activeIndex);
    let formula = '';
    if (m7DecoderType === '1to2') {
      formula = i === 0 ? "Y0 = Ā" : "Y1 = A";
    } else if (m7DecoderType === '2to4') {
      const xStr = (i >> 1) & 1 ? "X" : "X'";
      const yStr = i & 1 ? "Y" : "Y'";
      formula = `F${i} = ${xStr}${yStr}`;
    } else {
      const xStr = (i >> 2) & 1 ? "X" : "X'";
      const yStr = (i >> 1) & 1 ? "Y" : "Y'";
      const zStr = i & 1 ? "Z" : "Z'";
      formula = `F${i} = ${xStr}${yStr}${zStr}`;
    }

    outBarsHtml += `
      <div class="decoder-out-bar ${isLit ? 'active' : ''}">
        <div>
          <strong style="color:${isLit ? '#fff' : 'var(--text-secondary)'};">Output ${m7DecoderType === '1to2' ? 'Y' : 'F'}${i}</strong>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-left:8px;">(${formula})</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-mono);font-weight:800;color:${isLit ? 'var(--accent-green)' : 'var(--text-muted)'};font-size:1.1rem;">
            ${isLit ? '1' : '0'}
          </span>
          <div class="gate-led-bulb ${isLit ? 'glow' : ''}" style="width:28px;height:28px;font-size:0.8rem;">
            ${isLit ? '●' : '○'}
          </div>
        </div>
      </div>
    `;
  }

  visualGrid.innerHTML = `
    <!-- Sisi Kiri: Diagram Blok IC -->
    <div style="background:rgba(13,21,48,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:20px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;margin-bottom:8px;">
        Diagram Blok Decoder
      </div>
      <div style="width:170px;height:180px;background:rgba(10,14,30,0.9);border:2px solid var(--border-glow);border-radius:12px;display:flex;flex-direction:column;justify-content:center;align-items:center;box-shadow:inset 0 0 20px rgba(0,212,255,0.15);position:relative;">
        <span style="font-family:var(--font-heading);font-weight:800;color:#fff;font-size:1.1rem;">
          ${m7DecoderType === '1to2' ? '1-to-2' : (m7DecoderType === '2to4' ? '2-to-4' : '3-to-8')}<br>Decoder
        </span>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px;font-family:var(--font-mono);">
          ${m7DecoderEn === 1 ? 'Status: ENABLED' : 'Status: DISABLED'}
        </div>
        <div style="margin-top:10px;padding:3px 10px;background:rgba(0,212,255,0.1);border-radius:4px;font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-blue);">
          ${m7DecoderEn === 1 ? `Aktif: Pin #${activeIndex}` : 'Semua Output LOW'}
        </div>
      </div>
      <div style="margin-top:14px;font-size:0.82rem;color:var(--text-secondary);">
        Input Alamat: <code>${activeBinary || '-'}₂</code> &rarr; Desimal: <code>${m7DecoderEn === 1 ? activeIndex : '-'}₁₀</code>
      </div>
    </div>

    <!-- Sisi Kanan: Output Pin Status -->
    <div style="background:rgba(13,21,48,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:18px;">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-green);font-weight:700;margin-bottom:12px;">
        Status Saluran Output (Active-High):
      </div>
      ${outBarsHtml}
    </div>
  `;

  // 4. Pronounce Callout Box
  let voiceMsg = '';
  if (m7DecoderEn === 0) {
    voiceMsg = `"Pin Enable bernilai Nol, semua jalur output Decoder dinonaktifkan (LOW)!"`;
  } else {
    voiceMsg = `"Decoder dengan input biner ${activeBinary} (desimal ${activeIndex}) mengaktifkan jalur output ${m7DecoderType === '1to2' ? 'Y' : 'F'}${activeIndex} bernilai Satu!"`;
  }

  pronounceBox.innerHTML = `
    <div class="pronounce-header">
      <span class="pronounce-tag">🔊 Cara Penyebutan Lisan / Verbal Hasil Percobaan</span>
      <span class="tag ${m7DecoderEn === 1 ? 'tag-green' : 'tag-orange'}">${m7DecoderEn === 1 ? `Jalur #${activeIndex} Terpilih` : 'Decoder Disabled'}</span>
    </div>
    <div class="pronounce-voice-pill">
      <span>📢</span>
      <span>${voiceMsg}</span>
    </div>
    <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6;margin-bottom:0;">
      <strong>Prinsip Kerja Decoder (Slide 8):</strong> Mengubah kode biner ${m7DecoderType === '1to2' ? '1-bit' : (m7DecoderType === '2to4' ? '2-bit' : '3-bit')} menjadi 1 aktivasi tunggal dari ${numOutputs} jalur keluarannya. Sinyal input berfungsi sebagai alamat memori / pengarah rute yang mengalirkan logika tinggi hanya ke minterm yang berkesesuaian.
    </p>
  `;

  // 5. Truth Table
  let tableHtml = `
    <thead>
      <tr>
        <th>En</th>
        ${m7DecoderType === '1to2' ? `<th>A</th>` : (m7DecoderType === '2to4' ? `<th>X</th><th>Y</th>` : `<th>X</th><th>Y</th><th>Z</th>`)}
        ${Array.from({length: numOutputs}, (_, i) => `<th style="color:var(--accent-blue);">${m7DecoderType === '1to2' ? 'Y' : 'F'}${i}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <!-- Disabled Row -->
      <tr style="${m7DecoderEn === 0 ? 'background:rgba(239,68,68,0.15);font-weight:bold;outline:1px solid #ef4444;' : ''}">
        <td>0</td>
        ${m7DecoderType === '1to2' ? `<td>X</td>` : (m7DecoderType === '2to4' ? `<td>X</td><td>X</td>` : `<td>X</td><td>X</td><td>X</td>`)}
        ${Array.from({length: numOutputs}, () => `<td>0</td>`).join('')}
      </tr>
  `;

  for (let r = 0; r < numOutputs; r++) {
    let rX, rY, rZ;
    let isActiveRow = false;
    if (m7DecoderType === '1to2') {
      rX = r;
      isActiveRow = (m7DecoderEn === 1 && m7DecoderInputs.X === rX);
    } else if (m7DecoderType === '2to4') {
      rX = (r >> 1) & 1;
      rY = r & 1;
      isActiveRow = (m7DecoderEn === 1 && m7DecoderInputs.X === rX && m7DecoderInputs.Y === rY);
    } else {
      rX = (r >> 2) & 1;
      rY = (r >> 1) & 1;
      rZ = r & 1;
      isActiveRow = (m7DecoderEn === 1 && m7DecoderInputs.X === rX && m7DecoderInputs.Y === rY && m7DecoderInputs.Z === rZ);
    }

    tableHtml += `
      <tr style="${isActiveRow ? 'background:rgba(0,212,255,0.18);font-weight:bold;outline:1px solid var(--accent-blue);' : ''}">
        <td>1</td>
        <td>${rX}</td>
        ${m7DecoderType !== '1to2' ? `<td>${rY}</td>` : ''}
        ${m7DecoderType === '3to8' ? `<td>${rZ}</td>` : ''}
        ${Array.from({length: numOutputs}, (_, idx) => `
          <td style="font-family:var(--font-mono);font-weight:${idx === r ? '800' : '400'};color:${idx === r ? '#4ade80' : 'var(--text-muted)'};">
            ${idx === r ? '1' : '0'}
          </td>
        `).join('')}
      </tr>
    `;
  }

  tableHtml += `</tbody>`;
  truthTable.innerHTML = tableHtml;
}

// Render Aplikasi Dunia Nyata Decoder
function setM7AppScenario(scen) {
  m7AppScenario = scen;
  renderM7AppScenario();
}

function renderM7AppScenario() {
  const panel = document.getElementById('m7-app-scenario-content');
  if (!panel) return;

  if (m7AppScenario === 'mem') {
    panel.innerHTML = `
      <div style="background:rgba(10,14,30,0.7);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <h4 style="color:var(--accent-blue);margin-bottom:8px;">💾 Skenario 1: Address Decoder pada Memori / Memory Addressing (Slide 18)</h4>
        <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">
          CPU mengirimkan alamat biner 3-bit (A2, A1, A0) ke decoder untuk mengaktifkan salah satu dari 8 blok memori (Chip Select / CS line). Hanya blok memori yang terpilih yang akan mengizinkan proses baca/tulis data.
        </p>
        <div style="display:flex;gap:12px;margin-bottom:16px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:0.84rem;font-weight:700;color:#fff;">Pilih Alamat CPU (A2 A1 A0):</span>
          ${[0,1,2,3,4,5,6,7].map(addr => `
            <button class="btn btn-sm ${m7DecoderInputs.X === ((addr>>2)&1) && m7DecoderInputs.Y === ((addr>>1)&1) && m7DecoderInputs.Z === (addr&1) ? 'btn-primary' : 'btn-ghost'}" onclick="setM7MemAddress(${addr})">
              ${addr.toString(2).padStart(3,'0')}₂ (Blok ${addr})
            </button>
          `).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;">
          ${[0,1,2,3,4,5,6,7].map(b => {
            const isCur = (m7DecoderInputs.X === ((b>>2)&1) && m7DecoderInputs.Y === ((b>>1)&1) && m7DecoderInputs.Z === (b&1));
            return `
              <div style="background:${isCur ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.02)'};border:1px solid ${isCur ? 'var(--accent-green)' : 'var(--border-subtle)'};border-radius:8px;padding:12px;text-align:center;box-shadow:${isCur ? '0 0 15px rgba(34,197,94,0.3)' : 'none'};">
                <div style="font-family:var(--font-mono);font-size:0.75rem;color:${isCur ? '#4ade80' : 'var(--text-muted)'};">CS${b} (Y${b})</div>
                <div style="font-weight:800;font-size:0.95rem;color:${isCur ? '#fff' : 'var(--text-secondary)'};margin:4px 0;">Blok RAM ${b}</div>
                <span class="tag ${isCur ? 'tag-green' : 'tag-gray'}" style="font-size:0.65rem;">${isCur ? 'ACTIVE (Read/Write)' : 'Standby'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (m7AppScenario === 'safe') {
    const isUnlocked = (m7DecoderInputs.X === m7SafePin[0] && m7DecoderInputs.Y === m7SafePin[1] && m7DecoderInputs.Z === m7SafePin[2]);
    panel.innerHTML = `
      <div style="background:rgba(10,14,30,0.7);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <h4 style="color:var(--accent-pink);margin-bottom:8px;">🔐 Skenario 2: Sistem Keamanan &amp; Kunci Brankas Digital (Slide 20)</h4>
        <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;">
          Sesuai contoh Slide 20: Decoder mendeteksi kombinasi input biner tertentu sebagai sinyal buka kunci. Jika input 3-bit = <strong>101₂ (Desimal 5)</strong>, output <strong>Y5 aktif (HIGH)</strong> mengalirkan arus ke solenoid latch relay untuk membuka pintu brankas!
        </p>
        <div style="display:flex;justify-content:center;gap:30px;align-items:center;padding:24px;background:rgba(0,0,0,0.4);border-radius:12px;border:1px solid ${isUnlocked ? 'var(--accent-green)' : 'var(--border-subtle)'};flex-wrap:wrap;">
          <div style="font-size:3.5rem;">${isUnlocked ? '🔓' : '🔒'}</div>
          <div>
            <div style="font-size:0.8rem;text-transform:uppercase;color:${isUnlocked ? 'var(--accent-green)' : 'var(--accent-pink)'};font-weight:700;">
              STATUS BRANKAS: ${isUnlocked ? 'TERBUKA (ACCESS GRANTED)' : 'TERKUNCI (LOCKED)'}
            </div>
            <div style="font-family:var(--font-mono);font-size:1.1rem;color:#fff;margin:6px 0;">
              Input Saat Ini: ${m7DecoderInputs.X}${m7DecoderInputs.Y}${m7DecoderInputs.Z}₂ &bull; PIN Benar: 101₂ (Y5)
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);">
              ${isUnlocked ? 'Arus mengalir ke solenoid latch &rarr; Kunci mekanis terbuka!' : 'Kombinasi salah. Output Y5 tetap LOW sehingga relay tidak terpicu.'}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (m7AppScenario === 'audio') {
    const curCh = (m7DecoderInputs.X << 1) | m7DecoderInputs.Y;
    panel.innerHTML = `
      <div style="background:rgba(10,14,30,0.7);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <h4 style="color:var(--accent-orange);margin-bottom:8px;">🎧 Skenario 3: Pemilihan Saluran Audio / Channel Selector (Slide 19)</h4>
        <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;">
          Sesuai Slide 19: Decoder 2-to-4 digunakan pada sistem mixer audio/video selector. Input kontrol 2-bit memilih salah satu dari 4 sumber sinyal mikrofon untuk diteruskan ke speaker utama.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;">
          ${[
            { id: 0, name: "Mic 1 (Vokal)", icon: "🎤" },
            { id: 1, name: "Gitar Akustik", icon: "🎸" },
            { id: 2, name: "Keyboard / Piano", icon: "🎹" },
            { id: 3, name: "Drum / Perkusi", icon: "🥁" }
          ].map(ch => {
            const isLive = (curCh === ch.id && m7DecoderEn === 1);
            return `
              <div style="background:${isLive ? 'rgba(0,212,255,0.18)' : 'rgba(255,255,255,0.02)'};border:1px solid ${isLive ? 'var(--accent-blue)' : 'var(--border-subtle)'};border-radius:8px;padding:16px;text-align:center;">
                <div style="font-size:2rem;margin-bottom:4px;">${ch.icon}</div>
                <div style="font-weight:700;color:${isLive ? '#fff' : 'var(--text-secondary)'};font-size:0.95rem;">${ch.name}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:4px;">Jalur #${ch.id} (F${ch.id})</div>
                <span class="tag ${isLive ? 'tag-blue' : 'tag-gray'}" style="margin-top:8px;font-size:0.7rem;">${isLive ? 'ON AIR (Lolos Sinyal)' : 'Muted'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div style="background:rgba(10,14,30,0.7);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <h4 style="color:var(--accent-green);margin-bottom:8px;">🔌 Skenario 4: IC Decoder Komersial Standar 74LS138 (Slide 15-16)</h4>
        <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;">
          IC 74138 adalah IC TTL 16-pin standar industri <strong>3-line to 8-line Octal Decoder</strong>. Memiliki karakteristik <strong>Active-LOW Outputs (Ȳ0 - Ȳ7)</strong> dan 3 pin Enable khusus: <strong>E1 (Active-HIGH)</strong> serta <strong>Ē2 &amp; Ē3 (Active-LOW)</strong> untuk ekspansi cascading hingga ratusan jalur output!
        </p>
        <div style="display:flex;justify-content:center;gap:20px;align-items:center;background:rgba(0,0,0,0.4);padding:18px;border-radius:10px;border:1px solid var(--border-subtle);flex-wrap:wrap;">
          <div style="background:#020617;border:2px solid #38bdf8;padding:14px 20px;border-radius:8px;font-family:var(--font-mono);text-align:center;color:#fff;">
            <div style="font-size:1.1rem;font-weight:800;color:#38bdf8;">DIP-16: 74LS138</div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:4px;">3 Select Inputs (A0, A1, A2)</div>
            <div style="font-size:0.75rem;color:#94a3b8;">3 Enable Pins (E1, Ē2, Ē3)</div>
            <div style="font-size:0.75rem;color:#4ade80;margin-top:4px;">8 Active-Low Outputs (Ȳ0-Ȳ7)</div>
          </div>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;max-width:400px;">
            <strong>Kondisi Aktif IC 74138:</strong><br>
            Decoder hanya akan mendekode input jika: <code>E1 = 1</code>, <code>Ē2 = 0</code>, dan <code>Ē3 = 0</code>. Output yang terpilih akan menghasilkan tegangan <strong>0 Volt (GND)</strong> sementara output lainnya berada pada tegangan <strong>+5 Volt (Vcc)</strong>.
          </div>
        </div>
      </div>
    `;
  }
}

function setM7MemAddress(addr) {
  m7DecoderInputs.X = (addr >> 2) & 1;
  m7DecoderInputs.Y = (addr >> 1) & 1;
  m7DecoderInputs.Z = addr & 1;
  m7DecoderEn = 1;
  updateM7DecoderUI();
  renderM7AppScenario();
}

/* ═══════════════════════════════════════════════════════════════
   SUBMENU 2: ENCODER & PRIORITY ENCODER (SLIDE 22 - 28)
═══════════════════════════════════════════════════════════════ */
function renderMinggu7Encoder(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Rangkaian Encoder &amp; Priority Encoder</h1>
        <p>Berdasarkan silabus Pertemuan 7 Sistem Digital ITERA: Encoder adalah kebalikan fungsi dari Decoder. Rangkaian kombinasional ini mengubah 2<sup>n</sup> jalur input menjadi kode biner n-bit. Dilengkapi teknologi <strong>Priority Encoder (IC 74LS148)</strong> yang secara otomatis memprioritaskan input berbobot tertinggi saat beberapa tombol ditekan serempak.</p>
        <div class="week-hero-tags">
          <span class="tag tag-pink">2<sup>n</sup> to n Line</span>
          <span class="tag tag-orange">Priority Encoder</span>
          <span class="tag tag-blue">Keypad Scanner</span>
          <span class="tag tag-green">IC 74LS148</span>
        </div>
      </div>
    </div>

    <!-- Simulator Interaktif Encoder & Priority Encoder -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🎹 Simulator Interaktif Encoder &amp; Priority Encoder (Slide 23 &amp; 26)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Klik tombol-tombol input <strong>D</strong> di bawah. Coba tekan <strong>lebih dari satu tombol sekaligus</strong> untuk mengamati bagaimana <strong>Priority Encoder</strong> menyelesaikan konflik input dengan memprioritaskan indeks terbesar (Slide 26)!
      </p>

      <!-- Mode Selector -->
      <div style="display:flex;gap:12px;margin-bottom:20px;padding:14px;background:rgba(13,21,48,0.5);border-radius:var(--radius-md);border:1px solid var(--border-subtle);flex-wrap:wrap;align-items:center;">
        <span style="font-size:0.84rem;font-weight:700;color:var(--accent-blue);">Pilih Mode Encoder:</span>
        <button class="btn btn-sm ${m7EncoderMode === 'std4to2' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7EncoderMode('std4to2')">
          Encoder Standar 4 to 2 (Slide 23)
        </button>
        <button class="btn btn-sm ${m7EncoderMode === 'priority8to3' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7EncoderMode('priority8to3')">
          8 to 3 Priority Encoder (Slide 26 / IC 74LS148)
        </button>
      </div>

      <!-- Tombol Input D (Keypad Bar) -->
      <div style="margin-bottom:24px;">
        <div style="font-size:0.8rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;margin-bottom:10px;">
          Jalur Input Data (Klik untuk aktifkan/nonaktifkan sinyal):
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;" id="m7-encoder-buttons-bar">
          <!-- Diisi oleh updateM7EncoderUI() -->
        </div>
      </div>

      <!-- Panel Hasil Output Biner -->
      <div style="background:rgba(10,14,30,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:22px;margin-bottom:24px;" id="m7-encoder-result-panel">
        <!-- Diisi oleh updateM7EncoderUI() -->
      </div>

      <!-- Kotak Pelafalan Lisan Verbal -->
      <div class="pronounce-callout mb-24" id="m7-encoder-pronounce">
        <!-- Diisi oleh updateM7EncoderUI() -->
      </div>
    </div>

    <!-- Aplikasi Nyata: Keypad / Keyboard Scanner (Slide 27) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📱 Aplikasi Nyata: Keypad Scanner Kalkulator (Slide 27)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:16px;">
        Setiap tombol pada keyboard atau kalkulator fisik memiliki saklar mekanis tunggal. Encoder membaca tombol angka yang ditekan oleh pengguna dan secara instan mengubahnya menjadi kode biner 4-bit (BCD) yang dimengerti oleh CPU:
      </p>

      <div style="display:flex;justify-content:center;gap:30px;align-items:center;flex-wrap:wrap;">
        <!-- Visual Keypad 0-9 -->
        <div style="display:grid;grid-template-columns:repeat(3, 55px);gap:10px;background:rgba(13,21,48,0.8);padding:18px;border-radius:12px;border:1px solid var(--border-subtle);">
          ${[1,2,3,4,5,6,7,8,9,0].map(digit => `
            <button class="btn btn-ghost" onclick="testKeypadEncoder(${digit})" style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;height:55px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);">
              ${digit}
            </button>
          `).join('')}
        </div>

        <div style="background:rgba(0,0,0,0.4);border:1px solid var(--border-subtle);border-radius:10px;padding:18px 24px;min-width:240px;text-align:center;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;">Tombol Keypad Ditekan</div>
          <div id="m7-keypad-digit" style="font-family:var(--font-heading);font-size:2rem;font-weight:800;color:#fff;margin:6px 0;">5</div>
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-green);font-weight:700;">Kode Biner Menuju CPU:</div>
          <div id="m7-keypad-bin" style="font-family:var(--font-mono);font-size:1.4rem;font-weight:800;color:var(--accent-green);letter-spacing:3px;">0101₂</div>
        </div>
      </div>
    </div>

    <!-- Tabel Komparasi Resmi: Decoder vs Encoder (Slide 28) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">⚖️ Tabel Perbandingan: Decoder vs Encoder (Slide 28 Silabus ITERA)</h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="cheat-table" style="width:100%;text-align:center;">
          <thead>
            <tr>
              <th>Aspek Pembanding</th>
              <th style="color:var(--accent-blue);">Decoder</th>
              <th style="color:var(--accent-pink);">Encoder</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Arah Fungsi</strong></td>
              <td>Biner &rarr; Aktivasi Tunggal</td>
              <td>Aktivasi Tunggal &rarr; Biner</td>
            </tr>
            <tr>
              <td><strong>Jumlah Jalur Input</strong></td>
              <td>n bit</td>
              <td>2<sup>n</sup> jalur</td>
            </tr>
            <tr>
              <td><strong>Jumlah Jalur Output</strong></td>
              <td>2<sup>n</sup> jalur</td>
              <td>n bit</td>
            </tr>
            <tr>
              <td><strong>Contoh Standar</strong></td>
              <td>3-to-8 Decoder</td>
              <td>8-to-3 Encoder</td>
            </tr>
            <tr>
              <td><strong>IC Komersial Populer</strong></td>
              <td><code>74LS138</code></td>
              <td><code>74LS148</code> (Priority Encoder)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  updateM7EncoderUI();
}

function setM7EncoderMode(mode) {
  m7EncoderMode = mode;
  // Reset input
  m7EncoderInputs = [0, 0, 0, 0, 0, 0, 0, 0];
  m7EncoderInputs[mode === 'std4to2' ? 2 : 5] = 1;
  renderMinggu7Encoder(document.getElementById('content-body'));
}

function toggleM7EncoderInput(idx) {
  m7EncoderInputs[idx] = m7EncoderInputs[idx] === 1 ? 0 : 1;
  updateM7EncoderUI();
}

function updateM7EncoderUI() {
  const btnBar = document.getElementById('m7-encoder-buttons-bar');
  const resultPanel = document.getElementById('m7-encoder-result-panel');
  const pronounceBox = document.getElementById('m7-encoder-pronounce');
  if (!btnBar || !resultPanel || !pronounceBox) return;

  const totalInputs = m7EncoderMode === 'std4to2' ? 4 : 8;

  // 1. Render Tombol Input D
  let btnHtml = '';
  for (let i = 0; i < totalInputs; i++) {
    const isPressed = m7EncoderInputs[i] === 1;
    btnHtml += `
      <button class="gate-switch-btn ${isPressed ? 'on' : ''}" onclick="toggleM7EncoderInput(${i})" style="min-width:48px;height:48px;font-size:0.95rem;">
        D${i}
      </button>
    `;
  }
  btnBar.innerHTML = btnHtml;

  // 2. Evaluasi Logika Encoder
  let highestIndex = -1;
  let activeInputsList = [];

  for (let i = totalInputs - 1; i >= 0; i--) {
    if (m7EncoderInputs[i] === 1) {
      if (highestIndex === -1) highestIndex = i;
      activeInputsList.push(`D${i}`);
    }
  }

  let outBinStr = '';
  let a0 = 0, a1 = 0, a2 = 0;

  if (highestIndex !== -1) {
    if (m7EncoderMode === 'std4to2') {
      a1 = (highestIndex >> 1) & 1;
      a0 = highestIndex & 1;
      outBinStr = `${a1}${a0}`;
    } else {
      a2 = (highestIndex >> 2) & 1;
      a1 = (highestIndex >> 1) & 1;
      a0 = highestIndex & 1;
      outBinStr = `${a2}${a1}${a0}`;
    }
  } else {
    outBinStr = m7EncoderMode === 'std4to2' ? '00' : '000';
  }

  // 3. Render Panel Hasil
  resultPanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;">Status Input Aktif:</div>
        <div style="font-size:1.1rem;color:#fff;font-weight:700;margin:4px 0;">
          ${activeInputsList.length > 0 ? activeInputsList.join(', ') : 'Tidak ada input yang ditekan (Idle)'}
        </div>
        ${activeInputsList.length > 1 ? `
          <div style="font-size:0.8rem;color:var(--accent-green);background:rgba(34,197,94,0.12);padding:3px 10px;border-radius:4px;border:1px solid rgba(34,197,94,0.3);display:inline-block;">
            ⚡ Priority Logic Aktif: Memprioritaskan D${highestIndex} (Indeks Tertinggi)
          </div>
        ` : ''}
      </div>

      <div style="display:flex;gap:14px;align-items:center;">
        ${m7EncoderMode === 'priority8to3' ? `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">A2 (MSB)</span>
            <div class="gate-led-bulb ${a2 === 1 ? 'glow' : ''}" style="width:42px;height:42px;font-size:1.1rem;margin-top:4px;">${a2}</div>
          </div>
        ` : ''}
        <div style="display:flex;flex-direction:column;align-items:center;">
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">A1</span>
          <div class="gate-led-bulb ${a1 === 1 ? 'glow' : ''}" style="width:42px;height:42px;font-size:1.1rem;margin-top:4px;">${a1}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">A0 (LSB)</span>
          <div class="gate-led-bulb ${a0 === 1 ? 'glow' : ''}" style="width:42px;height:42px;font-size:1.1rem;margin-top:4px;">${a0}</div>
        </div>
      </div>
    </div>
  `;

  // 4. Pelafalan Lisan Verbal
  let voiceMsg = '';
  if (highestIndex === -1) {
    voiceMsg = `"Tidak ada input aktif, output encoder berada pada kondisi default nol."`;
  } else if (activeInputsList.length > 1) {
    voiceMsg = `"Beberapa input ditekan sekaligus: ${activeInputsList.join(', ')}. Priority Encoder memprioritaskan D${highestIndex} sehingga menghasilkan biner ${outBinStr}!"`;
  } else {
    voiceMsg = `"Input D${highestIndex} ditekan, Encoder menghasilkan kode biner ${outBinStr}!"`;
  }

  pronounceBox.innerHTML = `
    <div class="pronounce-header">
      <span class="pronounce-tag">🔊 Cara Penyebutan Lisan / Verbal Hasil Encoder</span>
      <span class="tag tag-pink">Output Biner: ${outBinStr}₂</span>
    </div>
    <div class="pronounce-voice-pill">
      <span>📢</span>
      <span>${voiceMsg}</span>
    </div>
    <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:0;">
      <strong>Persamaan Gerbang Logika (Slide 23 &amp; 26):</strong><br>
      Pada encoder 4-to-2: <code>A1 = D2 + D3</code> dan <code>A0 = D1 + D3</code>. Setiap bit output dibentuk menggunakan penjumlahan logika gerbang OR dari jalur-jalur yang memiliki nilai 1 pada posisi bit tersebut.
    </p>
  `;
}

function testKeypadEncoder(digit) {
  const digitEl = document.getElementById('m7-keypad-digit');
  const binEl = document.getElementById('m7-keypad-bin');
  if (digitEl && binEl) {
    digitEl.innerText = digit;
    binEl.innerText = `${digit.toString(2).padStart(4, '0')}₂`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   SUBMENU 3: BCD KE 7-SEGMENT DISPLAY (SLIDE 29 - 33)
═══════════════════════════════════════════════════════════════ */
function renderMinggu7SevenSeg(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Decoder BCD ke 7-Segment Display</h1>
        <p>Berdasarkan silabus Pertemuan 7 Sistem Digital ITERA: Seven Segment Display adalah komponen visual penampil angka yang tersusun dari 7 LED (segmen a, b, c, d, e, f, g) dan 1 titik desimal (dp). Decoder BCD ke 7-segment mengonversi input kode biner 4-bit (8421) menjadi sinyal aktivasi segmen yang tepat.</p>
        <div class="week-hero-tags">
          <span class="tag tag-red">7-Segment Display</span>
          <span class="tag tag-blue">Common Cathode (CC)</span>
          <span class="tag tag-violet">Common Anode (CA)</span>
          <span class="tag tag-green">BCD 8421 Code</span>
        </div>
      </div>
    </div>

    <!-- Anatomi & Polaritas Common Anode vs Cathode (Slide 30-31) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Anatomi 7-Segment &amp; Polaritas Sambungan (Slide 30 &amp; 31)</h3>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
        <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.3);border-radius:var(--radius-md);padding:16px;">
          <div style="color:var(--accent-blue);font-weight:700;font-size:1rem;margin-bottom:6px;">Common Cathode (CC) &bull; Katoda Bersama</div>
          <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:8px;">
            Semua kutub katoda (-) dari ke-7 LED dihubungkan bersama ke <strong>GND (0V)</strong>.
          </p>
          <div style="background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#4ade80;">
            Segmen akan menyala jika diberi logika <strong>HIGH (1)</strong> / Active-High.
          </div>
        </div>

        <div style="background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.3);border-radius:var(--radius-md);padding:16px;">
          <div style="color:var(--accent-pink);font-weight:700;font-size:1rem;margin-bottom:6px;">Common Anode (CA) &bull; Anoda Bersama</div>
          <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:8px;">
            Semua kutub anoda (+) dari ke-7 LED dihubungkan bersama ke <strong>Vcc (+5V)</strong>.
          </p>
          <div style="background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#f472b6;">
            Segmen akan menyala jika diberi logika <strong>LOW (0)</strong> / Active-Low.
          </div>
        </div>
      </div>
    </div>

    <!-- Simulator Interaktif BCD ke 7-Segment -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">💡 Simulator Interaktif BCD ke 7-Segment Display (Slide 33)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Pilih polaritas display (Common Cathode atau Common Anode), tekan tombol angka desimal cepat (0-9) atau gerakkan saklar 4-bit biner BCD ($A, B, C, D$) untuk melihat simulasi fisik LED 7-segmen menyala secara real-time!
      </p>

      <!-- Panel Pengatur Polaritas & Preset Cepat -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding:14px;background:rgba(13,21,48,0.5);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <!-- Polaritas Toggle -->
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.84rem;font-weight:700;color:var(--accent-blue);">Tipe Polaritas:</span>
          <button class="btn btn-sm ${m7Polarity === 'CC' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7Polarity('CC')">Common Cathode (CC)</button>
          <button class="btn btn-sm ${m7Polarity === 'CA' ? 'btn-primary' : 'btn-ghost'}" onclick="setM7Polarity('CA')">Common Anode (CA)</button>
        </div>

        <!-- Tombol Digit Desimal Cepat -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          <span style="font-size:0.78rem;color:var(--text-muted);font-weight:600;">Digit Cepat:</span>
          ${[0,1,2,3,4,5,6,7,8,9].map(d => `
            <button class="btn btn-sm btn-ghost" onclick="setM7BcdDigit(${d})" style="font-family:var(--font-mono);font-weight:700;min-width:32px;padding:4px 8px;">
              ${d}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Saklar Input 4-Bit BCD (A, B, C, D) -->
      <div style="display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:24px;padding:14px;background:rgba(10,14,30,0.6);border-radius:var(--radius-md);border:1px solid var(--border-subtle);flex-wrap:wrap;">
        <span style="font-size:0.84rem;font-weight:700;color:var(--accent-orange);">Input BCD 4-Bit:</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--text-secondary);">A (Bobot 8):</span>
          <button class="gate-switch-btn ${m7BcdBits[0] === 1 ? 'on' : ''}" onclick="toggleM7BcdBit(0)" id="m7-bcd-0">${m7BcdBits[0]}</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--text-secondary);">B (Bobot 4):</span>
          <button class="gate-switch-btn ${m7BcdBits[1] === 1 ? 'on' : ''}" onclick="toggleM7BcdBit(1)" id="m7-bcd-1">${m7BcdBits[1]}</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--text-secondary);">C (Bobot 2):</span>
          <button class="gate-switch-btn ${m7BcdBits[2] === 1 ? 'on' : ''}" onclick="toggleM7BcdBit(2)" id="m7-bcd-2">${m7BcdBits[2]}</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--text-secondary);">D (Bobot 1):</span>
          <button class="gate-switch-btn ${m7BcdBits[3] === 1 ? 'on' : ''}" onclick="toggleM7BcdBit(3)" id="m7-bcd-3">${m7BcdBits[3]}</button>
        </div>
      </div>

      <!-- Main Visual Workspace: 7-Segment Display + Pin Badges -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;" id="m7-sevenseg-workspace">
        <!-- Diisi oleh updateM7SevenSegUI() -->
      </div>

      <!-- Kotak Pelafalan Lisan Verbal -->
      <div class="pronounce-callout mb-24" id="m7-sevenseg-pronounce">
        <!-- Diisi oleh updateM7SevenSegUI() -->
      </div>

      <!-- Tabel Kebenaran Lengkap BCD ke 7-Segment (Slide 33) -->
      <div>
        <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:10px;color:var(--accent-blue);">
          📋 Tabel Kebenaran BCD / HEX Decoder Lengkap (Slide 33 Silabus ITERA)
        </h4>
        <div style="overflow-x:auto;">
          <table class="truth-table" id="m7-sevenseg-truth-table" style="width:100%;text-align:center;">
            <!-- Diisi oleh updateM7SevenSegUI() -->
          </table>
        </div>
      </div>
    </div>
  `;

  updateM7SevenSegUI();
}

function setM7Polarity(pol) {
  m7Polarity = pol;
  renderMinggu7SevenSeg(document.getElementById('content-body'));
}

function setM7BcdDigit(digit) {
  m7BcdBits[0] = (digit >> 3) & 1;
  m7BcdBits[1] = (digit >> 2) & 1;
  m7BcdBits[2] = (digit >> 1) & 1;
  m7BcdBits[3] = digit & 1;
  updateM7SevenSegUI();
}

function toggleM7BcdBit(bitIndex) {
  m7BcdBits[bitIndex] = m7BcdBits[bitIndex] === 1 ? 0 : 1;
  updateM7SevenSegUI();
}

function updateM7SevenSegUI() {
  const workspace = document.getElementById('m7-sevenseg-workspace');
  const pronounceBox = document.getElementById('m7-sevenseg-pronounce');
  const truthTable = document.getElementById('m7-sevenseg-truth-table');
  if (!workspace || !pronounceBox || !truthTable) return;

  // Update saklar input di DOM
  for (let b = 0; b < 4; b++) {
    const btn = document.getElementById(`m7-bcd-${b}`);
    if (btn) {
      btn.textContent = m7BcdBits[b];
      btn.classList.toggle('on', m7BcdBits[b] === 1);
    }
  }

  // Hitung Nilai Desimal
  const decVal = (m7BcdBits[0] << 3) | (m7BcdBits[1] << 2) | (m7BcdBits[2] << 1) | m7BcdBits[3];
  const item = M7_SEVENSEG_TABLE[decVal] || M7_SEVENSEG_TABLE[0];
  const segs = item.segs;

  // Logika Polaritas (CC = 1 nyala, CA = 0 nyala)
  const isLit = (segKey) => {
    return m7Polarity === 'CC' ? segs[segKey] === 1 : segs[segKey] === 0;
  };

  // Render SVG 7-Segment Realistis
  const segColorClass = m7Polarity === 'CC' ? 'lit-red' : 'lit-cyan';

  workspace.innerHTML = `
    <!-- Sisi Kiri: Visualisasi LED 7-Segment -->
    <div class="seven-seg-container">
      <div style="font-size:0.75rem;text-transform:uppercase;color:#ef4444;font-weight:700;letter-spacing:1px;margin-bottom:12px;">
        Seven-Segment LED Display (${m7Polarity === 'CC' ? 'Common Cathode' : 'Common Anode'})
      </div>

      <!-- SVG 7-Segment Display Geometrik Presisi -->
      <svg class="seven-seg-svg" viewBox="0 0 100 160">
        <!-- Segmen a (Top) -->
        <polygon class="seven-seg-polygon ${isLit('a') ? segColorClass : ''}" points="20,12 80,12 70,22 30,22"></polygon>
        <!-- Segmen b (Top-Right) -->
        <polygon class="seven-seg-polygon ${isLit('b') ? segColorClass : ''}" points="82,14 82,74 72,66 72,24"></polygon>
        <!-- Segmen c (Bottom-Right) -->
        <polygon class="seven-seg-polygon ${isLit('c') ? segColorClass : ''}" points="82,86 82,146 72,136 72,94"></polygon>
        <!-- Segmen d (Bottom) -->
        <polygon class="seven-seg-polygon ${isLit('d') ? segColorClass : ''}" points="20,148 80,148 70,138 30,138"></polygon>
        <!-- Segmen e (Bottom-Left) -->
        <polygon class="seven-seg-polygon ${isLit('e') ? segColorClass : ''}" points="18,86 18,146 28,136 28,94"></polygon>
        <!-- Segmen f (Top-Left) -->
        <polygon class="seven-seg-polygon ${isLit('f') ? segColorClass : ''}" points="18,14 18,74 28,24 28,66"></polygon>
        <!-- Segmen g (Middle) -->
        <polygon class="seven-seg-polygon ${isLit('g') ? segColorClass : ''}" points="24,80 76,80 68,88 32,88 24,80"></polygon>
        <!-- Decimal Point (dp) -->
        <circle class="seven-seg-polygon" cx="92" cy="146" r="5" style="fill:rgba(255,255,255,0.06);"></circle>
      </svg>

      <!-- Badges Status Segmen a-g -->
      <div class="seven-seg-pin-grid">
        ${['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(s => `
          <div class="seven-seg-pin-badge ${isLit(s) ? 'active' : ''}">
            ${s}: ${m7Polarity === 'CC' ? segs[s] : (segs[s] === 1 ? '0' : '1')}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Sisi Kanan: Kartu Info Dekode BCD -->
    <div style="background:rgba(13,21,48,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:22px;display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;">Angka Terdekode:</div>
        <div style="display:flex;align-items:baseline;gap:12px;margin:8px 0;">
          <span style="font-family:var(--font-heading);font-size:2.8rem;font-weight:800;color:#fff;">${item.hex}</span>
          <span style="color:var(--accent-green);font-size:1.1rem;font-weight:600;">(Desimal ${item.val})</span>
        </div>
        
        <div style="background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;border:1px solid var(--border-subtle);margin-bottom:14px;font-family:var(--font-mono);font-size:0.85rem;">
          <div>Input BCD: <strong>${m7BcdBits.join('')}₂</strong> (8421 Code)</div>
          <div style="color:var(--text-muted);font-size:0.78rem;margin-top:2px;">
            ${m7BcdBits[0]}×8 + ${m7BcdBits[1]}×4 + ${m7BcdBits[2]}×2 + ${m7BcdBits[3]}×1 = ${decVal}
          </div>
        </div>

        <div style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;">
          <strong>Segmen yang Menyala:</strong> ${Object.keys(segs).filter(k => segs[k] === 1).join(', ').toUpperCase()}<br>
          <strong>Segmen yang Mati:</strong> ${Object.keys(segs).filter(k => segs[k] === 0).join(', ').toUpperCase() || 'Tidak ada (Semua menyala)'}
        </div>
      </div>

      <div style="margin-top:14px;padding-top:14px;border-top:1px dashed var(--border-subtle);font-size:0.78rem;color:var(--text-muted);">
        Polaritas Terpasang: <strong style="color:#fff;">${m7Polarity === 'CC' ? 'Common Cathode (Tegangan HIGH menyalakan LED)' : 'Common Anode (Tegangan LOW menyalakan LED)'}</strong>
      </div>
    </div>
  `;

  // 4. Pelafalan Verbal
  const litSegsList = Object.keys(segs).filter(k => segs[k] === 1).map(k => k.toUpperCase()).join(', ');
  pronounceBox.innerHTML = `
    <div class="pronounce-header">
      <span class="pronounce-tag">🔊 Cara Penyebutan Lisan / Verbal Hasil Dekode 7-Segment</span>
      <span class="tag tag-blue">Digit: ${item.hex}</span>
    </div>
    <div class="pronounce-voice-pill">
      <span>📢</span>
      <span>"Kode BCD ${m7BcdBits.join('')} menghasilkan angka ${item.hex}, menyalakan segmen ${litSegsList} pada display!"</span>
    </div>
    <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;margin-bottom:0;">
      <strong>Analisis Logika:</strong> Pada angka ${item.hex}, segmen yang tidak menyala dikomplemenkan untuk menghemat daya. Dalam perancangan sirkuit IC seperti <code>74LS47</code> (untuk Common Anode) atau <code>74LS48</code> (untuk Common Cathode), setiap fungsi segmen a hingga g direduksi menggunakan peta Karnaugh (K-Map 4 variabel) untuk memperoleh gerbang logika minimal.
    </p>
  `;

  // 5. Truth Table Slide 33
  let tableHtml = `
    <thead>
      <tr>
        <th rowspan="2">Digit</th>
        <th colspan="4" style="color:var(--accent-blue);">Input BCD (8421)</th>
        <th colspan="7" style="color:var(--accent-pink);">Status Segmen (Slide 33)</th>
      </tr>
      <tr>
        <th>A (8)</th><th>B (4)</th><th>C (2)</th><th>D (1)</th>
        <th>a</th><th>b</th><th>c</th><th>d</th><th>e</th><th>f</th><th>g</th>
      </tr>
    </thead>
    <tbody>
  `;

  for (let r = 0; r < 16; r++) {
    const row = M7_SEVENSEG_TABLE[r];
    const isCurRow = (decVal === r);
    tableHtml += `
      <tr style="${isCurRow ? 'background:rgba(239,68,68,0.18);font-weight:bold;outline:1px solid #ef4444;' : ''}">
        <td style="font-family:var(--font-heading);font-weight:800;color:${isCurRow ? '#fff' : 'var(--text-primary)'};">${row.hex}</td>
        <td>${row.bcd[0]}</td>
        <td>${row.bcd[1]}</td>
        <td>${row.bcd[2]}</td>
        <td>${row.bcd[3]}</td>
        ${['a','b','c','d','e','f','g'].map(k => `
          <td style="font-family:var(--font-mono);font-weight:${row.segs[k] === 1 ? '700' : '400'};color:${row.segs[k] === 1 ? '#4ade80' : 'var(--text-muted)'};">
            ${row.segs[k]}
          </td>
        `).join('')}
      </tr>
    `;
  }

  tableHtml += `</tbody>`;
  truthTable.innerHTML = tableHtml;
}

// Expose fungsi ke window
window.renderMinggu7Decoder = renderMinggu7Decoder;
window.renderMinggu7Encoder = renderMinggu7Encoder;
window.renderMinggu7SevenSeg = renderMinggu7SevenSeg;
window.setM7DecoderType = setM7DecoderType;
window.toggleM7DecoderEn = toggleM7DecoderEn;
window.toggleM7DecoderInput = toggleM7DecoderInput;
window.setM7AppScenario = setM7AppScenario;
window.setM7MemAddress = setM7MemAddress;
window.setM7EncoderMode = setM7EncoderMode;
window.toggleM7EncoderInput = toggleM7EncoderInput;
window.testKeypadEncoder = testKeypadEncoder;
window.setM7Polarity = setM7Polarity;
window.setM7BcdDigit = setM7BcdDigit;
window.toggleM7BcdBit = toggleM7BcdBit;
