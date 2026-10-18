/**
 * minggu1.js
 * Sistem Bilangan & Konversi — Metode Biner sebagai Pusat
 * Mendukung: integer positif, integer negatif, bilangan pecahan (semua basis)
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   CORE MATH ENGINE — Binary Central Method
   Supports: integers, negatives, fractions
═══════════════════════════════════════════════════════════════ */

/**
 * Parse input string ke nilai float, mendeteksi basis dan tanda negatif.
 * Mendukung basis 2, 8, 10, 16 dengan bilangan bulat dan pecahan.
 * @param {string} raw  — input mentah dari user
 * @param {number} base — basis input (2/8/10/16)
 * @returns {number|null}
 */
function parseInput(raw, base) {
  if (!raw && raw !== '0') return null;
  raw = raw.trim().replace(',', '.'); // ganti koma → titik
  if (raw === '' || raw === '-') return null;

  const negative = raw.startsWith('-');
  const abs = negative ? raw.slice(1) : raw;

  // Pisah integer dan fraksi
  const [intPart, fracPart] = abs.split('.');

  // Validasi karakter per basis
  const charsets = { 2: /^[01]*$/, 8: /^[0-7]*$/, 10: /^[0-9]*$/, 16: /^[0-9a-fA-F]*$/ };
  if (!charsets[base]) return null;
  if (intPart && !charsets[base].test(intPart)) return null;
  if (fracPart && !charsets[base].test(fracPart)) return null;

  // Konversi
  let value = 0;
  if (intPart) value = parseInt(intPart || '0', base);
  if (fracPart) {
    let frac = 0;
    for (let i = 0; i < fracPart.length; i++) {
      frac += parseInt(fracPart[i], base) / Math.pow(base, i + 1);
    }
    value += frac;
  }
  return negative ? -value : value;
}

/**
 * Validasi input (ringan — hanya karakter yang diizinkan, termasuk tanda minus & titik)
 */
function validateRaw(raw, base) {
  if (!raw || raw.trim() === '') return false;
  raw = raw.trim().replace(',', '.');
  // Izinkan: opsional tanda minus, digit basis, opsional titik desimal
  const patterns = {
    2: /^-?[01]*\.?[01]+$/,
    8: /^-?[0-7]*\.?[0-7]+$/,
    10: /^-?[0-9]*\.?[0-9]+$/,
    16: /^-?[0-9a-fA-F]*\.?[0-9a-fA-F]+$/i,
  };
  return patterns[base]?.test(raw) ?? false;
}

/**
 * Konversi nilai desimal (float) → representasi biner lengkap.
 * Mengembalikan string biner dengan titik untuk fraksi.
 * Contoh: 13.625 → "1101.101"
 */
function decToBinFull(value) {
  if (value === 0) return { bin: '0', intBin: '0', fracBin: '' };

  const negative = value < 0;
  const absVal = Math.abs(value);
  const intPart = Math.floor(absVal);
  let fracPart = absVal - intPart;

  // Integer part → bagi 2 berulang
  let intBin = '';
  const intSteps = [];
  if (intPart === 0) {
    intBin = '0';
    intSteps.push({ dividend: 0, quotient: 0, remainder: 0 });
  } else {
    let n = intPart;
    while (n > 0) {
      const q = Math.floor(n / 2);
      const r = n % 2;
      intSteps.push({ dividend: n, quotient: q, remainder: r });
      intBin = r + intBin;
      n = q;
    }
  }

  // Fraksi part → kali 2 berulang (maks 20 bit)
  let fracBin = '';
  const fracSteps = [];
  if (fracPart > 1e-10) {
    let f = fracPart;
    for (let i = 0; i < 20 && f > 1e-10; i++) {
      f *= 2;
      const digit = Math.floor(f);
      fracSteps.push({ before: f / 2, multiplied: f, digit });
      fracBin += digit;
      f -= digit;
    }
  }

  const bin = fracBin ? `${intBin}.${fracBin}` : intBin;
  return { bin, intBin, fracBin, intSteps, fracSteps, negative };
}

/**
 * Biner (string, boleh ada titik) → Desimal (float)
 */
function binToDecFull(binStr) {
  const negative = binStr.startsWith('-');
  binStr = negative ? binStr.slice(1) : binStr;
  const [intPart, fracPart] = binStr.split('.');

  let value = 0;
  const intBits = (intPart || '0').split('').reverse();
  const intPositions = intBits.map((b, i) => ({ position: i, bit: parseInt(b), power: Math.pow(2, i), value: parseInt(b) * Math.pow(2, i) }));
  value = intPositions.reduce((s, p) => s + p.value, 0);

  const fracPositions = [];
  if (fracPart) {
    for (let i = 0; i < fracPart.length; i++) {
      const b = parseInt(fracPart[i]);
      const pwr = Math.pow(2, -(i + 1));
      fracPositions.push({ position: -(i + 1), bit: b, power: pwr, value: b * pwr });
      value += b * pwr;
    }
  }

  return { decimal: negative ? -value : value, intPositions: intPositions.reverse(), fracPositions, negative };
}

/**
 * Biner → Heksadesimal (mendukung bilangan pecahan)
 * Integer: kelompok 4-bit dari kanan
 * Fraksi:  kelompok 4-bit dari kiri
 */
