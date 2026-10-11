/**
 * minggu2.js
 * Bilangan Negatif & Aritmatika Biner
 * - 2's Complement dengan animasi step-by-step
 * - MSB merah mencolok
 * - Aritmatika: Pengurangan via Penjumlahan (A - B = A + C2(B))
 * - Konversi hasil biner negatif ke Hex/Oktal/Desimal
 * - [SECRET] Auto Sign-Extension 16-bit jika 8-bit overflow
 * - [SECRET] Dukungan input pecahan/fraksi secara diam-diam
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   HELPER: Bit Display Renderer
═══════════════════════════════════════════════════════════════ */

/**
 * Render deretan bit-cell HTML dari string biner (8 atau 16 bit).
 * bit[0] = MSB → merah.
 * extended=true → bit 0..7 adalah extended bits (ungu dashed)
 */
function renderBitsHTML(bits, { msb = true, extended = false, extendLen = 0, animate = false, delay = 0, idPrefix = '' } = {}) {
  return bits.split('').map((b, i) => {
    let cls = 'bit-cell';
    if (extended && i < extendLen) cls += ' extended-bit';
    else if (msb && i === extendLen) cls += ' msb-bit';
    else if (b === '1') cls += ' bit-one';
    else cls += ' bit-zero';
    if (animate) cls += ' inverting';
    const id = idPrefix ? ` id="${idPrefix}-${i}"` : '';
    const style = animate ? `animation-delay:${delay + i * 40}ms;` : '';
    return `<div class="${cls}"${id} style="${style}">${b}</div>`;
  }).join('');
}

/**
 * Pad biner ke 8-bit, kembali ke string
 */
function pad8(bin) { return bin.padStart(8, '0'); }
function pad16(bin) { return bin.padStart(16, '0'); }

/**
 * Hitung 2's Complement dari biner string positif (8-bit)
 * Mengembalikan: { ones, twos, carry }
 */
function compute2sComplement(bin8) {
  // 1's complement: flip all bits
  const ones = bin8.split('').map(b => b === '0' ? '1' : '0').join('');

  // 2's complement: add 1 to ones
  let arr = ones.split('').map(Number);
  let carry = 1;
  for (let i = arr.length - 1; i >= 0 && carry; i--) {
    const sum = arr[i] + carry;
    arr[i] = sum % 2;
    carry  = Math.floor(sum / 2);
  }
  const twos = arr.join('');
  return { ones, twos, carryOut: carry };
}

/**
 * Tambahkan dua string biner 8-bit, hasilkan 8-bit + carry out
 */
function addBinary8(a, b) {
  let result = '';
  let carry  = 0;
  const steps = [];
  for (let i = 7; i >= 0; i--) {
    const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
    result    = (sum % 2) + result;
    carry     = Math.floor(sum / 2);
    steps.push({ pos: i, a: parseInt(a[i]), b: parseInt(b[i]), sum, bit: sum % 2, carry: Math.floor(sum / 2) });
  }
  return { result, carryOut: carry, steps: steps.reverse() };
}

/**
 * Sign-extend 8-bit ke 16-bit: copy MSB ke upper 8 bits
 * [SECRET] — dipanggil diam-diam saat overflow
 */
function signExtend8to16(bin8) {
  const msb = bin8[0];
  return msb.repeat(8) + bin8;
}

/**
 * Konversi biner string (signed) ke nilai desimal integer (signed)
 * Untuk 8-bit signed atau 16-bit signed
 */
function signedBinToDec(bin) {
  const n = bin.length; // 8 or 16
  const msb = bin[0];
  if (msb === '0') {
    return parseInt(bin, 2);
  } else {
    // negative: compute 2's complement back
    const { twos } = compute2sComplement(bin);
    return -parseInt(twos, 2);
  }
}

/**
 * Biner (unsigned atau signed, boleh ada titik pecahan) → Hex
 * Wraps minggu1's binToHexFull — fungsi ini ada di minggu1.js
 */
function bin8ToFormats(bin8, isNegResult) {
  // Hex: kelompok 4-bit
  const hexGroups  = [bin8.slice(0,4), bin8.slice(4,8)];
  const hexVal     = hexGroups.map(g => parseInt(g, 2).toString(16).toUpperCase()).join('');

  // Octal: pad ke 3*3=9, kelompok 3-bit
  const padded9    = bin8.padStart(9, '0');
  const octGroups  = [padded9.slice(0,3), padded9.slice(3,6), padded9.slice(6,9)];
  const octVal     = octGroups.map(g => parseInt(g, 2).toString()).join('');

  // Decimal: signed interpretation
  const decVal     = signedBinToDec(bin8);

  return { hex: hexVal, octal: octVal, decimal: decVal };
}

