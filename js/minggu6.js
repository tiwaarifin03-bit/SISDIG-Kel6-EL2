/**
 * Minggu6.js
 * Materi Multilevel Logic & MUX (Pertemuan 6)
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 6 — MULTILEVEL NAND & NOR
═══════════════════════════════════════════════════════════════ */
function renderMinggu6Multilevel(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Rangkaian Universal &amp; Logika Multilevel</h1>
        <p>Secara fungsional, kita tidak perlu memproduksi semua jenis gerbang logika untuk membangun sistem digital kompleks. Gerbang NAND dan NOR didefinisikan sebagai <strong>Gerbang Universal</strong> karena kombinasi dari salah satu jenis gerbang ini saja mampu mensimulasikan seluruh operasi Boolean lainnya (AND, OR, NOT, XOR).</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">Universal NAND</span>
          <span class="tag tag-violet">Universal NOR</span>
          <span class="tag tag-green">Logika Multilevel</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Pembuktian Universalitas Gerbang</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Dengan mengaplikasikan Teorema De Morgan secara berulang, kita dapat mentransformasi persamaan logika standar ke dalam bentuk ekuivalen yang hanya tersusun dari gerbang NAND atau NOR.
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:16px;">
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--border-subtle);">
            <strong style="color:var(--accent-blue);">Sintesis NOT</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Hubungkan semua input sebuah gerbang NAND atau NOR ke sumber sinyal yang sama. Secara aljabar: A NAND A = (A·A)' = A' dan A NOR A = (A+A)' = A'.
            </p>
         </div>
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--border-subtle);">
            <strong style="color:var(--accent-pink);">Sintesis AND dari NAND</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Hubungkan output dari gerbang NAND pertama ke input gerbang NAND kedua (yang difungsikan sebagai NOT). Hasil: ((A·B)')' = A·B.
            </p>
         </div>
         <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;border:1px solid var(--border-subtle);">
            <strong style="color:var(--accent-green);">Sintesis OR dari NAND</strong>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">
               Sesuai De Morgan. Inversikan masing-masing input menggunakan NAND pembentuk NOT, lalu masukkan hasilnya ke NAND. Hasil: A' NAND B' = (A'·B')' = A + B.
            </p>
         </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Perancangan Rangkaian Multilevel</h3>
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary);">
        Untuk meminimalkan jenis komponen yang digunakan pada level pabrikasi perangkat keras, sebuah rangkaian seringkali dikonversi sepenuhnya menjadi rangkaian Multilevel NAND.
      </p>
      <div style="margin-top:16px;background:rgba(0,212,255,0.05);padding:16px;border-left:4px solid var(--accent-blue);border-radius:0 12px 12px 0;">
         <h4 style="color:var(--accent-blue);margin-bottom:8px;">Metodologi Konversi ke Multilevel NAND:</h4>
         <ol style="color:var(--text-secondary);font-size:0.85rem;margin-left:20px;line-height:1.6;">
            <li>Reduksi dan tuliskan persamaan fungsi Boolean dalam representasi <strong>SOP (Sum of Product)</strong>.</li>
            <li>Implementasikan seluruh operasi AND pada tingkat pertama menggunakan gerbang NAND.</li>
            <li>Implementasikan operasi OR pada tingkat akhir menggunakan gerbang NAND. <i>(Berdasarkan De Morgan, gerbang OR yang semua inputnya diinversi adalah ekuivalen fungsional dengan gerbang NAND)</i>.</li>
            <li>Setiap variabel tunggal yang tidak masuk ke operasi AND harus dilewatkan melalui gerbang NAND pembentuk NOT untuk penyesuaian fasa (fasa ganda).</li>
         </ol>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 6 — MULTIPLEXER (MUX)