function binToHexFull(binStr) {
  const negative = binStr.startsWith('-');
  if (negative) binStr = binStr.slice(1);

  const [intPart, fracPart] = binStr.split('.');
  const intGroups = groupBits(intPart || '0', 4, 'right');
  const fracGroups = fracPart ? groupBits(fracPart, 4, 'left') : [];

  const intHex = intGroups.map(g => ({ bits: g, value: parseInt(g, 2), hex: parseInt(g, 2).toString(16).toUpperCase() }));
  const fracHex = fracGroups.map(g => ({ bits: g, value: parseInt(g, 2), hex: parseInt(g, 2).toString(16).toUpperCase() }));

  const hex = (negative ? '-' : '') +
    intHex.map(g => g.hex).join('') +
    (fracHex.length ? '.' + fracHex.map(g => g.hex).join('') : '');

  return { hex, intGroups: intHex, fracGroups: fracHex, negative };
}

/**
 * Biner → Oktal (mendukung bilangan pecahan)
 * Integer: kelompok 3-bit dari kanan
 * Fraksi:  kelompok 3-bit dari kiri
 */
function binToOctFull(binStr) {
  const negative = binStr.startsWith('-');
  if (negative) binStr = binStr.slice(1);

  const [intPart, fracPart] = binStr.split('.');
  const intGroups = groupBits(intPart || '0', 3, 'right');
  const fracGroups = fracPart ? groupBits(fracPart, 3, 'left') : [];

  const intOct = intGroups.map(g => ({ bits: g, value: parseInt(g, 2).toString() }));
  const fracOct = fracGroups.map(g => ({ bits: g, value: parseInt(g, 2).toString() }));

  const octal = (negative ? '-' : '') +
    intOct.map(g => g.value).join('') +
    (fracOct.length ? '.' + fracOct.map(g => g.value).join('') : '');

  return { octal, intGroups: intOct, fracGroups: fracOct, negative };
}

/**
 * Kelompokkan bit string ke grup n-bit
 * direction: 'right' (pad kiri, untuk integer) | 'left' (pad kanan, untuk fraksi)
 */
function groupBits(bits, n, direction) {
  const groups = [];
  if (direction === 'right') {
    while (bits.length % n !== 0) bits = '0' + bits;
    for (let i = 0; i < bits.length; i += n) groups.push(bits.substring(i, i + n));
  } else {
    while (bits.length % n !== 0) bits = bits + '0';
    for (let i = 0; i < bits.length; i += n) groups.push(bits.substring(i, i + n));
  }
  return groups;
}

/**
 * Konversi dari basis lain ke biner (untuk tampilan step-by-step)
 */
function hexToBinGroups(hex) {
  const MAP = { '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111' };
  const neg = hex.startsWith('-');
  if (neg) hex = hex.slice(1);
  const [intPart, fracPart] = hex.split('.');
  const intGroups = intPart.toUpperCase().split('').map(c => ({ hex: c, bits: MAP[c] || '????' }));
  const fracGroups = fracPart ? fracPart.toUpperCase().split('').map(c => ({ hex: c, bits: MAP[c] || '????' })) : [];
  let bin = intGroups.map(g => g.bits).join('').replace(/^0+/, '') || '0';
  if (fracGroups.length) bin += '.' + fracGroups.map(g => g.bits).join('').replace(/0+$/, '');
  return { bin: (neg ? '-' : '') + bin, intGroups, fracGroups, neg };
}

function octToBinGroups(oct) {
  const MAP = { '0': '000', '1': '001', '2': '010', '3': '011', '4': '100', '5': '101', '6': '110', '7': '111' };
  const neg = oct.startsWith('-');
  if (neg) oct = oct.slice(1);
  const [intPart, fracPart] = oct.split('.');
  const intGroups = intPart.split('').map(c => ({ octal: c, bits: MAP[c] || '???' }));
  const fracGroups = fracPart ? fracPart.split('').map(c => ({ octal: c, bits: MAP[c] || '???' })) : [];
  let bin = intGroups.map(g => g.bits).join('').replace(/^0+/, '') || '0';
  if (fracGroups.length) bin += '.' + fracGroups.map(g => g.bits).join('').replace(/0+$/, '');
  return { bin: (neg ? '-' : '') + bin, intGroups, fracGroups, neg };
}

/* ═══════════════════════════════════════════════════════════════
   FORMAT HELPERS
═══════════════════════════════════════════════════════════════ */

function fmtDecimal(v) {
  if (Number.isInteger(v)) return v.toString();
  // round to 10 decimal places max
  return parseFloat(v.toPrecision(12)).toString();
}

