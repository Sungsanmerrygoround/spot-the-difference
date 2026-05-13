/* game.js – core game engine */
'use strict';

/* ──────────────────────────────────────────────────────────
   LEVEL DATA
────────────────────────────────────────────────────────── */
const LEVELS = [
  {
    name: '거실',
    difficulty: '쉬움',
    diffClass: 'easy',
    drawFn: drawLivingRoom,
    timeLimit: 120,
    diffs: [
      { id:0, x:255, y:50,  r:45, hint:'벽에 걸린 시계 색이 다릅니다' },
      { id:1, x:87,  y:103, r:55, hint:'창문 커튼 색을 확인해 보세요' },
      { id:2, x:385, y:87,  r:55, hint:'TV 테두리 색이 다릅니다' },
      { id:3, x:357, y:188, r:42, hint:'스탠드 전등갓 색이 다릅니다' },
      { id:4, x:410, y:293, r:45, hint:'화분의 색이 다릅니다' },
    ],
  },
  {
    name: '해변',
    difficulty: '보통',
    diffClass: 'medium',
    drawFn: drawBeach,
    timeLimit: 150,
    diffs: [
      { id:0, x:420, y:55,  r:50, hint:'태양 크기를 비교해 보세요' },
      { id:1, x:88,  y:90,  r:55, hint:'야자수 잎 개수를 세어 보세요' },
      { id:2, x:385, y:285, r:42, hint:'비치볼 색과 무늬가 다릅니다' },
      { id:3, x:177, y:279, r:40, hint:'수건 색이 다릅니다' },
      { id:4, x:172, y:210, r:50, hint:'파라솔 색이 다릅니다' },
      { id:5, x:470, y:320, r:40, hint:'모래 양동이 색이 다릅니다' },
    ],
  },
  {
    name: '우주',
    difficulty: '어려움',
    diffClass: 'hard',
    drawFn: drawSpace,
    timeLimit: 180,
    diffs: [
      { id:0, x:415, y:90,  r:55, hint:'행성 색이 다릅니다' },
      { id:1, x:128, y:275, r:42, hint:'로켓 불꽃 색을 확인하세요' },
      { id:2, x:220, y:135, r:45, hint:'별의 개수가 다릅니다' },
      { id:3, x:68,  y:55,  r:44, hint:'달의 모양이 다릅니다' },
      { id:4, x:295, y:215, r:42, hint:'우주인 헬멧 바이저 색이 다릅니다' },
      { id:5, x:415, y:110, r:62, hint:'행성 주변을 자세히 살펴보세요' },
      { id:6, x:358, y:48,  r:42, hint:'유성의 크기를 비교해 보세요' },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   GAME STATE
────────────────────────────────────────────────────────── */
const G = {
  screen:       'menu',
  levelIdx:     0,
  level:        null,
  found:        [],        // found diff IDs
  lives:        3,
  hints:        3,
  timeLeft:     0,
  score:        0,
  wrongTaps:    0,         // 3 wrong taps → lose 1 life
  timerRef:     null,
  paused:       false,
};

/* ──────────────────────────────────────────────────────────
   DOM REFS
────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const screens  = { menu:'screen-menu', levels:'screen-levels', game:'screen-game' };
const overlays = ['ov-pause','ov-complete','ov-gameover','ov-how','ov-scores'];

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-'+name).classList.add('active');
  G.screen = name;
}
function showOverlay(id)  { $(id).classList.remove('hidden'); }
function hideOverlay(id)  { $(id).classList.add('hidden'); }
function hideAllOverlays(){ overlays.forEach(hideOverlay); }

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
function init() {
  bindButtons();
  showScreen('menu');
}

function bindButtons() {
  /* menu */
  $('btn-play').addEventListener('click', () => { showScreen('levels'); renderLevelSelect(); });
  $('btn-scores').addEventListener('click', showScores);
  $('btn-how').addEventListener('click', () => showOverlay('ov-how'));

  /* level select back */
  document.querySelectorAll('.btn-back').forEach(b => {
    b.addEventListener('click', () => { stopTimer(); hideAllOverlays(); showScreen(b.dataset.to); });
  });

  /* game hud */
  $('btn-pause').addEventListener('click', pauseGame);
  $('btn-hint').addEventListener('click', useHint);

  /* pause */
  $('btn-resume').addEventListener('click', resumeGame);
  $('btn-restart').addEventListener('click', () => { hideAllOverlays(); startLevel(G.levelIdx); });
  $('btn-quit').addEventListener('click', () => { stopTimer(); hideAllOverlays(); showScreen('menu'); });

  /* complete */
  $('btn-next').addEventListener('click', () => {
    hideAllOverlays();
    const next = G.levelIdx + 1;
    if (next < LEVELS.length) startLevel(next);
    else { showScreen('levels'); renderLevelSelect(); }
  });
  $('btn-replay').addEventListener('click', () => { hideAllOverlays(); startLevel(G.levelIdx); });
  $('btn-menu2').addEventListener('click', () => { hideAllOverlays(); showScreen('menu'); });

  /* game over */
  $('btn-retry').addEventListener('click', () => { hideAllOverlays(); startLevel(G.levelIdx); });
  $('btn-menu3').addEventListener('click', () => { hideAllOverlays(); showScreen('menu'); });

  /* modals */
  $('btn-close-how').addEventListener('click', () => hideOverlay('ov-how'));
  $('btn-close-scores').addEventListener('click', () => hideOverlay('ov-scores'));

  /* canvas click / touch */
  ['left','right'].forEach(side => {
    const wrap = $('wrap-'+side);
    wrap.addEventListener('click', e => handleTap(e, side));
    wrap.addEventListener('touchend', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      handleTap(t, side);
    }, { passive: false });
  });

  /* resize */
  window.addEventListener('resize', () => { if (G.screen === 'game') drawScenes(); });
}

/* ──────────────────────────────────────────────────────────
   LEVEL SELECT
────────────────────────────────────────────────────────── */
function renderLevelSelect() {
  const list = $('level-list');
  list.innerHTML = '';

  LEVELS.forEach((lv, i) => {
    const saved = loadScore(i);
    const stars = saved ? calcStars(saved.score, lv.timeLimit, lv.diffs.length) : 0;
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);

    const card = document.createElement('div');
    card.className = 'level-card';
    card.innerHTML = `
      <div class="level-thumb"><canvas id="thumb-${i}" width="84" height="64"></canvas></div>
      <div class="level-info">
        <div class="level-name">${i+1}. ${lv.name}</div>
        <div class="diff-badge-sm diff-${lv.diffClass}">${lv.difficulty}</div>
        <div class="level-stars">${starStr}</div>
        <div class="level-meta">
          <span>🔍 차이 ${lv.diffs.length}개</span>
          <span>⏱ ${formatTime(lv.timeLimit)}</span>
          ${saved ? `<span>🏆 ${saved.score}점</span>` : ''}
        </div>
      </div>`;

    card.addEventListener('click', () => startLevel(i));
    list.appendChild(card);

    requestAnimationFrame(() => {
      const tc = $(`thumb-${i}`);
      if (!tc) return;
      const tctx = tc.getContext('2d');
      tctx.save();
      tctx.scale(84 / CW, 64 / CH);
      lv.drawFn(tctx, false);
      tctx.restore();
    });
  });
}

