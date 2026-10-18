/**
 * app.js - Navigation & Routing for Media Ajar Sistem Digital
 */

// ===== Week/Menu Data Structure =====
const weekData = [
  {
    id: 'minggu1',
    week: 1,
    title: 'Sistem Bilangan & Konversi',
    icon: '🔢',
    status: 'active',
    submenus: [
      { id: 'minggu1-konversi', title: 'Konversi Bilangan', icon: '🔄' },
      { id: 'minggu1-latihan', title: 'Latihan Interaktif', icon: '🎯' }
    ]
  },
  {
    id: 'minggu2',
    week: 2,
    title: 'Bilangan Negatif & Aritmatika',
    icon: '➖',
    status: 'active',
    submenus: [
      { id: 'minggu2-materi', title: 'Bilangan Negatif', icon: '🔢' },
      { id: 'minggu2-aritmatika', title: 'Aritmatika Biner', icon: '🧮' },
      { id: 'minggu2-latihan', title: 'Latihan Interaktif', icon: '🎯' }
    ]
  },
  {
    id: 'minggu3',
    week: 3,
    title: 'Aljabar Boolean & Gerbang Logika',
    icon: '⚡',
    status: 'active',
    submenus: [
      { id: 'minggu3-gerbang', title: 'Simulator Gerbang Logika', icon: '🔌' },
      { id: 'minggu3-penyederhanaan', title: 'Hukum Boolean & SOP/POS', icon: '📋' }
    ]
  },
  {
    id: 'minggu4',
    week: 4,
    title: 'Karnaugh Map (K-Map)',
    icon: '🗺️',
    status: 'active',
    submenus: [
      { id: 'minggu4-kmap', title: 'K-Map 2, 3, 4 Variabel', icon: '📊' },
      { id: 'minggu4-dontcare', title: "Don't Care Conditions", icon: '❓' }
    ]
  },
  {
    id: 'minggu5',
    week: 5,
    title: 'Adder & Subtractor',
    icon: '➕',
    status: 'active',
    submenus: [
      { id: 'minggu5-adder', title: 'Half & Full Adder', icon: '🧮' },
      { id: 'minggu5-subtractor', title: 'Subtractor & Terintegrasi', icon: '➖' }
    ]
  },
  {
    id: 'minggu6',
    week: 6,
    title: 'Multilevel Logic & MUX',
    icon: '🔀',
    status: 'active',
    submenus: [
      { id: 'minggu6-multilevel', title: 'NAND & NOR Universal', icon: '⚡' },
      { id: 'minggu6-mux', title: 'Multiplexer (MUX)', icon: '🛤️' }
    ]
  },
  {
    id: 'minggu7',
    week: 7,
    title: 'Decoder, Encoder & 7-Seg',
    icon: '📟',
    status: 'active',
    submenus: [
      { id: 'minggu7-decoder', title: 'Decoder & Aplikasinya', icon: '🔓' },
      { id: 'minggu7-encoder', title: 'Encoder & Priority Encoder', icon: '🎹' },
      { id: 'minggu7-sevenseg', title: 'BCD ke 7-Segment Display', icon: '💡' }
    ]
  },

  {
    id: 'minggu8',
    week: 8,
    title: 'UTS (Ujian Tengah Semester)',
    icon: '📝',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu8-review', title: 'Review Materi Minggu 1-7', icon: '📚' }
    ]
  },
  {
    id: 'minggu9',
    week: 9,
    title: 'Multiplexer & Demultiplexer',
    icon: '🔀',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu9-mux', title: 'Multiplexer (MUX)', icon: '🔄' },
      { id: 'minggu9-demux', title: 'Demultiplexer (DEMUX)', icon: '↗️' }
    ]
  },
  {
    id: 'minggu10',
    week: 10,
    title: 'Encoder & Decoder',
    icon: '🏷️',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu10-encoder', title: 'Encoder & Priority Encoder', icon: '🔐' },
      { id: 'minggu10-decoder', title: 'Decoder & Display 7-Segmen', icon: '🖥️' }
    ]
  },
  {
    id: 'minggu11',
    week: 11,
    title: 'Flip-Flop',
    icon: '🔁',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu11-sr', title: 'SR & D Flip-Flop', icon: '🔲' },
      { id: 'minggu11-jkt', title: 'JK & T Flip-Flop', icon: '🔳' }
    ]
  },
  {
    id: 'minggu12',
    week: 12,
    title: 'Register & Counter',
    icon: '🔢',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu12-register', title: 'Shift Register', icon: '↔️' },
      { id: 'minggu12-counter', title: 'Counter (Synchronous & Async)', icon: '⏱️' }
    ]
  },
  {
    id: 'minggu13',
    week: 13,
    title: 'Rangkaian Sekuensial',
    icon: '📈',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu13-fsm', title: 'Finite State Machine', icon: '🔄' },
      { id: 'minggu13-diagram', title: 'State Diagram & Tabel', icon: '📊' }
    ]
  },
  {
    id: 'minggu14',
    week: 14,
    title: 'Review & UAS',
    icon: '🎓',
    status: 'coming-soon',
    submenus: [
      { id: 'minggu14-review', title: 'Review Seluruh Materi', icon: '📚' },
      { id: 'minggu14-latihan', title: 'Latihan Soal UAS', icon: '🎯' }
    ]
  }
];