function bin16ToFormats(bin16) {
  // Hex: 4 groups of 4-bit
  const hexVal  = [0,4,8,12].map(i => parseInt(bin16.slice(i,i+4),2).toString(16).toUpperCase()).join('');
  // Octal: pad to 18 bits (ceil(16/3)*3)
  const p18     = bin16.padStart(18, '0');
  const octVal  = [0,3,6,9,12,15].map(i => parseInt(p18.slice(i,i+3),2).toString()).join('');
  const decVal  = signedBinToDec(bin16);
  return { hex: hexVal, octal: octVal, decimal: decVal };
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 2 — MATERI BILANGAN NEGATIF
═══════════════════════════════════════════════════════════════ */

function renderMinggu2Materi(container) {
  container.innerHTML = `
    <div class="week-hero">
      <div class="week-hero-content">
        <h1>➖ Bilangan Negatif dalam Sistem Digital</h1>
        <p>Komputer hanya kenal <code style="color:var(--accent-blue)">0</code> dan <code style="color:var(--accent-blue)">1</code>. Bagaimana bilangan negatif disimpan? Pelajari tiga skema representasi dan animasi transisi 2's Complement secara langkah-demi-langkah.</p>
        <div class="week-hero-tags">
          <span class="tag tag-pink">Sign-Magnitude</span>
          <span class="tag tag-green">1's Complement</span>
          <span class="tag tag-blue">2's Complement ★</span>
        </div>
      </div>
    </div>

    <!-- Perbandingan Skema -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">⚖️ Perbandingan Tiga Skema (Representasi 8-bit)</h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="cheat-table" style="width:100%;">
          <thead>
            <tr>
              <th style="background:rgba(100,116,139,.1);color:var(--text-secondary);">Skema</th>
              <th style="background:rgba(100,116,139,.1);color:var(--text-secondary);">Rentang 8-bit</th>
              <th style="background:rgba(100,116,139,.1);color:var(--text-secondary);">Cara Buat −X dari +X</th>
              <th style="background:rgba(100,116,139,.1);color:var(--text-secondary);">Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color:var(--accent-pink);">Sign-Magnitude</strong></td>
              <td>−127 s.d +127</td>
              <td>Ubah MSB (bit paling kiri) menjadi 1</td>
              <td>Ada +0 dan −0</td>
            </tr>
            <tr>
              <td><strong style="color:var(--accent-green);">1's Complement</strong></td>
              <td>−127 s.d +127</td>
              <td>Inversi semua bit (flip 0↔1)</td>
              <td>Masih ada +0 dan −0</td>
            </tr>
            <tr style="background:rgba(0,212,255,.04);">
              <td><strong style="color:var(--accent-blue);">2's Complement ★</strong></td>
              <td>−128 s.d +127</td>
              <td>Inversi semua bit, lalu tambah 1 di LSB</td>
              <td>Hanya satu nol — standar komputer modern</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MSB explanation -->
      <div style="margin-top:20px;padding:16px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.25);border-radius:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div class="bit-cell msb-bit" style="width:36px;height:36px;">1</div>
          <div>
            <strong style="color:var(--accent-red);">MSB (Most Significant Bit)</strong>
            <div style="font-size:.82rem;color:var(--text-secondary);margin-top:2px;">Bit paling kiri (posisi ke-7). Jika MSB = <strong>1</strong> → bilangan <strong>negatif</strong>. Jika MSB = <strong>0</strong> → bilangan <strong>positif</strong>.</div>
          </div>
        </div>
        <div style="display:flex;gap:4px;justify-content:flex-start;align-items:center;flex-wrap:wrap;">
          <div class="bit-cell msb-bit">1</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <div class="bit-cell bit-zero">0</div>
          <span style="color:var(--accent-red);font-weight:700;margin-left:10px;">← MSB = 1 → Negatif!</span>
        </div>
      </div>
    </div>

    <!-- Konverter 2's Complement dengan Animasi -->
    <div class="glass-card mb-28" id="comp2-converter">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🔄 Konverter Animasi 2's Complement (8-bit)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:18px;">
        Masukkan bilangan desimal (rentang −128 hingga 127). Sistem akan menampilkan animasi transisi bertahap dari nilai absolut → 1's Complement → 2's Complement.
      </p>

      <div style="max-width:460px;margin:0 auto;">
        <div class="input-group" style="margin-bottom:14px;">
          <label class="input-label">✏️ Masukkan Bilangan Desimal</label>
          <input type="text" class="input-field" id="m2-neg-input"
            placeholder="Contoh: -13 atau 45" autocomplete="off" spellcheck="false" />
        </div>
        <button class="convert-btn" onclick="m2ConvertNeg()" style="width:100%;">
          <span>⚡</span><span>Animasikan 2's Complement</span>
        </button>
      </div>

      <div id="m2-neg-result" style="display:none;margin-top:24px;"></div>
    </div>
  `;

  const inp = document.getElementById('m2-neg-input');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') m2ConvertNeg(); });
}

/* ─── Konversi & Animasi 2's Complement ─── */
function m2ConvertNeg() {
  const inp = document.getElementById('m2-neg-input');
  if (!inp) return;

  // Silent support for fractions too (Secret Feature #1 applied to M2 input)
  let raw = inp.value.trim().replace(',', '.');
  if (!raw) return;

  const val = parseFloat(raw);
  if (isNaN(val)) {
    inp.style.borderColor = 'var(--accent-red)';
    setTimeout(() => inp.style.borderColor = '', 1400);
    return;
  }

  // For 2's complement display: use integer part only for the bit representation
  // but show the actual value
  const intVal = Math.round(val); // silently round fractions for 8-bit representation

  // Handle out of range silently by using the actual binary
  const result = document.getElementById('m2-neg-result');
  if (!result) return;

  const absVal = Math.abs(intVal);
  const binAbs = pad8(absVal.toString(2));
  const negative = intVal < 0;

  let sm, ones, twos, special = false;

  if (intVal === -128) {
    special = true;
    sm   = 'N/A';
    ones = 'N/A';
    twos = '10000000';
  } else if (negative) {
    sm   = '1' + binAbs.slice(1);
    const { ones: o, twos: t } = compute2sComplement(binAbs);
    ones = o;
    twos = t;
  } else {
    sm   = binAbs;
    ones = binAbs;
    twos = binAbs;
  }

  // Get multi-format for 2's complement result
  const formats = negative ? bin8ToFormats(twos, true) : bin8ToFormats(binAbs, false);

  // Build animated HTML
  result.style.display = 'block';
  result.style.opacity = '0';

  let html = ``;

  // ── Step panels ──
  if (!special) {
    // Step 0: Original positive binary
    html += `
    <div style="margin-bottom:20px;">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px;">
        Langkah 1 — Tulis biner positif (|${intVal}| = ${absVal})
      </div>
      <div class="comp-step active-step">
        <div class="comp-step-label" style="color:var(--accent-green);">Nilai Absolut: +${absVal}</div>
        <div class="bits-row" id="bits-abs">
          ${renderBitsHTML(binAbs, { msb: false })}
        </div>
      </div>
    </div>`;

    if (negative) {
      // Step 1: 1's Complement (inversi semua bit)
      html += `
      <div style="margin-bottom:20px;">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px;">
          Langkah 2 — 1's Complement (inversi semua bit: 0→1, 1→0)
        </div>
        <div class="comp-step">
          <div class="comp-step-label" style="color:var(--accent-green);">1's Complement</div>
          <div class="bits-row" id="bits-ones">
            ${ones.split('').map((b, i) =>
              `<div class="bit-cell ${b === '1' ? 'bit-one' : 'bit-zero'}" style="animation:fadeInStep .35s ease forwards;animation-delay:${i * 60}ms;opacity:0;">${b}</div>`
            ).join('')}
          </div>
        </div>
      </div>`;

      // Step 2: 2's Complement (+1 LSB)
      html += `
      <div style="margin-bottom:20px;">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px;">
          Langkah 3 — 2's Complement (tambah 1 pada LSB)
        </div>
        <div class="comp-step" style="border-color:rgba(0,212,255,.35);background:rgba(0,212,255,.04);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
            <div style="font-size:.78rem;color:var(--text-muted);">${ones} + 1 =</div>
            <div class="carry-indicator">+1</div>
          </div>
          <div class="comp-step-label" style="color:var(--accent-blue);">2's Complement (Hasil Akhir)</div>
          <div class="bits-row" id="bits-twos">
            ${twos.split('').map((b, i) =>
              `<div class="bit-cell ${i === 0 ? 'msb-bit' : (b === '1' ? 'bit-one' : 'bit-zero')}" style="animation:fadeInStep .35s ease forwards;animation-delay:${i * 50 + 500}ms;opacity:0;">${b}</div>`
            ).join('')}
          </div>
        </div>
      </div>`;
    } else {
      html += `<div style="padding:14px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.25);border-radius:10px;margin-bottom:20px;font-size:.88rem;color:var(--text-secondary);">
        ✅ Bilangan positif — Sign-Magnitude, 1's Complement, dan 2's Complement semuanya sama dengan representasi biner biasanya.
      </div>`;
    }
  } else {
    html += `<div style="padding:14px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.25);border-radius:10px;margin-bottom:20px;font-size:.88rem;color:var(--text-secondary);">
      ⚠️ Nilai −128 adalah batas bawah 8-bit signed integer. Representasinya adalah <strong style="font-family:var(--font-mono);color:white;letter-spacing:2px;">10000000</strong>.
    </div>`;
  }

  // ── Result Cards ──
  html += `
  <div style="margin-top:4px;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:12px;">Hasil Representasi 8-bit</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;min-width:170px;background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.3);border-radius:12px;padding:16px;text-align:center;">
        <div style="color:var(--accent-pink);font-size:.78rem;font-weight:700;text-transform:uppercase;margin-bottom:8px;">Sign-Magnitude</div>
        <div style="font-family:var(--font-mono);font-size:1.3rem;letter-spacing:2px;font-weight:700;">${sm}</div>
      </div>
      <div style="flex:1;min-width:170px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:16px;text-align:center;">
        <div style="color:var(--accent-green);font-size:.78rem;font-weight:700;text-transform:uppercase;margin-bottom:8px;">1's Complement</div>
        <div style="font-family:var(--font-mono);font-size:1.3rem;letter-spacing:2px;font-weight:700;">${ones}</div>
      </div>
      <div style="flex:1;min-width:170px;background:rgba(0,212,255,.07);border:1px solid rgba(0,212,255,.3);border-radius:12px;padding:16px;text-align:center;">
        <div style="color:var(--accent-blue);font-size:.78rem;font-weight:700;text-transform:uppercase;margin-bottom:8px;">2's Complement ★</div>
        <div style="font-family:var(--font-mono);font-size:1.3rem;letter-spacing:2px;font-weight:700;">${twos}</div>
      </div>
    </div>
  </div>

  <!-- Multi-format conversion of 2's complement result -->
  <div style="margin-top:20px;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Konversi Hasil 2's Complement ke Format Lain</div>
    <div class="result-multi">
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-violet);">Heksadesimal</div>
        <div class="result-multi-value">${formats.hex}</div>
      </div>
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-green);">Oktal</div>
        <div class="result-multi-value">${formats.octal.replace(/^0+/, '') || '0'}</div>
      </div>
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-pink);">Desimal (Signed)</div>
        <div class="result-multi-value">${formats.decimal}</div>
      </div>
    </div>
  </div>`;

  result.innerHTML = html;
  setTimeout(() => {
    result.style.transition = 'opacity .4s ease';
    result.style.opacity = '1';
  }, 50);
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 2 — ARITMATIKA BINER (A op B)
═══════════════════════════════════════════════════════════════ */

function renderMinggu2Aritmatika(container) {
  container.innerHTML = `
    <div class="week-hero">
      <div class="week-hero-content">
        <h1>🧮 Aritmatika Biner &amp; Pengurangan via Penjumlahan</h1>
        <p>Komputer tidak punya unit pengurangan tersendiri — ia mengubah <strong>A − B</strong> menjadi <strong>A + (−B)</strong> dengan menggunakan <strong>2's Complement dari B</strong>.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">A + B</span>
          <span class="tag tag-pink">A − B = A + C2(B)</span>
          <span class="tag tag-orange">Overflow Handler</span>
        </div>
      </div>
    </div>

    <!-- Teori -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Rumus Pengurangan via Penjumlahan</h3>
      </div>
      <div style="background:rgba(0,212,255,.05);border-left:4px solid var(--accent-blue);padding:18px;border-radius:8px;margin-bottom:18px;">
        <div style="font-family:var(--font-mono);font-size:1.35rem;font-weight:800;color:white;margin-bottom:8px;">A − B = A + C2(B)</div>
        <div style="font-size:.88rem;color:var(--text-secondary);">
          dimana <strong style="color:var(--accent-blue)">C2(B)</strong> adalah 2's Complement dari B.
        </div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:240px;background:rgba(0,212,255,.05);border:1px solid rgba(0,212,255,.2);border-radius:10px;padding:16px;">
          <h4 style="color:var(--accent-blue);margin-bottom:12px;">Penjumlahan A + B</h4>
          <ol style="color:var(--text-secondary);font-size:.85rem;padding-left:18px;line-height:2;">
            <li>Konversi A dan B ke biner 8-bit</li>
            <li>Tambahkan bit per bit dari LSB</li>
            <li>Bawa carry jika ada</li>
          </ol>
        </div>
        <div style="flex:1;min-width:240px;background:rgba(236,72,153,.05);border:1px solid rgba(236,72,153,.2);border-radius:10px;padding:16px;">
          <h4 style="color:var(--accent-pink);margin-bottom:12px;">Pengurangan A − B</h4>
          <ol style="color:var(--text-secondary);font-size:.85rem;padding-left:18px;line-height:2;">
            <li>Konversi B ke 2's Complement</li>
            <li>Tambahkan A + C2(B)</li>
            <li>Abaikan carry out (untuk bilangan signed)</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Kalkulator Interaktif -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">⚡ Kalkulator Aritmatika Biner 8-bit</h3>
      </div>

      <div style="max-width:520px;margin:0 auto;">
        <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label class="input-label">Operand A</label>
            <input type="text" class="input-field" id="m2-arith-a" placeholder="misal: 18" autocomplete="off" />
          </div>
          <div style="margin-bottom:10px;">
            <div style="display:flex;gap:6px;">
              <button class="base-btn ${true ? 'active' : ''}" id="op-add" onclick="selectArithOp('+')" style="min-width:48px;">＋</button>
              <button class="base-btn" id="op-sub" onclick="selectArithOp('-')" style="min-width:48px;">－</button>
            </div>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label class="input-label">Operand B</label>
            <input type="text" class="input-field" id="m2-arith-b" placeholder="misal: 25" autocomplete="off" />
          </div>
        </div>
        <button class="convert-btn" onclick="m2DoArith()" style="width:100%;">
          <span>⚡</span><span>Hitung &amp; Animasikan</span>
        </button>
      </div>

      <div id="m2-arith-result" style="display:none;margin-top:24px;"></div>
    </div>
  `;

  // Set default op
  window._arithOp = '+';

  // Enter key
  ['m2-arith-a','m2-arith-b'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') m2DoArith(); });
  });
}

let _arithOp = '+';

function selectArithOp(op) {
  _arithOp = op;
  const addBtn = document.getElementById('op-add');
  const subBtn = document.getElementById('op-sub');
  if (addBtn) addBtn.classList.toggle('active', op === '+');
  if (subBtn) subBtn.classList.toggle('active', op === '-');
}

function m2DoArith() {
  const rawA = document.getElementById('m2-arith-a')?.value.trim().replace(',', '.') || '';
  const rawB = document.getElementById('m2-arith-b')?.value.trim().replace(',', '.') || '';
  if (!rawA || !rawB) return;

  // [SECRET] — silently round fractional inputs for 8-bit arithmetic
  const valA = Math.round(parseFloat(rawA));
  const valB = Math.round(parseFloat(rawB));

  if (isNaN(valA) || isNaN(valB)) return;

  const op    = _arithOp;
  const result = document.getElementById('m2-arith-result');
  if (!result) return;

  // Convert A and B to signed 8-bit binary
  const binA8 = getSignedBin8(valA);
  const binB8 = getSignedBin8(valB);

  // If subtracting: get 2's complement of B
  const isSubtraction = op === '-';
  let binB_eff = binB8; // effective B used in addition
  let c2B = null;

  if (isSubtraction) {
    // 2's complement of B: we need the complement of the absolute value,
    // but since valB could be any signed value, we do complement of binB8
    const { ones, twos } = compute2sComplement(binB8);
    c2B = { original: binB8, ones, twos };
    binB_eff = twos;
  }

  // Perform binary addition: A + B_eff
  const { result: sumBin8, carryOut, steps: addSteps } = addBinary8(binA8, binB_eff);

  // ── Determine true result ──
  const expectedDecResult = isSubtraction ? valA - valB : valA + valB;

  // Detect overflow (8-bit signed overflow)
  // Overflow if two same-sign operands produce different sign result
  const signA    = binA8[0]    === '1';
  const signBeff = binB_eff[0] === '1';
  const signR    = sumBin8[0]  === '1';
  const overflow8 = (signA === signBeff) && (signA !== signR);

  // [SECRET] Auto Sign Extension: if overflow, extend to 16-bit silently
  let finalBin, is16bit, bin16;
  if (overflow8) {
    // Sign-extend both operands to 16-bit and redo addition
    const binA16 = signExtend8to16(binA8);
    const binBeff16 = signExtend8to16(binB_eff);
    // add 16-bit
    const { result: r16, carryOut: co16 } = addBinary16(binA16, binBeff16);
    bin16   = r16;
    finalBin = r16;
    is16bit  = true;
  } else {
    finalBin = sumBin8;
    is16bit  = false;
  }

  // Get decimal result from binary
  const decResult = is16bit ? signedBinToDec(bin16) : signedBinToDec(sumBin8);

  // Multi-format results
  const fmt = is16bit ? bin16ToFormats(bin16) : bin8ToFormats(sumBin8, sumBin8[0] === '1');

  // Build result HTML
  result.style.display = 'block';
  result.style.opacity = '0';

  let html = ``;

  // Operasi label
  html += `<div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:6px;">Operasi</div>
    <div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:800;color:white;">${valA} ${op} ${valB} = <span style="color:var(--accent-blue)">${decResult}</span></div>
  </div>`;

  // Step 1: Konversi ke biner
  html += `<div style="margin-bottom:20px;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Langkah 1 — Konversi ke Biner 8-bit</div>
    <div style="background:var(--bg-tertiary);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div class="arith-row">
        <div class="arith-label">A = ${valA}</div>
        ${renderBitsHTML(binA8, { msb: true })}
      </div>
      <div class="arith-row">
        <div class="arith-label">B = ${valB}</div>
        ${renderBitsHTML(binB8, { msb: true })}
      </div>
    </div>
  </div>`;

  // Step 2 (jika pengurangan): 2's complement dari B
  if (isSubtraction && c2B) {
    html += `<div style="margin-bottom:20px;">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Langkah 2 — 2's Complement dari B (membuat −B)</div>
      <div style="background:var(--bg-tertiary);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:6px;">B asli:</div>
          <div class="bits-row" style="justify-content:flex-start;gap:3px;padding:0;">${renderBitsHTML(c2B.original, { msb: true })}</div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--accent-green);margin-bottom:6px;">1's Complement (inversi semua bit):</div>
          <div class="bits-row" style="justify-content:flex-start;gap:3px;padding:0;">
            ${c2B.ones.split('').map((b, i) =>
              `<div class="bit-cell ${b === '1' ? 'bit-one' : 'bit-zero'}" style="animation:fadeInStep .3s ease forwards;animation-delay:${i*45}ms;opacity:0;">${b}</div>`
            ).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--accent-blue);margin-bottom:6px;">2's Complement (tambah 1 di LSB) = <span style="font-family:var(--font-mono)">−B</span>:</div>
          <div class="bits-row" style="justify-content:flex-start;gap:3px;padding:0;">
            ${c2B.twos.split('').map((b, i) =>
              `<div class="bit-cell ${i === 0 ? 'msb-bit' : (b === '1' ? 'bit-one' : 'bit-zero')}" style="animation:fadeInStep .3s ease forwards;animation-delay:${i*40+400}ms;opacity:0;">${b}</div>`
            ).join('')}
            <span class="carry-indicator" style="margin-left:8px;animation:carryPop .5s ease forwards .7s;opacity:0;">+1</span>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Step 3: Penjumlahan biner
  html += `<div style="margin-bottom:20px;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Langkah ${isSubtraction ? '3' : '2'} — Penjumlahan Biner</div>
    <div style="background:var(--bg-tertiary);border-radius:10px;padding:16px;">
      <div class="arith-row" style="margin-bottom:8px;">
        <div class="arith-label" style="color:var(--accent-blue);">${isSubtraction ? 'A' : 'A'}</div>
        ${renderBitsHTML(binA8, { msb: true })}
      </div>
      <div class="arith-row" style="margin-bottom:8px;">
        <div class="arith-label" style="color:${isSubtraction ? 'var(--accent-pink)' : 'var(--accent-blue)'};">${isSubtraction ? 'C2(B)' : 'B'}</div>
        ${renderBitsHTML(binB_eff, { msb: true })}
        <span class="arith-op-sign" style="color:var(--accent-blue);margin-left:10px;">+</span>
      </div>
      <div class="arith-separator"></div>
      <div class="arith-row" style="margin-top:8px;">
        <div class="arith-label" style="color:${is16bit ? 'var(--accent-purple)' : (sumBin8[0]==='1' ? 'var(--accent-red)' : 'var(--accent-green)')};">Hasil 8-bit</div>
        ${renderBitsHTML(sumBin8, { msb: true })}
        ${carryOut ? `<span style="font-family:var(--font-mono);font-size:.75rem;color:var(--text-muted);margin-left:8px;">carry=${carryOut}</span>` : ''}
      </div>
    </div>
  </div>`;

  // Step 4: Hasil akhir (8-bit or 16-bit)
  if (is16bit) {
    // [SECRET] — 16-bit result displayed elegantly, no "overflow" label
    html += `<div style="margin-bottom:20px;">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Langkah 4 — Hasil Akhir (Extended 16-bit)</div>
      <div class="result-16bit-wrap">
        <div class="result-16bit-label">Representasi 16-bit</div>
        <div class="bits-row" style="justify-content:center;flex-wrap:wrap;gap:3px;">
          ${renderBitsHTML(bin16, { msb: true, extended: true, extendLen: 8 })}
        </div>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:8px;font-size:.7rem;color:var(--text-muted);">
          <span style="color:var(--accent-purple);">■ Extended (bit 15–8)</span>
          <span style="color:var(--accent-red);">■ MSB</span>
          <span style="color:var(--accent-blue);">■ Bit = 1</span>
        </div>
      </div>
    </div>`;
  }

  // Multi-format result
  html += `<div style="margin-bottom:8px;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px;">Konversi Hasil ke Format Lain</div>
    <div class="result-multi">
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-violet);">Heksadesimal</div>
        <div class="result-multi-value">${fmt.hex}</div>
      </div>
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-green);">Oktal</div>
        <div class="result-multi-value">${fmt.octal.replace(/^0+/,'') || '0'}</div>
      </div>
      <div class="result-multi-card">
        <div class="result-multi-label" style="color:var(--accent-pink);">Desimal</div>
        <div class="result-multi-value">${decResult}</div>
      </div>
    </div>
  </div>`;

  result.innerHTML = html;
  setTimeout(() => {
    result.style.transition = 'opacity .4s ease';
    result.style.opacity = '1';
  }, 50);
}

/* ─── Binary Arithmetic Helpers ─── */

function getSignedBin8(val) {
  if (val >= 0) return pad8(val.toString(2));
  // negative: use 2's complement
  const abs = Math.abs(val);
  const { twos } = compute2sComplement(pad8(abs.toString(2)));
  return twos;
}

function addBinary16(a, b) {
  let result = '', carry = 0;
  for (let i = 15; i >= 0; i--) {
    const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
    result = (sum % 2) + result;
    carry  = Math.floor(sum / 2);
  }
  return { result, carryOut: carry };
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 2 — LATIHAN INTERAKTIF (QUIZ)
═══════════════════════════════════════════════════════════════ */

let quiz2State = { current: 0, total: 10, correct: 0, wrong: 0, questions: [], answered: false };

function generateQuiz2() {
  const qs = [];

  // 5 soal 2's complement
  for (let i = 0; i < 5; i++) {
    const n   = Math.floor(Math.random() * 120) + 1;
    const abs = pad8(n.toString(2));
    const { twos } = compute2sComplement(abs);
    qs.push({
      type: '2s',
      question: `Representasi 2's Complement (8-bit) dari bilangan desimal <strong style="color:var(--accent-pink);font-size:1.4rem;">−${n}</strong>?`,
      answer: twos,
      hint: `Biner +${n} = ${abs} → inversi bit → ${compute2sComplement(abs).ones} → tambah 1 = ${twos}`
    });
  }

  // 5 soal aritmatika biner
  for (let i = 0; i < 5; i++) {
    const a  = Math.floor(Math.random() * 50) + 5;
    const b  = Math.floor(Math.random() * 50) + 5;
    const op = Math.random() > 0.5 ? '+' : '-';
    const r  = op === '+' ? a + b : a - b;
    let ans;
    if (r >= 0) ans = pad8(r.toString(2));
    else { const { twos } = compute2sComplement(pad8(Math.abs(r).toString(2))); ans = twos; }

    qs.push({
      type: 'arith',
      question: `Hasil <strong style="color:var(--accent-blue);font-size:1.4rem;">${a} ${op} ${b}</strong> dalam 2's Complement 8-bit?`,
      answer: ans,
      hint: `Hasil desimal = ${r}. Dalam 8-bit 2's complement = ${ans}`
    });
  }

  // Shuffle
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }
  return qs;
}