/* ──────────────────────────────────────────────────────────
   START LEVEL
────────────────────────────────────────────────────────── */
function startLevel(idx) {
  stopTimer();
  hideAllOverlays();

  G.levelIdx  = idx;
  G.level     = LEVELS[idx];
  G.found     = [];
  G.lives     = 3;
  G.hints     = 3;
  G.timeLeft  = G.level.timeLimit;
  G.score     = 0;
  G.wrongTaps = 0;
  G.paused    = false;

  showScreen('game');

  /* size canvases */
  ['left','right'].forEach(side => {
    const c = $('canvas-'+side);
    c.width  = CW;
    c.height = CH;
  });

  /* clear overlays */
  $('overlay-left').innerHTML  = '';
  $('overlay-right').innerHTML = '';

  drawScenes();
  updateHUD();
  startTimer();
}

/* ──────────────────────────────────────────────────────────
   DRAW
────────────────────────────────────────────────────────── */
function drawScenes() {
  const lv = G.level;
  if (!lv) return;

  const lCtx = $('canvas-left').getContext('2d');
  const rCtx = $('canvas-right').getContext('2d');

  lCtx.clearRect(0, 0, CW, CH);
  rCtx.clearRect(0, 0, CW, CH);

  lv.drawFn(lCtx, false);
  lv.drawFn(rCtx, true);

  /* redraw found circles */
  G.found.forEach(id => {
    const d = lv.diffs.find(x => x.id === id);
    if (d) placePermanentCircles(d);
  });
}

/* ──────────────────────────────────────────────────────────
   TIMER
────────────────────────────────────────────────────────── */
function startTimer() {
  stopTimer();
  G.timerRef = setInterval(() => {
    if (G.paused) return;
    G.timeLeft--;
    updateTimerDisplay();
    if (G.timeLeft <= 0) { stopTimer(); triggerGameOver('시간이 초과되었습니다'); }
  }, 1000);
}