function fmtBinary(binStr) {
  // Insert spaces for readability in groups of 4
  const neg = binStr.startsWith('-');
  if (neg) binStr = binStr.slice(1);
  const [ip, fp] = binStr.split('.');
  const padded = ip.padStart(Math.ceil(ip.length / 4) * 4, '0');
  const groups = padded.match(/.{1,4}/g) || [];
  let out = (neg ? '-' : '') + groups.join(' ');
  if (fp) out += '.' + fp;
  return out;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 1 — KONVERSI BILANGAN
═══════════════════════════════════════════════════════════════ */

function renderMinggu1Konversi(container) {
  container.innerHTML = `
    <!-- Hero -->
    <div class="week-hero">
      <div class="week-hero-content">
        <h1>🔢 Sistem Bilangan &amp; Konversi</h1>
        <p>Konversi antar sistem bilangan menggunakan metode <strong style="color:var(--accent-blue)">Biner sebagai Pusat</strong>. Semua bilangan — positif, negatif, maupun pecahan — dikonversi ke biner terlebih dahulu, lalu dikelompokkan ke format target.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">Biner (Base-2)</span>
          <span class="tag tag-violet">Heksadesimal (Base-16)</span>
          <span class="tag tag-green">Oktal (Base-8)</span>
          <span class="tag tag-orange">Desimal (Base-10)</span>
        </div>
      </div>
    </div>

    <!-- Hub Diagram -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🌐 Biner sebagai Pusat Konversi</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:.84rem;text-align:center;margin-bottom:4px;">
        Semua konversi melewati <strong style="color:var(--accent-blue)">BINER</strong> sebagai titik sentral
      </p>
      <div class="hub-diagram">
        <div class="hub-container">
          <div class="hub-line hub-line-decimal"></div>
          <div class="hub-line hub-line-hex"></div>
          <div class="hub-line hub-line-octal"></div>
          <div class="hub-line hub-line-input"></div>
          <div class="hub-center" onclick="scrollToConverter()">
            <div class="hub-center-label">BINER</div>
            <div class="hub-center-sub">Base-2 · Pusat</div>
          </div>
          <div class="hub-node hub-node-decimal" onclick="selectBase(10);scrollToConverter()">
            <div class="hub-node-label">DESIMAL</div>
            <div class="hub-node-sub">Base-10</div>
          </div>
          <div class="hub-node hub-node-hex" onclick="selectBase(16);scrollToConverter()">
            <div class="hub-node-label">HEKSA</div>
            <div class="hub-node-sub">Base-16 · 4-bit</div>
          </div>
          <div class="hub-node hub-node-octal" onclick="selectBase(8);scrollToConverter()">
            <div class="hub-node-label">OKTAL</div>
            <div class="hub-node-sub">Base-8 · 3-bit</div>
          </div>
          <div class="hub-node hub-node-input" onclick="selectBase(2);scrollToConverter()">
            <div class="hub-node-label">BINER</div>
            <div class="hub-node-sub">Input Langsung</div>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:center;gap:22px;flex-wrap:wrap;font-size:.74rem;color:var(--text-muted);margin-top:8px;">
        <span>📐 Kelompok <strong style="color:var(--accent-violet)">4-bit</strong> → Heksa</span>
        <span>📐 Kelompok <strong style="color:var(--accent-green)">3-bit</strong> → Oktal</span>
        <span>📐 Jumlahkan <strong style="color:var(--accent-pink)">2ⁿ</strong> → Desimal</span>
        <span>📐 Kali 2 berulang → Fraksi</span>
      </div>
    </div>

    <!-- Converter Tool -->
    <div class="glass-card mb-28" id="converter-tool">
      <div class="glass-card-header">
        <h3 class="glass-card-title">⚡ Konverter Bilangan Interaktif</h3>
      </div>

      <div class="converter-section">
        <div class="converter-input-panel">
          <div class="input-group">
            <label class="input-label">📥 Pilih Basis Input</label>
            <div class="base-selector">
              <button class="base-btn active" data-base="10" onclick="selectBase(10)" id="btn-base-10">Desimal (10)</button>
              <button class="base-btn" data-base="2"  onclick="selectBase(2)"  id="btn-base-2">Biner (2)</button>
              <button class="base-btn" data-base="8"  onclick="selectBase(8)"  id="btn-base-8">Oktal (8)</button>
              <button class="base-btn" data-base="16" onclick="selectBase(16)" id="btn-base-16">Heksa (16)</button>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">✏️ Masukkan Angka</label>
            <input type="text" class="input-field" id="converter-input"
              placeholder="Contoh: 156" autocomplete="off" spellcheck="false" />
          </div>
          <button class="convert-btn" id="convert-main-btn" onclick="performConversion()">
            <span>⚡</span><span>Konversi Sekarang</span>
          </button>
        </div>

        <div class="result-cards" id="result-cards">
          <div class="result-card result-card-decimal">
            <div class="result-card-label">Desimal (Base-10)</div>
            <div class="result-card-value" id="result-decimal">—</div>
          </div>
          <div class="result-card result-card-binary">
            <div class="result-card-label">Biner (Base-2)</div>
            <div class="result-card-value" id="result-binary">—</div>
          </div>
          <div class="result-card result-card-octal">
            <div class="result-card-label">Oktal (Base-8)</div>
            <div class="result-card-value" id="result-octal">—</div>
          </div>
          <div class="result-card result-card-hex">
            <div class="result-card-label">Heksadesimal (Base-16)</div>
            <div class="result-card-value" id="result-hex">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step-by-Step (hidden until convert) -->
    <div class="glass-card mb-28" id="steps-section" style="display:none;">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📊 Visualisasi Langkah-demi-Langkah</h3>
      </div>
      <div class="step-tabs" id="step-tabs"></div>
      <div id="step-contents"></div>
    </div>

    <!-- Cheat Sheet -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📋 Tabel Referensi Cepat (0–15)</h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="cheat-table">
          <thead>
            <tr>
              <th>Desimal</th><th>Biner</th><th>Oktal</th><th>Heksa</th>
            </tr>
          </thead>
          <tbody id="cheat-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  buildCheatSheet();
  const inp = document.getElementById('converter-input');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') performConversion(); });
}

function scrollToConverter() {
  const el = document.getElementById('converter-tool');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════════════════════════
   CONVERTER STATE & ACTIONS
═══════════════════════════════════════════════════════════════ */

let selectedBase = 10;

function selectBase(base) {
  selectedBase = base;
  document.querySelectorAll('.base-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.base) === base);
  });
  const placeholders = {
    2: 'Contoh: 10011100 atau 1101.101',
    8: 'Contoh: 234 atau 15.4',
    10: 'Contoh: 156 atau -13 atau 3.14',
    16: 'Contoh: 9C atau 1F.A',
  };
  const inp = document.getElementById('converter-input');
  if (inp) inp.placeholder = placeholders[base] || '';
}

function performConversion() {
  const inp = document.getElementById('converter-input');
  if (!inp) return;

  const raw = inp.value.trim().replace(',', '.');
  if (!raw) return;

  // Silent validation — jika tidak valid, flash red & return
  if (!validateRaw(raw, selectedBase)) {
    inp.style.borderColor = 'var(--accent-red)';
    inp.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
    setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 1400);
    return;
  }

  // ── Step 1: Convert input → decimal float ──
  const decValue = parseInput(raw, selectedBase);
  if (decValue === null) return;

  // ── Step 2: Decimal → Binary (central step) ──
  const { bin: binStr, intBin, fracBin, intSteps, fracSteps, negative } = decToBinFull(decValue);

  // ── Step 3: Binary → all targets ──
  const toHex = binToHexFull((negative ? '-' : '') + binStr.replace(/^-/, ''));
  const toOct = binToOctFull((negative ? '-' : '') + binStr.replace(/^-/, ''));
  const toDec = binToDecFull((negative ? '-' : '') + binStr.replace(/^-/, ''));

  // ── Display results ──
  animateResult('result-decimal', fmtDecimal(decValue));
  animateResult('result-binary', (negative ? '-' : '') + fmtBinary(binStr));
  animateResult('result-octal', toOct.octal);
  animateResult('result-hex', toHex.hex);

  // ── Build step-by-step based on input base ──
  let toBinStepData = null;
  if (selectedBase === 10) {
    toBinStepData = { type: 'decimal-to-binary', intSteps, fracSteps, intBin, fracBin, negative, decValue };
  } else if (selectedBase === 16) {
    toBinStepData = { type: 'hex-to-binary', ...hexToBinGroups(raw) };
  } else if (selectedBase === 8) {
    toBinStepData = { type: 'oct-to-binary', ...octToBinGroups(raw) };
  } else if (selectedBase === 2) {
    toBinStepData = null; // already binary
  }

  showStepsTabs(toBinStepData, (negative ? '-' : '') + binStr, intBin, fracBin, toHex, toOct, toDec, negative);
}

function animateResult(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  setTimeout(() => {
    el.textContent = val;
    el.style.transition = 'all .3s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 80);
}

/* ═══════════════════════════════════════════════════════════════
   STEP-BY-STEP VISUALIZATION
═══════════════════════════════════════════════════════════════ */

function showStepsTabs(toBinStep, binStr, intBin, fracBin, toHex, toOct, toDec, negative) {
  const section = document.getElementById('steps-section');
  const tabsEl = document.getElementById('step-tabs');
  const contEl = document.getElementById('step-contents');
  if (!section || !tabsEl || !contEl) return;

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const hasFrac = !!fracBin;
  const tabs = [];
  const contents = [];

  // Tab 0: Konversi ke Biner (jika bukan input biner)
  if (toBinStep) {
    tabs.push({ id: 'stp-to-bin', label: '① → Biner' });
    contents.push({ id: 'stp-to-bin', html: renderToBinaryStep(toBinStep, binStr, intBin, fracBin, negative) });
  }

  // Tab 1: Biner → Heksa (4-bit groups)
  tabs.push({ id: 'stp-to-hex', label: '② Biner → Heksa (4-bit)' });
  contents.push({ id: 'stp-to-hex', html: renderGroupStep(binStr, intBin, fracBin, toHex, 4, 'Heksa', 'var(--accent-violet)', negative) });

  // Tab 2: Biner → Oktal (3-bit groups)
  tabs.push({ id: 'stp-to-oct', label: '③ Biner → Oktal (3-bit)' });
  contents.push({ id: 'stp-to-oct', html: renderGroupStep(binStr, intBin, fracBin, toOct, 3, 'Oktal', 'var(--accent-green)', negative) });

  // Tab 3: Biner → Desimal (pangkat 2)
  tabs.push({ id: 'stp-to-dec', label: '④ Biner → Desimal (2ⁿ)' });
  contents.push({ id: 'stp-to-dec', html: renderPowerStep(binStr, intBin, fracBin, toDec, negative) });

  tabsEl.innerHTML = tabs.map((t, i) =>
    `<button class="step-tab ${i === 0 ? 'active' : ''}" onclick="switchTab('${t.id}', this)">${t.label}</button>`
  ).join('');

  contEl.innerHTML = contents.map((c, i) =>
    `<div class="step-content ${i === 0 ? 'active' : ''}" id="${c.id}">${c.html}</div>`
  ).join('');
}

function switchTab(id, btn) {
  document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ── Render: Input → Binary ── */
function renderToBinaryStep(step, binStr, intBin, fracBin, negative) {
  const hasFrac = !!fracBin;
  let html = `<div class="step-detail" style="text-align:center;">`;

  if (step.type === 'decimal-to-binary') {
    html += `<h4 class="step-title" style="justify-content:center;">✨ Desimal → Biner</h4>
      <p class="step-description">
        <strong>Bagian integer:</strong> bagi terus dengan 2, tulis sisa dari bawah ke atas.<br>
        ${hasFrac ? '<strong>Bagian fraksi:</strong> kali terus dengan 2, ambil angka di depan titik.' : ''}
      </p>`;

    // Integer division table
    html += `<div style="margin-bottom:16px;">
      <div style="font-size:.8rem;color:var(--accent-blue);font-weight:700;margin-bottom:10px;">Bagian Integer: ${step.negative ? '-' : ''}${Math.floor(Math.abs(step.decValue))}</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">`;

    step.intSteps.forEach((s, i) => {
      html += `<div style="display:flex;align-items:center;gap:12px;font-size:1rem;animation:fadeInStep .3s ease forwards;animation-delay:${i * 0.08}s;opacity:0;">
        <div style="background:var(--bg-secondary);padding:7px 14px;border-radius:8px;width:70px;text-align:right;font-family:var(--font-mono);font-weight:700;">${s.dividend}</div>
        <div style="color:var(--text-muted);">÷ 2 =</div>
        <div style="background:var(--bg-tertiary);padding:7px 14px;border-radius:8px;width:55px;text-align:center;font-family:var(--font-mono);">${s.quotient}</div>
        <div style="color:var(--text-muted);">sisa</div>
        <div style="background:${s.remainder ? 'rgba(0,212,255,.2)' : 'rgba(255,255,255,.04)'};border:1px solid ${s.remainder ? 'var(--accent-blue)' : 'var(--border-subtle)'};color:${s.remainder ? 'var(--accent-blue)' : 'var(--text-muted)'};padding:7px 14px;border-radius:8px;font-weight:800;width:36px;text-align:center;font-family:var(--font-mono);">${s.remainder}</div>
      </div>`;
    });

    html += `</div>
      <div style="color:var(--accent-blue);font-size:1.3rem;margin:10px 0;">↑ Baca ke Atas ↑</div>
      <div style="font-size:1.8rem;font-weight:900;color:white;letter-spacing:4px;font-family:var(--font-mono);">${intBin}</div>
    </div>`;

    // Fraction multiply table
    if (hasFrac && step.fracSteps?.length) {
      html += `<div style="margin-top:16px;">
        <div style="font-size:.8rem;color:var(--accent-orange);font-weight:700;margin-bottom:10px;">Bagian Fraksi: 0.${(() => { const f = Math.abs(step.decValue) % 1; return parseFloat(f.toPrecision(8)).toString().slice(2); })()}</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">`;

      step.fracSteps.forEach((s, i) => {
        html += `<div style="display:flex;align-items:center;gap:12px;font-size:1rem;animation:fadeInStep .3s ease forwards;animation-delay:${(step.intSteps.length + i) * 0.08}s;opacity:0;">
          <div style="background:var(--bg-secondary);padding:7px 14px;border-radius:8px;min-width:80px;text-align:right;font-family:var(--font-mono);font-size:.9rem;">${parseFloat(s.before.toPrecision(8))}</div>
          <div style="color:var(--text-muted);">× 2 =</div>
          <div style="background:var(--bg-tertiary);padding:7px 14px;border-radius:8px;min-width:80px;font-family:var(--font-mono);font-size:.9rem;">${parseFloat(s.multiplied.toPrecision(8))}</div>
          <div style="color:var(--text-muted);">ambil</div>
          <div style="background:${s.digit ? 'rgba(245,158,11,.2)' : 'rgba(255,255,255,.04)'};border:1px solid ${s.digit ? 'var(--accent-orange)' : 'var(--border-subtle)'};color:${s.digit ? 'var(--accent-orange)' : 'var(--text-muted)'};padding:7px 14px;border-radius:8px;font-weight:800;width:36px;text-align:center;font-family:var(--font-mono);">${s.digit}</div>
        </div>`;
      });

      html += `</div>
        <div style="color:var(--accent-orange);font-size:1.1rem;margin:10px 0;">↓ Baca ke Bawah ↓</div>
        <div style="font-size:1.5rem;font-weight:900;color:white;letter-spacing:3px;font-family:var(--font-mono);">0.${fracBin}</div>
      </div>`;
    }

    html += `<div style="margin-top:20px;padding:14px;background:rgba(0,0,0,.25);border-radius:12px;display:inline-block;">
      <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:6px;">Hasil Biner Lengkap:</div>
      <div style="font-size:2rem;font-weight:900;color:white;letter-spacing:3px;font-family:var(--font-mono);">${negative ? '-' : ''}${intBin}${fracBin ? '<span style="color:var(--accent-orange)">.</span>' + fracBin : ''}</div>
    </div>`;

  } else if (step.type === 'hex-to-binary') {
    html += `<h4 class="step-title" style="justify-content:center;color:var(--accent-violet);">✨ Heksadesimal → Biner</h4>
      <p class="step-description">Setiap digit heksa dipecah menjadi tepat <strong>4 digit biner</strong>.</p>
      <div style="display:flex;justify-content:center;gap:18px;margin:24px 0;flex-wrap:wrap;">`;
    [...step.intGroups, ...(step.fracGroups || [])].forEach((g, i) => {
      html += `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;animation:fadeInStep .3s ease forwards;animation-delay:${i * .12}s;opacity:0;">
        <div style="font-size:1.8rem;font-weight:bold;color:var(--accent-violet);background:rgba(124,58,237,.12);width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2px solid rgba(124,58,237,.4);">${g.hex}</div>
        <div style="color:var(--text-muted);">↓</div>
        <div style="font-size:1.3rem;letter-spacing:2px;font-family:var(--font-mono);font-weight:bold;padding:9px 13px;background:var(--bg-tertiary);border-radius:8px;">${g.bits}</div>
      </div>`;
    });
    html += `</div><div style="color:var(--text-muted);margin-bottom:8px;">Gabungkan → hapus nol depan:</div>
      <div style="font-size:1.8rem;font-weight:900;color:white;letter-spacing:3px;font-family:var(--font-mono);">${negative ? '-' : ''}${binStr}</div>`;

  } else if (step.type === 'oct-to-binary') {
    html += `<h4 class="step-title" style="justify-content:center;color:var(--accent-green);">✨ Oktal → Biner</h4>
      <p class="step-description">Setiap digit oktal dipecah menjadi tepat <strong>3 digit biner</strong>.</p>
      <div style="display:flex;justify-content:center;gap:18px;margin:24px 0;flex-wrap:wrap;">`;
    [...step.intGroups, ...(step.fracGroups || [])].forEach((g, i) => {
      html += `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;animation:fadeInStep .3s ease forwards;animation-delay:${i * .12}s;opacity:0;">
        <div style="font-size:1.8rem;font-weight:bold;color:var(--accent-green);background:rgba(34,197,94,.12);width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2px solid rgba(34,197,94,.4);">${g.octal}</div>
        <div style="color:var(--text-muted);">↓</div>
        <div style="font-size:1.3rem;letter-spacing:2px;font-family:var(--font-mono);font-weight:bold;padding:9px 13px;background:var(--bg-tertiary);border-radius:8px;">${g.bits}</div>
      </div>`;
    });
    html += `</div><div style="color:var(--text-muted);margin-bottom:8px;">Gabungkan → hapus nol depan:</div>
      <div style="font-size:1.8rem;font-weight:900;color:white;letter-spacing:3px;font-family:var(--font-mono);">${negative ? '-' : ''}${binStr}</div>`;
  }

  html += `</div>`;
  return html;
}