// ===== State =====
let currentWeek = 'minggu1';
let currentSubmenu = 'minggu1-konversi';
window.weekData = weekData;
window.currentWeek = currentWeek;
window.currentSubmenu = currentSubmenu;

// ===== DOM Builders =====

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  let html = '<div class="nav-section-label">📚 Materi Perkuliahan</div>';

  weekData.forEach((week) => {
    const isActive = week.id === currentWeek;
    const isExpanded = week.id === currentWeek;
    const badgeClass = week.status === 'active' ? 'active-badge' : 'coming-soon';
    const badgeText = week.status === 'active' ? 'Aktif' : 'Segera';

    html += `
      <div class="nav-item ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}" data-week="${week.id}">
        <div class="nav-item-header" onclick="toggleWeekMenu('${week.id}')">
          <div class="nav-item-icon">${week.icon}</div>
          <span class="nav-item-text">M${week.week} - ${week.title}</span>
          <span class="nav-item-badge ${badgeClass}">${badgeText}</span>
          <span class="nav-item-arrow">▶</span>
        </div>
        <div class="nav-submenu">
          ${week.submenus.map(sub => `
            <div class="nav-submenu-item ${sub.id === currentSubmenu ? 'active' : ''}" 
                 onclick="navigateTo('${week.id}', '${sub.id}')"
                 data-submenu="${sub.id}">
              <span>${sub.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  nav.innerHTML = html;
}

function toggleWeekMenu(weekId) {
  const item = document.querySelector(`.nav-item[data-week="${weekId}"]`);
  if (!item) return;

  // Close others
  document.querySelectorAll('.nav-item.expanded').forEach(el => {
    if (el !== item) el.classList.remove('expanded');
  });

  item.classList.toggle('expanded');
}

function navigateTo(weekId, submenuId) {
  currentWeek = weekId;
  currentSubmenu = submenuId;
  window.currentWeek = weekId;
  window.currentSubmenu = submenuId;
  if (window.SisDigitalPlayer && typeof window.SisDigitalPlayer.updateCurrentTopicIndicator === 'function') {
    window.SisDigitalPlayer.updateCurrentTopicIndicator();
  }

  // Update sidebar active states
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-submenu-item').forEach(el => el.classList.remove('active'));

  const weekItem = document.querySelector(`.nav-item[data-week="${weekId}"]`);
  if (weekItem) {
    weekItem.classList.add('active', 'expanded');
  }

  const subItem = document.querySelector(`.nav-submenu-item[data-submenu="${submenuId}"]`);
  if (subItem) {
    subItem.classList.add('active');
  }

  // Update breadcrumb
  updateBreadcrumb(weekId, submenuId);

  // Render content
  renderContent(weekId, submenuId);

  // Close mobile sidebar
  closeMobileSidebar();
}

function updateBreadcrumb(weekId, submenuId) {
  const week = weekData.find(w => w.id === weekId);
  const sub = week?.submenus.find(s => s.id === submenuId);

  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb && week && sub) {
    breadcrumb.innerHTML = `
      <span class="breadcrumb-item">Sistem Digital</span>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-item">Minggu ${week.week}</span>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-item current">${sub.title}</span>
    `;
  }
}

function renderContent(weekId, submenuId) {
  const contentBody = document.getElementById('content-body');
  if (!contentBody) return;

  const week = weekData.find(w => w.id === weekId);

  if (week.status === 'coming-soon') {
    contentBody.innerHTML = `
      <div class="coming-soon">
        <div class="coming-soon-icon">🚧</div>
        <h2>Coming Soon</h2>
        <p>Materi <strong>Minggu ${week.week} - ${week.title}</strong> sedang dalam pengembangan dan akan segera tersedia.</p>
      </div>
    `;
    return;
  }

  // Week 1 content
  if (weekId === 'minggu1') {
    if (submenuId === 'minggu1-konversi') {
      renderMinggu1Konversi(contentBody);
    } else if (submenuId === 'minggu1-latihan') {
      renderMinggu1Latihan(contentBody);
    }
  }

  // Week 2 content
  if (weekId === 'minggu2') {
    if (submenuId === 'minggu2-materi') {
      renderMinggu2Materi(contentBody);
    } else if (submenuId === 'minggu2-aritmatika') {
      renderMinggu2Aritmatika(contentBody);
    } else if (submenuId === 'minggu2-latihan') {
      renderMinggu2Latihan(contentBody);
    }
  }

  // Week 3 content
  if (weekId === 'minggu3') {
    if (submenuId === 'minggu3-gerbang') {
      if (typeof renderMinggu3Gerbang === 'function') renderMinggu3Gerbang(contentBody);
    } else if (submenuId === 'minggu3-penyederhanaan') {
      if (typeof renderMinggu3Penyederhanaan === 'function') renderMinggu3Penyederhanaan(contentBody);
    }
  }
  // Week 4 content
  if (weekId === 'minggu4') {
    if (submenuId === 'minggu4-kmap') {
      if (typeof renderMinggu4Kmap === 'function') renderMinggu4Kmap(contentBody);
    } else if (submenuId === 'minggu4-dontcare') {
      if (typeof renderMinggu4DontCare === 'function') renderMinggu4DontCare(contentBody);
    }
  }

  // Week 5 content
  if (weekId === 'minggu5') {
    if (submenuId === 'minggu5-adder') {
      if (typeof renderMinggu5Adder === 'function') renderMinggu5Adder(contentBody);
    } else if (submenuId === 'minggu5-subtractor') {
      if (typeof renderMinggu5Subtractor === 'function') renderMinggu5Subtractor(contentBody);
    }
  }

  // Week 6 content
  if (weekId === 'minggu6') {
    if (submenuId === 'minggu6-multilevel') {
      if (typeof renderMinggu6Multilevel === 'function') renderMinggu6Multilevel(contentBody);
    } else if (submenuId === 'minggu6-mux') {
      if (typeof renderMinggu6Mux === 'function') renderMinggu6Mux(contentBody);
    }
  }

  // Week 7 content
  if (weekId === 'minggu7') {
    if (submenuId === 'minggu7-decoder') {
      if (typeof renderMinggu7Decoder === 'function') renderMinggu7Decoder(contentBody);
    } else if (submenuId === 'minggu7-encoder') {
      if (typeof renderMinggu7Encoder === 'function') renderMinggu7Encoder(contentBody);
    } else if (submenuId === 'minggu7-sevenseg') {
      if (typeof renderMinggu7SevenSeg === 'function') renderMinggu7SevenSeg(contentBody);
    }
  }
}

// ===== Mobile Sidebar =====
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('hp-theme-active');
  buildSidebar();
  updateBreadcrumb(currentWeek, currentSubmenu);
  renderContent(currentWeek, currentSubmenu);
});
