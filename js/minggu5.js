/**
 * Minggu5.js
 * Materi Adder & Subtractor (Pertemuan 5)
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 5 — ADDER (PENJUMLAHAN)
═══════════════════════════════════════════════════════════════ */
function renderMinggu5Adder(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Rangkaian Aritmatika: Adder (Penjumlah)</h1>
        <p>Adder adalah blok fundamental dalam Arithmetic Logic Unit (ALU) yang bertugas melakukan operasi penjumlahan bilangan biner. Memahami perancangan dasar logika Adder merupakan kunci utama dalam membangun prosesor dan sistem komputasi digital.</p>
        <div class="week-hero-tags">
          <span class="tag tag-blue">Half Adder</span>
          <span class="tag tag-green">Full Adder</span>
          <span class="tag tag-orange">Ripple Carry Adder (RCA)</span>
          <span class="tag tag-violet">Carry Lookahead Adder (CLA)</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Representasi Bilangan Biner &amp; Two's Complement</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Sebelum membangun rangkaian aritmatika, kita harus memahami bagaimana komputer merepresentasikan bilangan negatif. Komputer modern secara eksklusif menggunakan sistem <strong>Two's Complement (Komplemen-2)</strong>.
      </p>
      
      <div style="background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin-bottom:20px;">
         <h4 style="color:#d4af37;margin-bottom:10px;">Proses Konversi ke Two's Complement:</h4>
         <ol style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin-left:20px;">
            <li>Representasikan bilangan absolut (positif) dalam format biner N-bit.</li>
            <li>Lakukan operasi <strong>One's Complement</strong>: Balikkan seluruh bit (0 menjadi 1, dan 1 menjadi 0) menggunakan gerbang NOT (atau XOR).</li>
            <li>Tambahkan nilai 1 pada bit LSB (Least Significant Bit). Hasilnya adalah representasi Two's Complement yang setara dengan nilai negatif bilangan tersebut.</li>
         </ol>
         <p style="font-size:0.85rem;color:var(--text-muted);margin-top:10px;">
            <strong>Keuntungan utama:</strong> Sistem hanya memerlukan satu rangkaian Adder untuk melakukan penjumlahan dan pengurangan. Operasi $A - B$ dapat direalisasikan sebagai $A + (-B)$, di mana $-B$ adalah bentuk Two's Complement dari $B$.
         </p>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Half Adder</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Half Adder merupakan rangkaian penjumlah paling dasar. Rangkaian ini menjumlahkan 2 bit input (A dan B) dan menghasilkan 2 output: <strong>Sum (S)</strong> dan <strong>Carry (C)</strong>. Kelemahan utamanya adalah ketiadaan input "Carry-in", sehingga Half Adder tidak dapat digunakan secara langsung (cascading) untuk penjumlahan bilangan multi-bit (lebih dari 1 bit).
      </p>
      
      <div style="display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px;">
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
          <h4 style="color:#d4af37;margin-bottom:10px;">Persamaan Logika Half Adder</h4>
          <ul style="color:var(--text-secondary);line-height:1.8;font-family:var(--font-mono);font-size:0.9rem;background:var(--bg-tertiary);padding:15px;border-radius:8px;">
            <li>S = A ⊕ B <span style="color:#888;">(Operasi XOR)</span></li>
            <li>C = A · B <span style="color:#888;">(Operasi AND)</span></li>
          </ul>
        </div>
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">Tabel Kebenaran Half Adder</h4>
           <table class="cheat-table" style="width:100%;font-size:0.85rem;">
              <thead>
                <tr><th>A</th><th>B</th><th>Carry (C)</th><th>Sum (S)</th></tr>
              </thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>1</td><td>0</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td>0</td><td>1</td></tr>
                <tr><td>1</td><td>1</td><td>1</td><td>0</td></tr>
              </tbody>
           </table>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Full Adder &amp; Optimalisasi Carry</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Full Adder adalah penyempurnaan dari Half Adder yang memiliki kemampuan menjumlahkan 3 input biner sekaligus: <strong>A, B, dan Carry-in (Cin)</strong> dari tahap perhitungan sebelumnya. Ia menghasilkan output <strong>Sum (S)</strong> dan <strong>Carry-out (Cout)</strong>.
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px;">
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">Persamaan Logika Full Adder</h4>
           <ul style="color:var(--text-secondary);line-height:1.8;font-family:var(--font-mono);font-size:0.9rem;background:var(--bg-tertiary);padding:15px;border-radius:8px;">
             <li>S = A ⊕ B ⊕ Cin</li>
             <li>Cout = (A·B) + (Cin·(A ⊕ B))</li>
           </ul>
        </div>
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
             <h4 style="color:#d4af37;margin-bottom:10px;">RCA vs CLA</h4>
             <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
               <strong>Ripple Carry Adder (RCA):</strong> Penjumlah multi-bit seri. Sangat sederhana, tetapi mengalami waktu tunda (propagation delay) karena setiap tahap Full Adder harus menunggu status carry dari tahap sebelumnya secara berurutan.<br><br>
               <strong>Carry Lookahead Adder (CLA):</strong> Arsitektur optimal yang mengatasi delay RCA. Menghitung carry lebih awal secara paralel menggunakan fungsi <i>Generate (G = A·B)</i> dan <i>Propagate (P = A⊕B)</i> tanpa perlu merambat secara berurutan.
             </p>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER: MINGGU 5 — SUBTRACTOR & TERINTEGRASI
═══════════════════════════════════════════════════════════════ */
function renderMinggu5Subtractor(container) {
  container.innerHTML = `
    <div class="week-hero hp-theme">
      <div class="week-hero-content">
        <h1>Rangkaian Aritmatika: Subtractor &amp; Integrasi</h1>
        <p>Beranjak dari penjumlahan, Subtractor bertugas melakukan operasi pengurangan (A - B). Dalam komputasi modern, operasi pengurangan direalisasikan menggunakan metode komplemen-2 (Two's Complement) yang memungkinkan penggunaan satu rangkaian Adder untuk melakukan penjumlahan maupun pengurangan sekaligus.</p>
        <div class="week-hero-tags">
          <span class="tag tag-pink">Half Subtractor</span>
          <span class="tag tag-red">Full Subtractor</span>
          <span class="tag tag-violet">Adder-Subtractor Terintegrasi</span>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Half Subtractor &amp; Full Subtractor</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Rangkaian pengurangan menghasilkan selisih (<strong>Difference / D</strong>) dan <strong>Borrow-out (Bout)</strong> ketika harus meminjam nilai dari bit berorde lebih tinggi (misalnya saat 0 dikurangi 1). Full Subtractor mendukung tiga input: Minuend (A), Subtrahend (B), dan Borrow-in (Bin).
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px;">
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">Tabel Kebenaran Full Subtractor</h4>
           <table class="cheat-table" style="width:100%;font-size:0.85rem;">
              <thead>
                <tr><th>A</th><th>B</th><th>Bin</th><th>Borrow (Bout)</th><th>Diff (D)</th></tr>
              </thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
                <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
              </tbody>
           </table>
        </div>
        <div style="flex:1;min-width:250px;background:rgba(255,255,255,0.02);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
           <h4 style="color:#d4af37;margin-bottom:10px;">Persamaan Logika Full Subtractor</h4>
           <ul style="color:var(--text-secondary);line-height:1.8;font-family:var(--font-mono);font-size:0.9rem;background:var(--bg-tertiary);padding:15px;border-radius:8px;">
             <li>D = A ⊕ B ⊕ Bin</li>
             <li>Bout = A'·(B + Bin) + (B·Bin)</li>
           </ul>
           <p style="font-size:0.8rem;color:var(--text-muted);margin-top:10px;">Persamaan D identik dengan Sum pada Full Adder. Perbedaan mendasar hanya terletak pada persamaan Borrow yang melibatkan negasi A (A').</p>
        </div>
      </div>
    </div>
    
    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">📖 Kamus Simbol Logika pada Adder/Subtractor</h3>
      </div>
      <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:16px;">
        Rangkaian Adder dan Subtractor menggunakan kombinasi beberapa simbol gerbang logika mendasar:
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px;margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--font-mono);font-size:1.1rem;font-weight:bold;color:var(--accent-orange);">⊕</span>
            <strong style="color:#fff;font-size:0.85rem;">XOR (Sum / Difference)</strong>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menghasilkan bit jumlahan tanpa carry ($S = A \oplus B$).<br>
            <strong>Cara Baca:</strong> <em>"A XOR B" (A eksklusif-atau B)</em>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--font-mono);font-size:1.1rem;font-weight:bold;color:var(--accent-blue);">·</span>
            <strong style="color:#fff;font-size:0.85rem;">AND (Carry Generator)</strong>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Mendeteksi carry jika kedua bit 1 ($C = A \cdot B$).<br>
            <strong>Cara Baca:</strong> <em>"A AND B" (A dikali B secara logika)</em>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--font-mono);font-size:1.1rem;font-weight:bold;color:var(--accent-pink);">+</span>
            <strong style="color:#fff;font-size:0.85rem;">OR (Carry Combiner)</strong>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Menggabungkan carry dari tahap lokal dan tahap propagate.<br>
            <strong>Cara Baca:</strong> <em>"OR" (atau)</em>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:8px;border:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--font-mono);font-size:1.1rem;font-weight:bold;color:var(--accent-green);">'</span>
            <strong style="color:#fff;font-size:0.85rem;">NOT / Inversi (2's Complement)</strong>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);">
            <strong>Fungsi:</strong> Membalik bit B ($B' = B \oplus 1$) pada mode pengurangan.<br>
            <strong>Cara Baca:</strong> <em>"B aksen" atau "NOT B"</em>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card mb-28">
      <div class="glass-card-header">
        <h3 class="glass-card-title">Simulator Adder-Subtractor Terintegrasi 4-bit</h3>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Dengan memanfaatkan gerbang logika <strong>XOR</strong>, kita dapat merancang sistem 4-bit yang mampu melakukan A + B ataupun A - B, dikendalikan oleh sinyal Mode (M). Konsep dasarnya menggunakan prinsip representasi bilangan Two's Complement.
      </p>
      
      <div style="display:flex;gap:12px;margin-bottom:20px;">
        <div style="flex:1;background:rgba(34,197,94,0.05);padding:12px;border-radius:8px;border:1px solid rgba(34,197,94,0.3);font-size:0.85rem;">
            <strong style="color:var(--accent-green);">Mode ADD (M = 0):</strong> XOR antara bit B dengan 0 tidak mengubah B (B ⊕ 0 = B). Cin awal = 0. Operasi menjadi <strong>A + B</strong>.
        </div>
        <div style="flex:1;background:rgba(239,68,68,0.05);padding:12px;border-radius:8px;border:1px solid rgba(239,68,68,0.3);font-size:0.85rem;">
            <strong style="color:var(--accent-red);">Mode SUB (M = 1):</strong> XOR antara bit B dengan 1 membalik status bit (B ⊕ 1 = B'). Cin awal = 1. Operasi menjadi <strong>A + B' + 1</strong> yang secara ekuivalen adalah operasi matematika <strong>A - B</strong>.
        </div>
      </div>

      <div style="background:var(--bg-tertiary);border:1px solid var(--border-subtle);border-radius:12px;padding:20px;">
         
         <div style="display:flex;justify-content:center;gap:30px;margin-bottom:20px;align-items:flex-end;flex-wrap:wrap;">
            <div style="display:flex;flex-direction:column;align-items:center;">
               <label style="color:#d4af37;font-weight:bold;margin-bottom:8px;font-size:0.9rem;">Input A (0-15)</label>
               <input type="number" id="sim5-a" min="0" max="15" value="5" oninput="updateSim5()" onchange="updateSim5()" style="width:85px;background:var(--bg-secondary);border:1px solid var(--accent-blue);color:white;padding:10px;border-radius:8px;font-family:var(--font-mono);font-size:1.2rem;text-align:center;">
            </div>
            
            <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.05);padding:10px 20px;border-radius:8px;border:1px solid var(--border-subtle);">
               <label style="color:var(--accent-pink);font-weight:bold;margin-bottom:8px;font-size:0.9rem;">Sinyal Mode (M)</label>
               <select id="sim5-m" onchange="updateSim5()" style="background:var(--bg-secondary);border:1px solid var(--accent-pink);color:white;padding:10px;border-radius:8px;font-family:var(--font-mono);font-size:1rem;cursor:pointer;">
                 <option value="0">M=0 (Tambah / +)</option>
                 <option value="1">M=1 (Kurang / -)</option>
               </select>
            </div>
            
            <div style="display:flex;flex-direction:column;align-items:center;">
               <label style="color:#d4af37;font-weight:bold;margin-bottom:8px;font-size:0.9rem;">Input B (0-15)</label>
               <input type="number" id="sim5-b" min="0" max="15" value="3" oninput="updateSim5()" onchange="updateSim5()" style="width:85px;background:var(--bg-secondary);border:1px solid var(--accent-blue);color:white;padding:10px;border-radius:8px;font-family:var(--font-mono);font-size:1.2rem;text-align:center;">
            </div>
         </div>

         <!-- Tombol Buktikan / Hitung Manual -->
         <div style="display:flex;justify-content:center;margin-bottom:25px;">
           <button class="convert-btn hp-theme" onclick="updateSim5()" style="background:linear-gradient(to right, #bf953f, #b38728);color:#1a1c29;font-weight:bold;padding:10px 24px;cursor:pointer;border-radius:8px;box-shadow:0 4px 15px rgba(191,149,63,0.3);">
             ✨ Hitung &amp; Buktikan Hasil
           </button>
         </div>
         
         <!-- Visualisasi Blok FA -->
         <div id="sim5-diagram" style="display:flex;justify-content:center;gap:12px;margin-bottom:30px;overflow-x:auto;padding:10px 5px;">
            <!-- Diagram Generated by JS -->
         </div>
         
         <div style="text-align:center;">
           <div style="font-family:var(--font-mono);font-size:1.1rem;color:var(--text-secondary);margin-bottom:5px;">Hasil Akhir:</div>
           <div id="sim5-result" style="font-family:var(--font-mono);font-size:2.2rem;font-weight:bold;color:white;text-shadow:0 0 10px rgba(0,212,255,0.5);letter-spacing:4px;">0000</div>
           <div id="sim5-result-dec" style="color:var(--accent-green);font-size:1.2rem;margin-top:8px;font-weight:bold;">Desimal: 0</div>
         </div>

         <!-- Pronunciation & Spoken Explanation Container -->
         <div id="sim5-pronounce-box" style="margin-top:20px;"></div>
      </div>

    </div>
  `;
  
  // Initialize simulator view on render
  setTimeout(updateSim5, 50);
}

// Logic for 4-bit Adder/Subtractor Simulator
function updateSim5() {
  const elA = document.getElementById('sim5-a');
  const elB = document.getElementById('sim5-b');
  const elM = document.getElementById('sim5-m');
  const diagram = document.getElementById('sim5-diagram');
  
  if(!elA || !elB || !elM || !diagram) return;
  
  let rawA = elA.value.trim();
  let rawB = elB.value.trim();
  let valA = rawA === '' ? 0 : parseInt(rawA, 10);
  let valB = rawB === '' ? 0 : parseInt(rawB, 10);
  if (isNaN(valA)) valA = 0;
  if (isNaN(valB)) valB = 0;
  
  // Clamping to 4 bits (0-15)
  if (valA < 0) valA = 0;
  if (valA > 15) valA = 15;
  if (valB < 0) valB = 0;
  if (valB > 15) valB = 15;
  
  let M = parseInt(elM.value, 10) || 0;
  
  let aBits = valA.toString(2).padStart(4, '0').split('').map(Number).reverse();
  let bBitsOriginal = valB.toString(2).padStart(4, '0').split('').map(Number).reverse();
  
  // Apply XOR with M
  let bBits = bBitsOriginal.map(b => b ^ M);
  
  let c = [M]; // Cin for FA0 is M
  let s = [];
  
  // Hitung carries dan sum secara berurutan dari LSB (0) ke MSB (3)
  for(let i=0; i<4; i++) {
     let sum = aBits[i] ^ bBits[i] ^ c[i];
     let carryOut = (aBits[i] & bBits[i]) | (c[i] & (aBits[i] ^ bBits[i]));
     s.push(sum);
     c.push(carryOut); // c[i+1]
  }
  
  // Build UI Left (MSB FA3) to Right (LSB FA0)
  let html = '';
  for(let i=3; i>=0; i--) {
     let blockHtml = `
        <div style="display:flex;flex-direction:column;align-items:center;min-width:85px;position:relative;">
           <!-- Inputs -->
           <div style="display:flex;justify-content:space-between;width:100%;margin-bottom:8px;font-family:var(--font-mono);font-size:1.05rem;font-weight:bold;padding:0 4px;">
              <span style="color:var(--accent-blue);" title="A${i}">A${i}=${aBits[i]}</span>
              <span style="color:var(--accent-pink);" title="B${i}">B${i}=${bBitsOriginal[i]}</span>
           </div>
           
           <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px;background:rgba(255,255,255,0.04);padding:2px 6px;border-radius:4px;" title="B${i} XOR ${M} = ${bBits[i]}">
             XOR(M) &rarr; <span style="color:white;font-weight:bold;">${bBits[i]}</span>
           </div>
           
           <!-- FA Block -->
           <div style="background:var(--bg-secondary);border:2px solid var(--border-glow);border-radius:8px;width:100%;padding:14px 4px;text-align:center;position:relative;box-shadow:inset 0 0 10px rgba(0,212,255,0.1);">
              <span style="font-size:0.85rem;font-weight:bold;color:var(--text-secondary);display:block;">FA ${i}</span>
              
              <!-- Carry IN arrow (comes from right side) -->
              ${i === 0 
                ? `<div style="position:absolute;right:-28px;top:50%;transform:translateY(-50%);font-size:0.65rem;color:var(--accent-orange);font-weight:bold;white-space:nowrap;z-index:2;">&larr; ${c[i]} <span style="font-size:0.55rem;">(Cin)</span></div>`
                : `<div style="position:absolute;right:-18px;top:50%;transform:translateY(-50%);font-size:0.75rem;color:var(--accent-orange);font-weight:bold;z-index:2;">&larr; ${c[i]}</div>`
              }
              
              <!-- Carry OUT arrow (goes to left side) -->
              ${i === 3
                ? `<div style="position:absolute;left:-38px;top:50%;transform:translateY(-50%);font-size:0.65rem;color:var(--accent-orange);font-weight:bold;white-space:nowrap;z-index:2;"><span style="font-size:0.55rem;">(Cout)</span> ${c[i+1]} &larr;</div>`
                : ''
              }
           </div>
           
           <!-- Sum Output -->
           <div style="margin-top:14px;font-family:var(--font-mono);font-size:1.4rem;font-weight:bold;color:var(--accent-green);background:rgba(34,197,94,0.1);width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid var(--accent-green);">
              ${s[i]}
           </div>
           <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">S${i}</div>
        </div>
     `;
     html += blockHtml;
  }
  
  diagram.innerHTML = html;
  
  // Format result
  let resultBin = [...s].reverse().join('');
  let cout = c[4];
  
  const resEl = document.getElementById('sim5-result');
  const resDecEl = document.getElementById('sim5-result-dec');
  
  if (resEl) {
     resEl.innerText = resultBin;
  }
  
  // Handle two's complement interpretation for display
  let decResult = 0;
  let explanation = '';
  
  if (M === 1) { // Pengurangan (A - B)
     let mathResult = valA - valB;
     let rawVal = parseInt(resultBin, 2);
     if (rawVal >= 8) { // Bilangan negatif dalam Komplemen-2 4-bit
         decResult = rawVal - 16;
     } else {
         decResult = rawVal;
     }
     
     explanation = `Operasi: ${valA} - ${valB} = ${mathResult} | S = ${resultBin}₂ (${decResult}₁₀)${cout === 1 ? ' | Cout = 1 (Tidak ada borrow)' : ' | Cout = 0 (Terjadi borrow / hasil negatif)'}`;
  } else { // Penjumlahan (A + B)
     let totalMath = valA + valB;
     decResult = parseInt(resultBin, 2);
     if (cout === 1) {
       explanation = `Operasi: ${valA} + ${valB} = ${totalMath} | S = ${resultBin}₂ (${decResult}₁₀) dengan Carry-Out = 1 | Total 5-bit: ${cout}${resultBin}₂ = ${totalMath}₁₀`;
     } else {
       explanation = `Operasi: ${valA} + ${valB} = ${totalMath} | S = ${resultBin}₂ (${decResult}₁₀) | Carry-Out = 0`;
     }
  }
  
  if (resDecEl) {
     resDecEl.innerHTML = `Desimal: <span style="font-size:1.3rem;color:var(--accent-green);font-weight:bold;">${decResult}</span> <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:6px;font-weight:normal;">${explanation}</div>`;
  }

  const pronounceBox = document.getElementById('sim5-pronounce-box');
  if (pronounceBox) {
    let readAloud = '';
    let symbolBreakdown = '';
    
    if (M === 0) {
      let totalMath = valA + valB;
      readAloud = `"Penjumlahan: ${valA} ditambah ${valB} menghasilkan ${totalMath}"`;
      symbolBreakdown = `
        <strong>Simbol &amp; Rumus yang Bekerja:</strong><br>
        &bull; <strong>Sum:</strong> <code>S = A ⊕ B ⊕ Cin</code> &rarr; Menghitung jumlahan modulo-2 per bit menggunakan gerbang XOR (<code>⊕</code>).<br>
        &bull; <strong>Carry-Out:</strong> <code>Cout = (A·B) + (Cin·(A ⊕ B))</code> &rarr; Menggunakan gerbang AND (<code>·</code>) untuk deteksi carry dan gerbang OR (<code>+</code>) untuk penggabungan carry.
      `;
    } else {
      let mathResult = valA - valB;
      readAloud = `"Pengurangan: ${valA} dikurangi ${valB} menghasilkan ${mathResult}"`;
      symbolBreakdown = `
        <strong>Simbol &amp; Rumus yang Bekerja:</strong><br>
        &bull; <strong>Inversi Two's Complement:</strong> <code>B ⊕ 1 = B'</code> (NOT B) &rarr; Gerbang XOR dengan kontrol M=1 membalik setiap bit B.<br>
        &bull; <strong>Penambahan +1:</strong> <code>Cin awal = 1</code> &rarr; Menjadikan persamaan <code>A + B' + 1</code> yang secara matematis ekuivalen dengan operasi <code>A - B</code>.
      `;
    }

    pronounceBox.innerHTML = `
      <div class="pronounce-callout" style="text-align:left;">
        <div class="pronounce-header">
          <span class="pronounce-tag">${M === 0 ? 'MODE ADD (PENJUMLAHAN)' : 'MODE SUB (PENGURANGAN)'}</span>
          <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">Operasi Gerbang Logika 4-Bit Terintegrasi</span>
        </div>
        <div style="margin-bottom:10px;">
          <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#d4af37;letter-spacing:1px;margin-bottom:6px;">🗣️ Cara Penyebutan Lisan / Verbal Hasil Percobaan:</div>
          <div class="pronounce-voice-pill">
            <span>🔊</span>
            <span style="color:#00d4ff;">${readAloud}</span>
          </div>
        </div>
        <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6;background:rgba(0,0,0,0.3);padding:10px 14px;border-radius:8px;">
          ${symbolBreakdown}
        </div>
      </div>
    `;
  }
}
