/**
 * minggu3.js
 * Simulator Gerbang Logika & Aljabar Boolean
 * - Visualisasi variabel & operator
 * - Penyederhanaan ekspresi (Hukum Boolean)
 * - Tabel kebenaran real-time & konversi SOP/POS
 * - [SECRET] Auto Universal Gates Renderer (NAND/NOR) di latar belakang
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   CORE ENGINE: LOGIC PARSER & TRUTH TABLE
═══════════════════════════════════════════════════════════════ */

function tokenize(expr) {
    expr = expr.toUpperCase().replace(/\s+/g, '');
    const tokens = [];
    for (let i = 0; i < expr.length; i++) {
        let char = expr[i];
        if (/[A-Z]/.test(char)) {
            tokens.push({ type: 'VAR', val: char });
        } else if (char === '+' || char === '|') {
            tokens.push({ type: 'OR', val: 'OR' });
        } else if (char === '*' || char === '&') {
            tokens.push({ type: 'AND', val: 'AND' });
        } else if (char === '!' || char === '~' || char === "'") {
            tokens.push({ type: 'NOT', val: 'NOT' });
        } else if (char === '^') {
            tokens.push({ type: 'XOR', val: 'XOR' });
        } else if (char === '(' || char === ')') {
            tokens.push({ type: 'PAREN', val: char });
        }
    }
    return tokens;
}

function evaluateTokens(tokens, env) {
    const precedence = { 'NOT': 3, 'AND': 2, 'OR': 1, 'XOR': 1 };
    const output = [];
    const ops = [];

    for (let t of tokens) {
        if (t.type === 'VAR') {
            output.push(env[t.val] ? 1 : 0);
        } else if (t.type === 'NOT' || t.type === 'AND' || t.type === 'OR' || t.type === 'XOR') {
            while (ops.length > 0 && ops[ops.length - 1].type !== 'PAREN' && 
                   precedence[ops[ops.length - 1].val] >= precedence[t.val]) {
                output.push(ops.pop());
            }
            ops.push(t);
        } else if (t.val === '(') {
            ops.push(t);
        } else if (t.val === ')') {
            while (ops.length > 0 && ops[ops.length - 1].val !== '(') {
                output.push(ops.pop());
            }
            ops.pop(); // remove '('
        }
    }
    while (ops.length > 0) {
        output.push(ops.pop());
    }

    const stack = [];
    for (let t of output) {
        if (typeof t === 'number') {
            stack.push(t);
        } else if (t.type === 'NOT') {
            const a = stack.pop();
            stack.push(a === 1 ? 0 : 1);
        } else if (t.type === 'AND') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a & b);
        } else if (t.type === 'OR') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a | b);
        } else if (t.type === 'XOR') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a ^ b);
        }
    }
    return stack[0] || 0;
}

function getVariables(expr) {
    const vars = new Set();
    const tokens = tokenize(expr);
    tokens.forEach(t => { if (t.type === 'VAR') vars.add(t.val); });
    return Array.from(vars).sort();
}

function generateTruthTable(expr) {
    const vars = getVariables(expr);
    if (vars.length === 0) return null;
    const rows = Math.pow(2, vars.length);
    const table = [];
    for (let i = 0; i < rows; i++) {
        const env = {};
        for (let j = 0; j < vars.length; j++) {
            env[vars[j]] = (i >> (vars.length - j - 1)) & 1;
        }
        const res = evaluateTokens(tokenize(expr), env);
        table.push({ env, result: res });
    }
    return { vars, table };
}

function generateSOPPOS(tt) {
    let sop = [], pos = [];
    const vars = tt.vars;
    tt.table.forEach((row, i) => {
        if (row.result === 1) {
            let term = vars.map(v => row.env[v] ? v : v + "'").join('');
            sop.push(term);
        } else {
            let term = '(' + vars.map(v => row.env[v] ? v + "'" : v).join('+') + ')';
            pos.push(term);
        }
    });
    return { 
        sop: sop.length > 0 ? sop.join(' + ') : '0', 
        pos: pos.length > 0 ? pos.join(' * ') : '1'
    };
}

/* ═══════════════════════════════════════════════════════════════
   [SECRET] UNIVERSAL GATES RENDERER (NAND / NOR)
═══════════════════════════════════════════════════════════════ */
function toNandEquivalent(expr) {
    // Secret silent renderer function for complex expressions.
    // Converts basic logic silently to NAND/NOR constructs.
    // This runs automatically for expressions length > 15
    return `<div style="padding:10px;border-left:2px solid var(--accent-violet);font-family:var(--font-mono);font-size:0.7rem;color:transparent;user-select:none;">
        [SECRET: AUTO-RENDERED VIA UNIVERSAL NAND/NOR GATES] ${expr.replace(/\*/g, ' NAND ').replace(/\+/g, ' NOR ')}
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   LAB SIMULATOR ENGINE: GATE TESTING & PRONUNCIATION
   ═══════════════════════════════════════════════════════════════ */

let currentLabGate = 'AND';
let labInputA = 1;
let labInputB = 0;

function computeLabGate(gate, a, b) {
  let y = 0;
  let formulaMath = '';
  let formulaKeyboard = '';
  let readAloud = '';
  let explanation = '';
  let formalName = '';
  let symbolDesc = '';

  switch(gate) {
    case 'AND':
      y = a & b;
      formalName = 'AND (Konjungsi / Perkalian Logika)';
      formulaMath = `Y = A • B = ${a} • ${b} = ${y}`;
      formulaKeyboard = `Y = A * B = ${a} * ${b} = ${y}`;
      symbolDesc = 'Simbol perkalian: [ * ] atau [ • ] atau [ & ] mewakili operasi AND.';
      if (a === 1 && b === 1) {
        readAloud = '"Satu AND Satu menghasilkan Satu"';
        explanation = 'Kedua input A dan B bernilai 1 (HIGH), sehingga syarat konjungsi gerbang AND terpenuhi penuh dan arus logika mengalir (Output = 1 / Lampu LED Menyala).';
      } else {
        readAloud = `"${a ? 'Satu' : 'Nol'} AND ${b ? 'Satu' : 'Nol'} menghasilkan Nol"`;
        explanation = `Karena ada input yang bernilai 0 (yaitu ${a === 0 && b === 0 ? 'kedua input A dan B' : (a === 0 ? 'Input A' : 'Input B')}), maka gerbang AND memutus aliran logika (Output = 0 / Lampu LED Mati). Prinsip AND: wajib SEMUA input bernilai 1 untuk menghasilkan 1.`;
      }
      break;

    case 'OR':
      y = a | b;
      formalName = 'OR (Disjungsi / Penjumlahan Logika)';
      formulaMath = `Y = A + B = ${a} + ${b} = ${y}`;
      formulaKeyboard = `Y = A + B = ${a} + ${b} = ${y}`;
      symbolDesc = 'Simbol penjumlahan: [ + ] atau [ | ] mewakili operasi OR.';
      if (y === 1) {
        readAloud = `"${a ? 'Satu' : 'Nol'} OR ${b ? 'Satu' : 'Nol'} menghasilkan Satu"`;
        explanation = `Syarat gerbang OR terpenuhi karena ${a === 1 && b === 1 ? 'kedua input A dan B' : `salah satu input (${a === 1 ? 'Input A' : 'Input B'})`} bernilai 1 (HIGH). Prinsip OR: jika MINIMAL SATU input aktif, arus mengalir ke output (Output = 1 / Lampu LED Menyala).`;
      } else {
        readAloud = '"Nol OR Nol menghasilkan Nol"';
        explanation = 'Kedua input bernilai 0 (LOW), tidak ada tegangan atau sinyal pemicu pada gerbang OR, sehingga output tetap bernilai 0 (Lampu LED Mati).';
      }
      break;

    case 'NOT':
      y = a === 1 ? 0 : 1;
      formalName = 'NOT (Inverter / Negasi / Komplemen)';
      formulaMath = `Y = A' = ${a}' = ${y}`;
      formulaKeyboard = `Y = !A atau A' = !${a} = ${y}`;
      symbolDesc = "Simbol aksen [ ' ] atau tanda seru [ ! ] atau tilde [ ~ ] mewakili inverter / negasi.";
      readAloud = `"NOT ${a ? 'Satu' : 'Nol'} menghasilkan ${y ? 'Satu' : 'Nol'}"`;
      explanation = `Gerbang NOT bertindak sebagai pembalik logika (Inverter). Input bernilai ${a} (${a ? 'HIGH/Aktif' : 'LOW/Mati'}) dibalikkan secara komplementer menjadi ${y} (${y ? 'HIGH/Menyala' : 'LOW/Mati'}).`;
      break;

    case 'XOR':
      y = a ^ b;
      formalName = 'XOR (Exclusive OR / Detektor Perbedaan)';
      formulaMath = `Y = A ⊕ B = ${a} ⊕ ${b} = ${y}`;
      formulaKeyboard = `Y = A ^ B = ${a} ^ ${b} = ${y}`;
      symbolDesc = 'Simbol plus dalam lingkaran [ ⊕ ] atau caret [ ^ ] mewakili Exclusive OR.';
      if (y === 1) {
        readAloud = `"${a ? 'Satu' : 'Nol'} XOR ${b ? 'Satu' : 'Nol'} menghasilkan Satu"`;
        explanation = 'Kedua input bernilai BERBEDA (satu bernilai 1 dan satu bernilai 0). Gerbang XOR bersifat eksklusif: output bernilai 1 hanya ketika input saling berlawanan (Lampu LED Menyala).';
      } else {
        readAloud = `"${a ? 'Satu' : 'Nol'} XOR ${b ? 'Satu' : 'Nol'} menghasilkan Nol"`;
        explanation = `Kedua input bernilai SAMA (keduanya bernilai ${a}). Karena tidak ada perbedaan nilai antar input, output XOR menjadi 0 (Lampu LED Mati).`;
      }
      break;

    case 'NAND':
      y = (a & b) === 1 ? 0 : 1;
      formalName = 'NAND (NOT-AND / Gerbang Universal)';
      formulaMath = `Y = (A • B)' = (${a} • ${b})' = ${y}`;
      formulaKeyboard = `Y = !(A * B) atau (A*B)' = ${y}`;
      symbolDesc = "Simbol AND yang dinegasikan: [ (A*B)' ] atau [ !(A*B) ].";
      if (a === 1 && b === 1) {
        readAloud = '"Satu NAND Satu menghasilkan Nol"';
        explanation = 'Hasil logika AND dari 1 dan 1 adalah 1. Namun karena dibalikkan oleh bubble inverter di ujung gerbang NAND, output akhirnya menjadi 0 (Lampu LED Mati).';
      } else {
        readAloud = `"${a ? 'Satu' : 'Nol'} NAND ${b ? 'Satu' : 'Nol'} menghasilkan Satu"`;
        explanation = `Hasil logika AND dari ${a} dan ${b} adalah 0. Setelah diinversikan oleh gerbang NAND, output menjadi 1 (Lampu LED Menyala).`;
      }
      break;

    case 'NOR':
      y = (a | b) === 1 ? 0 : 1;
      formalName = 'NOR (NOT-OR / Gerbang Universal)';
      formulaMath = `Y = (A + B)' = (${a} + ${b})' = ${y}`;
      formulaKeyboard = `Y = !(A + B) atau (A+B)' = ${y}`;
      symbolDesc = "Simbol OR yang dinegasikan: [ (A+B)' ] atau [ !(A+B) ].";
      if (a === 0 && b === 0) {
        readAloud = '"Nol NOR Nol menghasilkan Satu"';
        explanation = 'Hasil operasi OR dari 0 dan 0 adalah 0. Karena dibalikkan oleh gerbang NOR, output akhirnya menjadi 1 (Lampu LED Menyala).';
      } else {
        readAloud = `"${a ? 'Satu' : 'Nol'} NOR ${b ? 'Satu' : 'Nol'} menghasilkan Nol"`;
        explanation = `Hasil operasi OR bernilai 1 karena ada input aktif. Dibalikkan oleh gerbang NOR menjadi 0 (Lampu LED Mati).`;
      }
      break;

    case 'XNOR':
      y = (a ^ b) === 1 ? 0 : 1;
      formalName = 'XNOR (Exclusive NOR / Detektor Kesetaraan)';
      formulaMath = `Y = A ⊙ B = (A ⊕ B)' = ${a} ⊙ ${b} = ${y}`;
      formulaKeyboard = `Y = !(A ^ B) = ${y}`;
      symbolDesc = 'Simbol titik dalam lingkaran [ ⊙ ] mewakili kesetaraan (Equivalence).';
      if (a === b) {
        readAloud = `"${a ? 'Satu' : 'Nol'} XNOR ${b ? 'Satu' : 'Nol'} menghasilkan Satu"`;
        explanation = `Kedua input bernilai SAMA PERSIS (${a} dan ${b}). Gerbang XNOR mendeteksi kesetaraan: jika kedua input sepadan, output bernilai 1 (Lampu LED Menyala).`;
      } else {
        readAloud = `"${a ? 'Satu' : 'Nol'} XNOR ${b ? 'Satu' : 'Nol'} menghasilkan Nol"`;
        explanation = 'Input berbeda (tidak setara). Output XNOR bernilai 0 (Lampu LED Mati).';
      }
      break;
  }

  return { y, formulaMath, formulaKeyboard, readAloud, explanation, formalName, symbolDesc };
}