function renderMinggu2Latihan(container) {
  quiz2State = { current: 0, total: 10, correct: 0, wrong: 0, questions: generateQuiz2(), answered: false };
  container.innerHTML = `
    <div class="week-hero">
      <div class="week-hero-content">
        <h1>🎯 Latihan Aritmatika &amp; 2's Complement</h1>
        <p>Uji pemahaman tentang bilangan negatif dan aritmatika biner 8-bit. Format jawaban: 8 digit biner (contoh: <code style="color:var(--accent-blue)">11110011</code>).</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">10 Soal</span>
          <span class="tag tag-violet">Format 8-bit</span>
          <span class="tag tag-green">Feedback Lengkap</span>
        </div>
      </div>
    </div>
    <div class="glass-card">
      <div id="quiz2-container"></div>
    </div>`;
  renderQuiz2Question();
}

function renderQuiz2Question() {
  const c = document.getElementById('quiz2-container');
  if (!c) return;
  const q   = quiz2State.questions[quiz2State.current];
  quiz2State.answered = false;
  const pct = (quiz2State.current / quiz2State.total) * 100;

  c.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
        <span class="quiz-progress-text">${quiz2State.current + 1} / ${quiz2State.total}</span>
      </div>
      <div class="quiz-question" style="font-size:1.15rem;margin-bottom:22px;">${q.question}</div>
      <div class="quiz-input-wrap" style="max-width:360px;margin:0 auto 18px;">
        <input type="text" class="quiz-input" id="quiz2-ans" placeholder="xxxxxxxx (8 bit biner)" autocomplete="off" spellcheck="false" />
        <button class="quiz-submit-btn" onclick="checkQuiz2()">Cek ✓</button>
      </div>
      <div class="quiz-feedback" id="quiz2-fb" style="max-width:500px;margin:0 auto 14px;"></div>
      <div class="quiz-score" style="justify-content:center;margin-bottom:18px;">
        <div class="quiz-score-item"><span class="score-correct">✅ Benar: ${quiz2State.correct}</span></div>
        <div class="quiz-score-item"><span class="score-wrong">❌ Salah: ${quiz2State.wrong}</span></div>
      </div>
      <div style="text-align:center;">
        <button class="quiz-next-btn hidden" id="quiz2-next" onclick="nextQuiz2()">Soal Berikutnya →</button>
      </div>
    </div>`;

  const inp = document.getElementById('quiz2-ans');
  if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkQuiz2(); }); }
}

function checkQuiz2() {
  if (quiz2State.answered) return;
  const inp = document.getElementById('quiz2-ans');
  const fb  = document.getElementById('quiz2-fb');
  const nxt = document.getElementById('quiz2-next');
  if (!inp || !fb) return;

  const ua = inp.value.trim().replace(/\s+/g, '');
  const q  = quiz2State.questions[quiz2State.current];
  if (!ua) return;

  quiz2State.answered = true;

  if (ua === q.answer) {
    quiz2State.correct++;
    fb.className = 'quiz-feedback correct';
    fb.innerHTML = `✅ Benar!<br><span style="font-size:.85rem;color:var(--text-muted);display:inline-block;margin-top:6px;">${q.hint}</span>`;
  } else {
    quiz2State.wrong++;
    fb.className = 'quiz-feedback wrong';
    fb.innerHTML = `❌ Salah. Jawaban benar: <strong style="font-family:var(--font-mono);letter-spacing:1px;">${q.answer}</strong><br><span style="font-size:.85rem;color:rgba(255,255,255,.7);display:inline-block;margin-top:6px;">${q.hint}</span>`;
  }

  inp.disabled = true;
  if (nxt) {
    nxt.classList.remove('hidden');
    nxt.textContent = quiz2State.current < quiz2State.total - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🏆';
  }
}

function nextQuiz2() {
  quiz2State.current++;
  if (quiz2State.current >= quiz2State.total) { showQuiz2Result(); return; }
  renderQuiz2Question();
}

function showQuiz2Result() {
  const c = document.getElementById('quiz2-container');
  if (!c) return;
  const pct = Math.round((quiz2State.correct / quiz2State.total) * 100);
  const [emoji, msg] = pct >= 90 ? ['🏆', "Luar Biasa! Anda menguasai 2's Complement!"] :
                       pct >= 70 ? ['👏', 'Bagus! Terus berlatih!'] :
                       pct >= 50 ? ['💪', 'Cukup baik. Review materi dan coba lagi.'] :
                                   ['📚', 'Perlu latihan lebih. Review materi Minggu 2.'];

  c.innerHTML = `
    <div class="quiz-card" style="padding:48px;text-align:center;">
      <div style="font-size:68px;margin-bottom:20px;">${emoji}</div>
      <h2 style="font-family:var(--font-heading);font-size:1.75rem;font-weight:800;margin-bottom:8px;">
        Skor: <span class="text-gradient">${pct}%</span>
      </h2>
      <p style="color:var(--text-secondary);margin-bottom:24px;">${msg}</p>
      <div style="display:flex;justify-content:center;gap:40px;margin-bottom:28px;">
        <div style="text-align:center;"><div style="font-size:2.2rem;color:var(--accent-green);font-weight:800;">${quiz2State.correct}</div><div style="color:var(--text-muted);font-size:.88rem;">Benar</div></div>
        <div style="text-align:center;"><div style="font-size:2.2rem;color:var(--accent-red);font-weight:800;">${quiz2State.wrong}</div><div style="color:var(--text-muted);font-size:.88rem;">Salah</div></div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="convert-btn" onclick="renderMinggu2Latihan(document.getElementById('content-body'))">🔄 Ulangi Latihan</button>
        <button class="quiz-next-btn" style="margin-top:0;" onclick="navigateTo('minggu2','minggu2-aritmatika')">📖 Kembali ke Materi</button>
      </div>
    </div>`;
}