═══════════════════════════════════════════════════════════════ */
function renderMinggu6Mux(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Multiplexer (Data Selector)</h1>
        <p>Multiplexer (MUX) merupakan komponen rangkaian kombinasional yang bertugas menyeleksi dan merutekan informasi biner dari sekumpulan jalur input data menuju satu jalur output tunggal. Rute transmisi data ini dikendalikan sepenuhnya oleh sekumpulan input pemilih (Select Lines).</p>
        <div class="week-hero-tags">
          <span class="tag tag-orange">Data Selector</span>
          <span class="tag tag-blue">Kombinasional</span>
          <span class="tag tag-green">Multiple Input &rarr; Single Output</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Arsitektur &amp; Ekspresi Boolean MUX</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Aturan dasar desain MUX: Jika sebuah MUX memiliki <strong>k</strong> jalur selektor, maka MUX tersebut mampu mengakomodasi <strong>2<sup>k</sup></strong> jalur input data. Output selalu berjumlah <strong>1</strong> jalur.
      </p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">MUX 2:1</h4>
           <ul style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin-left:20px;">
              <li><strong>Input Data:</strong> 2 jalur (D<sub>0</sub>, D<sub>1</sub>)</li>
              <li><strong>Select Line:</strong> 1 jalur (S<sub>0</sub>)</li>
              <li><strong>Persamaan Y:</strong> Y = S<sub>0</sub>'·D<sub>0</sub> + S<sub>0</sub>·D<sub>1</sub></li>
           </ul>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">MUX 4:1</h4>
           <ul style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin-left:20px;">
              <li><strong>Input Data:</strong> 4 jalur (D<sub>0</sub>, D<sub>1</sub>, D<sub>2</sub>, D<sub>3</sub>)</li>
              <li><strong>Select Line:</strong> 2 jalur (S<sub>1</sub>, S<sub>0</sub>)</li>
              <li><strong>Persamaan Y:</strong> Y = S<sub>1</sub>'S<sub>0</sub>'·D<sub>0</sub> + S<sub>1</sub>'S<sub>0</sub>·D<sub>1</sub> + S<sub>1</sub>S<sub>0</sub>'·D<sub>2</sub> + S<sub>1</sub>S<sub>0</sub>·D<sub>3</sub></li>
           </ul>
        </div>
        <div style="grid-column:1/-1;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">MUX 8:1</h4>
           <ul style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin-left:20px;">
              <li><strong>Input Data:</strong> 8 jalur (D<sub>0</sub> - D<sub>7</sub>)</li>
              <li><strong>Select Line:</strong> 3 jalur (S<sub>2</sub>, S<sub>1</sub>, S<sub>0</sub>)</li>
              <li><strong>Persamaan Y:</strong> Ekspansi 8 suku (term) AND yang dijumlahkan. MUX ukuran ini sering digunakan untuk mengeksekusi persamaan fungsi Boolean kompleks tanpa perlu mendesain gerbang logika dasarnya.</li>
           </ul>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Kamus Simbol &amp; Cara Penyebutan Persamaan MUX</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:14px;">
        Ekspresi Boolean internal Multiplexer 4:1 dinyatakan dengan persamaan SOP (Sum of Product):
      </p>
      <div style="background:var(--bg-tertiary);padding:14px;border-radius:10px;border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.95rem;color:var(--accent-blue);margin-bottom:14px;">
        Y = S1'·S0'·D0 + S1'·S0·D1 + S1·S0'·D2 + S1·S0·D3
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px;">
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-pink);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Simbol [ ' ] (NOT / Aksen)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menginversi status bit selektor jika bernilai 0.<br>
            <strong>Cara Baca:</strong> <em>"NOT S1" atau "S1 aksen"</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-blue);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Simbol [ · ] (AND / Implisit)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menguji kecocokan kombinasi selektor dengan data input.<br>
            <strong>Cara Baca:</strong> <em>"AND" (dan)</em>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="color:var(--accent-green);font-weight:700;font-size:0.85rem;margin-bottom:4px;">Simbol [ + ] (OR)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menyatukan seluruh cabang data menuju 1 pin output tunggal.<br>
            <strong>Cara Baca:</strong> <em>"OR" (atau)</em>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Simulator MUX Data Selector (4:1)</h3>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
         Visualisasi arsitektur internal 4:1 Multiplexer. Ubah nilai-nilai input data (D) dan atur konfigurasi Sinyal Seleksi (S1, S0). Amati bagaimana jalur logika spesifik diaktifkan untuk meloloskan data menuju gerbang OR akhir.
      </p>
      
      <div class="converter-section" style="grid-template-columns: 1fr;">
        <div style="background:var(--bg-tertiary);padding:20px;border-radius:12px;border:1px solid #d4af37;">
          
          <!-- Data Inputs section -->
          <div style="display:flex;justify-content:space-evenly;margin-bottom:20px;padding-bottom:15px;border-bottom:1px dashed rgba(255,255,255,0.1);">
             <div style="display:flex;flex-direction:column;align-items:center;">
                <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-blue);font-weight:bold;">D0</span>
                <button id="sim6-d0" class="bit-cell" style="cursor:pointer;margin-top:8px;" onclick="toggleSim6('d0')">0</button>
             </div>
             <div style="display:flex;flex-direction:column;align-items:center;">
                <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-pink);font-weight:bold;">D1</span>
                <button id="sim6-d1" class="bit-cell" style="cursor:pointer;margin-top:8px;" onclick="toggleSim6('d1')">0</button>
             </div>
             <div style="display:flex;flex-direction:column;align-items:center;">
                <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-green);font-weight:bold;">D2</span>
                <button id="sim6-d2" class="bit-cell" style="cursor:pointer;margin-top:8px;" onclick="toggleSim6('d2')">0</button>
             </div>
             <div style="display:flex;flex-direction:column;align-items:center;">
                <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-violet);font-weight:bold;">D3</span>
                <button id="sim6-d3" class="bit-cell" style="cursor:pointer;margin-top:8px;" onclick="toggleSim6('d3')">0</button>
             </div>
          </div>

          <!-- MUX Block visualizer -->
          <div style="display:flex;justify-content:center;align-items:center;margin:30px 0;">
             <!-- Flow visualizer -->
             <div style="display:flex;flex-direction:column;gap:15px;">
                <div id="path-d0" style="width:50px;height:4px;background:rgba(255,255,255,0.1);transition:0.3s;position:relative;">
                  <span style="position:absolute;top:-20px;font-size:0.7rem;color:var(--accent-blue);">S1'S0'</span>
                </div>
                <div id="path-d1" style="width:50px;height:4px;background:rgba(255,255,255,0.1);transition:0.3s;position:relative;">
                  <span style="position:absolute;top:-20px;font-size:0.7rem;color:var(--accent-pink);">S1'S0</span>
                </div>
                <div id="path-d2" style="width:50px;height:4px;background:rgba(255,255,255,0.1);transition:0.3s;position:relative;">
                  <span style="position:absolute;top:-20px;font-size:0.7rem;color:var(--accent-green);">S1S0'</span>
                </div>
                <div id="path-d3" style="width:50px;height:4px;background:rgba(255,255,255,0.1);transition:0.3s;position:relative;">
                  <span style="position:absolute;top:-20px;font-size:0.7rem;color:var(--accent-violet);">S1S0</span>
                </div>
             </div>

             <!-- Core MUX Polygon styling -->
             <div style="position:relative;width:120px;height:180px;background:rgba(212,175,55,0.05);border:2px solid #d4af37;border-radius:12px;display:flex;flex-direction:column;justify-content:center;align-items:center;box-shadow:inset 0 0 20px rgba(212,175,55,0.1);">
                <span style="font-weight:bold;color:#d4af37;letter-spacing:2px;">MUX<br>4:1</span>
                
                <!-- Internal OR Gate logic -->
                <div style="font-size:0.7rem;color:var(--text-muted);margin-top:20px;">Gerbang OR</div>
                <div style="width:30px;height:30px;border-radius:50% 50% 0 50%;border:2px solid var(--text-muted);transform:rotate(45deg);margin-top:5px;"></div>
                
                <!-- Select Lines input from bottom -->
                <div style="position:absolute;bottom:-30px;display:flex;gap:15px;">
                   <div style="display:flex;flex-direction:column;align-items:center;">
                      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-orange);font-weight:bold;margin-bottom:5px;">S1</span>
                      <button id="sim6-s1" class="bit-cell" style="width:30px;height:30px;font-size:0.9rem;border-color:var(--accent-orange);color:var(--accent-orange);" onclick="toggleSim6('s1')">0</button>
                   </div>
                   <div style="display:flex;flex-direction:column;align-items:center;">
                      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-orange);font-weight:bold;margin-bottom:5px;">S0</span>
                      <button id="sim6-s0" class="bit-cell" style="width:30px;height:30px;font-size:0.9rem;border-color:var(--accent-orange);color:var(--accent-orange);" onclick="toggleSim6('s0')">0</button>
                   </div>
                </div>
             </div>
             
             <!-- Output Path -->
             <div id="path-out" style="width:50px;height:4px;background:rgba(255,255,255,0.1);transition:0.3s;"></div>
             
             <div style="display:flex;flex-direction:column;align-items:center;margin-left:10px;">
                <span style="font-family:var(--font-mono);font-size:0.85rem;color:#d4af37;font-weight:bold;margin-bottom:5px;">Output (Y)</span>
                <div id="sim6-y" style="font-family:var(--font-mono);font-size:1.6rem;font-weight:bold;color:white;width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:rgba(212,175,55,0.15);border:2px solid #d4af37;border-radius:12px;">0</div>
             </div>
          </div>
          
          <div style="margin-top:50px;text-align:center;font-size:0.9rem;color:var(--text-secondary);">
             <span style="background:var(--bg-secondary);padding:5px 15px;border-radius:20px;border:1px solid var(--border-subtle);">
                Jalur aktif: <strong id="sim6-active-label" style="color:var(--accent-blue);">D0 (S1=0, S0=0)</strong>
             </span>
          </div>

          <!-- Pronunciation & Spoken Explanation Container -->
          <div id="sim6-pronounce-box" style="margin-top:20px;"></div>

        </div>
      </div>
      
    </div>
  `;
  
  setTimeout(updateSim6, 50);
}

// State for 4:1 MUX
let mux4State = { d0:0, d1:0, d2:0, d3:0, s1:0, s0:0 };

function toggleSim6(pin) {
  mux4State[pin] = mux4State[pin] ? 0 : 1;
  document.getElementById(`sim6-${pin}`).innerText = mux4State[pin];
  updateSim6();
}

function updateSim6() {
  const s1 = mux4State.s1;
  const s0 = mux4State.s0;
  
  // Calculate selection index
  const selectIndex = (s1 << 1) | s0;
  
  // Array of data values
  const dVals = [mux4State.d0, mux4State.d1, mux4State.d2, mux4State.d3];
  const activeData = dVals[selectIndex];
  
  // Output element
  const yEl = document.getElementById('sim6-y');
  if (yEl) {
    yEl.innerText = activeData;
    yEl.style.boxShadow = activeData ? '0 0 20px rgba(212,175,55,0.6)' : 'none';
  }
  
  // Update path visualizations
  const colors = [
    'var(--accent-blue)', 
    'var(--accent-pink)', 
    'var(--accent-green)', 
    'var(--accent-violet)'
  ];
  
  for(let i=0; i<4; i++) {
     const pathEl = document.getElementById(`path-d${i}`);
     if(!pathEl) continue;
     
     if (i === selectIndex) {
         pathEl.style.background = colors[i];
         pathEl.style.boxShadow = `0 0 10px ${colors[i]}`;
         pathEl.style.height = '6px';
     } else {
         pathEl.style.background = 'rgba(255,255,255,0.1)';
         pathEl.style.boxShadow = 'none';
         pathEl.style.height = '4px';
     }
  }
  
  const pathOut = document.getElementById('path-out');
  if (pathOut) {
     pathOut.style.background = colors[selectIndex];
     pathOut.style.boxShadow = activeData ? `0 0 10px ${colors[selectIndex]}` : 'none';
     if(activeData === 0) pathOut.style.opacity = '0.5'; else pathOut.style.opacity = '1';
  }
  
  const labelEl = document.getElementById('sim6-active-label');
  if (labelEl) {
     labelEl.innerText = `D${selectIndex} (S1=${s1}, S0=${s0})`;
     labelEl.style.color = colors[selectIndex];
  }

  // Pronunciation & Spoken Explanation for MUX
  const termFormulas = [
    { term: "S1'·S0'·D0", spoken: "NOT S1 AND NOT S0 AND D0", binary: "00" },
    { term: "S1'·S0·D1",  spoken: "NOT S1 AND S0 AND D1",      binary: "01" },
    { term: "S1·S0'·D2",  spoken: "S1 AND NOT S0 AND D2",      binary: "10" },
    { term: "S1·S0·D3",   spoken: "S1 AND S0 AND D3",          binary: "11" }
  ];

  const currentTerm = termFormulas[selectIndex];
  const pronounceBox = document.getElementById('sim6-pronounce-box');
  if (pronounceBox) {
    pronounceBox.innerHTML = `
      <div class="pronounce-callout" style="text-align:left;">
        <div class="pronounce-header">
          <span class="pronounce-tag">JALUR TERPILIH: D${selectIndex}</span>
          <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">Sinyal Seleksi: S1=${s1}, S0=${s0} (Biner ${currentTerm.binary}₂ = Desimal ${selectIndex})</span>
        </div>
        <div style="margin-bottom:10px;">
          <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#d4af37;letter-spacing:1px;margin-bottom:6px;">🗣️ Cara Penyebutan Lisan / Verbal Jalur Ini:</div>
          <div class="pronounce-voice-pill">
            <span>🔊</span>
            <span style="color:#00d4ff;">"Suku logika aktif: ${currentTerm.spoken}"</span>
          </div>
        </div>
        <div style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;">
          <strong>💡 Penjelasan Kerja Seleksi:</strong> Karena S1 bernilai <code>${s1}</code> dan S0 bernilai <code>${s0}</code>, hanya gerbang AND untuk jalur <strong>D${selectIndex}</strong> yang mendapatkan input 1 pada semua pin seleksinya. Nilai dari jalur <strong>D${selectIndex} = ${activeData}</strong> diloloskan menuju output <strong>Y = ${activeData}</strong>.
        </div>
      </div>
    `;
  }
}
