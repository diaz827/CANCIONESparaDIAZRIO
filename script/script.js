const VIDEOS = [
  { title: "Canción 1", sub: "videoi1.mp4", file: "videos/videoi1.mp4" },
  { title: "Canción 2", sub: "video2.mp4", file: "videos/video2.mp4" },
  { title: "Canción 3", sub: "video3.mp4", file: "videos/video3.mp4" },
  { title: "Canción 4", sub: "video5.mp4", file: "videos/video5.mp4" },
  { title: "Canción 5", sub: "video6.mp4", file: "videos/video6.mp4" },
  { title: "Canción 6", sub: "video7.mp4", file: "videos/video7.mp4" },
];

let currentVideo = 0, isPlaying = false, cameraOn = false;
let lastGesture = null, gestureHoldStart = null;
let gesturesArmed = false;
const HOLD_WAKE_MS = 1000;  // tres dedos: 2 segundos
const HOLD_ACTION_MS = 1000; // resto de gestos: 1 segundo

const cam = document.getElementById('cam');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
const statusPill = document.getElementById('status-pill');
const statusTxt = document.getElementById('status-txt');
const gestureBadge = document.getElementById('gesture-badge');
const holdBar = document.getElementById('hold-bar');
const localVideo = document.getElementById('local-video');
const noVideo = document.getElementById('no-video');
const nowTitle = document.getElementById('now-title');
const videoList = document.getElementById('video-list');
const startBtn = document.getElementById('start-btn');

function setStatus(msg, mode) {
  statusTxt.textContent = msg;
  statusPill.className = mode || '';
}

function buildList() {
  videoList.innerHTML = '';
  VIDEOS.forEach((v, i) => {
    const el = document.createElement('div');
    el.className = 'vi' + (i === currentVideo ? ' current' : '');
    el.innerHTML = `<div class="vi-n">${i+1}</div><div class="vi-info"><div class="vi-title">${v.title}</div><div class="vi-sub">${v.sub}</div></div>`;
    el.onclick = () => { currentVideo = i; loadVideo(); };
    videoList.appendChild(el);
  });
  nowTitle.textContent = VIDEOS[currentVideo].title;
}

function loadVideo() {
  const v = VIDEOS[currentVideo];
  noVideo.style.display = 'none';
  localVideo.style.display = 'block';
  localVideo.src = v.file;
  localVideo.play();
  isPlaying = true;
  buildList();
}

function pauseVideo() {
  if (!isPlaying) return;
  localVideo.pause();
  isPlaying = false;
  buildList();
}

function nextVideo() { currentVideo = (currentVideo + 1) % VIDEOS.length; loadVideo(); }
function prevVideo() { currentVideo = (currentVideo - 1 + VIDEOS.length) % VIDEOS.length; loadVideo(); }

document.getElementById('btn-next').onclick = nextVideo;
document.getElementById('btn-prev').onclick = prevVideo;

function setArmed(val) {
  gesturesArmed = val;
  const bar = document.getElementById('gesture-mode-bar');
  const label = document.getElementById('mode-label');
  const lockedIds = ['gc-open','gc-fist','gc-one','gc-two'];
  if (val) {
    bar.className = 'armed';
    label.textContent = 'Gestos activos — haz un gesto';
    lockedIds.forEach(g => { document.getElementById(g).className = 'gc unlocked'; });
  } else {
    bar.className = '';
    label.textContent = 'En espera — haz 🤟 tres dedos para activar';
    lockedIds.forEach(g => { document.getElementById(g).className = 'gc gc-locked'; });
  }
}

function highlightGc(id, mode) {
  ['gc-open','gc-fist','gc-one','gc-two'].forEach(g => {
    const el = document.getElementById(g);
    el.className = gesturesArmed ? 'gc unlocked' : 'gc gc-locked';
  });
  document.getElementById('gc-three').className = 'gc gc-wake';
  if (id && id !== 'gc-three') document.getElementById(id).className = 'gc ' + (mode || 'active');
  if (id === 'gc-three') document.getElementById('gc-three').className = 'gc gc-wake ' + (mode || 'active');
}