function stopTimer() {
  if (G.timerRef) { clearInterval(G.timerRef); G.timerRef = null; }
}

function updateTimerDisplay() {
  const el = $('timer-text');
  const box = $('timer-box');
  el.textContent = formatTime(G.timeLeft);
  if (G.timeLeft <= 30) box.classList.add('warn');
  else box.classList.remove('warn');
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ──────────────────────────────────────────────────────────
   HUD
────────────────────────────────────────────────────────── */
function updateHUD() {
  $('hud-found').textContent  = G.found.length;
  $('hud-total').textContent  = G.level.diffs.length;
  $('hint-count').textContent = G.hints;

  /* lives */
  const lr = $('lives-row');
  lr.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const h = document.createElement('span');
    h.className = 'heart' + (i >= G.lives ? ' lost' : '');
    h.textContent = '❤️';
    lr.appendChild(h);
  }

  updateTimerDisplay();
}

/* ──────────────────────────────────────────────────────────
   CLICK / TAP HANDLING
────────────────────────────────────────────────────────── */
function handleTap(e, side) {
  if (G.paused || G.screen !== 'game') return;

  const canvas = $('canvas-' + side);
  const rect   = canvas.getBoundingClientRect();
  const scaleX = CW / rect.width;
  const scaleY = CH / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top)  * scaleY;

  /* screen coords for visual ripple */
  const sx = e.clientX, sy = e.clientY;

  /* check against unfound diffs */
  let hit = null;
  for (const d of G.level.diffs) {
    if (G.found.includes(d.id)) continue;
    if (Math.hypot(x - d.x, y - d.y) <= d.r) { hit = d; break; }
  }

  if (hit) {
    onFound(hit, sx, sy);
  } else {
    onWrong(x, y, side, sx, sy);
  }
}

function onFound(diff, sx, sy) {
  G.found.push(diff.id);
  G.wrongTaps = 0;
  G.score += 100;

  placePermanentCircles(diff);
  spawnRipple(sx, sy, 'ok');
  showToast('정답! +100점 🎉');
  updateHUD();

  if (G.found.length === G.level.diffs.length) {
    setTimeout(showLevelComplete, 500);
  }
}

function onWrong(cx, cy, side, sx, sy) {
  G.wrongTaps++;
  spawnRipple(sx, sy, 'bad');

  /* wrong-tap marker (fades) */
  const overlay = $('overlay-' + side);
  const el = document.createElement('div');
  el.className = 'found-circle';
  el.style.cssText = `
    left:${(cx/CW)*100}%; top:${(cy/CH)*100}%;
    border-color:#FF4444; background:rgba(255,68,68,0.15);
  `;
  overlay.appendChild(el);
  setTimeout(() => el.remove(), 800);

  if (G.wrongTaps % 3 === 0) {
    G.lives--;
    updateHUD();
    if (G.lives <= 0) { stopTimer(); triggerGameOver('목숨을 모두 잃었습니다'); }
    else showToast('오답! 목숨 -1 ❤️');
  } else {
    showToast('다시 찾아보세요!');
  }
}

/* ──────────────────────────────────────────────────────────
   FOUND CIRCLES
────────────────────────────────────────────────────────── */
function placePermanentCircles(diff) {
  ['left','right'].forEach(side => {
    const overlay = $('overlay-' + side);
    /* remove previous (if hint had placed one) */
    overlay.querySelectorAll(`.perm-${diff.id}`).forEach(e => e.remove());

    const el = document.createElement('div');
    el.className = `found-circle perm-${diff.id}`;
    el.style.cssText = `
      left:${(diff.x/CW)*100}%;
      top:${(diff.y/CH)*100}%;
      width:${(diff.r*2/CW)*100}%;
      height:${(diff.r*2/CH)*100}%;
    `;
    overlay.appendChild(el);
  });
}

/* ──────────────────────────────────────────────────────────
   HINT
────────────────────────────────────────────────────────── */
function useHint() {
  if (G.hints <= 0 || G.paused) return;

  const remaining = G.level.diffs.filter(d => !G.found.includes(d.id));
  if (!remaining.length) return;

  G.hints--;
  updateHUD();

  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  showToast(`💡 힌트: ${pick.hint}`);

  ['left','right'].forEach(side => {
    const overlay = $('overlay-' + side);
    const el = document.createElement('div');
    el.className = 'hint-ring';
    const w = (pick.r * 2.2 / CW) * 100;
    const h = (pick.r * 2.2 / CH) * 100;
    el.style.cssText = `
      left:${(pick.x/CW)*100}%; top:${(pick.y/CH)*100}%;
      width:${w}%; height:${h}%;
    `;
    overlay.appendChild(el);
    /* remove after animation */
    setTimeout(() => el.remove(), 4200);
  });
}

