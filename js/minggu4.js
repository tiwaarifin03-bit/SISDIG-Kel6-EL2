/**
 * Minggu4.js
 * Materi Karnaugh Map (Pertemuan 4)
 */

'use strict';

function renderMinggu4Kmap(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Penyederhanaan Fungsi dengan Peta Karnaugh (K-Map)</h1>
        <p>Karnaugh Map (K-Map) adalah metode grafis untuk menyederhanakan persamaan aljabar Boolean. K-Map memanfaatkan kemampuan visual manusia untuk mengidentifikasi pola pengelompokan yang optimal (Prime Implicants) tanpa perlu melakukan komputasi matematis panjang berulang-ulang menggunakan hukum aljabar Boolean.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">Minterm (1)</span>
          <span class="tag tag-green">Maxterm (0)</span>
          <span class="tag tag-orange">Kode Gray</span>
          <span class="tag tag-violet">Kondisi Don't Care (X)</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Aturan Pengelompokan (Grouping) K-Map</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Dalam melakukan penyederhanaan fungsi Boolean menggunakan K-Map, terdapat protokol ketat yang harus dipatuhi untuk memastikan hasil fungsi yang didapatkan adalah bentuk paling minimal (paling sedikit gerbang logika).
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--accent-blue);">
            <strong style="color:var(--accent-blue);">1. Pemanfaatan Kode Gray</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Baris dan kolom K-Map diurutkan menggunakan <strong>Kode Gray (00, 01, 11, 10)</strong>, bukan biner standar. Hal ini menjamin bahwa sel-sel yang bersebelahan secara fisik hanya memiliki perbedaan <strong>tepat 1 bit</strong> (Hamming distance = 1), sehingga dapat direduksi.
            </p>
         </div>
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--accent-green);">
            <strong style="color:var(--accent-green);">2. Syarat Geometris Kelompok (Group)</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Setiap kelompok (group) hanya boleh berisi angka 1 (untuk SOP). Ukuran kelompok wajib berupa pangkat dua: <strong>1, 2, 4, 8, atau 16 sel</strong>. Bentuk kelompok harus persegi atau persegi panjang (tidak boleh diagonal atau bentuk L).
            </p>
         </div>
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--accent-orange);">
            <strong style="color:var(--accent-orange);">3. Prioritas Pengelompokan Terbesar</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Selalu buat kelompok sebesar mungkin. Semakin besar kelompok sel yang disatukan, semakin sedikit variabel yang tersisa dalam suku (term) hasil reduksi, yang menghemat penggunaan input gerbang logika.
            </p>
         </div>
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--accent-violet);">
            <strong style="color:var(--accent-violet);">4. Sifat Menggulung (Wrap-Around)</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               K-Map tidak memiliki ujung. Sel di tepi kanan bersebelahan secara logis dengan sel di tepi kiri. Sel di tepi atas bersebelahan dengan sel di tepi bawah. Kelompok dapat menyeberangi tepi-tepi ini.
            </p>
         </div>
      </div>
    </div>

    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Struktur Peta Karnaugh (2, 3, dan 4 Variabel)</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Jumlah sel (kotak) dalam sebuah K-Map ditentukan oleh rumus <strong>2<sup>n</sup></strong>, di mana n adalah jumlah variabel input.
      </p>
      
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:20px;">
         <div style="flex:1;min-width:200px;background:rgba(255,255,255,0.02);padding:15px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
            <strong style="color:var(--accent-blue);">2 Variabel (4 Sel)</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Menggunakan variabel A dan B. Tabel berukuran 2x2. Baris merepresentasikan nilai A (0, 1) dan kolom merepresentasikan B (0, 1).
            </p>
         </div>
         <div style="flex:1;min-width:200px;background:rgba(255,255,255,0.02);padding:15px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
            <strong style="color:var(--accent-green);">3 Variabel (8 Sel)</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Menggunakan variabel A, B, C. Tabel berukuran 2x4. Urutan kolom (BC) harus menggunakan kode Gray: <strong>00, 01, 11, 10</strong>.
            </p>
         </div>
         <div style="flex:1;min-width:200px;background:rgba(255,255,255,0.02);padding:15px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
            <strong style="color:var(--accent-pink);">4 Variabel (16 Sel)</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Menggunakan A, B, C, D. Tabel berukuran 4x4. Baik baris (AB) maupun kolom (CD) wajib menggunakan kode Gray: <strong>00, 01, 11, 10</strong> secara berurutan.
            </p>
         </div>
      </div>
    </div>
  `;
}

function renderMinggu4DontCare(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Kondisi Tak Acuh (Don't Care) &amp; K-Map 4 Variabel</h1>
        <p>Dalam sistem digital, terdapat kombinasi input yang tidak pernah mungkin terjadi secara operasional, atau nilai outputnya tidak relevan bagi sistem. Kondisi ini direpresentasikan dengan simbol <strong>X (Don't Care)</strong>.</p>
        <div class="week-hero-tags">
          <span class="tag tag-red">Don't Care (X)</span>
          <span class="tag tag-blue">Penyederhanaan 4 Variabel</span>
          <span class="tag tag-green">Quine-McCluskey</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Optimalisasi K-Map dengan Don't Care</h3>
      </div>
      <div style="background:rgba(255,255,255,0.02);padding:20px;border-radius:12px;border-left:4px solid var(--accent-pink);">
        <p style="font-size:0.9rem;color:var(--text-secondary);">
          Kondisi X memiliki sifat ganda. Anda diizinkan untuk menganggap X sebagai 1 <strong>jika dan hanya jika</strong> langkah tersebut membantu memperbesar ukuran kelompok yang sedang Anda buat (misalnya mengubah kelompok berukuran 2 menjadi 4). Namun, Anda <strong>tidak wajib</strong> mengelompokkan semua nilai X. Biarkan X bernilai 0 jika ia tidak berkontribusi dalam memperbesar kelompok manapun.
        </p>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Panduan Simbol Logika pada Hasil Penyederhanaan K-Map</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:14px;">
        Hasil akhir pengelompokan K-Map menghasilkan fungsi dalam format <strong>SOP (Sum of Product)</strong> yang menggunakan simbol-simbol berikut:
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px;">
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-pink);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Simbol [ ' ] (NOT / Aksen)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menandakan variabel bernilai 0 pada minterm kelompok.<br>
            <strong>Cara Baca:</strong> <em>"NOT A" atau "A aksen"</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-blue);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Perkalian Implisit (AND)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menghubungkan variabel dalam satu suku (misal: A'B).<br>
            <strong>Cara Baca:</strong> <em>"A aksen AND B" (A aksen dikali B)</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-green);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Simbol [ + ] (OR)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menjumlahkan / menggabungkan antar suku kelompok minterm.<br>
            <strong>Cara Baca:</strong> <em>"OR" (atau / ditambah secara logika)</em>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">K-Map Grid Interaktif 4 Variabel</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
         Klik sel pada K-Map di bawah untuk mengganti nilai (0 &rarr; 1 &rarr; X). Setelah selesai, klik "Sederhanakan" untuk melihat hasil reduksi ekspresi Boolean secara otomatis.
      </p>
      
      <div style="display:flex;flex-direction:column;align-items:center;">
        
        <!-- Tabel K-Map 4x4 -->
        <div style="position:relative;margin-bottom:20px;">
          <table style="border-collapse:collapse;font-family:var(--font-mono);background:var(--bg-secondary);border:2px solid var(--border-subtle);">
            <tr>
              <td rowspan="2" colspan="2" style="border-right:2px solid var(--border-subtle);border-bottom:2px solid var(--border-subtle);position:relative;width:60px;height:60px;">
                <div style="position:absolute;top:5px;right:5px;font-size:0.75rem;color:var(--accent-blue);font-weight:bold;">CD</div>
                <div style="position:absolute;bottom:5px;left:5px;font-size:0.75rem;color:var(--accent-pink);font-weight:bold;">AB</div>
                <svg width="100%" height="100%" style="position:absolute;top:0;left:0;"><line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--border-subtle)" stroke-width="2"/></svg>
              </td>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-blue);">00</th>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-blue);">01</th>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-blue);">11</th>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-blue);">10</th>
            </tr>
            <tr></tr>
            <tr>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-pink);">00</th>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-0" class="kmap-cell" onclick="toggleKmap4(0)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-1" class="kmap-cell" onclick="toggleKmap4(1)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-3" class="kmap-cell" onclick="toggleKmap4(3)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-2" class="kmap-cell" onclick="toggleKmap4(2)">0</button></td>
            </tr>
            <tr>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-pink);">01</th>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-4" class="kmap-cell" onclick="toggleKmap4(4)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-5" class="kmap-cell" onclick="toggleKmap4(5)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-7" class="kmap-cell" onclick="toggleKmap4(7)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-6" class="kmap-cell" onclick="toggleKmap4(6)">0</button></td>
            </tr>
            <tr>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-pink);">11</th>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-12" class="kmap-cell" onclick="toggleKmap4(12)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-13" class="kmap-cell" onclick="toggleKmap4(13)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-15" class="kmap-cell" onclick="toggleKmap4(15)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-14" class="kmap-cell" onclick="toggleKmap4(14)">0</button></td>
            </tr>
            <tr>
              <th style="padding:10px;border:1px solid var(--border-subtle);color:var(--accent-pink);">10</th>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-8" class="kmap-cell" onclick="toggleKmap4(8)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-9" class="kmap-cell" onclick="toggleKmap4(9)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-11" class="kmap-cell" onclick="toggleKmap4(11)">0</button></td>
              <td style="border:1px solid var(--border-subtle);"><button id="kmap4-10" class="kmap-cell" onclick="toggleKmap4(10)">0</button></td>
            </tr>
          </table>
        </div>
        
        <button class="convert-btn hp-theme" onclick="simplifyKmap4()" style="margin-bottom:20px;background:linear-gradient(to right, #bf953f, #b38728);color:#1a1c29;">
          Sederhanakan Fungsi
        </button>
        
        <div id="kmap4-legend" style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;justify-content:center;">
           <!-- Dynamic grouping colors legend -->
        </div>

        <div style="background:var(--bg-tertiary);padding:15px 30px;border-radius:12px;border:1px solid #d4af37;width:100%;text-align:center;box-shadow:0 0 15px rgba(212,175,55,0.2);">
           <span style="font-family:var(--font-heading);color:#d4af37;font-size:1rem;margin-right:10px;font-weight:bold;">Y =</span>
           <span id="kmap4-result" style="font-family:var(--font-mono);font-size:1.4rem;color:white;font-weight:bold;">0</span>
        </div>

        <!-- Pronunciation & Spoken Explanation Container -->
        <div id="kmap4-pronounce-box" style="margin-top:20px;width:100%;"></div>
      </div>
    </div>
    
    <style>
      .kmap-cell {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        font-weight: bold;
        background: transparent;
        color: var(--text-primary);
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
        margin: 2px;
      }
      .kmap-cell:hover {
        background: rgba(255,255,255,0.1);
      }
      .kmap-val-1 {
        color: var(--accent-green);
        background: rgba(34,197,94,0.1);
      }
      .kmap-val-X {
        color: var(--accent-orange);
      }
    </style>
  `;
}