/* ── Render: Binary → Hex or Octal (group view) ── */
function renderGroupStep(binStr, intBin, fracBin, data, n, name, color, negative) {
  const isHex = n === 4;
  const intGroups = isHex ? data.intGroups : data.intGroups;
  const fracGroups = isHex ? data.fracGroups : data.fracGroups;
  const resultStr = isHex ? data.hex : data.octal;

  let html = `<div class="step-detail" style="text-align:center;">
    <h4 class="step-title" style="justify-content:center;color:${color};">✨ Biner → ${name}</h4>
    <p class="step-description">Potong biner menjadi kelompok <strong>${n} bit</strong> dari kanan (integer) dan dari kiri (fraksi), lalu konversi langsung.</p>`;

  // Integer groups
  html += `<div style="font-size:.78rem;color:var(--text-muted);margin-bottom:10px;">Bagian Integer — kelompok ${n}-bit dari kanan:</div>
    <div style="display:flex;justify-content:center;gap:14px;margin-bottom:26px;flex-wrap:wrap;">`;

  intGroups.forEach((g, i) => {
    const val = isHex ? g.hex : g.value;
    html += `<div style="display:flex;flex-direction:column;align-items:center;gap:9px;animation:fadeInStep .3s ease forwards;animation-delay:${i * .1}s;opacity:0;">
      <div style="font-size:1.3rem;letter-spacing:2px;font-family:var(--font-mono);font-weight:bold;padding:9px 13px;background:var(--bg-tertiary);border-radius:8px;">${g.bits}</div>
      <div style="color:var(--text-muted);">↓</div>
      <div style="font-size:1.8rem;font-weight:bold;color:${color};background:rgba(255,255,255,.04);width:54px;height:54px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2px solid ${color.replace(')', ',.45)').replace('var(', 'rgba(').replace('--accent-', '')};">${val}</div>
    </div>`;
  });
  html += `</div>`;

  // Fraction groups (if any)
  if (fracGroups.length) {
    html += `<div style="font-size:.78rem;color:var(--text-muted);margin-bottom:10px;">Bagian Fraksi — kelompok ${n}-bit dari kiri:</div>
      <div style="display:flex;justify-content:center;gap:14px;margin-bottom:26px;flex-wrap:wrap;">`;

    fracGroups.forEach((g, i) => {
      const val = isHex ? g.hex : g.value;
      html += `<div style="display:flex;flex-direction:column;align-items:center;gap:9px;animation:fadeInStep .3s ease forwards;animation-delay:${(intGroups.length + i) * .1}s;opacity:0;">
        <div style="font-size:1.3rem;letter-spacing:2px;font-family:var(--font-mono);font-weight:bold;padding:9px 13px;background:var(--bg-tertiary);border-radius:8px;">${g.bits}</div>
        <div style="color:var(--text-muted);">↓</div>
        <div style="font-size:1.8rem;font-weight:bold;color:${color};background:rgba(255,255,255,.04);width:54px;height:54px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2px solid ${color.replace(')', ',.45)').replace('var(', 'rgba(').replace('--accent-', '')};">${val}</div>
      </div>`;
    });
    html += `</div>`;
  }

  html += `<div style="color:var(--text-muted);margin-bottom:8px;">Hasil Gabungan ${name}:</div>
    <div style="font-size:2.4rem;font-weight:900;color:${color};">${resultStr}</div>
  </div>`;
  return html;
}