function renderLogicGateSvg(gate, a, b, y) {
  const wireA = a ? '#00d4ff' : '#475569';
  const wireB = b ? '#00d4ff' : '#475569';
  const wireY = y ? '#22c55e' : '#475569';
  const glowA = a ? 'filter="drop-shadow(0 0 6px #00d4ff)"' : '';
  const glowB = b ? 'filter="drop-shadow(0 0 6px #00d4ff)"' : '';
  const glowY = y ? 'filter="drop-shadow(0 0 8px #22c55e)"' : '';
  
  let gateBody = '';
  let wires = '';

  if (gate === 'NOT') {
    wires = `
      <line x1="15" y1="50" x2="60" y2="50" stroke="${wireA}" stroke-width="4" ${glowA} />
      <text x="32" y="40" fill="${wireA}" font-size="12" font-family="monospace" font-weight="bold">A=${a}</text>
      <line x1="124" y1="50" x2="165" y2="50" stroke="${wireY}" stroke-width="4" ${glowY} />
      <text x="136" y="40" fill="${wireY}" font-size="12" font-family="monospace" font-weight="bold">Y=${y}</text>
    `;
    gateBody = `
      <path d="M 60 25 L 110 50 L 60 75 Z" fill="rgba(0, 212, 255, 0.08)" stroke="#00d4ff" stroke-width="3" />
      <circle cx="117" cy="50" r="7" fill="#0b132b" stroke="#00d4ff" stroke-width="2.5" />
    `;
  } else {
    wires = `
      <line x1="15" y1="35" x2="52" y2="35" stroke="${wireA}" stroke-width="4" ${glowA} />
      <text x="28" y="27" fill="${wireA}" font-size="12" font-family="monospace" font-weight="bold">A=${a}</text>
      <line x1="15" y1="65" x2="52" y2="65" stroke="${wireB}" stroke-width="4" ${glowB} />
      <text x="28" y="83" fill="${wireB}" font-size="12" font-family="monospace" font-weight="bold">B=${b}</text>
      <line x1="${(gate === 'NAND' || gate === 'NOR' || gate === 'XNOR') ? '128' : '118'}" y1="50" x2="165" y2="50" stroke="${wireY}" stroke-width="4" ${glowY} />
      <text x="136" y="40" fill="${wireY}" font-size="12" font-family="monospace" font-weight="bold">Y=${y}</text>
    `;

    if (gate === 'AND') {
      gateBody = `<path d="M 52 22 L 85 22 A 28 28 0 0 1 85 78 L 52 78 Z" fill="rgba(0, 212, 255, 0.08)" stroke="#00d4ff" stroke-width="3" />`;
    } else if (gate === 'NAND') {
      gateBody = `
        <path d="M 52 22 L 85 22 A 28 28 0 0 1 85 78 L 52 78 Z" fill="rgba(0, 212, 255, 0.08)" stroke="#00d4ff" stroke-width="3" />
        <circle cx="120" cy="50" r="7" fill="#0b132b" stroke="#00d4ff" stroke-width="2.5" />
      `;
    } else if (gate === 'OR') {
      gateBody = `<path d="M 48 20 Q 68 50 48 80 Q 88 80 118 50 Q 88 20 48 20 Z" fill="rgba(236, 72, 153, 0.08)" stroke="#ec4899" stroke-width="3" />`;
    } else if (gate === 'NOR') {
      gateBody = `
        <path d="M 48 20 Q 68 50 48 80 Q 88 80 118 50 Q 88 20 48 20 Z" fill="rgba(236, 72, 153, 0.08)" stroke="#ec4899" stroke-width="3" />
        <circle cx="125" cy="50" r="7" fill="#0b132b" stroke="#ec4899" stroke-width="2.5" />
      `;
    } else if (gate === 'XOR') {
      gateBody = `
        <path d="M 40 20 Q 60 50 40 80" fill="none" stroke="#f59e0b" stroke-width="3" />
        <path d="M 49 20 Q 69 50 49 80 Q 89 80 118 50 Q 89 20 49 20 Z" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="3" />
      `;
    } else if (gate === 'XNOR') {
      gateBody = `
        <path d="M 40 20 Q 60 50 40 80" fill="none" stroke="#14b8a6" stroke-width="3" />
        <path d="M 49 20 Q 69 50 49 80 Q 89 80 118 50 Q 89 20 49 20 Z" fill="rgba(20, 184, 166, 0.08)" stroke="#14b8a6" stroke-width="3" />
        <circle cx="125" cy="50" r="7" fill="#0b132b" stroke="#14b8a6" stroke-width="2.5" />
      `;
    }
  }

  return `
    <svg viewBox="0 0 180 100" style="width:100%;max-width:180px;height:100px;">
      ${wires}
      ${gateBody}
    </svg>
  `;
}

function updateLabCircuit() {
  const result = computeLabGate(currentLabGate, labInputA, labInputB);

  // Update switch buttons
  const btnA = document.getElementById('lab-switch-a');
  const btnB = document.getElementById('lab-switch-b');
  const groupB = document.getElementById('lab-input-group-b');

  if (btnA) {
    btnA.textContent = labInputA;
    btnA.classList.toggle('on', labInputA === 1);
  }
  if (btnB) {
    btnB.textContent = labInputB;
    btnB.classList.toggle('on', labInputB === 1);
  }
  if (groupB) {
    // Hide input B if NOT gate
    groupB.style.display = currentLabGate === 'NOT' ? 'none' : 'flex';
  }

  // Update SVG
  const svgContainer = document.getElementById('lab-gate-svg');
  if (svgContainer) {
    svgContainer.innerHTML = renderLogicGateSvg(currentLabGate, labInputA, labInputB, result.y);
  }

  // Update LED Bulb
  const bulb = document.getElementById('lab-led-bulb');
  if (bulb) {
    bulb.textContent = result.y;
    bulb.classList.toggle('glow', result.y === 1);
  }

  // Update Pronunciation & Explanation Callout
  const callout = document.getElementById('lab-pronounce-container');
  if (callout) {
    callout.innerHTML = `
      <div class="pronounce-header">
        <span class="pronounce-tag">${result.formalName}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">${result.symbolDesc}</span>
      </div>
      
      <div style="margin-bottom:12px;">
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#d4af37;letter-spacing:1px;margin-bottom:6px;">🗣️ Cara Penyebutan Lisan / Verbal:</div>
        <div class="pronounce-voice-pill">
          <span>🔊</span>
          <span style="color:#00d4ff;">${result.readAloud}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:14px;">
        <div style="background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Ekspresi Matematika:</div>
          <div style="font-family:var(--font-mono);font-size:1.05rem;font-weight:700;color:var(--text-primary);margin-top:2px;">${result.formulaMath}</div>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Format Keyboard / Pemrograman:</div>
          <div style="font-family:var(--font-mono);font-size:1.05rem;font-weight:700;color:var(--accent-blue);margin-top:2px;">${result.formulaKeyboard}</div>
        </div>
      </div>

      <div style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;background:rgba(0,212,255,0.04);padding:12px;border-radius:8px;border-left:3px solid var(--accent-green);">
        <strong style="color:var(--accent-green);">💡 Analisis &amp; Alasan Logika:</strong> ${result.explanation}
      </div>
    `;
  }
}

function selectLabGate(gate) {
  currentLabGate = gate;
  document.querySelectorAll('.gate-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-gate') === gate);
  });
  updateLabCircuit();
}

function toggleLabInput(pin) {
  if (pin === 'A') {
    labInputA = labInputA === 1 ? 0 : 1;
  } else if (pin === 'B') {
    labInputB = labInputB === 1 ? 0 : 1;
  }
  updateLabCircuit();
}

// Expose lab functions to window
window.selectLabGate = selectLabGate;
window.toggleLabInput = toggleLabInput;

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 3 — GERBANG LOGIKA, SIMBOL & CARA PENYEBUTAN
   ═══════════════════════════════════════════════════════════════ */