// State map: cell index (0-15) -> value (0, 1, 'X')
let kmap4State = Array(16).fill(0);

function toggleKmap4(index) {
  let val = kmap4State[index];
  if (val === 0) val = 1;
  else if (val === 1) val = 'X';
  else val = 0;
  
  kmap4State[index] = val;
  const btn = document.getElementById(`kmap4-${index}`);
  btn.innerText = val;
  
  // Clear previous box shadows / grouping colors
  for(let i=0; i<16; i++) {
     const cell = document.getElementById(`kmap4-${i}`);
     cell.style.boxShadow = 'none';
     cell.style.backgroundColor = 'transparent';
  }
  document.getElementById('kmap4-legend').innerHTML = '';
  
  // Update classes
  btn.classList.remove('kmap-val-1', 'kmap-val-X');
  if (val === 1) btn.classList.add('kmap-val-1');
  if (val === 'X') btn.classList.add('kmap-val-X');
  
  // Clear previous result to prompt user to simplify again
  document.getElementById('kmap4-result').innerText = '...';
}

function simplifyKmap4() {
  const resultEl = document.getElementById('kmap4-result');
  
  let ones = [];
  let dcs = [];
  
  for (let i = 0; i < 16; i++) {
    if (kmap4State[i] === 1) ones.push(i);
    else if (kmap4State[i] === 'X') dcs.push(i);
  }
  
  if (ones.length === 0) {
    resultEl.innerText = '0';
    return;
  }
  if (ones.length + dcs.length === 16) {
    resultEl.innerText = '1';
    return;
  }
  
  // Quine-McCluskey (Simplified Greedy Approach for Demo)
  let minterms = ones.concat(dcs);
  
  let implicants = minterms.map(m => {
    let bin = m.toString(2).padStart(4, '0');
    return { term: bin, minterms: [m], covered: false };
  });
  
  let primeImplicants = [];
  
  function getDiff(t1, t2) {
    let diff = 0;
    let combined = '';
    for (let i=0; i<4; i++) {
      if (t1[i] !== t2[i]) {
        diff++;
        combined += '-';
      } else {
        combined += t1[i];
      }
    }
    return diff === 1 ? combined : null;
  }
  
  let currentGroup = implicants;
  let nextGroup = [];
  
  while (currentGroup.length > 0) {
    let added = new Set();
    for (let i = 0; i < currentGroup.length; i++) {
      for (let j = i + 1; j < currentGroup.length; j++) {
        let combined = getDiff(currentGroup[i].term, currentGroup[j].term);
        if (combined) {
          currentGroup[i].covered = true;
          currentGroup[j].covered = true;
          if (!added.has(combined)) {
            added.add(combined);
            nextGroup.push({
              term: combined,
              minterms: [...new Set([...currentGroup[i].minterms, ...currentGroup[j].minterms])],
              covered: false
            });
          }
        }
      }
    }
    
    // Add uncovered to PIs
    currentGroup.forEach(imp => {
      if (!imp.covered) primeImplicants.push(imp);
    });
    
    currentGroup = nextGroup;
    nextGroup = [];
  }
  
  // Petrick's Method / Greedy Set Cover
  // We only need to cover 'ones', not 'dcs'
  let toCover = new Set(ones);
  let selectedPIs = [];
  
  // 1. Essential PIs
  let essential = [];
  ones.forEach(m => {
    let coveringPIs = primeImplicants.filter(pi => pi.minterms.includes(m));
    if (coveringPIs.length === 1) {
      if (!essential.includes(coveringPIs[0])) {
        essential.push(coveringPIs[0]);
      }
    }
  });
  
  essential.forEach(pi => {
    selectedPIs.push(pi);
    pi.minterms.forEach(m => toCover.delete(m));
  });
  
  // 2. Greedy for remaining
  primeImplicants = primeImplicants.filter(pi => !essential.includes(pi));
  
  while (toCover.size > 0) {
    // Sort PIs by number of uncovered minterms they cover, descending
    primeImplicants.sort((a, b) => {
      let coverA = a.minterms.filter(m => toCover.has(m)).length;
      let coverB = b.minterms.filter(m => toCover.has(m)).length;
      return coverB - coverA;
    });
    
    let bestPI = primeImplicants[0];
    if (bestPI.minterms.filter(m => toCover.has(m)).length === 0) break; // Should not happen if logic is correct
    
    selectedPIs.push(bestPI);
    bestPI.minterms.forEach(m => toCover.delete(m));
    primeImplicants.shift();
  }
  
  // Define colors for groupings
  const groupColors = [
    'rgba(239, 68, 68, 0.4)', // Red
    'rgba(59, 130, 246, 0.4)', // Blue
    'rgba(34, 197, 94, 0.4)', // Green
    'rgba(168, 85, 247, 0.4)', // Purple
    'rgba(234, 179, 8, 0.4)', // Yellow
    'rgba(236, 72, 153, 0.4)'  // Pink
  ];
  
  const legendEl = document.getElementById('kmap4-legend');
  legendEl.innerHTML = '';
  
  // Format to variables A, B, C, D and apply grouping colors
  let eq = selectedPIs.map((pi, index) => {
    let str = '';
    if (pi.term[0] === '0') str += "A'"; else if (pi.term[0] === '1') str += "A";
    if (pi.term[1] === '0') str += "B'"; else if (pi.term[1] === '1') str += "B";
    if (pi.term[2] === '0') str += "C'"; else if (pi.term[2] === '1') str += "C";
    if (pi.term[3] === '0') str += "D'"; else if (pi.term[3] === '1') str += "D";
    if (str === '') str = '1';
    
    // Apply visual color to cells
    const color = groupColors[index % groupColors.length];
    
    // Animate the cells for this group
    pi.minterms.forEach(m => {
       const cell = document.getElementById(`kmap4-${m}`);
       if(cell) {
          // If cell already has a color, blend them (or just apply multiple box shadows)
          const currentShadow = cell.style.boxShadow;
          const newShadow = `inset 0 0 20px ${color}`;
          cell.style.boxShadow = (currentShadow && currentShadow !== 'none') ? currentShadow + ', ' + newShadow : newShadow;
          cell.style.backgroundColor = color.replace('0.4', '0.2'); // light background
       }
    });
    
    // Add to legend
    legendEl.innerHTML += `<span style="background:${color.replace('0.4', '0.2')};border:1px solid ${color.replace('0.4', '1')};padding:4px 8px;border-radius:4px;font-family:var(--font-mono);font-size:0.85rem;color:white;">${str}</span>`;
    
    return str;
  }).join(' + ');
  
  resultEl.innerText = eq;
  
  // Optional: Visual styling (pulsing effect) to show completion
  resultEl.style.animation = 'none';
  resultEl.offsetHeight; // trigger reflow
  resultEl.style.animation = 'groupAppear 0.5s ease forwards';

  // Update Pronunciation callout for K-Map result
  const pronounceBox = document.getElementById('kmap4-pronounce-box');
  if (pronounceBox) {
    let spoken = '';
    if (eq === '0') {
      spoken = '"Fungsi bernilai Nol konstan (semua sel bernilai 0)"';
    } else if (eq === '1') {
      spoken = '"Fungsi bernilai Satu konstan (seluruh sel membentuk kelompok 16)"';
    } else {
      let parts = selectedPIs.map(pi => {
        let pStr = '';
        if (pi.term[0] === '0') pStr += "NOT A "; else if (pi.term[0] === '1') pStr += "A ";
        if (pi.term[1] === '0') pStr += "NOT B "; else if (pi.term[1] === '1') pStr += "B ";
        if (pi.term[2] === '0') pStr += "NOT C "; else if (pi.term[2] === '1') pStr += "C ";
        if (pi.term[3] === '0') pStr += "NOT D "; else if (pi.term[3] === '1') pStr += "D ";
        return pStr.trim().replace(/\s+/g, ' AND ');
      });
      spoken = `"${parts.join(' ATAU (OR) ')}"`;
    }

    pronounceBox.innerHTML = `
      <div class="pronounce-callout" style="text-align:left;">
        <div class="pronounce-header">
          <span class="pronounce-tag">HASIL PENYEDERHANAAN K-MAP 4 VARIABEL</span>
          <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">${selectedPIs.length} Kelompok Prime Implicant</span>
        </div>
        <div style="margin-bottom:10px;">
          <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#d4af37;letter-spacing:1px;margin-bottom:6px;">🗣️ Cara Penyebutan Lisan / Verbal Hasil Reduksi:</div>
          <div class="pronounce-voice-pill">
            <span>🔊</span>
            <span style="color:#00d4ff;">${spoken}</span>
          </div>
        </div>
        <div style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;">
          <strong>💡 Penjelasan Aljabar:</strong> Bentuk minimal di atas adalah gabungan (OR / <code>+</code>) dari suku-suku minterm yang terbentuk dari kelompok terbesar. Setiap variabel dengan tanda aksen (<code>'</code>) mewakili nilai bit 0, sedangkan tanpa aksen mewakili nilai bit 1.
        </div>
      </div>
    `;
  }
}