/* ── Render: Binary → Decimal (power of 2) ── */
function renderPowerStep(binStr, intBin, fracBin, toDec, negative) {
  const intPos = toDec.intPositions;
  const fracPos = toDec.fracPositions || [];

  let html = `<div class="step-detail" style="text-align:center;">
    <h4 class="step-title" style="justify-content:center;color:var(--accent-pink);">✨ Biner → Desimal</h4>
    <p class="step-description">Tulis nilai pangkat 2 di bawah setiap bit. Jumlahkan semua yang bitnya <strong>= 1</strong>.</p>`;

  // Integer bits
  html += `<div style="font-size:.78rem;color:var(--text-muted);margin-bottom:10px;">Bagian Integer:</div>
    <div style="display:flex;justify-content:center;gap:7px;margin:16px 0;flex-wrap:wrap;">`;

  intPos.forEach((p, i) => {
    const active = p.bit === 1;
    html += `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;animation:fadeInStep .25s ease forwards;animation-delay:${i * .05}s;opacity:0;">
      <div style="font-size:.85rem;font-weight:700;color:${active ? 'var(--accent-pink)' : 'var(--text-muted)'};opacity:${active ? '1' : '.35'};">${p.power}</div>
      <div class="bit-cell ${active ? 'bit-one' : 'bit-zero'}" style="border-color:${active ? 'rgba(236,72,153,.4)' : 'var(--border-subtle)'};${active ? 'background:rgba(236,72,153,.18);color:var(--accent-pink);' : ''}">${p.bit}</div>
    </div>`;
  });
  html += `</div>`;

  // Fraction bits (if any)
  if (fracPos.length) {
    html += `<div style="font-size:.78rem;color:var(--text-muted);margin-top:10px;margin-bottom:10px;">Bagian Fraksi:</div>
      <div style="display:flex;justify-content:center;gap:7px;margin:10px 0;flex-wrap:wrap;">`;

    fracPos.forEach((p, i) => {
      const active = p.bit === 1;
      html += `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;animation:fadeInStep .25s ease forwards;animation-delay:${(intPos.length + i) * .05}s;opacity:0;">
        <div style="font-size:.75rem;font-weight:700;color:${active ? 'var(--accent-orange)' : 'var(--text-muted)'};opacity:${active ? '1' : '.35'};">2<sup>${p.position}</sup></div>
        <div class="bit-cell ${active ? '' : 'bit-zero'}" style="${active ? 'background:rgba(245,158,11,.18);color:var(--accent-orange);border-color:rgba(245,158,11,.4);' : ''}">${p.bit}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // Sum
  const activeInt = intPos.filter(p => p.bit === 1);
  const activeFrac = fracPos.filter(p => p.bit === 1);
  const allActive = [...activeInt, ...activeFrac];

  html += `<div style="background:rgba(0,0,0,.22);padding:18px;border-radius:12px;display:inline-block;margin-top:12px;">
    <div style="color:var(--text-muted);margin-bottom:8px;font-size:.88rem;">Tambahkan yang bernilai 1:</div>
    <div style="font-size:1.05rem;color:white;margin-bottom:8px;">`;

  if (allActive.length > 0) {
    html += allActive.map(p => `<span style="color:var(--accent-pink);font-weight:bold;">${p.power < 1 ? p.power.toFixed(Math.abs(p.position)) : p.power}</span>`).join(' + ');
    html += `<br><div style="font-size:2.2rem;font-weight:900;color:white;margin-top:8px;">= ${fmtDecimal(toDec.decimal)}</div>`;
  } else {
    html += `<div style="font-size:2.2rem;font-weight:900;color:white;">= 0</div>`;
  }

  html += `</div></div></div>`;
  return html;
}

/* ═══════════════════════════════════════════════════════════════
   CHEAT SHEET
═══════════════════════════════════════════════════════════════ */

function buildCheatSheet() {
  const tbody = document.getElementById('cheat-table-body');
  if (!tbody) return;
  let html = '';
  for (let i = 0; i <= 15; i++) {
    html += `<tr>
      <td>${i}</td>
      <td>${i.toString(2).padStart(4, '0')}</td>
      <td>${i.toString(8)}</td>
      <td>${i.toString(16).toUpperCase()}</td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 1 — LATIHAN INTERAKTIF (QUIZ)
═══════════════════════════════════════════════════════════════ */

let quizState = { current: 0, total: 10, correct: 0, wrong: 0, questions: [], answered: false };

function generateQuiz1() {
  const types = [
    { from: 'Desimal', to: 'Biner', fb: 10, tb: 2 },
    { from: 'Biner', to: 'Desimal', fb: 2, tb: 10 },
    { from: 'Desimal', to: 'Heksa', fb: 10, tb: 16 },
    { from: 'Biner', to: 'Heksa', fb: 2, tb: 16 },
    { from: 'Desimal', to: 'Oktal', fb: 10, tb: 8 },
    { from: 'Biner', to: 'Oktal', fb: 2, tb: 8 },
    { from: 'Heksa', to: 'Biner', fb: 16, tb: 2 },
    { from: 'Oktal', to: 'Biner', fb: 8, tb: 2 },
    { from: 'Heksa', to: 'Desimal', fb: 16, tb: 10 },
    { from: 'Oktal', to: 'Desimal', fb: 8, tb: 10 },
  ];
  const qs = [];
  for (let i = 0; i < 10; i++) {
    const t = types[i];
    const dec = Math.floor(Math.random() * 220) + 5;
    const inp = dec.toString(t.fb).toUpperCase();
    const ans = dec.toString(t.tb).toUpperCase();
    qs.push({ from: t.from, to: t.to, fb: t.fb, tb: t.tb, input: inp, answer: ans });
  }
  // shuffle
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }
  return qs;
}

function renderMinggu1Latihan(container) {
  quizState = { current: 0, total: 10, correct: 0, wrong: 0, questions: generateQuiz1(), answered: false };
  container.innerHTML = `
    <div class="week-hero">
      <div class="week-hero-content">
        <h1>🎯 Latihan Konversi Bilangan</h1>
        <p>Uji kemampuan konversi antar basis bilangan. Jawab 10 soal secara interaktif — jawaban langsung dicek!</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">10 Soal</span>
          <span class="tag tag-green">Feedback Langsung</span>
          <span class="tag tag-violet">Skor Otomatis</span>
        </div>
      </div>
    </div>
    <div class="glass-card">
      <div id="quiz1-container"></div>
    </div>`;
  renderQuiz1Question();
}

function renderQuiz1Question() {
  const c = document.getElementById('quiz1-container');
  if (!c) return;
  const q = quizState.questions[quizState.current];
  quizState.answered = false;
  const pct = (quizState.current / quizState.total) * 100;

  c.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
        <span class="quiz-progress-text">${quizState.current + 1} / ${quizState.total}</span>
      </div>
      <div class="quiz-question">Konversikan bilangan berikut:</div>
      <div class="quiz-prompt">
        <span class="from-base">${q.input}</span>
        <span style="color:var(--text-muted);font-size:1rem;margin:0 8px;">(${q.from})</span>
        <span style="color:var(--text-muted);font-size:1.2rem;">→</span>
        <span class="to-base"> ?</span>
        <span style="color:var(--text-muted);font-size:1rem;margin-left:8px;">(${q.to})</span>
      </div>
      <div class="quiz-input-wrap">
        <input type="text" class="quiz-input" id="quiz1-ans" placeholder="Jawaban Anda..." autocomplete="off" spellcheck="false" />
        <button class="quiz-submit-btn" onclick="checkQuiz1()">Cek ✓</button>
      </div>
      <div class="quiz-feedback" id="quiz1-fb"></div>
      <div class="quiz-score">
        <div class="quiz-score-item"><span class="score-correct">✅ Benar: ${quizState.correct}</span></div>
        <div class="quiz-score-item"><span class="score-wrong">❌ Salah: ${quizState.wrong}</span></div>
      </div>
      <div style="text-align:center;">
        <button class="quiz-next-btn hidden" id="quiz1-next" onclick="nextQuiz1()">Soal Berikutnya →</button>
      </div>
    </div>`;

  const inp = document.getElementById('quiz1-ans');
  if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkQuiz1(); }); }
}

function checkQuiz1() {
  if (quizState.answered) return;
  const inp = document.getElementById('quiz1-ans');
  const fb = document.getElementById('quiz1-fb');
  const nxt = document.getElementById('quiz1-next');
  if (!inp || !fb) return;

  const ua = inp.value.trim().toUpperCase().replace(/\s+/g, '');
  const q = quizState.questions[quizState.current];
  if (!ua) return;

  quizState.answered = true;

  if (ua === q.answer) {
    quizState.correct++;
    fb.className = 'quiz-feedback correct';
    fb.textContent = `✅ Benar! ${q.input} (${q.from}) = ${q.answer} (${q.to})`;
  } else {
    quizState.wrong++;
    fb.className = 'quiz-feedback wrong';
    fb.textContent = `❌ Salah. Jawaban benar: ${q.answer} (${q.to}). Anda menjawab: ${ua}`;
  }

  inp.disabled = true;
  if (nxt) {
    nxt.classList.remove('hidden');
    nxt.textContent = quizState.current < quizState.total - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🏆';
  }
}

function nextQuiz1() {
  quizState.current++;
  if (quizState.current >= quizState.total) { showQuiz1Result(); return; }
  renderQuiz1Question();
}

function showQuiz1Result() {
  const c = document.getElementById('quiz1-container');
  if (!c) return;
  const pct = Math.round((quizState.correct / quizState.total) * 100);
  const [emoji, msg] = pct >= 90 ? ['🏆', 'Luar Biasa! Anda menguasai konversi bilangan!'] :
    pct >= 70 ? ['👏', 'Bagus! Terus berlatih!'] :
      pct >= 50 ? ['💪', 'Cukup baik. Ulangi materi lalu coba lagi.'] :
        ['📚', 'Perlu latihan lebih. Review materi konversi.'];

  c.innerHTML = `
    <div class="quiz-card" style="padding:48px;">
      <div style="font-size:68px;margin-bottom:20px;">${emoji}</div>
      <h2 style="font-family:var(--font-heading);font-size:1.75rem;font-weight:800;margin-bottom:8px;">
        Skor: <span class="text-gradient">${pct}%</span>
      </h2>
      <p style="color:var(--text-secondary);margin-bottom:24px;">${msg}</p>
      <div style="display:flex;justify-content:center;gap:40px;margin-bottom:28px;">
        <div style="text-align:center;"><div style="font-size:2.2rem;color:var(--accent-green);font-weight:800;">${quizState.correct}</div><div style="color:var(--text-muted);font-size:.88rem;">Benar</div></div>
        <div style="text-align:center;"><div style="font-size:2.2rem;color:var(--accent-red);font-weight:800;">${quizState.wrong}</div><div style="color:var(--text-muted);font-size:.88rem;">Salah</div></div>
        <div style="text-align:center;"><div style="font-size:2.2rem;color:var(--accent-blue);font-weight:800;">${quizState.total}</div><div style="color:var(--text-muted);font-size:.88rem;">Total</div></div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="convert-btn" onclick="renderMinggu1Latihan(document.getElementById('content-body'))">🔄 Coba Lagi</button>
        <button class="quiz-next-btn" style="margin-top:0;" onclick="navigateTo('minggu1','minggu1-konversi')">📖 Kembali ke Materi</button>
      </div>
    </div>`;
}