function showBadge(text) {
  gestureBadge.textContent = text;
  gestureBadge.classList.add('show');
  setTimeout(() => gestureBadge.classList.remove('show'), 1600);
}

function countFingers(lm) {
  const tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
  let n = 0;
  for (let i = 0; i < 4; i++) if (lm[tips[i]].y < lm[pips[i]].y) n++;
  if (Math.abs(lm[4].x - lm[2].x) > 0.05) n++;
  return n;
}

function classify(lm) {
  const n = countFingers(lm);
  // Tres dedos siempre detectado (es el gesto de wake)
  if (n === 3) return 'three';
  // El resto solo si está armado
  if (!gesturesArmed) return null;
  if (n >= 4) return 'open';
  if (n === 0) return 'fist';
  if (n === 1) return 'one';
  if (n === 2) return 'two';
  return null;
}

const ACTIONS = {
  three: () => { setArmed(true); showBadge('⚡ Gestos activados'); },
  open:  () => { loadVideo(); showBadge('▶ Reproduciendo'); setArmed(false); },
  fist:  () => { pauseVideo(); showBadge('⏸ Pausado'); setArmed(false); },
  one:   () => { nextVideo(); showBadge('⏭ Siguiente'); setArmed(false); },
  two:   () => { prevVideo(); showBadge('⏮ Anterior'); setArmed(false); },
};
const GC_MAP = { three:'gc-three', open:'gc-open', fist:'gc-fist', one:'gc-one', two:'gc-two' };
const LABELS = { three:'🤟 Tres dedos', open:'✋ Mano abierta', fist:'✊ Puño cerrado', one:'☝ Un dedo', two:'✌ Dos dedos' };

function onResults(results) {
  overlay.width = cam.videoWidth || 640;
  overlay.height = cam.videoHeight || 480;
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
    lastGesture = null; gestureHoldStart = null;
    holdBar.style.width = '0%';
    highlightGc(null);
    setStatus('Esperando mano...', 'detecting');
    return;
  }

  for (const lm of results.multiHandLandmarks) {
    drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: 'rgba(255,60,60,0.7)', lineWidth: 2 });
    drawLandmarks(ctx, lm, { color: '#ff2222', lineWidth: 1, radius: 3 });

    const g = classify(lm);
    if (g) {
      setStatus(LABELS[g], 'detecting');
      highlightGc(GC_MAP[g], 'holding');

      if (g !== lastGesture) {
        lastGesture = g; gestureHoldStart = Date.now();
      } else {
        const holdMs = g === 'three' ? HOLD_WAKE_MS : HOLD_ACTION_MS;
        const elapsed = Date.now() - gestureHoldStart;
        holdBar.style.width = Math.min((elapsed / holdMs) * 100, 100) + '%';
        if (elapsed >= holdMs) {
          gestureHoldStart = Date.now() + 3000;
          holdBar.style.width = '0%';
          ACTIONS[g]();
          highlightGc(GC_MAP[g], 'active');
          setStatus('✓ ' + LABELS[g], 'active');
        }
      }
    } else {
      lastGesture = null; gestureHoldStart = null;
      holdBar.style.width = '0%';
      highlightGc(null);
    }
  }
}

startBtn.onclick = async () => {
  if (cameraOn) return;
  startBtn.disabled = true;
  startBtn.textContent = '⏳ Iniciando...';
  setStatus('Solicitando permiso de cámara...', '');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
    cam.srcObject = stream;
    await cam.play();
    cameraOn = true;

    const hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}` });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.72, minTrackingConfidence: 0.5 });
    hands.onResults(onResults);

    const camera = new Camera(cam, {
      onFrame: async () => { await hands.send({ image: cam }); },
      width: 640, height: 480
    });
    camera.start();

    setStatus('Cámara activa', 'active');
    startBtn.textContent = '✓ Cámara activa';
  } catch (e) {
    setStatus('Error: ' + (e.message || 'permiso denegado'), '');
    startBtn.disabled = false;
    startBtn.textContent = '📷 Reintentar';
    cameraOn = false;
  }
};

buildList();