/* ──────────────────────────────────────────────────────────
   PAUSE / RESUME
────────────────────────────────────────────────────────── */
function pauseGame()  { G.paused = true;  showOverlay('ov-pause'); }
function resumeGame() { G.paused = false; hideOverlay('ov-pause'); }

/* ──────────────────────────────────────────────────────────
   LEVEL COMPLETE
────────────────────────────────────────────────────────── */
function showLevelComplete() {
  stopTimer();

  const timeBonus = G.timeLeft * 5;
  const total = G.score + timeBonus;
  const stars = calcStars(total, G.level.timeLimit, G.level.diffs.length);

  $('res-emoji').textContent   = stars === 3 ? '🏆' : stars === 2 ? '🎉' : '😊';
  $('res-title').textContent   = '레벨 클리어!';
  $('res-stars').textContent   = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  $('res-found').textContent   = `${G.found.length}/${G.level.diffs.length}`;
  $('res-time').textContent    = formatTime(G.timeLeft);
  $('res-bonus').textContent   = `+${timeBonus}`;
  $('res-score').textContent   = total;

  /* high score */
  const prev = loadScore(G.levelIdx);
  if (!prev || total > prev.score) {
    saveScore(G.levelIdx, total);
    $('res-best').classList.remove('hidden');
  } else {
    $('res-best').classList.add('hidden');
  }

  const isLast = G.levelIdx >= LEVELS.length - 1;
  $('btn-next').textContent = isLast ? '레벨 선택' : '다음 레벨 ›';

  showOverlay('ov-complete');
}

function calcStars(score, timeLimit, numDiffs) {
  const maxScore = numDiffs * 100 + timeLimit * 5;
  const pct = score / maxScore;
  if (pct >= 0.75) return 3;
  if (pct >= 0.45) return 2;
  return 1;
}

/* ──────────────────────────────────────────────────────────
   GAME OVER
────────────────────────────────────────────────────────── */
function triggerGameOver(reason) {
  $('go-reason').textContent = reason;
  showOverlay('ov-gameover');
}

/* ──────────────────────────────────────────────────────────
   HIGH SCORES
────────────────────────────────────────────────────────── */
const SCORE_KEY = 'spotdiff_scores_v1';

function saveScore(idx, score) {
  const all = JSON.parse(localStorage.getItem(SCORE_KEY) || '{}');
  all[idx] = { score, date: Date.now() };
  localStorage.setItem(SCORE_KEY, JSON.stringify(all));
}

function loadScore(idx) {
  const all = JSON.parse(localStorage.getItem(SCORE_KEY) || '{}');
  return all[idx] || null;
}

function showScores() {
  const body = $('scores-body');
  body.innerHTML = '';

  const hasAny = LEVELS.some((_, i) => loadScore(i));
  if (!hasAny) {
    body.innerHTML = '<p class="no-scores">아직 기록이 없습니다.<br>게임을 완료하면 점수가 저장됩니다!</p>';
  } else {
    const list = document.createElement('div');
    list.className = 'scores-list';
    LEVELS.forEach((lv, i) => {
      const saved = loadScore(i);
      const entry = document.createElement('div');
      entry.className = 'score-entry';
      const stars = saved ? calcStars(saved.score, lv.timeLimit, lv.diffs.length) : 0;
      entry.innerHTML = `
        <div>
          <div class="score-entry-name">${i+1}. ${lv.name} ${'★'.repeat(stars)}</div>
          <div style="font-size:11px;color:#8892B0;">${lv.difficulty}</div>
        </div>
        <div class="score-entry-pts">${saved ? saved.score + '점' : '-'}</div>
      `;
      list.appendChild(entry);
    });
    body.appendChild(list);
  }

  showOverlay('ov-scores');
}

/* ──────────────────────────────────────────────────────────
   VISUAL EFFECTS
────────────────────────────────────────────────────────── */
function spawnRipple(sx, sy, type) {
  const el = document.createElement('div');
  el.className = `click-ripple ${type}`;
  el.style.left = sx + 'px';
  el.style.top  = sy + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 550);
}

let toastTimer = null;
function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  /* restart animation */
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = '';
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2300);
}

/* ──────────────────────────────────────────────────────────
   BOOT
────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', init);
