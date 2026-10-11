/**
 * youtube-fullscreen.js
 * YouTube-style Fullscreen, Theater Mode, Auto-Hide Controls & Media Player HUD
 * Media Ajar Interaktif Sistem Digital (Kelompok 6)
 */

(function () {
  'use strict';

  // ===== State Variables =====
  let isFullscreen = false;
  let isTheaterMode = false;
  let outerIconsHidden = false;
  let isBgmPlaying = false;
  let idleTimer = null;
  const IDLE_TIMEOUT_MS = 2500; // 2.5 seconds like YouTube player

  // ===== SVG Icons =====
  const ICONS = {
    fullscreenExpand: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    fullscreenCompress: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`,
    theaterOn: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/></svg>`,
    theaterOff: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z"/></svg>`,
    eyeOpen: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
    eyeClosed: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`,
    audioOn: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    audioOff: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    prev: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`,
    next: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`,
    keyboard: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`
  };

  // ===== Cross-browser Fullscreen Helpers =====
  function getFullscreenElement() {
    return document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement || null;
  }

  function enterFullscreen() {
    const docEl = document.documentElement;
    const requestMethod = docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestMethod) {
      document.body.classList.add('screen-expand');
      setTimeout(() => document.body.classList.remove('screen-expand'), 500);

      const promise = requestMethod.call(docEl);
      if (promise && promise.catch) {
        promise.catch(err => {
          console.warn('Fullscreen request blocked or not supported:', err);
          showYtOsd('⚠️', 'Izin Layar Penuh diblokir browser', 'Esc/F');
        });
      }
    }
  }

  function exitFullscreen() {
    const exitMethod = document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exitMethod && getFullscreenElement()) {
      // Trigger smooth shrink feedback animation ("dia kaya ngecil")
      document.body.classList.add('screen-shrink');
      setTimeout(() => document.body.classList.remove('screen-shrink'), 500);

      const promise = exitMethod.call(document);
      if (promise && promise.catch) {
        promise.catch(err => console.warn('Exit fullscreen error:', err));
      }
    }
  }

  function toggleFullscreen() {
    if (!getFullscreenElement()) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  // ===== Fullscreen State Change Listener =====
  function handleFullscreenChange() {
    const activeFs = !!getFullscreenElement();
    isFullscreen = activeFs;

    document.body.classList.toggle('is-fullscreen', isFullscreen);

    // Update buttons
    updateFullscreenButtons();

    if (isFullscreen) {
      showYtOsd('⛶', 'Mode Layar Penuh Aktif', 'F / Esc');
    } else {
      // Exiting fullscreen: shrink feedback & auto-hide outer icons as requested!
      document.body.classList.add('screen-shrink');
      setTimeout(() => document.body.classList.remove('screen-shrink'), 500);
      showYtOsd('🗗', 'Layar Normal (Keluar Fullscreen)', 'F');

      // Per user request: "kerika escape/esc dia kaya ngecil ot icon diluarnya itu ke hide"
      // Automatically hide outer floating icons on exiting fullscreen
      setOuterIconsHidden(true);
    }
  }

  function updateFullscreenButtons() {
    const headerBtn = document.getElementById('btn-header-fullscreen');
    const barBtn = document.getElementById('yt-bar-btn-fullscreen');

    const iconSvg = isFullscreen ? ICONS.fullscreenCompress : ICONS.fullscreenExpand;
    const tooltipText = isFullscreen ? 'Keluar Layar Penuh (f / Esc)' : 'Layar Penuh (f)';
    const headerText = isFullscreen ? 'Keluar Full' : 'Layar Penuh';

    if (headerBtn) {
      const iconSpan = headerBtn.querySelector('.btn-icon');
      const textSpan = headerBtn.querySelector('.btn-text');
      if (iconSpan) iconSpan.innerHTML = iconSvg;
      if (textSpan) textSpan.textContent = headerText;
      headerBtn.classList.toggle('active', isFullscreen);
      headerBtn.setAttribute('title', tooltipText);
    }

    if (barBtn) {
      barBtn.innerHTML = iconSvg;
      barBtn.setAttribute('data-tooltip', tooltipText);
      barBtn.classList.toggle('active', isFullscreen);
    }
  }

  // ===== Theater Mode (Mode Bioskop / Sidebar Collapse) =====
  function toggleTheaterMode() {
    isTheaterMode = !isTheaterMode;
    document.body.classList.toggle('theater-mode', isTheaterMode);

    const headerBtn = document.getElementById('btn-theater-mode');
    const barBtn = document.getElementById('yt-bar-btn-theater');

    if (headerBtn) headerBtn.classList.toggle('active', isTheaterMode);
    if (barBtn) {
      barBtn.innerHTML = isTheaterMode ? ICONS.theaterOff : ICONS.theaterOn;
      barBtn.setAttribute('data-tooltip', isTheaterMode ? 'Keluar Mode Bioskop (t)' : 'Mode Bioskop (t)');
      barBtn.classList.toggle('active', isTheaterMode);
    }

    showYtOsd('🎬', isTheaterMode ? 'Mode Bioskop Aktif (Sidebar Ciut)' : 'Mode Normal (Sidebar Tampil)', 'T');
  }

  // ===== Outer Icons Toggle ("ot icon diluarnya itu ke hide") =====
  function setOuterIconsHidden(hidden) {
    outerIconsHidden = hidden;
    document.body.classList.toggle('hide-outer-icons', outerIconsHidden);

    const barBtn = document.getElementById('yt-bar-btn-icons');
    const headerBtn = document.getElementById('btn-toggle-outer-icons');
    const iconSvg = outerIconsHidden ? ICONS.eyeClosed : ICONS.eyeOpen;
    const tooltipText = outerIconsHidden ? 'Tampilkan Icon Luar (h)' : 'Sembunyikan Icon Luar (h)';

    if (barBtn) {
      barBtn.innerHTML = iconSvg;
      barBtn.setAttribute('data-tooltip', tooltipText);
      barBtn.classList.toggle('active', outerIconsHidden);
    }
    if (headerBtn) {
      const iconSpan = headerBtn.querySelector('.btn-icon');
      if (iconSpan) iconSpan.innerHTML = iconSvg;
      headerBtn.classList.toggle('active', outerIconsHidden);
      headerBtn.setAttribute('title', tooltipText);
    }
  }

  function toggleOuterIcons() {
    setOuterIconsHidden(!outerIconsHidden);
    showYtOsd(
      outerIconsHidden ? '👁️‍🗨️' : '👁️',
      outerIconsHidden ? 'Icon Luar Disembunyikan' : 'Icon Luar Ditampilkan',
      'H'
    );
  }

  // ===== BGM Audio Toggle =====
  function toggleBgm() {
    const bgm = document.getElementById('hp-bgm');
    const barBtn = document.getElementById('yt-bar-btn-bgm');

    if (!bgm) return;

    if (bgm.paused) {
      bgm.volume = 0.4;
      bgm.play().then(() => {
        isBgmPlaying = true;
        updateBgmButton(true);
        showYtOsd('🔊', 'Musik Latar Berputar', 'M');
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    } else {
      bgm.pause();
      isBgmPlaying = false;
      updateBgmButton(false);
      showYtOsd('🔇', 'Musik Latar Dibisukan', 'M');
    }
  }

  function updateBgmButton(playing) {
    const barBtn = document.getElementById('yt-bar-btn-bgm');
    if (barBtn) {
      barBtn.innerHTML = playing ? ICONS.audioOn : ICONS.audioOff;
      barBtn.setAttribute('data-tooltip', playing ? 'Bisukan Musik (m)' : 'Putar Musik (m)');
      barBtn.classList.toggle('active', playing);
    }
  }

  // ===== Navigation Next / Prev Topic =====
  function navigatePrevTopic() {
    if (typeof weekData === 'undefined') return;

    const currentWIndex = weekData.findIndex(w => w.id === window.currentWeek);
    if (currentWIndex > 0) {
      const prevWeek = weekData[currentWIndex - 1];
      if (typeof navigateTo === 'function' && prevWeek.submenus.length > 0) {
        navigateTo(prevWeek.id, prevWeek.submenus[0].id);
        updateCurrentTopicIndicator();
        showYtOsd('⏮️', `M${prevWeek.week}: ${prevWeek.title}`, '[');
      }
    } else {
      showYtOsd('ℹ️', 'Materi Pertama', '');
    }
  }

  function navigateNextTopic() {
    if (typeof weekData === 'undefined') return;

    const currentWIndex = weekData.findIndex(w => w.id === window.currentWeek);
    if (currentWIndex !== -1 && currentWIndex < weekData.length - 1) {
      const nextWeek = weekData[currentWIndex + 1];
      if (typeof navigateTo === 'function' && nextWeek.submenus.length > 0) {
        navigateTo(nextWeek.id, nextWeek.submenus[0].id);
        updateCurrentTopicIndicator();
        showYtOsd('⏭️', `M${nextWeek.week}: ${nextWeek.title}`, ']');
      }
    } else {
      showYtOsd('ℹ️', 'Materi Terakhir', '');
    }
  }

  function updateCurrentTopicIndicator() {
    const topicTextEl = document.getElementById('yt-bar-topic-text');
    if (!topicTextEl) return;

    if (typeof weekData !== 'undefined' && window.currentWeek) {
      const w = weekData.find(item => item.id === window.currentWeek);
      const sub = w?.submenus.find(s => s.id === window.currentSubmenu);
      if (w && sub) {
        topicTextEl.textContent = `M${w.week}: ${sub.title}`;
        return;
      }
    }
    topicTextEl.textContent = 'SisDigital Interaktif';
  }

  // ===== Inactivity / Idle Auto-Hide Timer =====
  function resetIdleTimer() {
    document.body.classList.remove('user-idle');

    if (idleTimer) clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      // Auto-hide floating icons & controls when user is not moving mouse
      document.body.classList.add('user-idle');
    }, IDLE_TIMEOUT_MS);
  }

  function initIdleTracker() {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];
    events.forEach(evt => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();
  }

  // ===== On-Screen Display (OSD) Toast =====
  let osdTimer = null;
  function showYtOsd(icon, text, badge) {
    let toast = document.getElementById('yt-osd-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'yt-osd-toast';
      toast.className = 'yt-osd-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="yt-osd-icon">${icon}</div>
      <div class="yt-osd-text">${text}</div>
      ${badge ? `<div class="yt-osd-badge">${badge}</div>` : ''}
    `;

    toast.title = 'Klik untuk toggle Layar Penuh (F)';
    toast.onclick = () => {
      toggleFullscreen();
    };

    toast.classList.add('show');

    if (osdTimer) clearTimeout(osdTimer);
    osdTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // ===== Keyboard Shortcuts Modal =====
  function toggleShortcutsModal() {
    const overlay = document.getElementById('yt-shortcuts-overlay');
    if (!overlay) return;
    const isShowing = overlay.classList.contains('active');
    overlay.classList.toggle('active', !isShowing);
  }

  // ===== Keyboard Shortcut Event Listener =====
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Check if user is typing in an input or textarea
      const target = e.target;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (isInput) return; // Don't intercept while typing numbers/formulas

      const key = e.key.toLowerCase();

      // F / f -> Layar Penuh
      if (key === 'f') {
        e.preventDefault();
        const beranda = document.getElementById('beranda-overlay');
        if (beranda && beranda.style.display !== 'none' && typeof window.startMagic === 'function') {
          window.startMagic();
        } else {
          toggleFullscreen();
        }
        return;
      }

      // Enter -> Jika masih di beranda landing, mulai & layar penuh
      if (key === 'enter') {
        const beranda = document.getElementById('beranda-overlay');
        if (beranda && beranda.style.display !== 'none' && typeof window.startMagic === 'function') {
          e.preventDefault();
          window.startMagic();
          return;
        }
      }

      // T / t -> Mode Bioskop (Theater)
      if (key === 't') {
        e.preventDefault();
        toggleTheaterMode();
        return;
      }

      // H / h -> Sembunyikan / Tampilkan Icon Luar
      if (key === 'h') {
        e.preventDefault();
        toggleOuterIcons();
        return;
      }

      // M / m -> Bisukan / Putar Audio BGM
      if (key === 'm') {
        e.preventDefault();
        toggleBgm();
        return;
      }

      // [ -> Materi Sebelumnya
      if (e.key === '[') {
        e.preventDefault();
        navigatePrevTopic();
        return;
      }

      // ] -> Materi Selanjutnya
      if (e.key === ']') {
        e.preventDefault();
        navigateNextTopic();
        return;
      }

      // ? -> Panduan Shortcut Keyboard
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // Esc -> If shortcuts modal open, close it; If exiting fullscreen, browser fires it
      if (e.key === 'Escape') {
        const overlay = document.getElementById('yt-shortcuts-overlay');
        if (overlay && overlay.classList.contains('active')) {
          overlay.classList.remove('active');
          return;
        }

        // When Esc is pressed in fullscreen, browser triggers fullscreenchange.
        // If pressed outside fullscreen, toggle outer icons hide as requested
        if (!getFullscreenElement()) {
          setOuterIconsHidden(!isOuterIconsHidden);
          showYtOsd('🗗', isOuterIconsHidden ? 'Icon Luar Disembunyikan' : 'Icon Luar Ditampilkan', 'Esc / H');
        }
      }
    });
  }

  // ===== Build DOM Elements =====
  function buildYtElements() {
    // 1. Keyboard Shortcuts Modal (Accessible via '?')
    if (!document.getElementById('yt-shortcuts-overlay')) {
      const modalOverlay = document.createElement('div');
      modalOverlay.id = 'yt-shortcuts-overlay';
      modalOverlay.className = 'yt-shortcuts-modal-overlay';

      modalOverlay.innerHTML = `
        <div class="yt-shortcuts-modal">
          <div class="yt-shortcuts-header">
            <div class="yt-shortcuts-title">
              <span>⚡</span>
              <span>Pintasan Keyboard</span>
            </div>
            <button class="yt-shortcuts-close" id="yt-shortcuts-close" aria-label="Tutup">&times;</button>
          </div>
          <div class="yt-shortcuts-list">
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Mode Layar Penuh (Toggle Fullscreen)</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">F</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Keluar Layar Penuh & Sembunyikan Icon Luar</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">ESC</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Mode Bioskop (Sidebar Ciut / Lebar Penuh)</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">T</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Sembunyikan / Tampilkan Icon & Widget Luar</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">H</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Putar / Bisukan Musik Latar (BGM)</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">M</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Materi / Modul Selanjutnya</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">]</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Materi / Modul Sebelumnya</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">[</span></div>
            </div>
            <div class="yt-shortcut-row">
              <span class="yt-shortcut-desc">Buka / Tutup Bantuan Shortcut</span>
              <div class="yt-shortcut-keys"><span class="yt-shortcut-key">?</span></div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modalOverlay);

      document.getElementById('yt-shortcuts-close').addEventListener('click', toggleShortcutsModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) toggleShortcutsModal();
      });
    }

    // 2. Floating Mini Eye Toggle (only visible when outer icons are hidden)
    if (!document.getElementById('yt-floating-toggle-btn')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'yt-floating-toggle-btn';
      toggleBtn.className = 'yt-floating-toggle-btn';
      toggleBtn.title = 'Tampilkan Icon Luar (H)';
      toggleBtn.setAttribute('aria-label', 'Tampilkan Icon Luar');
      toggleBtn.innerHTML = ICONS.eyeClosed;
      toggleBtn.addEventListener('click', toggleOuterIcons);
      document.body.appendChild(toggleBtn);
    }
  }

  // ===== Expose Global Methods & Hook into window =====
  window.SisDigitalPlayer = {
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleTheaterMode,
    toggleOuterIcons,
    toggleBgm,
    toggleShortcutsModal,
    showYtOsd,
    updateCurrentTopicIndicator
  };

  // ===== Initialization on DOM Ready =====
  function init() {
    buildYtElements();
    initKeyboardShortcuts();
    initIdleTracker();

    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Update indicator silently without any popup on load
    setTimeout(() => {
      updateCurrentTopicIndicator();
    }, 1000);

    // Observe navigation updates to update player bar topic text
    const originalNavigateTo = window.navigateTo;
    if (typeof originalNavigateTo === 'function') {
      window.navigateTo = function (weekId, submenuId) {
        originalNavigateTo(weekId, submenuId);
        setTimeout(updateCurrentTopicIndicator, 50);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