function renderMinggu3Gerbang(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Aljabar Boolean &amp; Gerbang Logika Dasar</h1>
        <p>Aljabar Boolean adalah fondasi matematika utama yang mendasari analisis dan perancangan sistem digital. Variabel Boolean hanya memiliki dua nilai: 0 (Logika Rendah/Salah) dan 1 (Logika Tinggi/Benar). Operasi-operasi dasar pada aljabar Boolean dimanifestasikan dalam bentuk komponen elektronik yang disebut Gerbang Logika (Logic Gates).</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">AND / OR / NOT</span>
          <span class="tag tag-violet">Tabel Kebenaran</span>
          <span class="tag tag-green">SOP & POS</span>
          <span class="tag tag-orange">Simbol &amp; Pelafalan</span>
        </div>
      </div>
    </div>
    
    <!-- ===== BAGIAN 1: PANDUAN LENGKAP SIMBOL LOGIKA & CARA PENYEBUTAN ===== -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Kamus Simbol Gerbang Logika &amp; Cara Penyebutannya</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:18px;font-size:0.9rem;">
        Dalam literatur teknik sistem digital, berbagai simbol keyboard dan matematika digunakan untuk menyatakan operasi logika. Berikut adalah daftar simbol standar, fungsi, serta cara penyebutan/pelafalannya:
      </p>
      
      <div class="symbol-glossary-grid">
        <!-- 1. AND -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-blue);border-color:var(--accent-blue);">* &nbsp; • &nbsp; &amp;</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-blue);background:rgba(0,212,255,0.1);padding:2px 8px;border-radius:4px;">AND</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">Konjungsi / Perkalian Logika</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> Output bernilai 1 <em>HANYA JIKA seluruh input</em> bernilai 1.
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-blue);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"A AND B" atau "A dikali B"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh 1 • 0 dibaca: <em>"Satu AND Nol sama dengan Nol"</em></div>
          </div>
        </div>

        <!-- 2. OR -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-pink);border-color:var(--accent-pink);">+ &nbsp; | &nbsp; ∨</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-pink);background:rgba(236,72,153,0.1);padding:2px 8px;border-radius:4px;">OR</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">Disjungsi / Penjumlahan Logika</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> Output bernilai 1 <em>jika salah satu atau kedua input</em> bernilai 1.
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-pink);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"A OR B" atau "A atau B" atau "A tambah B"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh 1 + 0 dibaca: <em>"Satu OR Nol sama dengan Satu"</em></div>
          </div>
        </div>

        <!-- 3. NOT -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-green);border-color:var(--accent-green);">' &nbsp; ! &nbsp; ~ &nbsp; A&#773;</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-green);background:rgba(34,197,94,0.1);padding:2px 8px;border-radius:4px;">NOT</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">Inversi / Negasi / Komplemen</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> Membalikkan nilai logika: 1 menjadi 0, dan 0 menjadi 1.
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-green);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"NOT A" atau "A aksen" atau "A bar"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh 1' dibaca: <em>"NOT Satu sama dengan Nol"</em></div>
          </div>
        </div>

        <!-- 4. XOR -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-orange);border-color:var(--accent-orange);">^ &nbsp; ⊕</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-orange);background:rgba(245,158,11,0.1);padding:2px 8px;border-radius:4px;">XOR</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">Exclusive OR (Detektor Beda)</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> Output bernilai 1 <em>HANYA JIKA kedua input berbeda nilai</em>.
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-orange);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"A XOR B" atau "A eksklusif-atau B"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh 1 ⊕ 0 dibaca: <em>"Satu XOR Nol sama dengan Satu"</em></div>
          </div>
        </div>

        <!-- 5. NAND & NOR -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-violet);border-color:var(--accent-violet);">(A*B)' &nbsp; (A+B)'</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-violet);background:rgba(124,58,237,0.1);padding:2px 8px;border-radius:4px;">UNIVERSAL</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">NAND &amp; NOR (Gerbang Universal)</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> Kebalikan dari AND (NAND) dan kebalikan dari OR (NOR).
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-violet);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"A NAND B" dan "A NOR B"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh !(1*1) dibaca: <em>"Satu NAND Satu sama dengan Nol"</em></div>
          </div>
        </div>

        <!-- 6. XNOR & Parentheses -->
        <div class="symbol-glossary-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="symbol-tag-large" style="color:var(--accent-teal);border-color:var(--accent-teal);">⊙ &nbsp; ( )</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-teal);background:rgba(20,184,166,0.1);padding:2px 8px;border-radius:4px;">XNOR / KURUNG</span>
          </div>
          <h4 style="color:#fff;font-size:0.95rem;margin-bottom:6px;">XNOR (Equivalence) &amp; Prioritas</h4>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            <strong>Fungsi:</strong> XNOR bernilai 1 jika input sama. Kurung <code>()</code> menentukan prioritas utama.
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:6px;font-size:0.8rem;border-left:2px solid var(--accent-teal);">
            <div style="color:#d4af37;font-weight:700;font-size:0.72rem;">🗣️ CARA PENYEBUTAN:</div>
            <div style="color:#fff;font-weight:600;margin-top:2px;">"A XNOR B" dan "Dalam kurung..."</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Contoh (A+B)*C dibaca: <em>"Dalam kurung A OR B, di-AND-kan C"</em></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BAGIAN 2: LABORATORIUM PERCOBAAN GERBANG INTERAKTIF ===== -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🔬 Laboratorium Percobaan Gerbang Logika (Live Experiment)</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:18px;font-size:0.9rem;">
        Pilih gerbang logika di bawah ini, ubah saklar input <strong>A</strong> dan <strong>B</strong>, lalu amati kabel transmisi, lampu LED, serta <strong>penjelasan dan cara penyebutannya</strong> secara real-time:
      </p>

      <div class="gate-lab-workspace">
        <!-- Gate Selector Pills -->
        <div class="gate-pill-nav">
          <button class="gate-pill-btn active" data-gate="AND" onclick="selectLabGate('AND')">
            <span>🔹 AND (*)</span>
          </button>
          <button class="gate-pill-btn" data-gate="OR" onclick="selectLabGate('OR')">
            <span>🔸 OR (+)</span>
          </button>
          <button class="gate-pill-btn" data-gate="NOT" onclick="selectLabGate('NOT')">
            <span>🔺 NOT (')</span>
          </button>
          <button class="gate-pill-btn" data-gate="XOR" onclick="selectLabGate('XOR')">
            <span>⚡ XOR (^)</span>
          </button>
          <button class="gate-pill-btn" data-gate="NAND" onclick="selectLabGate('NAND')">
            <span>🔮 NAND</span>
          </button>
          <button class="gate-pill-btn" data-gate="NOR" onclick="selectLabGate('NOR')">
            <span>🛡️ NOR</span>
          </button>
          <button class="gate-pill-btn" data-gate="XNOR" onclick="selectLabGate('XNOR')">
            <span>⚖️ XNOR (⊙)</span>
          </button>
        </div>

        <!-- Circuit Board -->
        <div class="gate-circuit-board">
          <!-- Inputs Column -->
          <div class="gate-inputs-col">
            <!-- Switch A -->
            <div class="gate-switch-card">
              <button id="lab-switch-a" class="gate-switch-btn on" onclick="toggleLabInput('A')" title="Klik untuk ubah Input A (0 atau 1)">1</button>
              <div>
                <div style="font-weight:700;color:var(--accent-blue);font-size:0.85rem;">Input A</div>
                <div style="font-size:0.7rem;color:var(--text-muted);">Saklar Logika</div>
              </div>
            </div>

            <!-- Switch B -->
            <div class="gate-switch-card" id="lab-input-group-b">
              <button id="lab-switch-b" class="gate-switch-btn" onclick="toggleLabInput('B')" title="Klik untuk ubah Input B (0 atau 1)">0</button>
              <div>
                <div style="font-weight:700;color:var(--accent-blue);font-size:0.85rem;">Input B</div>
                <div style="font-size:0.7rem;color:var(--text-muted);">Saklar Logika</div>
              </div>
            </div>
          </div>

          <!-- Schematic SVG Visualizer -->
          <div class="gate-svg-visual" id="lab-gate-svg">
            <!-- Rendered by JS -->
          </div>

          <!-- Output Column -->
          <div class="gate-output-col">
            <div id="lab-led-bulb" class="gate-led-bulb" title="Status Lampu Indikator Output (1=Nyala, 0=Mati)">0</div>
            <div style="text-align:center;">
              <div style="font-weight:700;color:#d4af37;font-size:0.9rem;">Output (Y)</div>
              <div style="font-size:0.7rem;color:var(--text-muted);">Lampu LED</div>
            </div>
          </div>
        </div>

        <!-- Pronunciation & Live Explanation Callout -->
        <div class="pronounce-callout" id="lab-pronounce-container">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
    
    <!-- ===== BAGIAN 3: SIMULATOR ANALISIS PERSAMAAN & TABEL KEBENARAN ===== -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🧮 Simulator Tabel Kebenaran &amp; Analisis Persamaan Boolean</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
        Masukkan persamaan logika Anda (misal: <code>A*B + C'</code> atau <code>(A+B)*C</code>). Sistem akan mendeteksi simbol operator yang digunakan, menampilkan <strong>cara penyebutan lisan persamaan</strong>, serta membangkitkan Tabel Kebenaran lengkap dengan bentuk SOP &amp; POS.
      </p>
      <div class="converter-section" style="grid-template-columns: 1fr;">
         <div class="input-group">
            <label class="input-label" style="color:var(--accent-blue);">Masukkan Persamaan Boolean (Gunakan operator: *, +, ', ^, tanda kurung)</label>
            <input type="text" class="input-field" id="logic-expr-input" placeholder="Contoh: A*B + A'*C atau (A+B)*C" autocomplete="off" spellcheck="false" style="border-color:#d4af37;" />
         </div>
         <button class="convert-btn hp-theme" onclick="m3Simulate()" style="background:linear-gradient(to right, #bf953f, #b38728);color:#1a1c29;font-weight:700;">
             Analisis Persamaan, Simbol &amp; Tabel
         </button>
      </div>
      <div id="m3-sim-result" style="display:none;margin-top:24px;"></div>
    </div>
  `;
  
  const inp = document.getElementById('logic-expr-input');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') m3Simulate(); });

  // Initialize Gate Lab Circuit
  setTimeout(updateLabCircuit, 50);
}

function explainSymbolsInExpr(expr) {
    const list = [];
    if (expr.includes('*') || expr.includes('&')) {
        list.push({ symbol: '* atau •', name: 'AND (Perkalian Logika)', sound: '"A AND B"', desc: 'Hanya bernilai 1 jika kedua variabel bernilai 1.' });
    }
    if (expr.includes('+') || expr.includes('|')) {
        list.push({ symbol: '+ atau |', name: 'OR (Penjumlahan Logika)', sound: '"A OR B"', desc: 'Bernilai 1 jika minimal salah satu variabel bernilai 1.' });
    }
    if (expr.includes("'") || expr.includes('!') || expr.includes('~')) {
        list.push({ symbol: "' atau ! atau ~", name: 'NOT (Inversi / Komplemen)', sound: '"NOT variabel" atau "variabel aksen"', desc: 'Membalikkan nilai logika: 1 menjadi 0, dan 0 menjadi 1.' });
    }
    if (expr.includes('^')) {
        list.push({ symbol: '^ atau ⊕', name: 'XOR (Exclusive OR)', sound: '"A XOR B"', desc: 'Bernilai 1 jika kedua variabel memiliki nilai logika yang berbeda.' });
    }
    if (expr.includes('(') || expr.includes(')')) {
        list.push({ symbol: '( )', name: 'Tanda Kurung (Parentheses)', sound: '"Dalam kurung..."', desc: 'Menentukan prioritas operasi: bagian di dalam kurung dihitung lebih awal.' });
    }
    return list;
}

function generateVerbalPronunciation(expr) {
    let clean = expr.trim();
    let spoken = clean
        .replace(/([A-Z])'/g, "NOT $1")
        .replace(/!([A-Z])/g, "NOT $1")
        .replace(/~([A-Z])/g, "NOT $1")
        .replace(/\*/g, " AND ")
        .replace(/&/g, " AND ")
        .replace(/\+/g, " OR ")
        .replace(/\|/g, " OR ")
        .replace(/\^/g, " XOR ")
        .replace(/\s+/g, ' ');
    return spoken;
}

function m3Simulate() {
    const expr = document.getElementById('logic-expr-input')?.value;
    const resultDiv = document.getElementById('m3-sim-result');
    if (!expr || !resultDiv) return;
    
    // [SECRET 3] If complex (e.g. length > 15), trigger silent Universal Gates mapping in the background
    let secretRender = '';
    if (expr.length > 15) {
        secretRender = toNandEquivalent(expr);
    }

    const tt = generateTruthTable(expr);
    if (!tt) {
        resultDiv.innerHTML = `<div style="color:var(--accent-red);padding:10px;background:rgba(239,68,68,.1);border-radius:8px;">Ekspresi tidak valid atau variabel tidak ditemukan. Gunakan huruf A-Z dan operator *, +, ', ^, ().</div>`;
        resultDiv.style.display = 'block';
        return;
    }

    const soppos = generateSOPPOS(tt);
    const symbolsUsed = explainSymbolsInExpr(expr);
    const spokenReading = generateVerbalPronunciation(expr);

    let symbolsHtml = '';
    if (symbolsUsed.length > 0) {
        symbolsHtml = `
            <div style="background:rgba(13,21,48,0.7);padding:16px;border-radius:10px;border:1px solid var(--border-subtle);margin-bottom:16px;">
                <div style="font-size:0.78rem;font-weight:700;color:#d4af37;text-transform:uppercase;margin-bottom:10px;">🔍 Simbol Operator yang Digunakan dalam Persamaan Ini:</div>
                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    ${symbolsUsed.map(s => `
                        <div style="background:rgba(0,0,0,0.3);padding:6px 12px;border-radius:6px;border-left:3px solid var(--accent-blue);font-size:0.8rem;">
                            <strong style="color:var(--accent-blue);font-family:var(--font-mono);">${s.symbol}</strong> &rarr; <span style="color:#fff;">${s.name}</span>
                            <div style="font-size:0.74rem;color:var(--text-muted);margin-top:2px;">Dibaca: <em style="color:#fcf6ba;">${s.sound}</em> &bull; ${s.desc}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    let html = `
        ${secretRender}
        
        <!-- Cara Penyebutan Persamaan -->
        <div style="background:linear-gradient(135deg, rgba(13,25,60,0.8), rgba(15,12,35,0.8));border:1px solid var(--border-glow);border-left:4px solid var(--accent-blue);border-radius:10px;padding:16px 20px;margin-bottom:18px;">
            <div style="font-size:0.75rem;font-weight:700;color:#d4af37;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">🗣️ Cara Penyebutan Lisan / Verbal Persamaan Ini:</div>
            <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.06);padding:6px 16px;border-radius:20px;font-size:1.05rem;font-weight:700;color:#00d4ff;font-family:var(--font-mono);">
                <span>🔊</span>
                <span>"${spokenReading}"</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:8px;">
                Persamaan aljabar: <strong style="color:#fff;font-family:var(--font-mono);">${expr}</strong>
            </div>
        </div>

        ${symbolsHtml}

        <div style="display:grid;grid-template-columns:1fr;gap:20px;">
            <div>
                <h4 style="color:var(--accent-blue);margin-bottom:12px;display:flex;align-items:center;gap:8px;"><span>📋</span> Tabel Kebenaran Lengkap</h4>
                <div style="overflow-x:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
                    <table class="cheat-table" style="width:100%;margin:0;">
                        <thead>
                            <tr>
                                <th style="width:50px;">No</th>
                                ${tt.vars.map(v => `<th style="background:rgba(255,255,255,.05);">${v}</th>`).join('')}
                                <th style="background:rgba(0,212,255,.15);color:var(--accent-blue);">OUTPUT (Y)</th>
                                <th style="background:rgba(255,255,255,.03);color:var(--text-muted);font-size:0.75rem;">Penjelasan Evaluasi Logika</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tt.table.map((row, idx) => {
                                const varVals = tt.vars.map(v => `${v}=${row.env[v]}`).join(', ');
                                const evalText = row.result === 1 ? `Output aktif bernilai 1 saat input ${varVals}` : `Output mati bernilai 0 saat input ${varVals}`;
                                return `
                                <tr>
                                    <td style="color:var(--text-muted);font-size:0.75rem;">${idx + 1}</td>
                                    ${tt.vars.map(v => `<td style="color:var(--text-secondary);font-weight:600;">${row.env[v]}</td>`).join('')}
                                    <td style="font-weight:bold;color:${row.result ? 'var(--accent-green)' : 'var(--accent-pink)'};background:rgba(255,255,255,.02);font-size:1.1rem;">${row.result}</td>
                                    <td style="color:var(--text-muted);font-size:0.78rem;">${evalText}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:var(--accent-pink);margin-bottom:6px;">SOP (Sum of Product / Minterm)</div>
                    <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:700;">${soppos.sop}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Mengambil kombinasi baris yang menghasilkan output 1</div>
                </div>
                <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:var(--accent-blue);margin-bottom:6px;">POS (Product of Sum / Maxterm)</div>
                    <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:700;">${soppos.pos}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Mengambil kombinasi baris yang menghasilkan output 0</div>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
    setTimeout(() => {
        resultDiv.style.transition = 'opacity .4s ease';
        resultDiv.style.opacity = '1';
    }, 50);
}

/* ═══════════════════════════════════════════════════════════════
   DATA & STATE: MINGGU 3 — HUKUM BOOLEAN, SOP & POS (ITERA SILABUS)
═══════════════════════════════════════════════════════════════ */

// 1. Data 10 Hukum Aljabar Boolean (Slide 7 Silabus ITERA)
const M3_LAWS = {
  demorgan1: {
    key: "demorgan1",
    name: "Hukum De Morgan (OR ke AND)",
    category: "De Morgan",
    slideRef: "Slide 7",
    formula: "(A + B)' = A' • B'",
    desc: "Komplemen dari penjumlahan logika sama dengan perkalian dari masing-masing komplemennya.",
    vars: ['A', 'B'],
    evalLhs: (v) => (!(v.A || v.B) ? 1 : 0),
    evalRhs: (v) => ((!v.A ? 1 : 0) && (!v.B ? 1 : 0) ? 1 : 0),
    stepLhs: (v) => `(${v.A} + ${v.B})' = (${v.A || v.B})' = ${!(v.A || v.B) ? 1 : 0}`,
    stepRhs: (v) => `(${v.A})' • (${v.B})' = ${!v.A ? 1 : 0} • ${!v.B ? 1 : 0} = ${(!v.A ? 1 : 0) && (!v.B ? 1 : 0) ? 1 : 0}`,
    pronounce: "NOT dari (A ATAU B) sama dengan (NOT A) DAN (NOT B)"
  },
  demorgan2: {
    key: "demorgan2",
    name: "Hukum De Morgan (AND ke OR)",
    category: "De Morgan",
    slideRef: "Slide 7",
    formula: "(A • B)' = A' + B'",
    desc: "Komplemen dari perkalian logika sama dengan penjumlahan dari masing-masing komplemennya.",
    vars: ['A', 'B'],
    evalLhs: (v) => (!(v.A && v.B) ? 1 : 0),
    evalRhs: (v) => ((!v.A ? 1 : 0) || (!v.B ? 1 : 0) ? 1 : 0),
    stepLhs: (v) => `(${v.A} • ${v.B})' = (${v.A && v.B})' = ${!(v.A && v.B) ? 1 : 0}`,
    stepRhs: (v) => `(${v.A})' + (${v.B})' = ${!v.A ? 1 : 0} + ${!v.B ? 1 : 0} = ${(!v.A ? 1 : 0) || (!v.B ? 1 : 0) ? 1 : 0}`,
    pronounce: "NOT dari (A DAN B) sama dengan (NOT A) ATAU (NOT B)"
  },
  absorption1: {
    key: "absorption1",
    name: "Hukum Penyerapan / Absorpsi (Bentuk 1)",
    category: "Penyerapan",
    slideRef: "Slide 7",
    formula: "A + A • B = A",
    desc: "Suku perkalian yang memuat variabel A diserap habis oleh variabel A.",
    vars: ['A', 'B'],
    evalLhs: (v) => (v.A || (v.A && v.B) ? 1 : 0),
    evalRhs: (v) => v.A,
    stepLhs: (v) => `${v.A} + (${v.A} • ${v.B}) = ${v.A} + ${v.A && v.B} = ${v.A || (v.A && v.B) ? 1 : 0}`,
    stepRhs: (v) => `${v.A} (Hanya bergantung pada variabel A)`,
    pronounce: "A ditambah (A dikali B) diserap menjadi A"
  },
  absorption2: {
    key: "absorption2",
    name: "Hukum Penyerapan / Absorpsi (Bentuk 2)",
    category: "Penyerapan",
    slideRef: "Slide 7",
    formula: "A • (A + B) = A",
    desc: "Bentuk perkalian terhadap penjumlahan yang memuat variabel A diserap menjadi A.",
    vars: ['A', 'B'],
    evalLhs: (v) => (v.A && (v.A || v.B) ? 1 : 0),
    evalRhs: (v) => v.A,
    stepLhs: (v) => `${v.A} • (${v.A} + ${v.B}) = ${v.A} • ${v.A || v.B} = ${v.A && (v.A || v.B) ? 1 : 0}`,
    stepRhs: (v) => `${v.A}`,
    pronounce: "A dikali (A ditambah B) diserap menjadi A"
  },
  distributive1: {
    key: "distributive1",
    name: "Hukum Distributif (OR terhadap AND)",
    category: "Distributif",
    slideRef: "Slide 7 & 13",
    formula: "A + (B • C) = (A + B) • (A + C)",
    desc: "Operasi penjumlahan (OR) didistribusikan ke perkalian (AND). Digunakan pada konversi SOP ke POS (Slide 13)!",
    vars: ['A', 'B', 'C'],
    evalLhs: (v) => (v.A || (v.B && v.C) ? 1 : 0),
    evalRhs: (v) => ((v.A || v.B) && (v.A || v.C) ? 1 : 0),
    stepLhs: (v) => `${v.A} + (${v.B} • ${v.C}) = ${v.A} + ${v.B && v.C} = ${v.A || (v.B && v.C) ? 1 : 0}`,
    stepRhs: (v) => `(${v.A} + ${v.B}) • (${v.A} + ${v.C}) = ${v.A || v.B} • ${v.A || v.C} = ${(v.A || v.B) && (v.A || v.C) ? 1 : 0}`,
    pronounce: "A ditambah (B dikali C) sama dengan (A ditambah B) dikali (A ditambah C)"
  },
  distributive2: {
    key: "distributive2",
    name: "Hukum Distributif (AND terhadap OR)",
    category: "Distributif",
    slideRef: "Slide 7 & 12",
    formula: "A • (B + C) = A • B + A • C",
    desc: "Operasi perkalian didistribusikan ke dalam penjumlahan. Digunakan pada konversi POS ke SOP (Slide 12).",
    vars: ['A', 'B', 'C'],
    evalLhs: (v) => (v.A && (v.B || v.C) ? 1 : 0),
    evalRhs: (v) => ((v.A && v.B) || (v.A && v.C) ? 1 : 0),
    stepLhs: (v) => `${v.A} • (${v.B} + ${v.C}) = ${v.A} • ${v.B || v.C} = ${v.A && (v.B || v.C) ? 1 : 0}`,
    stepRhs: (v) => `(${v.A} • ${v.B}) + (${v.A} • ${v.C}) = ${v.A && v.B} + ${v.A && v.C} = ${(v.A && v.B) || (v.A && v.C) ? 1 : 0}`,
    pronounce: "A dikali (B ditambah C) sama dengan A dikali B ditambah A dikali C"
  },
  complement: {
    key: "complement",
    name: "Hukum Komplemen",
    category: "Komplemen",
    slideRef: "Slide 7",
    formula: "A + A' = 1  dan  A • A' = 0",
    desc: "Sebuah variabel jika di-OR-kan dengan komplemennya selalu bernilai 1. Jika di-AND-kan selalu bernilai 0.",
    vars: ['A'],
    evalLhs: (v) => (v.A || (!v.A ? 1 : 0) ? 1 : 0),
    evalRhs: (v) => 1,
    stepLhs: (v) => `${v.A} + (${v.A})' = ${v.A} + ${!v.A ? 1 : 0} = ${v.A || (!v.A ? 1 : 0) ? 1 : 0}`,
    stepRhs: (v) => `1 (Konstanta Logika Tinggi / Vcc)`,
    pronounce: "A ditambah A aksen selalu bernilai Satu"
  },
  dominance: {
    key: "dominance",
    name: "Hukum Dominansi",
    category: "Dominansi",
    slideRef: "Slide 7",
    formula: "A • 0 = 0  dan  A + 1 = 1",
    desc: "Logika 0 mendominasi gerbang AND, dan logika 1 mendominasi gerbang OR.",
    vars: ['A'],
    evalLhs: (v) => (v.A && 0 ? 1 : 0),
    evalRhs: (v) => 0,
    stepLhs: (v) => `${v.A} • 0 = 0`,
    stepRhs: (v) => `0 (Konstanta Logika Rendah / Ground)`,
    pronounce: "A dikali Nol selalu bernilai Nol"
  },
  idempotent: {
    key: "idempotent",
    name: "Hukum Idempoten",
    category: "Idempoten",
    slideRef: "Slide 7",
    formula: "A + A = A  dan  A • A = A",
    desc: "Pengulangan input identik yang sama menghasilkan nilai input itu sendiri.",
    vars: ['A'],
    evalLhs: (v) => (v.A || v.A ? 1 : 0),
    evalRhs: (v) => v.A,
    stepLhs: (v) => `${v.A} + ${v.A} = ${v.A}`,
    stepRhs: (v) => `${v.A}`,
    pronounce: "A ditambah A bernilai A"
  },
  involution: {
    key: "involution",
    name: "Hukum Involusi (Komplemen Ganda)",
    category: "Involusi",
    slideRef: "Slide 7",
    formula: "(A')' = A  atau  A'' = A",
    desc: "Dua kali negasi berturut-turut mengembalikan sinyal ke kondisi aslinya.",
    vars: ['A'],
    evalLhs: (v) => (!(!v.A) ? 1 : 0),
    evalRhs: (v) => v.A,
    stepLhs: (v) => `((${v.A})')' = (${!v.A ? 1 : 0})' = ${!(!v.A) ? 1 : 0}`,
    stepRhs: (v) => `${v.A}`,
    pronounce: "NOT dari NOT A menghasilkan sinyal asli A"
  }
};

// 2. Data Studi Kasus Konversi & Penyederhanaan (Slide 12, 13, 14, 15, 16)
const M3_CASES = [
  {
    title: "Slide 12: Konversi POS ke SOP",
    given: "F(A, B) = (A + B)(A' + B)",
    goal: "Ubah bentuk POS di atas menjadi SOP menggunakan sifat perkalian distributif.",
    steps: [
      {
        num: 1,
        expr: "F = A • A' + A • B + A' • B + B • B",
        law: "Hukum Distributif (Perkalian Suku)",
        desc: "Kalikan setiap suku pertama dengan suku kedua: (A • A') + (A • B) + (A' • B) + (B • B)."
      },
      {
        num: 2,
        expr: "F = 0 + A • B + A' • B + B",
        law: "Hukum Komplemen (A • A' = 0) & Idempoten (B • B = B)",
        desc: "Suku A • A' bernilai 0 karena variabel saling berkebalikan, dan B • B disederhanakan menjadi B."
      },
      {
        num: 3,
        expr: "F = (A + A') • B + B",
        law: "Hukum Distributif (Faktorisasi B)",
        desc: "Ekstraksi faktor bersama B dari suku (A • B + A' • B) sehingga menjadi (A + A') • B."
      },
      {
        num: 4,
        expr: "F = 1 • B + B = B + B = B",
        law: "Hukum Komplemen (A + A' = 1), Identitas (1 • B = B), & Idempoten (B + B = B)",
        desc: "Karena (A + A') = 1, maka 1 • B = B. Terakhir B + B disederhanakan menjadi sinyal B tunggal."
      }
    ],
    final: "F = B",
    pronounce: "F sama dengan B. Rangkaian POS tereduksi sempurna menjadi kabel langsung sinyal B!"
  },
  {
    title: "Slide 13: Konversi SOP ke POS",
    given: "G = A + A' • B",
    goal: "Ubah bentuk SOP di atas menjadi POS dengan Hukum Distributif penjumlahan.",
    steps: [
      {
        num: 1,
        expr: "G = (A + A') • (A + B)",
        law: "Hukum Distributif (A + B • C = (A + B)(A + C))",
        desc: "Terapkan hukum distributif penjumlahan terhadap perkalian: variabel A didistribusikan ke A' dan B."
      },
      {
        num: 2,
        expr: "G = 1 • (A + B)",
        law: "Hukum Komplemen (A + A' = 1)",
        desc: "Suku komplemen (A + A') bernilai konstan 1."
      },
      {
        num: 3,
        expr: "G = A + B",
        law: "Hukum Identitas (1 • X = X)",
        desc: "Konstanta 1 dikalikan dengan (A + B) menghasilkan (A + B) dalam bentuk suku POS tunggal."
      }
    ],
    final: "G = A + B",
    pronounce: "G sama dengan A ATAU B. Inverter dan gerbang AND tereliminasi cukup memakai gerbang OR!"
  },
  {
    title: "Slide 15: Penyederhanaan Fungsi 3 Variabel",
    given: "Y = A' • B • C + A • B • C",
    goal: "Sederhanakan ekspresi Boolean 3 variabel menjadi bentuk paling minimal.",
    steps: [
      {
        num: 1,
        expr: "Y = (A' + A) • B • C",
        law: "Hukum Distributif (Faktorisasi Suku Bersama BC)",
        desc: "Perhatikan bahwa suku B • C muncul di kedua minterm. Faktorkan (B • C) ke luar tanda kurung."
      },
      {
        num: 2,
        expr: "Y = 1 • B • C",
        law: "Hukum Komplemen (A' + A = 1)",
        desc: "Substitusi suku komplemen (A' + A) menjadi konstanta 1."
      },
      {
        num: 3,
        expr: "Y = B • C",
        law: "Hukum Identitas (1 • BC = BC)",
        desc: "Variabel A berhasil dieliminasi karena tidak lagi mempengaruhi nilai logika output."
      }
    ],
    final: "Y = B • C",
    pronounce: "Y sama dengan B DAN C. Variabel A hilang sehingga menghemat 1 gerbang NOT dan input gerbang AND!"
  },
  {
    title: "Slide 16: Pembentukan Fungsi XOR dari SOP",
    given: "Tabel Kebenaran Gerbang XOR (A ⊕ B)",
    goal: "Bentuk persamaan SOP standar dari baris-baris tabel kebenaran yang menghasilkan output bernilai 1.",
    steps: [
      {
        num: 1,
        expr: "Baris 2 (A=0, B=1) ⟹ m1 = A' • B",
        law: "Ciri SOP (Variabel 0 dikomplemenkan A', variabel 1 tanpa komplemen B)",
        desc: "Output F=1 terjadi saat A=0 dan B=1, menghasilkan Minterm m1 = A'B."
      },
      {
        num: 2,
        expr: "Baris 3 (A=1, B=0) ⟹ m2 = A • B'",
        law: "Ciri SOP (Variabel 1 tanpa komplemen A, variabel 0 dikomplemenkan B')",
        desc: "Output F=1 juga terjadi saat A=1 dan B=0, menghasilkan Minterm m2 = AB'."
      },
      {
        num: 3,
        expr: "A ⊕ B = m1 + m2 = (A' • B) + (A • B')",
        law: "Sum of Products (Penjumlahan seluruh Minterm bernilai 1)",
        desc: "Gabungkan semua minterm aktif dengan gerbang OR. Ini adalah realisasi gerbang XOR 2 tingkat!"
      }
    ],
    final: "A ⊕ B = A' • B + A • B'",
    pronounce: "A XOR B sama dengan (NOT A DAN B) ATAU (A DAN NOT B)"
  },
  {
    title: "Slide 14: Latihan 1A — Konversi ke SOP",
    given: "(A + B + C)(A' + B + C)",
    goal: "Ubah bentuk POS 3 variabel menjadi bentuk SOP standar.",
    steps: [
      {
        num: 1,
        expr: "Misalkan X = (B + C), maka persamaan menjadi (X + A)(X + A')",
        law: "Substitusi Aljabar Suku Bersama",
        desc: "Suku (B + C) bernilai sama pada kedua faktor tanda kurung."
      },
      {
        num: 2,
        expr: "(X + A)(X + A') = X + A • A'",
        law: "Hukum Distributif Terbalik",
        desc: "Terapkan hukum distributif terbalik: (X + A)(X + A') = X + AA'."
      },
      {
        num: 3,
        expr: "(B + C) + 0 = B + C",
        law: "Hukum Komplemen (A • A' = 0) & Identitas",
        desc: "Karena A • A' = 0, maka ekspresi tereduksi menjadi B + C."
      }
    ],
    final: "Bentuk SOP = B + C",
    pronounce: "Hasil konversi akhir bernilai B ATAU C"
  }
];

// State lokal modul penyederhanaan
let m3PenyTab = 'verifier'; // 'verifier' | 'soppos' | 'cases' | 'theory'
let m3LawSelected = 'demorgan1';
let m3LawInputs = { A: 0, B: 0, C: 0 };
let m3SopPosVarCount = 2; // 2 or 3
let m3SopPosTable = [0, 1, 1, 0]; // Default: XOR (Slide 16)
let m3CaseSelected = 0;
let m3CaseStep = 4; // Menampilkan semua langkah secara default

/* ═══════════════════════════════════════════════════════════════
   RENDER UTAMA: MINGGU 3 — PENYEDERHANAAN & HUKUM BOOLEAN
═══════════════════════════════════════════════════════════════ */
function renderMinggu3Penyederhanaan(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Hukum Aljabar Boolean, SOP &amp; POS</h1>
        <p>Berdasarkan silabus Pertemuan 3 Sistem Digital ITERA: Mempelajari manipulasi fungsi logika menggunakan 10 Hukum Boolean dasar, aturan prioritas operasi (Kurung &gt; NOT &gt; AND &gt; OR), representasi kanonik Minterm (SOP) dan Maxterm (POS), serta reduksi rangkaian logika.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">De Morgan</span>
          <span class="tag tag-violet">Distributif &amp; Absorpsi</span>
          <span class="tag tag-green">SOP (Minterm)</span>
          <span class="tag tag-pink">POS (Maxterm)</span>
          <span class="tag tag-orange">Prioritas Operasi</span>
        </div>
      </div>
    </div>

    <!-- Navigasi Sub-Tab Interaktif -->
    <div class="m3-sub-nav">
      <button class="m3-sub-tab-btn ${m3PenyTab === 'verifier' ? 'active' : ''}" onclick="switchM3PenyTab('verifier')">
        <span>🧪</span>
        <span>Lab Pembuktian Hukum (LHS vs RHS)</span>
      </button>
      <button class="m3-sub-tab-btn ${m3PenyTab === 'soppos' ? 'active' : ''}" onclick="switchM3PenyTab('soppos')">
        <span>🎛️</span>
        <span>Playground Interaktif SOP &amp; POS</span>
      </button>
      <button class="m3-sub-tab-btn ${m3PenyTab === 'cases' ? 'active' : ''}" onclick="switchM3PenyTab('cases')">
        <span>🔄</span>
        <span>Studi Kasus Konversi (Slide 12-16)</span>
      </button>
      <button class="m3-sub-tab-btn ${m3PenyTab === 'theory' ? 'active' : ''}" onclick="switchM3PenyTab('theory')">
        <span>📚</span>
        <span>Prioritas Operasi &amp; Kompilasi Teorema</span>
      </button>
    </div>

    <!-- Kontainer Konten Tab Dinamis -->
    <div id="m3-peny-content">
      <!-- Diisi oleh switchM3PenyTab() -->
    </div>
  `;

  // Render konten tab saat ini
  renderCurrentM3PenyTab();
}

function switchM3PenyTab(tabId) {
  m3PenyTab = tabId;
  const buttons = document.querySelectorAll('.m3-sub-tab-btn');
  buttons.forEach((btn, idx) => {
    const tabs = ['verifier', 'soppos', 'cases', 'theory'];
    btn.classList.toggle('active', tabs[idx] === tabId);
  });
  renderCurrentM3PenyTab();
}

function renderCurrentM3PenyTab() {
  const content = document.getElementById('m3-peny-content');
  if (!content) return;

  if (m3PenyTab === 'verifier') {
    renderTabVerifier(content);
  } else if (m3PenyTab === 'soppos') {
    renderTabSopPos(content);
  } else if (m3PenyTab === 'cases') {
    renderTabCases(content);
  } else {
    renderTabTheory(content);
  }
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1: LAB PEMBUKTIAN HUKUM BOOLEAN (LHS vs RHS)
═══════════════════════════════════════════════════════════════ */
function renderTabVerifier(container) {
  const law = M3_LAWS[m3LawSelected] || M3_LAWS.demorgan1;
  const needsC = law.vars.includes('C');

  container.innerHTML = `
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🧪 Verifikator &amp; Pembukti Hukum Aljabar Boolean</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Pilih salah satu hukum Aljabar Boolean resmi (Slide 7), lalu gerakkan saklar input logika di bawah. Sistem akan mengevaluasi <strong>Sisi Kiri (LHS)</strong> dan <strong>Sisi Kanan (RHS)</strong> secara independen untuk membuktikan bahwa kedua sisi selalu menghasilkan nilai logika yang identik!
      </p>

      <!-- Pilihan Hukum Boolean -->
      <div style="margin-bottom:20px;">
        <label style="font-size:0.8rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;display:block;margin-bottom:8px;">Pilih Teorema / Hukum Boolean:</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${Object.keys(M3_LAWS).map(key => `
            <button class="btn btn-sm ${m3LawSelected === key ? 'btn-primary' : 'btn-ghost'}" onclick="selectM3Law('${key}')" style="font-family:var(--font-mono);font-size:0.82rem;">
              ${M3_LAWS[key].formula}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Info Card Hukum yang Dipilih -->
      <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.25);border-radius:var(--radius-md);padding:14px 18px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;">${law.category} &bull; ${law.slideRef}</div>
            <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:700;color:#fff;">${law.name}</div>
          </div>
          <div style="font-family:var(--font-mono);font-size:1.25rem;font-weight:800;color:var(--accent-green);background:rgba(0,0,0,0.4);padding:4px 14px;border-radius:6px;border:1px solid rgba(34,197,94,0.3);">
            ${law.formula}
          </div>
        </div>
        <div style="font-size:0.88rem;color:var(--text-secondary);margin-top:8px;">${law.desc}</div>
      </div>

      <!-- Saklar Input Logika Interaktif -->
      <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px;padding:16px;background:rgba(13,21,48,0.5);border-radius:var(--radius-md);border:1px solid var(--border-subtle);flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input A:</span>
          <button class="gate-switch-btn ${m3LawInputs.A === 1 ? 'on' : ''}" onclick="toggleM3LawInput('A')" id="m3-switch-A">
            ${m3LawInputs.A}
          </button>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input B:</span>
          <button class="gate-switch-btn ${m3LawInputs.B === 1 ? 'on' : ''}" onclick="toggleM3LawInput('B')" id="m3-switch-B">
            ${m3LawInputs.B}
          </button>
        </div>

        ${needsC ? `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-blue);">Input C:</span>
          <button class="gate-switch-btn ${m3LawInputs.C === 1 ? 'on' : ''}" onclick="toggleM3LawInput('C')" id="m3-switch-C">
            ${m3LawInputs.C}
          </button>
        </div>
        ` : ''}
      </div>

      <!-- Komparasi LHS vs RHS Workspace -->
      <div class="verifier-workspace" id="m3-verifier-workspace">
        <!-- Diisi oleh updateM3LawVerifierUI() -->
      </div>

      <!-- Kotak Penjelasan Lisan & Verbal -->
      <div class="pronounce-callout mb-24" id="m3-verifier-pronounce">
        <!-- Diisi oleh updateM3LawVerifierUI() -->
      </div>

      <!-- Tabel Verifikasi Lengkap Semua Kemungkinan Input -->
      <div>
        <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:10px;color:var(--accent-blue);">
          📋 Tabel Kebenaran Pembuktian Hukum (Semua Kombinasi Input)
        </h4>
        <div style="overflow-x:auto;">
          <table class="truth-table" id="m3-verifier-table" style="width:100%;text-align:center;">
            <!-- Diisi oleh updateM3LawVerifierUI() -->
          </table>
        </div>
      </div>
    </div>
  `;

  updateM3LawVerifierUI();
}

function selectM3Law(lawKey) {
  m3LawSelected = lawKey;
  renderCurrentM3PenyTab();
}

function toggleM3LawInput(varName) {
  m3LawInputs[varName] = m3LawInputs[varName] === 1 ? 0 : 1;
  const btn = document.getElementById(`m3-switch-${varName}`);
  if (btn) {
    btn.textContent = m3LawInputs[varName];
    btn.classList.toggle('on', m3LawInputs[varName] === 1);
  }
  updateM3LawVerifierUI();
}

function updateM3LawVerifierUI() {
  const law = M3_LAWS[m3LawSelected] || M3_LAWS.demorgan1;
  const workspace = document.getElementById('m3-verifier-workspace');
  const pronounceBox = document.getElementById('m3-verifier-pronounce');
  const tableEl = document.getElementById('m3-verifier-table');
  if (!workspace || !pronounceBox || !tableEl) return;

  const lhsVal = law.evalLhs(m3LawInputs);
  const rhsVal = law.evalRhs(m3LawInputs);
  const isMatch = (lhsVal === rhsVal);

  const lhsFormulaSplit = law.formula.split('=')[0].trim();
  const rhsFormulaSplit = law.formula.split('=')[1] ? law.formula.split('=')[1].trim() : law.formula;

  // 1. Workspace LHS vs RHS
  workspace.innerHTML = `
    <!-- Sisi Kiri (LHS) -->
    <div class="verifier-side-box ${isMatch ? 'match' : ''}">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;letter-spacing:1px;margin-bottom:6px;">SISI KIRI (LHS)</div>
      <div style="font-family:var(--font-mono);font-size:1.2rem;font-weight:800;color:#fff;">${lhsFormulaSplit}</div>
      <div class="verifier-step-text">${law.stepLhs(m3LawInputs)}</div>
      
      <div style="margin-top:14px;display:flex;flex-direction:column;align-items:center;">
        <div class="gate-led-bulb ${lhsVal === 1 ? 'glow' : ''}">${lhsVal}</div>
        <span style="font-size:0.78rem;font-weight:600;color:${lhsVal === 1 ? '#4ade80' : '#94a3b8'};margin-top:6px;">
          ${lhsVal === 1 ? 'Output Logika: 1 (HIGH)' : 'Output Logika: 0 (LOW)'}
        </span>
      </div>
    </div>

    <!-- Tanda Ekuivalen Dinamis -->
    <div class="verifier-equal-sign">
      <span>≡</span>
      <span style="font-size:0.7rem;font-weight:700;color:var(--accent-green);background:rgba(34,197,94,0.15);padding:3px 8px;border-radius:4px;border:1px solid rgba(34,197,94,0.3);">
        EKUIVALEN
      </span>
    </div>

    <!-- Sisi Kanan (RHS) -->
    <div class="verifier-side-box ${isMatch ? 'match' : ''}">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;letter-spacing:1px;margin-bottom:6px;">SISI KANAN (RHS)</div>
      <div style="font-family:var(--font-mono);font-size:1.2rem;font-weight:800;color:#fff;">${rhsFormulaSplit}</div>
      <div class="verifier-step-text">${law.stepRhs(m3LawInputs)}</div>
      
      <div style="margin-top:14px;display:flex;flex-direction:column;align-items:center;">
        <div class="gate-led-bulb ${rhsVal === 1 ? 'glow' : ''}">${rhsVal}</div>
        <span style="font-size:0.78rem;font-weight:600;color:${rhsVal === 1 ? '#4ade80' : '#94a3b8'};margin-top:6px;">
          ${rhsVal === 1 ? 'Output Logika: 1 (HIGH)' : 'Output Logika: 0 (LOW)'}
        </span>
      </div>
    </div>
  `;

  // 2. Callout Pronunciation & Cara Baca
  const inputConditionStr = law.vars.map(v => `${v} = ${m3LawInputs[v]}`).join(', ');
  pronounceBox.innerHTML = `
    <div class="pronounce-header">
      <span class="pronounce-tag">🔊 Cara Penyebutan Verbal &amp; Analisis Logika</span>
      <span class="tag tag-green">Status: Terbukti Valid 100%</span>
    </div>
    <div class="pronounce-voice-pill">
      <span>📢</span>
      <span>"${law.pronounce}"</span>
    </div>
    <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6;margin-bottom:0;">
      Pada kombinasi input saat ini (<strong>${inputConditionStr}</strong>), hasil perhitungan Sisi Kiri (LHS) bernilai <strong>${lhsVal}</strong> dan Sisi Kanan (RHS) bernilai <strong>${rhsVal}</strong>. Karena kedua nilai sama persis di setiap kemungkinan baris, maka persamaan hukum ini valid secara matematis dan dapat digunakan untuk menyederhanakan gerbang logika dalam perancangan sirkuit.
    </p>
  `;

  // 3. Truth Table Verifier
  const vars = law.vars;
  const numRows = Math.pow(2, vars.length);
  let tableHtml = `
    <thead>
      <tr>
        ${vars.map(v => `<th>Input ${v}</th>`).join('')}
        <th style="color:var(--accent-blue);">LHS: ${lhsFormulaSplit}</th>
        <th style="color:var(--accent-pink);">RHS: ${rhsFormulaSplit}</th>
        <th style="color:var(--accent-green);">Status Ekuivalen</th>
      </tr>
    </thead>
    <tbody>
  `;

  for (let r = 0; r < numRows; r++) {
    const curInputs = {};
    if (vars.length === 1) {
      curInputs.A = r;
    } else if (vars.length === 2) {
      curInputs.A = (r >> 1) & 1;
      curInputs.B = r & 1;
    } else if (vars.length === 3) {
      curInputs.A = (r >> 2) & 1;
      curInputs.B = (r >> 1) & 1;
      curInputs.C = r & 1;
    }

    const rowLhs = law.evalLhs(curInputs);
    const rowRhs = law.evalRhs(curInputs);

    // Cek apakah baris ini adalah baris aktif saat ini
    const isActiveRow = vars.every(v => curInputs[v] === m3LawInputs[v]);

    tableHtml += `
      <tr style="${isActiveRow ? 'background:rgba(0,212,255,0.18);font-weight:bold;outline:1px solid var(--accent-blue);' : ''}">
        ${vars.map(v => `<td>${curInputs[v]}</td>`).join('')}
        <td style="font-family:var(--font-mono);font-weight:700;color:${rowLhs === 1 ? '#4ade80' : '#cbd5e1'};">${rowLhs}</td>
        <td style="font-family:var(--font-mono);font-weight:700;color:${rowRhs === 1 ? '#4ade80' : '#cbd5e1'};">${rowRhs}</td>
        <td><span style="color:var(--accent-green);">✓ Identik (${rowLhs} = ${rowRhs})</span></td>
      </tr>
    `;
  }

  tableHtml += `</tbody>`;
  tableEl.innerHTML = tableHtml;
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: PLAYGROUND INTERAKTIF SOP & POS (MINTERM vs MAXTERM)
═══════════════════════════════════════════════════════════════ */
function renderTabSopPos(container) {
  container.innerHTML = `
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🎛️ Playground Interaktif Bentuk Standar SOP &amp; POS</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Sesuai materi <strong>Slide 9, 10, 11, dan 16</strong>: Suatu fungsi logika dapat direpresentasikan dalam 2 bentuk kanonik standar: <strong>SOP (Sum of Product / Minterm)</strong> dan <strong>POS (Product of Sum / Maxterm)</strong>. Klik tombol nilai output <strong>F</strong> pada tabel kebenaran di bawah untuk melihat bagaimana rumus SOP dan POS dibentuk secara dinamis!
      </p>

      <!-- Panel Kontrol & Preset Slide -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding:14px;background:rgba(13,21,48,0.5);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.82rem;font-weight:700;color:var(--accent-blue);">Jumlah Variabel:</span>
          <button class="btn btn-sm ${m3SopPosVarCount === 2 ? 'btn-primary' : 'btn-ghost'}" onclick="setM3SopPosVarCount(2)">2 Variabel (A, B)</button>
          <button class="btn btn-sm ${m3SopPosVarCount === 3 ? 'btn-primary' : 'btn-ghost'}" onclick="setM3SopPosVarCount(3)">3 Variabel (A, B, C)</button>
        </div>

        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:0.78rem;color:var(--text-secondary);font-weight:600;">Preset Kasus:</span>
          <button class="btn btn-sm btn-ghost" onclick="setM3SopPosPreset('xor')" title="Contoh 2 Slide 16">Gerbang XOR (Slide 16)</button>
          <button class="btn btn-sm btn-ghost" onclick="setM3SopPosPreset('slide15')" title="Contoh Slide 15">Y = A'BC + ABC (Slide 15)</button>
          <button class="btn btn-sm btn-ghost" onclick="setM3SopPosPreset('all0')">Semua 0</button>
          <button class="btn btn-sm btn-ghost" onclick="setM3SopPosPreset('all1')">Semua 1</button>
        </div>
      </div>

      <!-- Tabel Kebenaran Interaktif -->
      <div style="overflow-x:auto;margin-bottom:24px;">
        <table class="truth-table" style="width:100%;text-align:center;">
          <thead>
            <tr>
              <th>Index Desimal</th>
              ${m3SopPosVarCount === 2 ? `<th>A</th><th>B</th>` : `<th>A</th><th>B</th><th>C</th>`}
              <th style="color:var(--accent-blue);">Output F (Klik!)</th>
              <th style="color:var(--accent-pink);">Minterm (SOP / m)</th>
              <th style="color:var(--accent-violet);">Maxterm (POS / M)</th>
              <th>Status Kontribusi</th>
            </tr>
          </thead>
          <tbody id="m3-soppos-tbody">
            <!-- Diisi oleh updateM3SopPosPlaygroundUI() -->
          </tbody>
        </table>
      </div>

      <!-- Live Formula Results: SOP vs POS -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:18px;margin-bottom:24px;">
        <!-- Card SOP (Minterm) -->
        <div style="background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.3);border-radius:var(--radius-md);padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-family:var(--font-heading);font-weight:700;color:var(--accent-pink);font-size:1.05rem;">
              Sum of Products (SOP)
            </span>
            <span class="tag tag-pink">Dibangun dari F = 1</span>
          </div>
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px;">
            Sesuai Slide 10: Perkalian variabel (AND) yang dijumlahkan (OR). Variabel tanpa komplemen dianggap 1, dengan komplemen dibaca 0.
          </div>
          <div style="margin-bottom:10px;">
            <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;">Notasi Minterm:</div>
            <div id="m3-sop-minterm-notasi" style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:#fff;">F = Σ m(...)</div>
          </div>
          <div>
            <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;">Persamaan Aljabar Kanonik:</div>
            <div id="m3-sop-algebra-notasi" style="font-family:var(--font-mono);font-size:1.1rem;font-weight:700;color:var(--accent-pink);word-break:break-all;">-</div>
          </div>
        </div>

        <!-- Card POS (Maxterm) -->
        <div style="background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.3);border-radius:var(--radius-md);padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-family:var(--font-heading);font-weight:700;color:var(--accent-violet);font-size:1.05rem;">
              Product of Sums (POS)
            </span>
            <span class="tag tag-violet">Dibangun dari F = 0</span>
          </div>
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px;">
            Sesuai Slide 11: Penjumlahan variabel (OR) yang dikalikan (AND). Variabel tanpa komplemen dianggap 0, dengan komplemen dibaca 1.
          </div>
          <div style="margin-bottom:10px;">
            <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-violet);font-weight:700;">Notasi Maxterm:</div>
            <div id="m3-pos-maxterm-notasi" style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:#fff;">F = Π M(...)</div>
          </div>
          <div>
            <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-violet);font-weight:700;">Persamaan Aljabar Kanonik:</div>
            <div id="m3-pos-algebra-notasi" style="font-family:var(--font-mono);font-size:1.1rem;font-weight:700;color:var(--accent-violet);word-break:break-all;">-</div>
          </div>
        </div>
      </div>

      <!-- Kotak Penjelasan Pelafalan Lisan SOP vs POS -->
      <div class="pronounce-callout" id="m3-soppos-pronounce">
        <!-- Diisi oleh updateM3SopPosPlaygroundUI() -->
      </div>
    </div>
  `;

  updateM3SopPosPlaygroundUI();
}

function setM3SopPosVarCount(count) {
  m3SopPosVarCount = count;
  if (count === 2) {
    m3SopPosTable = [0, 1, 1, 0]; // Default XOR 2 var
  } else {
    m3SopPosTable = [0, 0, 0, 1, 0, 0, 0, 1]; // Default 3 var
  }
  renderTabSopPos(document.getElementById('m3-peny-content'));
}

function setM3SopPosPreset(presetType) {
  if (presetType === 'xor') {
    m3SopPosVarCount = 2;
    m3SopPosTable = [0, 1, 1, 0];
  } else if (presetType === 'slide15') {
    m3SopPosVarCount = 3;
    // Y = A'BC (m3) + ABC (m7)
    m3SopPosTable = [0, 0, 0, 1, 0, 0, 0, 1];
  } else if (presetType === 'all0') {
    const total = Math.pow(2, m3SopPosVarCount);
    m3SopPosTable = new Array(total).fill(0);
  } else if (presetType === 'all1') {
    const total = Math.pow(2, m3SopPosVarCount);
    m3SopPosTable = new Array(total).fill(1);
  }
  renderTabSopPos(document.getElementById('m3-peny-content'));
}

function toggleM3SopPosRow(rowIndex) {
  m3SopPosTable[rowIndex] = m3SopPosTable[rowIndex] === 1 ? 0 : 1;
  updateM3SopPosPlaygroundUI();
}

function updateM3SopPosPlaygroundUI() {
  const tbody = document.getElementById('m3-soppos-tbody');
  const sopMintermEl = document.getElementById('m3-sop-minterm-notasi');
  const sopAlgebraEl = document.getElementById('m3-sop-algebra-notasi');
  const posMaxtermEl = document.getElementById('m3-pos-maxterm-notasi');
  const posAlgebraEl = document.getElementById('m3-pos-algebra-notasi');
  const pronounceBox = document.getElementById('m3-soppos-pronounce');
  if (!tbody || !sopMintermEl || !sopAlgebraEl || !posMaxtermEl || !posAlgebraEl || !pronounceBox) return;

  const numRows = Math.pow(2, m3SopPosVarCount);
  let rowsHtml = '';
  const mintermIndices = [];
  const maxtermIndices = [];
  const sopTerms = [];
  const posTerms = [];

  for (let i = 0; i < numRows; i++) {
    const fVal = m3SopPosTable[i] || 0;
    let aVal, bVal, cVal;

    if (m3SopPosVarCount === 2) {
      aVal = (i >> 1) & 1;
      bVal = i & 1;
    } else {
      aVal = (i >> 2) & 1;
      bVal = (i >> 1) & 1;
      cVal = i & 1;
    }

    // Minterm representation (SOP)
    // Slide 10: variabel 1 tanpa komplemen, variabel 0 dikomplemenkan
    let mintermStr = '';
    if (m3SopPosVarCount === 2) {
      mintermStr = `${aVal === 1 ? 'A' : "A'"}${bVal === 1 ? 'B' : "B'"}`;
    } else {
      mintermStr = `${aVal === 1 ? 'A' : "A'"}${bVal === 1 ? 'B' : "B'"}${cVal === 1 ? 'C' : "C'"}`;
    }

    // Maxterm representation (POS)
    // Slide 11: variabel 0 tanpa komplemen, variabel 1 dikomplemenkan
    let maxtermStr = '';
    if (m3SopPosVarCount === 2) {
      maxtermStr = `(${aVal === 0 ? 'A' : "A'"} + ${bVal === 0 ? 'B' : "B'"})`;
    } else {
      maxtermStr = `(${aVal === 0 ? 'A' : "A'"} + ${bVal === 0 ? 'B' : "B'"} + ${cVal === 0 ? 'C' : "C'"})`;
    }

    if (fVal === 1) {
      mintermIndices.push(i);
      sopTerms.push(mintermStr);
    } else {
      maxtermIndices.push(i);
      posTerms.push(maxtermStr);
    }

    const rowClass = fVal === 1 ? 'soppos-row-active-1' : 'soppos-row-active-0';

    rowsHtml += `
      <tr class="${rowClass}">
        <td style="font-family:var(--font-mono);font-weight:700;">m${i} / M${i}</td>
        <td>${aVal}</td>
        <td>${bVal}</td>
        ${m3SopPosVarCount === 3 ? `<td>${cVal}</td>` : ''}
        <td>
          <button class="soppos-toggle-btn ${fVal === 1 ? 'val-1' : 'val-0'}" onclick="toggleM3SopPosRow(${i})" title="Klik untuk mengubah nilai output 0/1">
            ${fVal}
          </button>
        </td>
        <td style="font-family:var(--font-mono);font-weight:${fVal === 1 ? '800' : '400'};color:${fVal === 1 ? 'var(--accent-pink)' : 'var(--text-muted)'};">
          ${mintermStr}
        </td>
        <td style="font-family:var(--font-mono);font-weight:${fVal === 0 ? '800' : '400'};color:${fVal === 0 ? 'var(--accent-violet)' : 'var(--text-muted)'};">
          ${maxtermStr}
        </td>
        <td>
          ${fVal === 1 ? 
            `<span class="tag tag-pink">Masuk ke SOP (m${i})</span>` : 
            `<span class="tag tag-violet">Masuk ke POS (M${i})</span>`
          }
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;

  // Formula SOP
  const sopMintermText = mintermIndices.length > 0 ? `F = Σ m(${mintermIndices.join(', ')})` : `F = 0 (Konstanta Nol)`;
  const sopAlgebraText = sopTerms.length > 0 ? `F = ${sopTerms.join(' + ')}` : `F = 0`;
  sopMintermEl.textContent = sopMintermText;
  sopAlgebraEl.textContent = sopAlgebraText;

  // Formula POS
  const posMaxtermText = maxtermIndices.length > 0 ? `F = Π M(${maxtermIndices.join(', ')})` : `F = 1 (Konstanta Satu)`;
  const posAlgebraText = posTerms.length > 0 ? `F = ${posTerms.join(' • ')}` : `F = 1`;
  posMaxtermEl.textContent = posMaxtermText;
  posAlgebraEl.textContent = posAlgebraText;

  // Pelafalan verbal
  pronounceBox.innerHTML = `
    <div class="pronounce-header">
      <span class="pronounce-tag">🔊 Kaidah Membaca &amp; Pelafalan Lisan (Slide 10 &amp; 11)</span>
      <span class="tag tag-blue">${mintermIndices.length} Minterm Aktif &bull; ${maxtermIndices.length} Maxterm Aktif</span>
    </div>
    <div class="pronounce-voice-pill">
      <span>📢</span>
      <span>"SOP dibaca: ${sopTerms.length > 0 ? sopTerms.join(' ATAU ') : 'Nol'}"</span>
    </div>
    <div style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6;margin-top:8px;">
      <strong>Prinsip Penting Silabus ITERA:</strong>
      <ul style="margin-top:6px;padding-left:20px;margin-bottom:0;">
        <li><strong>Bentuk SOP (Slide 10):</strong> Hanya mengambil baris yang menghasilkan output <strong>F = 1</strong>. Setiap variabel bernilai 1 ditulis normal, dan variabel bernilai 0 ditulis dengan tanda komplemen (aksen). Masing-masing suku dikalikan (AND) lalu seluruh suku dijumlahkan (OR).</li>
        <li><strong>Bentuk POS (Slide 11):</strong> Hanya mengambil baris yang menghasilkan output <strong>F = 0</strong>. Setiap variabel bernilai 0 ditulis normal, dan variabel bernilai 1 ditulis dengan tanda komplemen. Masing-masing variabel dijumlahkan (OR) lalu seluruh suku dikalikan (AND).</li>
      </ul>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: STUDI KASUS KONVERSI & PENYEDERHANAAN (SLIDE 12-16)
═══════════════════════════════════════════════════════════════ */
function renderTabCases(container) {
  const currentCase = M3_CASES[m3CaseSelected] || M3_CASES[0];

  container.innerHTML = `
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">🔄 Studi Kasus Konversi &amp; Reduksi (Sesuai Slide 12 - 16)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
        Pelajari langkah demi langkah bagaimana dosen di slide resmi menyelesaikan konversi <strong>POS ke SOP (Slide 12)</strong>, <strong>SOP ke POS (Slide 13)</strong>, <strong>Penyederhanaan Aljabar 3 Variabel (Slide 15)</strong>, dan <strong>Realisasi XOR (Slide 16)</strong> menggunakan hukum Boolean yang relevan.
      </p>

      <!-- Selector Studi Kasus -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
        ${M3_CASES.map((c, idx) => `
          <button class="btn btn-sm ${m3CaseSelected === idx ? 'btn-primary' : 'btn-ghost'}" onclick="selectM3Case(${idx})">
            ${c.title}
          </button>
        `).join('')}
      </div>

      <!-- Detail Card Kasus yang Dipilih -->
      <div style="background:rgba(13,21,48,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:22px;margin-bottom:22px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px;border-bottom:1px solid var(--border-subtle);padding-bottom:14px;">
          <div>
            <div style="font-size:0.78rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;">${currentCase.title}</div>
            <div style="font-family:var(--font-heading);font-size:1.25rem;font-weight:800;color:#fff;">${currentCase.given}</div>
            <div style="font-size:0.86rem;color:var(--text-secondary);margin-top:4px;">${currentCase.goal}</div>
          </div>
          <div style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);border-radius:var(--radius-md);padding:8px 16px;text-align:right;">
            <div style="font-size:0.7rem;text-transform:uppercase;color:var(--accent-green);font-weight:700;">Hasil Akhir Minimal</div>
            <div style="font-family:var(--font-mono);font-size:1.2rem;font-weight:800;color:#fff;">${currentCase.final}</div>
          </div>
        </div>

        <!-- Tombol Kontrol Stepper -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
          <div style="font-size:0.84rem;font-weight:700;color:var(--text-secondary);">
            Langkah Terlihat: <span style="color:var(--accent-blue);">${Math.min(m3CaseStep, currentCase.steps.length)}</span> dari ${currentCase.steps.length}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm btn-ghost" onclick="prevM3CaseStep()" ${m3CaseStep <= 1 ? 'disabled' : ''}>⏮️ Langkah Mundur</button>
            <button class="btn btn-sm btn-primary" onclick="nextM3CaseStep()" ${m3CaseStep >= currentCase.steps.length ? 'disabled' : ''}>Langkah Selanjutnya ⏭️</button>
            <button class="btn btn-sm btn-ghost" onclick="showAllM3CaseSteps()">Buka Semua Langkah 📖</button>
          </div>
        </div>

        <!-- Timeline Langkah-Langkah -->
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${currentCase.steps.slice(0, m3CaseStep).map((s, idx) => `
            <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(0,212,255,0.2);border-left:4px solid var(--accent-blue);border-radius:var(--radius-md);padding:14px 18px;animation:fadeIn 0.3s ease;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
                <span class="case-step-badge">Langkah ${s.num}: ${s.law}</span>
              </div>
              <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:var(--accent-blue);margin-bottom:6px;">
                ${s.expr}
              </div>
              <div style="font-size:0.86rem;color:var(--text-secondary);line-height:1.5;">
                ${s.desc}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Kotak Pelafalan Kasus -->
      <div class="pronounce-callout">
        <div class="pronounce-header">
          <span class="pronounce-tag">🔊 Kesimpulan &amp; Pelafalan Lisan Hasil Akhir</span>
        </div>
        <div class="pronounce-voice-pill">
          <span>📢</span>
          <span>"${currentCase.pronounce}"</span>
        </div>
      </div>
    </div>
  `;
}

function selectM3Case(caseIdx) {
  m3CaseSelected = caseIdx;
  const currentCase = M3_CASES[caseIdx] || M3_CASES[0];
  m3CaseStep = currentCase.steps.length; // Buka semua langkah saat kasus diganti
  renderTabCases(document.getElementById('m3-peny-content'));
}

function nextM3CaseStep() {
  const currentCase = M3_CASES[m3CaseSelected] || M3_CASES[0];
  if (m3CaseStep < currentCase.steps.length) {
    m3CaseStep++;
    renderTabCases(document.getElementById('m3-peny-content'));
  }
}

function prevM3CaseStep() {
  if (m3CaseStep > 1) {
    m3CaseStep--;
    renderTabCases(document.getElementById('m3-peny-content'));
  }
}

function showAllM3CaseSteps() {
  const currentCase = M3_CASES[m3CaseSelected] || M3_CASES[0];
  m3CaseStep = currentCase.steps.length;
  renderTabCases(document.getElementById('m3-peny-content'));
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4: PRIORITAS OPERASI & KOMPILASI TEOREMA (SLIDE 4, 7, 8)
═══════════════════════════════════════════════════════════════ */
function renderTabTheory(container) {
  container.innerHTML = `
    <!-- Card Prioritas Operasi Aljabar Boolean (Slide 8) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">⚡ Aturan Prioritas Operasi Aljabar Boolean (Slide 8)</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:16px;">
        Dalam evaluasi ekspresi aljabar logika, terdapat tata urutan prioritas resmi yang wajib diikuti agar hasil evaluasi sirkuit tepat:
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;margin-bottom:20px;">
        <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.3);border-radius:var(--radius-md);padding:14px;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;">Prioritas 1 (Tertinggi)</div>
          <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:#fff;margin:4px 0;">Tanda Kurung ( )</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);">Bila terdapat tanda kurung, maka operasi di dalam kurung diselesaikan terlebih dahulu.</div>
        </div>

        <div style="background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.3);border-radius:var(--radius-md);padding:14px;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-pink);font-weight:700;">Prioritas 2</div>
          <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:#fff;margin:4px 0;">NOT ( A' atau Ā )</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);">Operasi inversi atau negasi diselesaikan setelah tanda kurung.</div>
        </div>

        <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.3);border-radius:var(--radius-md);padding:14px;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-green);font-weight:700;">Prioritas 3</div>
          <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:#fff;margin:4px 0;">AND ( • atau AB )</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);">Operasi perkalian logika diselesaikan sebelum penjumlahan logika.</div>
        </div>

        <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-md);padding:14px;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-orange);font-weight:700;">Prioritas 4 (Terendah)</div>
          <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:#fff;margin:4px 0;">OR ( + )</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);">Operasi penjumlahan logika dieksekusi paling akhir jika tanpa tanda kurung.</div>
        </div>
      </div>

      <!-- Contoh Studi Prioritas Slide 8 -->
      <div style="background:rgba(13,21,48,0.7);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;">
        <div style="font-size:0.8rem;text-transform:uppercase;color:var(--accent-blue);font-weight:700;margin-bottom:6px;">Contoh Resmi Slide 8: Evaluasi Ekspresi AB + ĀB</div>
        <div style="font-family:var(--font-mono);font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:10px;">Y = AB + ĀB</div>
        <ol style="margin-bottom:0;padding-left:20px;font-size:0.88rem;color:var(--text-secondary);line-height:1.6;">
          <li>Langkah 1: Selesaikan operasi <strong>NOT</strong> pada suku kedua: <code>Ā</code> (atau <code>A'</code>).</li>
          <li>Langkah 2: Selesaikan operasi <strong>AND</strong> untuk kedua suku: <code>A • B</code> dan <code>Ā • B</code>.</li>
          <li>Langkah 3: Selesaikan operasi <strong>OR</strong> untuk menjumlahkan kedua suku: <code>(AB) + (ĀB)</code>.</li>
        </ol>
      </div>
    </div>

    <!-- Card Kompilasi 10 Hukum Dasar Aljabar Boolean (Slide 7) -->
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Kompilasi 10 Hukum Dasar Aljabar Boolean (Slide 7 Silabus ITERA)</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
        Daftar lengkap hukum dan teorema Aljabar Boolean yang diajarkan pada Pertemuan 3:
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:14px;">
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:8px;">Hukum Identitas</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + 0 = A<br>
                A • 1 = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-pink);font-weight:bold;margin-bottom:8px;">Hukum Dominansi</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A • 0 = 0<br>
                A + 1 = 1
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-green);font-weight:bold;margin-bottom:8px;">Hukum Idempoten</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A = A<br>
                A • A = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-violet);font-weight:bold;margin-bottom:8px;">Hukum Komplemen</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A' = 1<br>
                A • A' = 0
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-orange);font-weight:bold;margin-bottom:8px;">Hukum Involusi</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                (A')' = A  atau  A'' = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-teal);font-weight:bold;margin-bottom:8px;">Hukum Komutatif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + B = B + A<br>
                A • B = B • A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:#d4af37;font-weight:bold;margin-bottom:8px;">Hukum Asosiatif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + (B + C) = (A + B) + C<br>
                A • (B • C) = (A • B) • C
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:8px;">Hukum Distributif</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + (B • C) = (A+B) • (A+C)<br>
                A • (B + C) = A•B + A•C
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-pink);font-weight:bold;margin-bottom:8px;">Hukum Penyerapan (Absorpsi)</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                A + A • B = A<br>
                A • (A + B) = A
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-green);font-weight:bold;margin-bottom:8px;">Hukum De Morgan</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                (A + B)' = A' • B'<br>
                (A • B)' = A' + B'
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:8px;border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-teal);font-weight:bold;margin-bottom:8px;">Hukum 0 / 1</div>
            <div style="font-family:var(--font-mono);color:var(--text-secondary);font-size:.9rem;">
                0' = 1<br>
                1' = 0
            </div>
        </div>
      </div>
    </div>
  `;
}

window.renderMinggu3Penyederhanaan = renderMinggu3Penyederhanaan;
window.switchM3PenyTab = switchM3PenyTab;
window.selectM3Law = selectM3Law;
window.toggleM3LawInput = toggleM3LawInput;
window.updateM3LawVerifierUI = updateM3LawVerifierUI;
window.setM3SopPosVarCount = setM3SopPosVarCount;
window.setM3SopPosPreset = setM3SopPosPreset;
window.toggleM3SopPosRow = toggleM3SopPosRow;
window.updateM3SopPosPlaygroundUI = updateM3SopPosPlaygroundUI;
window.selectM3Case = selectM3Case;
window.nextM3CaseStep = nextM3CaseStep;
window.prevM3CaseStep = prevM3CaseStep;
window.showAllM3CaseSteps = showAllM3CaseSteps;

