const images = [
  "image/280eca67e6bb747c0bdc6a3259f80c22.JPG",
  "image/483fb82173403a5338f85662ae61e5fa.JPG",
  "image/6489470efca0613daeac8ee4e02ecef0.JPG",
  "image/80b7d8ba8cc72e14b2b47ebcaf460079.JPG",
  "image/a2cd87e85c91cfa05bc451e515b10cb1.JPG",
  "image/fd7e2117dbc390e25c7609f8d90124c8.JPG",
  "image/IMG_0372.jpg",
  "image/IMG_0374.jpg",
  "image/IMG_0378.jpg",
  "image/IMG_0379.jpg",
  "image/IMG_0380.jpg",
  "image/IMG_0381.jpg"
];

const quotes = [
  "第一次见你",
  "那天阳光很好",
  "我开始记住你",
  "你笑的时候很好看",
  "我慢慢喜欢上你",
  "你变得很重要",
  "我不想失去你",
  "习惯了有你",
  "心动变成日常",
  "我确定是你"
];
const headlineText = "MY LOVE";

const ui = {
  entryGate: document.getElementById("entryGate"),
  entryStartBtn: document.getElementById("entryStartBtn"),
  overlay: document.getElementById("overlay"),
  stars: document.getElementById("starsContainer"),
  bookContainer: document.getElementById("bookContainer"),
  book: document.getElementById("book"),
  finalMessage: document.getElementById("finalMessage"),
  flash: document.getElementById("flash"),
  fireworkPhotoLayer: document.getElementById("fireworkPhotoLayer"),
  introHeart: document.getElementById("introHeart"),
  bgmAudio: document.getElementById("bgmAudio"),
  musicToggle: document.getElementById("musicToggle")
};

const bgmState = {
  started: false,
  enabled: true,
  sources: [
    "saga-of-endless-dawn.mp3"
  ],
  sourceIndex: 0
};
let gatePassed = false;
let appBooted = false;

function passEntryGate(playMusic) {
  gatePassed = true;
  bgmState.enabled = !!playMusic;
  updateMusicButton();
  if (ui.entryGate) ui.entryGate.classList.add("hidden");
  if (ui.musicToggle) ui.musicToggle.classList.remove("hidden");
  if (!appBooted) {
    appBooted = true;
    boot();
  }
  if (playMusic) startBgmIfAllowed();
}

function updateMusicButton() {
  if (!ui.musicToggle) return;
  ui.musicToggle.textContent = bgmState.enabled ? "♪ ON" : "♪ OFF";
}

function ensureBgmSource() {
  if (!ui.bgmAudio) return;
  if (ui.bgmAudio.src) return;
  ui.bgmAudio.src = bgmState.sources[bgmState.sourceIndex];
}

function startBgmIfAllowed() {
  if (!ui.bgmAudio || !bgmState.enabled) return;
  ensureBgmSource();
  ui.bgmAudio.volume = 0.38;
  ui.bgmAudio.play().then(() => {
    bgmState.started = true;
  }).catch(() => {
    // 忽略自动播放拦截，等待下一次用户手势
  });
}

function tryNextBgmSource() {
  if (!ui.bgmAudio) return;
  if (bgmState.sourceIndex >= bgmState.sources.length - 1) return;
  bgmState.sourceIndex += 1;
  ui.bgmAudio.src = bgmState.sources[bgmState.sourceIndex];
  startBgmIfAllowed();
}

// ======= Cinematic Background (from provided React idea, vanilla rewrite) =======
const cinematicScenes = [
  { title: "Hi… 我想慢慢告诉你一些事 ❤️", subtitle: "这是一段只属于你的体验", type: "intro" },
  { title: "你愿意继续吗？", subtitle: "有些话，我想一点点说", type: "choice" },
  { title: "其实我一直在想你", subtitle: "不是突然，是很久了", type: "story" },
  { title: "最后一个问题", subtitle: "如果是我，你会怎么回答？", type: "final" }
];

const cinematic = {
  root: document.getElementById("cinematicBg"),
  stars: document.getElementById("cinematicStars"),
  meteors: document.getElementById("cinematicMeteors"),
  content: document.getElementById("cinematicContent"),
  title: document.getElementById("cinematicTitle"),
  subtitle: document.getElementById("cinematicSubtitle"),
  buttons: document.getElementById("cinematicButtons"),
  step: 0,
  timers: []
};

function clearCinematicTimers() {
  cinematic.timers.forEach((t) => clearTimeout(t));
  cinematic.timers = [];
}

function typeTo(el, text, speed = 60) {
  el.textContent = "";
  let i = 0;
  const run = () => {
    el.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      const tid = setTimeout(run, speed);
      cinematic.timers.push(tid);
    }
  };
  run();
}

function renderCinematicScene() {
  clearCinematicTimers();
  const scene = cinematicScenes[cinematic.step];
  if (!scene) return;
  typeTo(cinematic.title, scene.title, 55);
  typeTo(cinematic.subtitle, scene.subtitle, 30);
  cinematic.buttons.innerHTML = "";

  const addBtn = (label, cls, onClick) => {
    const b = document.createElement("button");
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", onClick, { once: false });
    cinematic.buttons.appendChild(b);
  };

  if (scene.type !== "final") {
    addBtn("继续", "primary", () => {
      cinematic.step = Math.min(cinematicScenes.length - 1, cinematic.step + 1);
      renderCinematicScene();
    });
  }
  if (scene.type === "choice") {
    addBtn("我愿意", "", () => {
      cinematic.step = Math.min(cinematicScenes.length - 1, cinematic.step + 1);
      renderCinematicScene();
    });
  }
  if (scene.type === "final") {
    addBtn("回答", "danger", () => {
      alert("❤️ 我也一直在等你");
    });
  }
}

function initCinematicBackground() {
  if (!cinematic.root) return;
  // stars
  cinematic.stars.innerHTML = "";
  for (let i = 0; i < 28; i += 1) {
    const s = document.createElement("div");
    s.className = "cinematic-star";
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.animationDelay = `${Math.random() * 2.8}s`;
    cinematic.stars.appendChild(s);
  }

  // meteors
  cinematic.meteors.innerHTML = "";
  // 主流星由 canvas 实现，这里不再额外叠加 css 流星，避免过密与斜向干扰

  cinematic.step = 0;
  renderCinematicScene();
}

// ========= 发光粒子文字（聚合/扩散）=========
const textCanvas = document.getElementById("textParticles");
const textCtx = textCanvas.getContext("2d");
const textFx = {
  particles: [],
  targets: [],
  phrase: "",
  styleMode: "text", // "text" | "sparkHeart" | "countdown"
  staticText: "",
  staticAlpha: 0,
  mosaicPoints: [],
  mosaicAlpha: 0,
  mosaicFill: "rgba(255, 118, 202, 1)",
  mosaicCore: "rgba(255, 238, 248, 1)",
  mosaicShadow: "rgba(255, 40, 156, 0.55)",
  mosaicDotScale: 0.28,
  phase: "idle", // "gather" | "disperse"
  t: 0,
  w: 0,
  h: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2)
};

function resizeTextCanvas() {
  textFx.dpr = Math.min(window.devicePixelRatio || 1, 2);
  textFx.w = window.innerWidth;
  textFx.h = window.innerHeight;
  textCanvas.width = Math.floor(textFx.w * textFx.dpr);
  textCanvas.height = Math.floor(textFx.h * textFx.dpr);
  textCanvas.style.width = `${textFx.w}px`;
  textCanvas.style.height = `${textFx.h}px`;
  textCtx.setTransform(textFx.dpr, 0, 0, textFx.dpr, 0, 0);
}

function buildTextTargets(phrase) {
  const off = document.createElement("canvas");
  off.width = Math.floor(textFx.w * 0.9);
  off.height = 180;
  const c = off.getContext("2d");
  c.clearRect(0, 0, off.width, off.height);
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const fontSize = Math.max(28, Math.min(78, Math.floor(textFx.w * 0.12)));
  // 可爱字体优先（含中文），不命中则回退系统字体
  c.font = `400 ${fontSize}px "ZCOOL KuaiLe","Dancing Script","PingFang SC","Microsoft YaHei",sans-serif`;
  c.fillText(phrase, off.width / 2, off.height / 2);

  const img = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = 3;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = img[(y * off.width + x) * 4 + 3];
      if (a > 140) pts.push({ x, y });
    }
  }
  const originX = (textFx.w - off.width) * 0.5;
  // 顶部文案下移到屏幕底部区域（匹配用户标注位置）
  const originY = Math.max(18, textFx.h * 0.72);
  return pts.map((p) => ({
    x: originX + p.x,
    y: originY + p.y
  }));
}

function buildCenterTextTargets(phrase) {
  const off = document.createElement("canvas");
  off.width = Math.floor(textFx.w * 0.9);
  off.height = 220;
  const c = off.getContext("2d");
  c.clearRect(0, 0, off.width, off.height);
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const fontSize = Math.max(52, Math.min(120, Math.floor(textFx.w * 0.22)));
  c.font = `700 ${fontSize}px "ZCOOL KuaiLe","PingFang SC","Microsoft YaHei",sans-serif`;
  c.fillText(phrase, off.width / 2, off.height / 2);

  const img = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = 3;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = img[(y * off.width + x) * 4 + 3];
      if (a > 140) pts.push({ x, y });
    }
  }
  const originX = (textFx.w - off.width) * 0.5;
  const originY = Math.max(10, textFx.h * 0.46);
  return pts.map((p) => ({ x: originX + p.x, y: originY + p.y }));
}

function setCenterParticleText(phrase) {
  textFx.phrase = phrase;
  textFx.styleMode = "text";
  textFx.targets = buildCenterTextTargets(phrase);
  const count = Math.min(980, Math.max(520, Math.floor(textFx.targets.length * 0.85)));
  textFx.particles.length = 0;
  for (let i = 0; i < count; i += 1) {
    const t = textFx.targets[i % Math.max(1, textFx.targets.length)] || { x: textFx.w * 0.5, y: textFx.h * 0.5 };
    textFx.particles.push({
      x: t.x + (Math.random() - 0.5) * 10,
      y: t.y + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      a: 0.55 + Math.random() * 0.45,
      r: 0.9 + Math.random() * 1.7
    });
  }
  textFx.phase = "gather";
  textFx.t = 0;
}

function hideParticleText() {
  textFx.phase = "idle";
  textFx.targets = [];
  textFx.particles = [];
  textFx.phrase = "";
}

function buildCountdownTargets(numText) {
  const off = document.createElement("canvas");
  off.width = Math.floor(textFx.w);
  off.height = Math.floor(textFx.h);
  const c = off.getContext("2d");
  c.clearRect(0, 0, off.width, off.height);
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  // 使用更稳定的数字字体，并按测量结果自适应到完整可见
  const family = `"Arial Black","Montserrat","Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif`;
  let fontSize = Math.floor(Math.min(off.width, off.height) * 0.72);
  fontSize = Math.max(120, fontSize);
  c.font = `900 ${fontSize}px ${family}`;
  let measured = c.measureText(numText);
  const maxW = off.width * 0.84;
  const maxH = off.height * 0.74;
  if (measured.width > maxW) {
    fontSize = Math.max(110, Math.floor(fontSize * (maxW / measured.width)));
    c.font = `900 ${fontSize}px ${family}`;
    measured = c.measureText(numText);
  }
  const textH = Math.max(1, (measured.actualBoundingBoxAscent || fontSize * 0.7) + (measured.actualBoundingBoxDescent || fontSize * 0.3));
  if (textH > maxH) {
    fontSize = Math.max(100, Math.floor(fontSize * (maxH / textH)));
    c.font = `900 ${fontSize}px ${family}`;
    measured = c.measureText(numText);
  }
  const asc = measured.actualBoundingBoxAscent || fontSize * 0.7;
  const desc = measured.actualBoundingBoxDescent || fontSize * 0.3;
  const drawY = off.height * 0.5 + (asc - desc) * 0.5 - fontSize * 0.02;
  c.fillText(numText, off.width * 0.5, drawY);

  const img = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = 2;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = img[(y * off.width + x) * 4 + 3];
      if (a > 120) pts.push({ x, y });
    }
  }
  const ox = 0;
  const oy = 0;
  return pts.map((p) => ({ x: ox + p.x, y: oy + p.y }));
}

function buildHeartTargets2D() {
  const off = document.createElement("canvas");
  // 开屏大爱心：占屏更大、更居中
  off.width = Math.floor(textFx.w * 0.9);
  off.height = Math.floor(textFx.h * 0.62);
  const c = off.getContext("2d");
  c.clearRect(0, 0, off.width, off.height);
  c.fillStyle = "#fff";
  const cx = off.width * 0.5;
  const cy = off.height * 0.52;
  const s = Math.min(off.width, off.height) * 0.038;
  c.beginPath();
  for (let i = 0; i <= 520; i += 1) {
    const t = (i / 520) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const px = cx + x * s * 10;
    const py = cy - y * s * 10;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.fill();

  const img = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = 2;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = img[(y * off.width + x) * 4 + 3];
      if (a > 140) pts.push({ x, y });
    }
  }
  const originX = (textFx.w - off.width) * 0.5;
  const originY = Math.max(10, textFx.h * 0.17);
  return pts.map((p) => ({ x: originX + p.x, y: originY + p.y }));
}

function buildSparkHeartTargets2D() {
  const pts = [];
  const cx = textFx.w * 0.5;
  const cy = textFx.h * 0.43;
  const base = Math.min(textFx.w, textFx.h) * 0.18;
  const total = window.innerWidth < 430 ? 2600 : 3600;

  // 外轮廓粒子（更亮更密）
  for (let i = 0; i < total; i += 1) {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const jitter = (Math.random() - 0.5) * 0.85;
    const s = base * (1 + jitter * 0.08);
    pts.push({
      x: cx + x * s * 0.07 + (Math.random() - 0.5) * 2.8,
      y: cy - y * s * 0.07 + (Math.random() - 0.5) * 2.8
    });
  }

  // 内部散点（形成参考图那种“填充雾感”）
  const inner = window.innerWidth < 430 ? 1200 : 1800;
  for (let i = 0; i < inner; i += 1) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 1.45);
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const s = base * 0.07 * r;
    pts.push({
      x: cx + x * s * 0.95 + (Math.random() - 0.5) * 3.2,
      y: cy - y * s * 0.95 + (Math.random() - 0.5) * 3.2
    });
  }
  return pts;
}

function setParticleText(phrase) {
  textFx.phrase = phrase;
  textFx.styleMode = "text";
  textFx.targets = buildTextTargets(phrase);
  const count = Math.min(720, Math.max(380, Math.floor(textFx.targets.length * 0.75)));

  if (textFx.particles.length === 0) {
    for (let i = 0; i < count; i += 1) {
      textFx.particles.push({
        x: Math.random() * textFx.w,
        y: Math.random() * (textFx.h * 0.45),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        a: 0.2 + Math.random() * 0.8,
        r: 0.7 + Math.random() * 1.9
      });
    }
  }

  // 重采样目标（循环复用），并触发“聚合”
  textFx.phase = "gather";
  textFx.t = 0;
}

function disperseParticleText() {
  textFx.phase = "disperse";
  textFx.t = 0;
}

function showIntroHeart() {
  textFx.styleMode = "sparkHeart";
  textFx.targets = buildSparkHeartTargets2D();
  // 强制高密度粒子，确保大爱心可见
  const desired = Math.max(1400, Math.min(2200, textFx.targets.length));
  textFx.particles.length = 0;
  for (let i = 0; i < desired; i += 1) {
    textFx.particles.push({
      x: Math.random() * textFx.w,
      y: Math.random() * textFx.h * 0.8,
      vx: (Math.random() - 0.5) * 1.1,
      vy: (Math.random() - 0.5) * 1.1,
      a: 0.45 + Math.random() * 0.55,
      r: 0.8 + Math.random() * 1.8
    });
  }
  textFx.phase = "gather";
  textFx.t = 0;
}

function setBigCountdown(numText) {
  textFx.styleMode = "countdown";
  const rawTargets = buildCountdownTargets(numText);
  const maxPoints = window.innerWidth < 430 ? 3400 : 4600;
  let sampledTargets = rawTargets;
  if (rawTargets.length > maxPoints) {
    sampledTargets = [];
    for (let i = 0; i < maxPoints; i += 1) {
      const idx = Math.floor((i / maxPoints) * rawTargets.length);
      sampledTargets.push(rawTargets[idx]);
    }
  }
  textFx.targets = sampledTargets;
  const desired = textFx.targets.length || 1800;
  if (textFx.particles.length === 0) {
    for (let i = 0; i < desired; i += 1) {
      const t = textFx.targets[i % Math.max(1, textFx.targets.length)] || { x: textFx.w * 0.5, y: textFx.h * 0.5 };
      textFx.particles.push({
        // 首次“3”直接原地成型，不跳出
        x: t.x,
        y: t.y,
        vx: 0,
        vy: 0,
        a: 0.35 + Math.random() * 0.65,
        r: 1.35 + Math.random() * 1.55
      });
    }
  } else {
    // 原地变换：保留当前位置，只切换目标并迅速收敛
    if (textFx.particles.length < desired) {
      const add = desired - textFx.particles.length;
      for (let i = 0; i < add; i += 1) {
        const seed = textFx.particles[i % textFx.particles.length];
        textFx.particles.push({
          x: seed.x,
          y: seed.y,
          vx: 0,
          vy: 0,
          a: seed.a,
          r: seed.r
        });
      }
    } else if (textFx.particles.length > desired) {
      textFx.particles.length = desired;
    }
    textFx.particles.forEach((p) => {
      p.vx *= 0.04;
      p.vy *= 0.04;
    });
  }
  textFx.phase = "gather";
  textFx.t = 0;
}

function showStaticThreeFade() {
  textFx.styleMode = "countdownStatic";
  textFx.staticText = "3";
  textFx.staticAlpha = 0;
  textFx.phase = "idle";
  textFx.targets = [];
  textFx.particles = [];
  gsap.killTweensOf(textFx);
  gsap.to(textFx, {
    staticAlpha: 1,
    duration: 0.55,
    ease: "sine.out",
    yoyo: true,
    repeat: 1
  });
}

function playIntroHeartBeat() {
  if (!ui.introHeart) return;
  gsap.killTweensOf(ui.introHeart);
  gsap.set(ui.introHeart, { autoAlpha: 0, scale: 0.56 });
  gsap.to(ui.introHeart, {
    scale: 0.96,
    duration: 0.42,
    ease: "power2.out",
    yoyo: true,
    repeat: 3
  });
  gsap.to(ui.introHeart, {
    autoAlpha: 0,
    delay: 1.95,
    duration: 0.55,
    ease: "power2.inOut"
  });
}

function buildMosaicTextPoints(text, opts = {}) {
  const off = document.createElement("canvas");
  off.width = Math.floor(textFx.w);
  off.height = Math.floor(textFx.h);
  const c = off.getContext("2d");
  c.clearRect(0, 0, off.width, off.height);
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";

  const family = opts.family || `"Arial Black","Montserrat","Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif`;
  let fontSize = opts.fontSize || Math.floor(Math.min(off.width, off.height) * 0.72);
  fontSize = Math.max(120, fontSize);
  c.font = `900 ${fontSize}px ${family}`;
  let measured = c.measureText(text);
  const maxW = off.width * 0.84;
  const maxH = off.height * 0.74;
  if (measured.width > maxW) {
    fontSize = Math.max(100, Math.floor(fontSize * (maxW / measured.width)));
    c.font = `900 ${fontSize}px ${family}`;
    measured = c.measureText(text);
  }
  const textH = Math.max(1, (measured.actualBoundingBoxAscent || fontSize * 0.7) + (measured.actualBoundingBoxDescent || fontSize * 0.3));
  if (textH > maxH) {
    fontSize = Math.max(90, Math.floor(fontSize * (maxH / textH)));
    c.font = `900 ${fontSize}px ${family}`;
    measured = c.measureText(text);
  }
  const asc = measured.actualBoundingBoxAscent || fontSize * 0.7;
  const desc = measured.actualBoundingBoxDescent || fontSize * 0.3;
  const targetY = typeof opts.centerY === "number" ? opts.centerY : off.height * 0.5;
  const drawY = targetY + (asc - desc) * 0.5 - fontSize * 0.02;
  c.fillText(text, off.width * 0.5, drawY);

  const img = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = opts.step || Math.max(7, Math.floor(Math.min(off.width, off.height) / 70)); // 马赛克密度
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = img[(y * off.width + x) * 4 + 3];
      if (a > 110) pts.push({ x, y });
    }
  }
  return { pts, step };
}

function showMosaicCountdown(numText, { fadeIn = 0.55, hold = 0.75, fadeOut = 0.55 } = {}) {
  textFx.styleMode = "countdownMosaic";
  const built = buildMosaicTextPoints(numText, {
    family: `"Arial Black","Montserrat","Helvetica Neue",sans-serif`,
    centerY: textFx.h * 0.5
  });
  textFx.mosaicPoints = built.pts;
  textFx.mosaicStep = built.step;
  textFx.mosaicAlpha = 0;
  textFx.mosaicFill = "rgba(255, 118, 202, 1)";
  textFx.mosaicCore = "rgba(255, 238, 248, 1)";
  textFx.mosaicShadow = "rgba(255, 40, 156, 0.55)";
  textFx.mosaicDotScale = 0.28;
  textFx.phase = "idle";
  textFx.targets = [];
  textFx.particles = [];
  gsap.killTweensOf(textFx);
  gsap.to(textFx, { mosaicAlpha: 1, duration: fadeIn, ease: "sine.out" });
  gsap.to(textFx, { mosaicAlpha: 0, delay: fadeIn + hold, duration: fadeOut, ease: "sine.inOut" });
}

function showMosaicName(text) {
  // 名字位置：底部英文句子上方（finalMessage 在 bottom:14vh）
  const centerY = textFx.h * 0.80;
  textFx.styleMode = "countdownMosaic";
  const built = buildMosaicTextPoints(text, {
    family: `"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif`,
    fontSize: Math.max(68, Math.floor(Math.min(textFx.w, textFx.h) * 0.15)),
    centerY,
    step: 5
  });
  textFx.mosaicPoints = built.pts;
  textFx.mosaicStep = built.step;
  textFx.mosaicAlpha = 0;
  textFx.mosaicFill = "rgba(255, 118, 202, 1)";
  textFx.mosaicCore = "rgba(255, 238, 248, 1)";
  textFx.mosaicShadow = "rgba(255, 40, 156, 0.55)";
  textFx.mosaicDotScale = 0.22;
  textFx.phase = "idle";
  textFx.targets = [];
  textFx.particles = [];
  gsap.killTweensOf(textFx);
  gsap.to(textFx, { mosaicAlpha: 1, duration: 0.8, ease: "sine.out" });
}

function drawParticleText(dt) {
  textFx.t += dt;
  textCtx.clearRect(0, 0, textFx.w, textFx.h);

  // 更清晰：避免过度叠加导致糊成一条
  textCtx.globalCompositeOperation = "source-over";

  if (textFx.styleMode === "countdownMosaic") {
    const a = Math.max(0, Math.min(1, textFx.mosaicAlpha));
    if (a <= 0.001) return;
    const pts = textFx.mosaicPoints || [];
    const r = Math.max(1.4, (textFx.mosaicStep || 8) * (textFx.mosaicDotScale || 0.28));
    const fillBase = textFx.mosaicFill || "rgba(255, 118, 202, 1)";
    const coreBase = textFx.mosaicCore || "rgba(255, 238, 248, 1)";
    // 把 rgba(...,1) 安全替换成 rgba(...,a)，避免使用正则导致解析失败
    const fillColor = fillBase.startsWith("rgba(") ? fillBase.replace("1)", `${a})`) : `rgba(255, 118, 202, ${a})`;
    const coreAlpha = Math.min(1, a * 0.72);
    const coreColor = coreBase.startsWith("rgba(") ? coreBase.replace("1)", `${coreAlpha})`) : `rgba(255, 238, 248, ${coreAlpha})`;
    textCtx.save();
    textCtx.shadowBlur = 8;
    textCtx.shadowColor = textFx.mosaicShadow || "rgba(255, 40, 156, 0.55)";
    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i];
      textCtx.beginPath();
      textCtx.fillStyle = fillColor;
      textCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      textCtx.fill();
      textCtx.beginPath();
      textCtx.fillStyle = coreColor;
      textCtx.arc(p.x, p.y, Math.max(0.8, r * 0.44), 0, Math.PI * 2);
      textCtx.fill();
    }
    textCtx.restore();
    return;
  }

  const countdownMode = textFx.styleMode === "countdown";
  if (countdownMode) {
    // 倒计时背景字母矩阵（参考图风格）
    const chars = "MYLOVEBABY";
    const gap = 40;
    textCtx.save();
    textCtx.font = `700 ${Math.max(22, Math.floor(textFx.w * 0.055))}px "Dancing Script","ZCOOL KuaiLe",sans-serif`;
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    for (let y = gap * 0.6; y < textFx.h; y += gap) {
      for (let x = gap * 0.6; x < textFx.w; x += gap) {
        const idx = (Math.floor((x + y) / gap) + Math.floor(textFx.t * 2.3)) % chars.length;
        const ch = chars[idx];
        const hi = ((x * 0.013 + y * 0.017 + textFx.t * 1.8) % 1) > 0.86;
        textCtx.fillStyle = hi ? "rgba(255, 52, 162, 0.58)" : "rgba(255, 70, 180, 0.16)";
        textCtx.fillText(ch, x, y);
      }
    }
    textCtx.restore();
  }

  const targets = textFx.targets;
  const gather = textFx.phase === "gather";
  const k = countdownMode ? 0.068 : (gather ? 0.09 : 0.012);
  const damp = countdownMode ? 0.9 : (gather ? 0.84 : 0.92);

  for (let i = 0; i < textFx.particles.length; i += 1) {
    const p = textFx.particles[i];
    const t = targets.length ? targets[i % targets.length] : null;

    if (t) {
      if (gather) {
        p.vx += (t.x - p.x) * k;
        p.vy += (t.y - p.y) * k;
      } else {
        // 扩散：远离目标 + 风场扰动
        const dx = p.x - t.x;
        const dy = p.y - t.y;
        p.vx += (dx * 0.0006) + Math.sin((p.y + textFx.t * 60) * 0.01) * 0.04;
        p.vy += (dy * 0.0006) + Math.cos((p.x + textFx.t * 60) * 0.01) * 0.04;
      }
    }

    p.vx *= damp;
    p.vy *= damp;
    p.x += p.vx;
    p.y += p.vy;

    const heartMode = textFx.styleMode === "sparkHeart";
    const pulse = heartMode
      ? 0.82 + 0.28 * Math.sin(textFx.t * 2.2 + i * 0.03)
      : (countdownMode ? 1 : 0.78 + 0.22 * Math.sin(textFx.t * 1.4 + i * 0.02));
    const alpha = heartMode ? (0.35 + p.a * 0.75) * pulse : (0.22 + p.a * 0.55) * pulse;
    const r = heartMode ? p.r * (0.55 + pulse * 0.38) : (countdownMode ? p.r * 1.05 : p.r * (0.8 + pulse * 0.55));

    if (heartMode) {
      textCtx.save();
      textCtx.shadowBlur = 14;
      textCtx.shadowColor = "rgba(255, 58, 134, 0.9)";
      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 56, 132, ${Math.min(1, alpha * 0.78)})`;
      textCtx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
      textCtx.fill();
      textCtx.restore();

      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 170, 210, ${Math.min(1, alpha * 0.9)})`;
      textCtx.arc(p.x, p.y, r * 0.85, 0, Math.PI * 2);
      textCtx.fill();
    } else if (countdownMode) {
      textCtx.save();
      textCtx.shadowBlur = 5;
      textCtx.shadowColor = "rgba(255,40,156,0.55)";
      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 118, 202, ${Math.min(1, 0.82 + p.a * 0.18)})`;
      textCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      textCtx.fill();
      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 238, 248, ${Math.min(1, 0.42 + p.a * 0.28)})`;
      textCtx.arc(p.x, p.y, Math.max(0.8, r * 0.44), 0, Math.PI * 2);
      textCtx.fill();
      textCtx.restore();
    } else {
      // 颜色：白芯 + 轻粉光（用 shadowBlur 提清晰度）
      textCtx.save();
      textCtx.shadowBlur = 10;
      textCtx.shadowColor = "rgba(255,140,220,0.55)";
      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 210, 245, ${alpha * 0.5})`;
      textCtx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
      textCtx.fill();
      textCtx.restore();

      textCtx.beginPath();
      textCtx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.25)})`;
      textCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      textCtx.fill();
    }
  }

  textCtx.globalCompositeOperation = "source-over";
}

const app = {
  phase: "intro",
  page: 0,
  flipping: false,
  touchY: 0,
  t: 0,
  started: false,
  introClosed: false,
  textTarget: null
};

const meteorCanvas = document.getElementById("meteorCanvas");
const meteorCtx = meteorCanvas.getContext("2d");
let meteorW = 0;
let meteorH = 0;
const meteorStars = [];
const meteorList = [];

class Meteor2D {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * Math.max(1, meteorW);
    this.y = initial ? Math.random() * Math.max(1, meteorH) * 0.3 : -20;
    this.len = Math.random() * 95 + 80;
    this.speed = Math.random() * 1.55 + 1.7;
    this.vx = (Math.random() - 0.5) * 0.05; // 极轻微横向漂移
    this.vy = this.speed; // 垂直下落
    this.opacity = Math.random() * 0.35 + 0.28;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > meteorW + 40 || this.y > meteorH + 40) {
      this.reset(false);
      this.x = Math.random() * Math.max(1, meteorW);
    }
  }
  draw() {
    const g = meteorCtx.createLinearGradient(this.x, this.y, this.x, this.y - this.len);
    g.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    meteorCtx.strokeStyle = g;
    meteorCtx.lineWidth = 1.8;
    meteorCtx.beginPath();
    meteorCtx.moveTo(this.x, this.y);
    meteorCtx.lineTo(this.x, this.y - this.len);
    meteorCtx.stroke();
  }
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b0615, 0.06);
const spaceTexture = new THREE.TextureLoader().load("https://www.w3schools.com/w3images/stars.jpg");
spaceTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = null;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("webgl").appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.4, 6);

const ambient = new THREE.AmbientLight(0xffd9f4, 0.82);
const keyLight = new THREE.PointLight(0xff8ce6, 1.2, 20);
keyLight.position.set(0, 2.8, 4.8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
const rimLight = new THREE.PointLight(0x9a70ff, 0.9, 20);
rimLight.position.set(-3.2, -1.5, -1.8);
scene.add(ambient, keyLight, rimLight);

// ========= 3D 硬皮相册书本（Three.js）=========
function makeLeatherTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  // 红色硬皮质感
  g.addColorStop(0, "#5a0d14");
  g.addColorStop(0.45, "#8b1826");
  g.addColorStop(1, "#2a0509");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const img = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
  // 细纹
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#120206";
  for (let y = 0; y < 512; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.02) * 2);
    ctx.lineTo(512, y + Math.cos(y * 0.018) * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.2, 1.2);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

const album = (() => {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);

  const leatherMap = makeLeatherTexture();
  const coverMat = new THREE.MeshStandardMaterial({
    map: leatherMap,
    roughness: 0.85,
    metalness: 0.06,
    color: 0xffffff,
    emissive: new THREE.Color(0x2a0509),
    emissiveIntensity: 0.35
  });
  const spineMat = new THREE.MeshStandardMaterial({
    map: leatherMap,
    roughness: 0.9,
    metalness: 0.05,
    color: 0xffffff,
    emissive: new THREE.Color(0x1a0306),
    emissiveIntensity: 0.25
  });

  // 页面 400x300 => 4:3
  const pageW = 4.0;
  const pageH = 3.0;
  const coverThickness = 0.16;
  const spineW = 0.22;
  const zStack = 0.02;

  const spine = new THREE.Mesh(new THREE.BoxGeometry(spineW, pageH + 0.3, coverThickness), spineMat);
  spine.castShadow = true;
  spine.receiveShadow = true;
  group.add(spine);

  const leftPivot = new THREE.Group();
  leftPivot.position.x = -spineW / 2;
  group.add(leftPivot);
  const rightPivot = new THREE.Group();
  rightPivot.position.x = spineW / 2;
  group.add(rightPivot);

  const leftCover = new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH + 0.25, coverThickness), coverMat);
  leftCover.position.x = -pageW / 2;
  leftCover.castShadow = true;
  leftCover.receiveShadow = true;
  leftPivot.add(leftCover);

  const rightCover = new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH + 0.25, coverThickness), coverMat);
  rightCover.position.x = pageW / 2;
  rightCover.castShadow = true;
  rightCover.receiveShadow = true;
  rightPivot.add(rightCover);

  // 页面材质（明确配置，确保贴图可见）
  const leftMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide
  });
  const rightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // 静态左右页（照片完整显示：用 4:3 平面）
  const leftPage = new THREE.Mesh(new THREE.PlaneGeometry(pageW, pageH), leftMat);
  leftPage.position.set(-spineW / 2 - pageW / 2, 0, zStack);
  leftPage.receiveShadow = true;
  group.add(leftPage);

  const rightPage = new THREE.Mesh(new THREE.PlaneGeometry(pageW, pageH), rightMat);
  rightPage.position.set(spineW / 2 + pageW / 2, 0, zStack);
  rightPage.receiveShadow = true;
  group.add(rightPage);

  // 可翻页（带弯曲：高分段平面 + 更新顶点 z）
  const flipPivot = new THREE.Group();
  flipPivot.position.set(spineW / 2, 0, zStack * 2);
  group.add(flipPivot);

  const flipGeo = new THREE.PlaneGeometry(pageW, pageH, 24, 18);
  const flipFrontMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.0, side: THREE.DoubleSide });
  const flipBackMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.0, side: THREE.DoubleSide });
  const flipFront = new THREE.Mesh(flipGeo, flipFrontMat);
  flipFront.position.x = pageW / 2;
  flipFront.castShadow = true;
  flipFront.receiveShadow = true;
  const flipBack = new THREE.Mesh(flipGeo, flipBackMat);
  flipBack.position.x = pageW / 2;
  flipBack.rotation.y = Math.PI;
  flipBack.castShadow = true;
  flipBack.receiveShadow = true;
  flipPivot.add(flipFront, flipBack);
  flipPivot.visible = false;

  function setMaterialMap(mat, tex) {
    mat.map = tex || null;
    mat.needsUpdate = true;
  }

  function setPageTextures(leftIndex, rightIndex) {
    const lTex = textures[leftIndex] || null;
    const rTex = textures[rightIndex] || null;
    setMaterialMap(leftMat, lTex);
    setMaterialMap(rightMat, rTex);
  }

  function setFlipTextures(frontIndex, backIndex) {
    setMaterialMap(flipFrontMat, textures[frontIndex] || null);
    setMaterialMap(flipBackMat, textures[backIndex] || null);
  }

  function bendFlip(progress) {
    const p = flipGeo.attributes.position;
    const bend = Math.sin(progress * Math.PI) * 0.45; // 弯曲强度
    for (let i = 0; i < p.count; i += 1) {
      const x = p.getX(i);
      const nx = (x / (pageW * 0.5)); // -1..1
      p.setZ(i, bend * (1.0 - Math.abs(nx)) * (nx));
    }
    p.needsUpdate = true;
    flipGeo.computeVertexNormals();
  }

  return {
    group,
    pageW,
    pageH,
    spineW,
    leftPivot,
    rightPivot,
    leftCover,
    rightCover,
    leftPage,
    rightPage,
    flipPivot,
    setPageTextures,
    setFlipTextures,
    bendFlip
  };
})();

function layoutAlbumForDevice() {
  const isMobile = window.innerWidth <= 768;
  const s = isMobile ? 0.42 : 0.6;
  album.group.scale.setScalar(s);
  album.group.position.set(0, -0.15, 0);
  // 相机更适合看书
  camera.position.set(0, 0.4, isMobile ? 10.5 : 9.2);
  camera.lookAt(0, 0, 0);
}

function openAlbum() {
  album.group.visible = true;
  layoutAlbumForDevice();
  // 从合书到打开
  album.leftPivot.rotation.y = 0.0;
  album.rightPivot.rotation.y = 0.0;
  gsap.to(album.leftPivot.rotation, { y: -1.25, duration: 1.6, ease: "power3.inOut" });
  gsap.to(album.rightPivot.rotation, { y: 1.25, duration: 1.6, ease: "power3.inOut" });
  // 最终回到微开状态
  gsap.to(album.leftPivot.rotation, { y: -0.22, duration: 1.0, delay: 1.6, ease: "power2.out" });
  gsap.to(album.rightPivot.rotation, { y: 0.22, duration: 1.0, delay: 1.6, ease: "power2.out" });
}

function flipAlbumPage(dir) {
  if (app.phase !== "book" || app.flipping) return;
  const next = app.page + dir;
  if (next < 0 || next >= images.length) return;
  app.flipping = true;

  const leftIndex = Math.max(0, app.page - 1);
  const rightIndex = app.page;
  const nextRightIndex = next;

  // 更新静态页
  album.setPageTextures(leftIndex, rightIndex);

  // 准备翻页（永远翻右页）
  album.flipPivot.visible = true;
  album.flipPivot.rotation.y = dir > 0 ? 0 : -Math.PI;
  const frontIndex = dir > 0 ? rightIndex : nextRightIndex;
  const backIndex = dir > 0 ? nextRightIndex : rightIndex;
  album.setFlipTextures(frontIndex, backIndex);
  album.bendFlip(0);

  const prog = { v: 0 };
  gsap.to(prog, {
    v: 1,
    duration: 1.25,
    ease: "power3.inOut",
    onUpdate: () => {
      const p = prog.v;
      const rot = dir > 0 ? -Math.PI * p : -Math.PI * (1 - p);
      album.flipPivot.rotation.y = rot;
      album.bendFlip(p);
    },
    onComplete: () => {
      app.page = next;
      // 翻完后：静态页更新成新状态（左页=上一张，右页=当前张）
      album.setPageTextures(Math.max(0, app.page - 1), app.page);
      album.flipPivot.visible = false;
      updateMemoryUI();
      disperseParticleText();
      setTimeout(() => setParticleText(headlineText), 220);
      app.flipping = false;
      if (app.page === images.length - 1 && dir > 0) setTimeout(startClimax, 900);
    }
  });
}

// ========= 深空宇宙渐变穹顶（Shader）=========
const deepSpaceUniforms = { uTime: { value: 0 } };
const deepSpace = (() => {
  const geo = new THREE.SphereGeometry(60, 32, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    uniforms: deepSpaceUniforms,
    vertexShader: `
      precision mediump float;
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vPos;
      uniform float uTime;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.0-2.0*f);
        float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v=0.0, a=0.5;
        for(int i=0;i<4;i++){ v += a*noise(p); p = p*2.02 + 11.7; a *= 0.5; }
        return v;
      }
      void main(){
        vec3 p = normalize(vPos);
        float h = clamp(p.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 top = vec3(0.02, 0.03, 0.08);
        vec3 bottom = vec3(0.002, 0.003, 0.012);
        vec3 col = mix(bottom, top, pow(h, 1.35));
        float n = fbm(p.xz * 2.6 + vec2(uTime*0.02, -uTime*0.015));
        col += vec3(0.015, 0.008, 0.02) * (n - 0.5) * 0.55;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -100;
  scene.add(mesh);
  return mesh;
})();

const nebulaUniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uIntensity: { value: 0.58 }
};

const nebulaVertexShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorld = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const nebulaFragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vWorld;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + 7.13;
      a *= 0.5;
    }
    return v;
  }

  vec2 curlLike(vec2 p) {
    float e = 0.08;
    float n1 = fbm(p + vec2(0.0, e));
    float n2 = fbm(p - vec2(0.0, e));
    float n3 = fbm(p + vec2(e, 0.0));
    float n4 = fbm(p - vec2(e, 0.0));
    float dx = (n1 - n2) / (2.0 * e);
    float dy = (n3 - n4) / (2.0 * e);
    return vec2(dy, -dx);
  }

  float starField(vec2 p, float t) {
    vec2 gv = fract(p) - 0.5;
    vec2 id = floor(p);
    float n = hash(id);
    float mask = step(0.985, n);
    float d = length(gv);
    float tw = 0.55 + 0.45 * sin(t * (2.0 + n * 9.0) + n * 20.0);
    float s = smoothstep(0.12, 0.0, d) * mask * tw;
    return s;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / max(1.0, uResolution.y);

    float t = uTime * 0.06;
    vec2 flowUv = uv * 1.15;
    vec2 curl = curlLike(flowUv * 1.4 + vec2(t * 0.8, -t * 0.35));
    flowUv += curl * 0.35;
    flowUv += vec2(t * 0.25, -t * 0.14);

    float nA = fbm(flowUv * 1.8);
    float nB = fbm((flowUv + vec2(4.2, -3.7)) * 2.9);
    float nMix = mix(nA, nB, 0.42);

    float core = 1.0 - smoothstep(0.1, 1.25, length(uv * vec2(0.78, 1.05)));
    float cloud = smoothstep(0.28, 0.88, nMix + core * 0.42);
    float ridge = smoothstep(0.62, 0.98, nA * 0.75 + nB * 0.45);

    vec3 deep = vec3(0.005, 0.006, 0.016);   // near black deep space
    vec3 violet = vec3(0.416, 0.239, 0.941); // #6a3df0
    vec3 pink = vec3(1.0, 0.31, 0.847);      // #ff4fd8
    vec3 whiteCore = vec3(1.0, 0.93, 1.0);

    vec3 col = deep;
    col = mix(col, violet, cloud * 0.85);
    col = mix(col, pink, ridge * 0.7 + cloud * 0.2);
    col = mix(col, whiteCore, pow(core, 2.2) * 0.58 + ridge * 0.2);

    float breathing = 0.92 + 0.08 * sin(uTime * 0.52);
    col *= breathing;

    // fake bloom glow + soft falloff
    float glow = smoothstep(1.05, 0.08, length(uv));
    col += (pink * 0.22 + whiteCore * 0.06) * glow * (0.45 + cloud * 0.5);

    // 星点层（不规则分布 + 闪烁）
    float stars1 = starField((uv + vec2(t * 0.12, -t * 0.08)) * 28.0, uTime);
    float stars2 = starField((uv + vec2(-t * 0.05, t * 0.06)) * 46.0, uTime * 1.3);
    float stars = stars1 * 0.9 + stars2 * 0.55;
    col += vec3(1.0, 0.98, 1.0) * stars * 0.55;

    // 远处衰减更淡，增强空间层次感
    float depthFade = smoothstep(1.3, 0.15, length(uv));
    col *= mix(0.55, 1.0, depthFade);

    gl_FragColor = vec4(col * uIntensity, 1.0);
  }
`;

const nebula = (() => {
  const geo = new THREE.PlaneGeometry(44, 28, 1, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: nebulaUniforms,
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    transparent: true
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, -16);
  scene.add(mesh);
  return mesh;
})();
nebula.visible = false;

// ========= 发光星星（三层 Points + Additive + 闪烁 + 视差旋转）=========
function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,214,246,0.85)");
  g.addColorStop(0.55, "rgba(255,144,230,0.22)");
  g.addColorStop(1, "rgba(255,144,230,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

const starSprite = makeGlowTexture();

function createStarLayer({ count, radius, ySpread, sizeMin, sizeMax, opacityBase }) {
  const pos = new Float32Array(count * 3);
  const aSize = new Float32Array(count);
  const aPhase = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const ang = Math.random() * Math.PI * 2;
    const r = radius * (0.35 + Math.random() * 0.65);
    pos[i * 3] = Math.cos(ang) * r + (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = (Math.random() - 0.5) * ySpread;
    pos[i * 3 + 2] = -8 - Math.random() * 18;
    aSize[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
    aPhase[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMap: { value: starSprite },
      uOpacity: { value: opacityBase }
    },
    vertexShader: `
      precision mediump float;
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.65 + 0.35 * sin(uTime * (0.8 + fract(aPhase) * 1.6) + aPhase);
        vA = tw;
        gl_Position = projectionMatrix * mv;
        float depth = clamp(1.0 / max(0.6, -mv.z), 0.10, 1.0);
        gl_PointSize = aSize * (0.8 + tw) * 10.0 * depth;
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D uMap;
      uniform float uOpacity;
      varying float vA;
      void main() {
        vec4 t = texture2D(uMap, gl_PointCoord);
        float a = t.a * uOpacity * (0.4 + vA * 0.6);
        gl_FragColor = vec4(t.rgb, a);
      }
    `
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  return pts;
}

const starNear = createStarLayer({ count: window.innerWidth < 430 ? 160 : 240, radius: 18, ySpread: 12, sizeMin: 1.8, sizeMax: 3.8, opacityBase: 0.85 });
const starMid = createStarLayer({ count: window.innerWidth < 430 ? 260 : 420, radius: 26, ySpread: 18, sizeMin: 1.2, sizeMax: 2.6, opacityBase: 0.55 });
const starFar = createStarLayer({ count: window.innerWidth < 430 ? 360 : 560, radius: 34, ySpread: 24, sizeMin: 0.8, sizeMax: 1.8, opacityBase: 0.34 });

const planetGroup = new THREE.Group();
scene.add(planetGroup);

const texLoader = new THREE.TextureLoader();
function loadPlanetTexture(url) {
  const tex = texLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

const planetMapA = loadPlanetTexture("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
const planetMapB = loadPlanetTexture("https://threejs.org/examples/textures/planets/mars_1k_color.jpg");

const planetA = new THREE.Mesh(
  new THREE.SphereGeometry(1.25, 40, 40),
  new THREE.MeshStandardMaterial({
    map: planetMapA,
    roughness: 0.9,
    metalness: 0.02
  })
);
planetA.position.set(-6.4, 3.1, -13.5);
planetGroup.add(planetA);

const ringA = new THREE.Mesh(
  new THREE.RingGeometry(1.7, 2.5, 48),
  new THREE.MeshBasicMaterial({
    color: 0xffa6ea,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
);
ringA.position.copy(planetA.position);
ringA.rotation.x = Math.PI * 0.34;
ringA.rotation.y = Math.PI * 0.18;
planetGroup.add(ringA);

const planetB = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 36, 36),
  new THREE.MeshStandardMaterial({
    map: planetMapB,
    roughness: 0.92,
    metalness: 0.02
  })
);
planetB.position.set(5.8, -1.8, -11.6);
planetGroup.add(planetB);

function createRimGlow(radius, colorHex) {
  const geo = new THREE.SphereGeometry(radius, 40, 40);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uPower: { value: 2.2 },
      uIntensity: { value: 0.85 }
    },
    vertexShader: `
      precision mediump float;
      varying vec3 vN;
      varying vec3 vV;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vN;
      varying vec3 vV;
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;
      void main(){
        float fres = pow(1.0 - max(0.0, dot(vN, vV)), uPower);
        gl_FragColor = vec4(uColor, fres * uIntensity);
      }
    `
  });
  return new THREE.Mesh(geo, mat);
}

const glowA = createRimGlow(1.32, 0xff8ce6);
glowA.position.copy(planetA.position);
planetGroup.add(glowA);

const glowB = createRimGlow(0.86, 0x9a70ff);
glowB.position.copy(planetB.position);
planetGroup.add(glowB);

const planetLight = new THREE.PointLight(0xffffff, 1.15, 80);
planetLight.position.set(2.8, 3.6, 5.5);
scene.add(planetLight);

function applyMobilePlanetLayout() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    // 移动端把星球拉回视锥内并适当放大
    planetA.position.set(-2.6, 1.9, -8.8);
    ringA.position.copy(planetA.position);
    planetB.position.set(2.35, -1.15, -7.9);
    glowA.scale.setScalar(1.12);
    glowB.scale.setScalar(1.18);
    planetA.scale.setScalar(1.12);
    planetB.scale.setScalar(1.18);
    planetLight.intensity = 1.35;
    planetLight.position.set(1.6, 2.6, 4.2);
  } else {
    planetA.position.set(-6.4, 3.1, -13.5);
    ringA.position.copy(planetA.position);
    planetB.position.set(5.8, -1.8, -11.6);
    glowA.scale.setScalar(1);
    glowB.scale.setScalar(1);
    planetA.scale.setScalar(1);
    planetB.scale.setScalar(1);
    planetLight.intensity = 1.15;
    planetLight.position.set(2.8, 3.6, 5.5);
  }
}

const breatheStars = (() => {
  const count = window.innerWidth < 430 ? 220 : 340;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 24;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = -8 - Math.random() * 12;
    size[i] = 0.5 + Math.random() * 1.6;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      precision mediump float;
      attribute float aSize;
      attribute float aPhase;
      varying float vA;
      uniform float uTime;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.5 + 0.5 * sin(uTime * (0.8 + fract(aPhase) * 1.8) + aPhase);
        vA = tw;
        gl_Position = projectionMatrix * mv;
        float depth = clamp(1.0 / max(0.5, -mv.z), 0.12, 1.0);
        gl_PointSize = (aSize * (0.6 + tw * 0.8)) * 8.0 * depth;
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying float vA;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float m = smoothstep(0.5, 0.0, d);
        vec3 col = mix(vec3(0.78, 0.82, 1.0), vec3(1.0, 0.85, 0.96), vA);
        gl_FragColor = vec4(col, m * (0.25 + vA * 0.75));
      }
    `
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  return { points, mat };
})();

function createMeteorSystem(sceneRef) {
  const systemGroup = new THREE.Group();
  sceneRef.add(systemGroup);

  const isMobile = window.innerWidth < 430;
  const layerConfigs = [
    // 开屏要“满屏缓缓坠落”：增加数量、略加拖尾、整体更柔更慢
    { name: "near", count: isMobile ? 56 : 88, size: 0.16, opacity: 1.0, gravity: 0.00016, speed: 0.058, windAmp: 0.0026, trailLen: 24 },
    { name: "mid", count: isMobile ? 78 : 118, size: 0.125, opacity: 0.75, gravity: 0.00012, speed: 0.048, windAmp: 0.0018, trailLen: 20 },
    { name: "far", count: isMobile ? 108 : 160, size: 0.095, opacity: 0.46, gravity: 0.00008, speed: 0.038, windAmp: 0.0011, trailLen: 16 }
  ];

  const meteors = [];
  const color = new THREE.Color(0xff9ae6);
  const tmpMat = new THREE.Matrix4();
  const tmpPos = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();
  const headGeo = new THREE.SphereGeometry(0.08, 6, 6);

  const totalCount = layerConfigs.reduce((s, c) => s + c.count, 0);
  const headMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  const heads = new THREE.InstancedMesh(headGeo, headMat, totalCount);
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  heads.frustumCulled = false;
  systemGroup.add(heads);

  let trailPointCount = 0;
  layerConfigs.forEach((c) => { trailPointCount += c.count * c.trailLen; });
  const trailPos = new Float32Array(trailPointCount * 3);
  const trailAlpha = new Float32Array(trailPointCount);
  const trailSize = new Float32Array(trailPointCount);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3).setUsage(THREE.DynamicDrawUsage));
  trailGeo.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1).setUsage(THREE.DynamicDrawUsage));
  trailGeo.setAttribute("aSize", new THREE.BufferAttribute(trailSize, 1).setUsage(THREE.DynamicDrawUsage));

  const trailMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: color },
      uOpacity: { value: 1.0 }
    },
    vertexShader: `
      attribute float aAlpha;
      attribute float aSize;
      varying float vAlpha;
      void main() {
        vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = clamp(1.0 / max(0.25, -mv.z), 0.15, 1.2);
        gl_PointSize = aSize * 340.0 * depth;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float m = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, m * vAlpha * uOpacity);
      }
    `
  });
  const trails = new THREE.Points(trailGeo, trailMat);
  trails.frustumCulled = false;
  systemGroup.add(trails);

  let meteorCursor = 0;
  layerConfigs.forEach((cfg, layerIndex) => {
    for (let i = 0; i < cfg.count; i += 1) {
      const history = new Float32Array(cfg.trailLen * 3);
      const x = (Math.random() - 0.5) * 14;
      const y = Math.random() * 10 - 1.5;
      const z = -6 + layerIndex * 3 + Math.random() * 2.5;
      for (let h = 0; h < cfg.trailLen; h += 1) {
        history[h * 3] = x;
        history[h * 3 + 1] = y;
        history[h * 3 + 2] = z;
      }
      meteors.push({
        layerIndex,
        cfg,
        idx: meteorCursor,
        seed: Math.random() * Math.PI * 2,
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(-cfg.speed * (0.2 + Math.random() * 0.6), -cfg.speed * (0.75 + Math.random() * 0.5), 0),
        history
      });
      meteorCursor += 1;
    }
  });

  const state = { opacity: 1 };

  function respawn(m) {
    m.pos.set(7 + Math.random() * 8, 4.5 + Math.random() * 4.5, -6 + m.layerIndex * 3 + Math.random() * 2.4);
    m.vel.set(-m.cfg.speed * (0.2 + Math.random() * 0.6), -m.cfg.speed * (0.8 + Math.random() * 0.5), 0);
    for (let h = 0; h < m.cfg.trailLen; h += 1) {
      m.history[h * 3] = m.pos.x;
      m.history[h * 3 + 1] = m.pos.y;
      m.history[h * 3 + 2] = m.pos.z;
    }
  }

  function update(time) {
    let trailCursor = 0;
    meteors.forEach((m) => {
      const { cfg } = m;
      const wind = Math.sin(time * 0.75 + m.seed) * cfg.windAmp + Math.cos(time * 1.1 + m.seed * 1.7) * cfg.windAmp * 0.7;
      m.vel.x += wind;
      m.vel.y -= cfg.gravity;
      m.vel.multiplyScalar(0.996);
      m.pos.add(m.vel);

      if (m.pos.y < -6.2 || m.pos.x < -9.5) respawn(m);

      for (let h = cfg.trailLen - 1; h > 0; h -= 1) {
        const to = h * 3;
        const from = (h - 1) * 3;
        m.history[to] = m.history[from];
        m.history[to + 1] = m.history[from + 1];
        m.history[to + 2] = m.history[from + 2];
      }
      m.history[0] = m.pos.x;
      m.history[1] = m.pos.y;
      m.history[2] = m.pos.z;

      const depthFade = THREE.MathUtils.clamp(1.22 - (m.pos.z + 7.5) * 0.1, 0.24, 1);
      const headAlpha = cfg.opacity * depthFade * state.opacity;
      tmpPos.copy(m.pos);
      tmpQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.62);
      tmpScale.setScalar(cfg.size * (0.82 + depthFade * 0.5));
      tmpMat.compose(tmpPos, tmpQuat, tmpScale);
      heads.setMatrixAt(m.idx, tmpMat);
      const c = color.clone().multiplyScalar(0.55 + headAlpha * 0.9);
      heads.setColorAt(m.idx, c);

      for (let h = 0; h < cfg.trailLen; h += 1) {
        const hi = h * 3;
        const px = m.history[hi];
        const py = m.history[hi + 1];
        const pz = m.history[hi + 2];
        const age = h / Math.max(1, cfg.trailLen - 1);
        const alpha = (1 - age) * (1 - age) * cfg.opacity * depthFade * state.opacity * 1.12;
        trailPos[trailCursor * 3] = px;
        trailPos[trailCursor * 3 + 1] = py;
        trailPos[trailCursor * 3 + 2] = pz;
        trailAlpha[trailCursor] = alpha;
        trailSize[trailCursor] = cfg.size * (0.6 + (1 - age) * 1.2) * (0.9 + depthFade * 0.48);
        trailCursor += 1;
      }
    });

    heads.instanceMatrix.needsUpdate = true;
    if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.aAlpha.needsUpdate = true;
    trailGeo.attributes.aSize.needsUpdate = true;
  }

  return { group: systemGroup, state, update, trailMat };
}

// 参考版：与用户给出的星空/流星逻辑一致（Points + velocity）
function createReferenceMeteorSystem(sceneRef) {
  const group = new THREE.Group();
  sceneRef.add(group);

  // 旋转球形线框星空层
  const starsGeometry = new THREE.SphereGeometry(1000, 32, 32);
  const starsMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const stars = new THREE.Mesh(starsGeometry, starsMaterial);
  stars.rotation.x = Math.PI / 2;
  stars.scale.setScalar(0.02);
  group.add(stars);

  // 流星粒子系统
  const meteorGeometry = new THREE.BufferGeometry();
  const meteorCount = window.innerWidth < 430 ? 1400 : 2200;
  const positions = new Float32Array(meteorCount * 3);
  const velocities = new Float32Array(meteorCount * 3);
  const sizes = new Float32Array(meteorCount);

  for (let i = 0; i < meteorCount; i += 1) {
    positions[i * 3] = Math.random() * 2000 - 1000;
    positions[i * 3 + 1] = Math.random() * 2000 - 1000;
    positions[i * 3 + 2] = Math.random() * 2000 - 1000;

    velocities[i * 3] = Math.random() * 0.5 - 0.25;
    velocities[i * 3 + 1] = Math.random() * 0.5 - 0.25;
    velocities[i * 3 + 2] = Math.random() * 0.5 - 0.25;

    sizes[i] = Math.random() * 2 + 1;
  }

  meteorGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  meteorGeometry.setAttribute("velocity", new THREE.Float32BufferAttribute(velocities, 3));
  meteorGeometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const meteorMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    opacity: 0.8,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const meteorPoints = new THREE.Points(meteorGeometry, meteorMaterial);
  group.add(meteorPoints);

  const state = { opacity: 1 };
  const trailMat = { uniforms: { uOpacity: { value: 1 } } };

  function update() {
    const pos = meteorGeometry.attributes.position.array;
    const vel = meteorGeometry.attributes.velocity.array;
    for (let i = 0; i < meteorCount; i += 1) {
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];
      if (pos[i * 3 + 1] < -1000) {
        pos[i * 3 + 1] = 1000;
        pos[i * 3] = Math.random() * 2000 - 1000;
        pos[i * 3 + 2] = Math.random() * 2000 - 1000;
      }
    }
    meteorGeometry.attributes.position.needsUpdate = true;
    meteorMaterial.opacity = 0.8 * state.opacity;
    starsMaterial.opacity = 0.28 * state.opacity;
    group.rotation.y += 0.0002;
  }

  return { group, state, update, trailMat };
}

const meteorSystem = createReferenceMeteorSystem(scene);
meteorSystem.group.visible = false;
meteorSystem.state.opacity = 1;
meteorSystem.trailMat.uniforms.uOpacity.value = 1;

const bookGroup = new THREE.Group();
bookGroup.visible = false;
bookGroup.position.set(0, 0.02, 0.1);
scene.add(bookGroup);

// 稳定版书本：用书框+中缝+翻页层，避免厚几何在移动端透视畸形
const bookBase = new THREE.Mesh(
  new THREE.PlaneGeometry(2.5, 1.9),
  new THREE.MeshStandardMaterial({
    color: 0x1b0d2a,
    emissive: 0x24103a,
    emissiveIntensity: 0.65,
    roughness: 0.62,
    metalness: 0.08
  })
);
bookBase.position.set(0, 0, -0.02);
bookGroup.add(bookBase);

const bookFrame = new THREE.Mesh(
  new THREE.RingGeometry(1.05, 1.28, 4, 1, Math.PI * 0.25, Math.PI * 2),
  new THREE.MeshBasicMaterial({
    color: 0xffb5ea,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
);
bookFrame.rotation.z = Math.PI * 0.25;
bookFrame.scale.set(1.45, 1.15, 1);
bookFrame.position.z = 0.01;
bookGroup.add(bookFrame);

const spineLine = new THREE.Mesh(
  new THREE.PlaneGeometry(0.035, 1.84),
  new THREE.MeshBasicMaterial({
    color: 0xf3b6f0,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
spineLine.position.set(0, 0, 0.02);
bookGroup.add(spineLine);

const pageShadowLeft = new THREE.Mesh(
  new THREE.PlaneGeometry(1.18, 1.78),
  new THREE.MeshBasicMaterial({
    color: 0x06030c,
    transparent: true,
    opacity: 0.36,
    depthWrite: false
  })
);
pageShadowLeft.position.set(-0.62, 0, -0.005);
bookGroup.add(pageShadowLeft);

const pageShadowRight = pageShadowLeft.clone();
pageShadowRight.position.x = 0.62;
bookGroup.add(pageShadowRight);

const textures = [];
const imageLoadState = { loaded: 0, failed: 0 };
function createFallbackTexture(text) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, "#2a1239");
  g.addColorStop(1, "#120817");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(255,210,240,0.45)";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, c.width - 36, c.height - 36);
  ctx.fillStyle = "rgba(255,236,248,0.92)";
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createPhotoTextureFromImage(img) {
  // 用 canvas 包一层，规避部分本地环境下 Image 纹理不稳定问题
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0d0814";
  ctx.fillRect(0, 0, c.width, c.height);

  const ir = img.width / Math.max(1, img.height);
  const cr = c.width / c.height;
  let dw;
  let dh;
  let dx;
  let dy;
  if (ir > cr) {
    dw = c.width;
    dh = dw / ir;
    dx = 0;
    dy = (c.height - dh) * 0.5;
  } else {
    dh = c.height;
    dw = dh * ir;
    dy = 0;
    dx = (c.width - dw) * 0.5;
  }
  ctx.drawImage(img, dx, dy, dw, dh);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

images.forEach((src) => {
  const tex = createFallbackTexture("回忆加载中");
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.onload = () => {
    const readyTex = createPhotoTextureFromImage(img);
    // 保持数组引用可更新，后续取图直接拿最新纹理
    textures[textures.indexOf(tex)] = readyTex;
    tex.dispose();
    imageLoadState.loaded += 1;
  };
  img.onerror = () => {
    const failed = createFallbackTexture("图片加载失败");
    textures[textures.indexOf(tex)] = failed;
    tex.dispose();
    imageLoadState.failed += 1;
  };
  img.src = new URL(src, window.location.href).href;
  textures.push(tex);
});

let leftPageMesh = null;
let rightPageMesh = null;
function buildPageMesh(index) {
  if (leftPageMesh) {
    bookGroup.remove(leftPageMesh);
    leftPageMesh.geometry.dispose();
    leftPageMesh.material.dispose();
  }
  if (rightPageMesh) {
    bookGroup.remove(rightPageMesh);
    rightPageMesh.geometry.dispose();
    rightPageMesh.material.dispose();
  }

  const leftIndex = Math.max(0, index - 1);
  const rightIndex = index;
  const h = 1.72;
  const w = 1.1;
  const geoLeft = new THREE.PlaneGeometry(w, h, 1, 1);
  const geoRight = new THREE.PlaneGeometry(w, h, 1, 1);
  const matLeft = new THREE.MeshStandardMaterial({
    map: textures[leftIndex],
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 0.44,
    metalness: 0.1
  });
  const matRight = new THREE.MeshStandardMaterial({
    map: textures[rightIndex],
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 0.4,
    metalness: 0.12
  });
  leftPageMesh = new THREE.Mesh(geoLeft, matLeft);
  rightPageMesh = new THREE.Mesh(geoRight, matRight);
  leftPageMesh.position.set(-0.58, 0, 0.04);
  rightPageMesh.position.set(0.58, 0, 0.05);
  leftPageMesh.rotation.y = 0.02;
  rightPageMesh.rotation.y = -0.02;
  bookGroup.add(leftPageMesh, rightPageMesh);
}

function updateMemoryUI() {
  // 文字更清楚：在书本上方用粒子聚合显示（并确保不被遮挡）
  setParticleText(headlineText);
}

function resizeMeteorCanvas() {
  meteorW = window.innerWidth;
  meteorH = window.innerHeight;
  meteorCanvas.width = meteorW;
  meteorCanvas.height = meteorH;
}

function resetMeteors2D() {
  meteorStars.length = 0;
  meteorList.length = 0;
  // 圈圈点减少，只留少量散布全屏
  for (let i = 0; i < 36; i += 1) {
    meteorStars.push({
      x: Math.random() * Math.max(1, meteorW),
      y: Math.random() * Math.max(1, meteorH),
      r: Math.random() * 2.4 + 0.8,
      a: Math.random() * 0.35 + 0.18
    });
  }
  for (let i = 0; i < 170; i += 1) {
    meteorList.push(new Meteor2D());
  }
  meteorCanvas.style.display = "block";
  meteorCanvas.style.opacity = "1";
}

function renderMeteors2D() {
  meteorCtx.fillStyle = "rgba(0,0,0,0.25)";
  meteorCtx.fillRect(0, 0, meteorW, meteorH);

  for (let i = 0; i < meteorStars.length; i += 1) {
    const s = meteorStars[i];
    meteorCtx.globalAlpha = s.a;
    // 少量粉白圈圈，避免满屏
    meteorCtx.fillStyle = "rgba(255,206,243,0.95)";
    meteorCtx.beginPath();
    meteorCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    meteorCtx.fill();
  }
  meteorCtx.globalAlpha = 1;

  for (let i = 0; i < meteorList.length; i += 1) {
    meteorList[i].update();
    meteorList[i].draw();
  }
}

function enterBookPhase() {
  if (app.phase !== "intro") return;
  app.started = true;
  app.introClosed = true;
  app.phase = "book";
  if (ui.introHeart) gsap.set(ui.introHeart, { autoAlpha: 0 });
  setParticleText(headlineText);
  gsap.to(meteorSystem.state, {
    opacity: 0.06,
    duration: 1.2,
    onUpdate: () => { meteorSystem.trailMat.uniforms.uOpacity.value = meteorSystem.state.opacity; }
  });
  gsap.to(meteorCanvas, { autoAlpha: 0, duration: 1.2 });
  gsap.set(ui.bookContainer, { autoAlpha: 0, display: "none" });
  // 保留“书本阶段”语义，但展示方式替换为烟花照片，并放慢节奏
  startFireworkPhotoShow({
    shotCount: images.length,
    shotInterval: 1120,
    rocketSpeedMul: 0.72,
    burstLifeMul: 1.45,
    photoHold: 3.2,
    accentCount: Math.max(4, Math.floor(images.length * 0.8)),
    endAfter: Math.max(17000, images.length * 1120 + 6500)
  });
}

function buildDomBook() {
  ui.book.innerHTML = "";
  const surface = document.createElement("div");
  surface.className = "book-surface";
  const spine = document.createElement("div");
  spine.className = "book-spine";
  ui.book.appendChild(surface);
  ui.book.appendChild(spine);

  // 固定左右页 + 一张可翻动页（更像真实翻书）
  const left = document.createElement("div");
  left.className = "page static-left";
  left.id = "leftPage";
  const right = document.createElement("div");
  right.className = "page static-right";
  right.id = "rightPage";
  const flip = document.createElement("div");
  flip.className = "page flip";
  flip.id = "flipPage";

  function buildFace(imgSrc, alt) {
    const face = document.createElement("div");
    face.className = "front";
    const img = document.createElement("img");
    img.src = new URL(imgSrc, window.location.href).href;
    img.alt = alt;
    img.loading = "eager";
    const shine = document.createElement("div");
    shine.className = "shine";
    face.appendChild(img);
    face.appendChild(shine);
    return face;
  }

  // left/right 静态页只用 front
  left.appendChild(buildFace(images[0], quotes[0] || "记忆"));
  right.appendChild(buildFace(images[0], quotes[0] || "记忆"));

  // flip 页 front/back
  const flipFront = buildFace(images[0], quotes[0] || "记忆");
  const flipBack = document.createElement("div");
  flipBack.className = "back";
  const backImg = document.createElement("img");
  backImg.src = new URL(images[Math.min(1, images.length - 1)], window.location.href).href;
  backImg.alt = quotes[Math.min(1, quotes.length - 1)] || "记忆";
  backImg.loading = "eager";
  const backShine = document.createElement("div");
  backShine.className = "shine";
  flipBack.appendChild(backImg);
  flipBack.appendChild(backShine);
  flip.appendChild(flipFront);
  flip.appendChild(flipBack);

  ui.book.appendChild(left);
  ui.book.appendChild(right);
  ui.book.appendChild(flip);

  // 初始化页内容
  syncStaticPages();
}

function setPageImage(pageEl, src, alt) {
  const img = pageEl.querySelector(".front img");
  if (!img) return;
  img.src = new URL(src, window.location.href).href;
  img.alt = alt;
}

function setFlipImages(frontSrc, frontAlt, backSrc, backAlt) {
  const flip = document.getElementById("flipPage");
  if (!flip) return;
  const imgF = flip.querySelector(".front img");
  const imgB = flip.querySelector(".back img");
  if (imgF) { imgF.src = new URL(frontSrc, window.location.href).href; imgF.alt = frontAlt; }
  if (imgB) { imgB.src = new URL(backSrc, window.location.href).href; imgB.alt = backAlt; }
}

function syncStaticPages() {
  const leftPage = document.getElementById("leftPage");
  const rightPage = document.getElementById("rightPage");
  const leftIndex = Math.max(0, app.page - 1);
  const rightIndex = app.page;
  if (leftPage) setPageImage(leftPage, images[leftIndex], quotes[leftIndex] || `记忆 ${leftIndex + 1}`);
  if (rightPage) setPageImage(rightPage, images[rightIndex], quotes[rightIndex] || `记忆 ${rightIndex + 1}`);
}

function flipDomPage(dir) {
  if (app.phase !== "book" || app.flipping) return;
  const next = app.page + dir;
  if (next < 0 || next >= images.length) return;

  app.flipping = true;
  const flip = document.getElementById("flipPage");
  if (!flip) { app.flipping = false; return; }

  // 准备翻页贴图
  if (dir > 0) {
    // 从右翻到左：front=当前右页，back=下一页右页
    setFlipImages(
      images[app.page],
      quotes[app.page] || `记忆 ${app.page + 1}`,
      images[next],
      quotes[next] || `记忆 ${next + 1}`
    );
  } else {
    // 从左翻回右：front=上一页右页（next），back=当前右页（app.page）
    setFlipImages(
      images[next],
      quotes[next] || `记忆 ${next + 1}`,
      images[app.page],
      quotes[app.page] || `记忆 ${app.page + 1}`
    );
  }

  const rotateTo = dir > 0 ? -180 : 0;
  const from = dir > 0 ? 0 : -180;
  gsap.set(flip, { transformOrigin: "left center", rotateY: from, autoAlpha: 1 });
  gsap.to(flip, {
    rotateY: rotateTo,
    duration: 1.18,
    ease: "power3.inOut",
    onUpdate: () => {
      const p = gsap.getProperty(flip, "rotateY");
      const shine = flip.querySelectorAll(".shine");
      shine.forEach((s) => {
        s.style.transform = `translateX(${(-26 + (Number(p) / -180) * 52)}%)`;
        s.style.opacity = String(0.25 + Math.abs(Number(p)) / 180 * 0.7);
      });
    },
    onComplete: () => {
      app.page = next;
      syncStaticPages();
      updateMemoryUI();
      disperseParticleText();
      setTimeout(() => setParticleText(headlineText), 260);
      gsap.set(flip, { autoAlpha: 0 });
      app.flipping = false;
      if (app.page === images.length - 1 && dir > 0) {
        setTimeout(startClimax, 900);
      }
    }
  });
}
function flipPage(dir) {
  if (app.phase !== "book" || app.flipping) return;
  const next = app.page + dir;
  if (next < 0 || next >= images.length) return;
  app.flipping = true;

  const texFront = textures[Math.max(0, app.page)];
  const texBack = textures[Math.max(0, next)];
  const h = 1.72;
  const w = 1.1;

  const sheetPivot = new THREE.Group();
  sheetPivot.position.set(0, 0, 0.08);
  const geo = new THREE.PlaneGeometry(w, h, 20, 20);
  const front = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: texFront, side: THREE.DoubleSide, roughness: 0.4 }));
  const back = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: texBack, side: THREE.DoubleSide, roughness: 0.4 }));
  back.rotation.y = Math.PI;
  front.position.x = 0.58;
  back.position.x = 0.58;
  sheetPivot.add(front, back);
  bookGroup.add(sheetPivot);
  if (rightPageMesh) rightPageMesh.visible = false;

  const sweep = { x: 0 };
  gsap.to(sweep, {
    x: dir > 0 ? -Math.PI * 0.96 : Math.PI * 0.96,
    duration: 1.05,
    ease: "power3.inOut",
    onUpdate: () => {
      sheetPivot.rotation.y = sweep.x;
      const bend = Math.sin(Math.abs(sweep.x)) * 0.12;
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i += 1) {
        const xx = p.getX(i);
        p.setZ(i, bend * (xx / (w * 0.5)));
      }
      p.needsUpdate = true;
    },
    onComplete: () => {
      app.page = next;
      buildPageMesh(app.page);
      updateMemoryUI();
      bookGroup.remove(sheetPivot);
      geo.dispose();
      front.material.dispose();
      back.material.dispose();
      app.flipping = false;
      if (app.page === images.length - 1 && dir > 0) {
        setTimeout(startClimax, 900);
      }
    }
  });
}

let heartPoints = null;
const photoHeartGroup = new THREE.Group();
photoHeartGroup.visible = false;
scene.add(photoHeartGroup);

const finalOrbitGroup = new THREE.Group();
finalOrbitGroup.visible = false;
scene.add(finalOrbitGroup);
const finalOrbitCards = [];
let finalOrbitRingEl = null;

function setupFinalPhotoOrbit() {
  clearFinalPhotoOrbit();
  if (!ui.fireworkPhotoLayer) return;
  const ring = document.createElement("div");
  ring.className = "final-orbit-ring";
  ui.fireworkPhotoLayer.appendChild(ring);
  finalOrbitRingEl = ring;

  // 用更多卡片围成“空心爱心”，可重复图片补足
  const count = window.innerWidth < 430 ? 40 : 54;
  // 与 CSS .final-orbit-ring 同步：width=min(86vw,430px), height=min(74vw,380px)
  const ringW = Math.min(window.innerWidth * 0.86, 430);
  const ringH = Math.min(window.innerWidth * 0.74, 380);
  // 与 CSS .fw-final-orbit-card 同步：width=min(12vw,62px)
  const cardW = Math.min(window.innerWidth * 0.12, 62);
  const cardH = cardW * (4 / 3);
  const limitX = Math.max(24, ringW * 0.5 - cardW * 0.56 - 8);
  const limitY = Math.max(20, ringH * 0.5 - cardH * 0.56 - 8);
  const heartTargets = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    heartTargets.push({
      x,
      y: -y * 0.92
    });
  }

  // 等比缩放到容器内（保持心形轮廓，不逐点钳制挤变形）
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  heartTargets.forEach((p) => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  const spanX = Math.max(0.001, maxX - minX);
  const spanY = Math.max(0.001, maxY - minY);
  const sx = (limitX * 2) / spanX;
  const sy = (limitY * 2) / spanY;
  // 放大一点让手机上更“铺满”
  const scale = Math.min(sx, sy) * (window.innerWidth < 430 ? 1.04 : 1.0);
  const centerX = (minX + maxX) * 0.5;
  const centerY = (minY + maxY) * 0.5;
  heartTargets.forEach((p) => {
    p.x = (p.x - centerX) * scale;
    p.y = (p.y - centerY) * scale;
  });

  // 留出中心空洞（名字区域），把点向外推
  const hole = Math.min(limitX, limitY) * 0.48;
  heartTargets.forEach((p) => {
    const d = Math.hypot(p.x, p.y);
    if (d < hole) {
      const k = hole / Math.max(0.001, d);
      p.x *= k;
      p.y *= k;
    }
  });

  for (let i = 0; i < count; i += 1) {
    const p = heartTargets[i];
    const jitter = window.innerWidth < 430 ? 4 : 6;
    const x = p.x + (Math.random() - 0.5) * jitter;
    const y = p.y + (Math.random() - 0.5) * jitter;
    const card = document.createElement("div");
    card.className = "fw-final-orbit-card";
    const img = document.createElement("img");
    img.src = new URL(images[(i * 3 + (i % 5)) % images.length], window.location.href).href;
    img.alt = quotes[i % quotes.length] || "memory";
    card.appendChild(img);
    ring.appendChild(card);
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      // 入场从“稍外侧”滑回轮廓，避免堆成一团
      x: x * 1.15 + (Math.random() - 0.5) * 10,
      y: y * 1.15 + (Math.random() - 0.5) * 10,
      rotate: (Math.random() - 0.5) * 10,
      zIndex: 10 + (i % 7),
      opacity: 0,
      scale: 0.68
    });
    gsap.to(card, {
      opacity: 1,
      scale: 1,
      x,
      y,
      duration: 2.35,
      delay: 0.25 + i * 0.035,
      ease: "sine.out"
    });
    gsap.to(card, {
      y: `+=${(i % 2 === 0 ? -1 : 1) * (window.innerWidth < 430 ? 5 : 7)}`,
      duration: 2.6 + (i % 4) * 0.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0.82, opacity: 0 });
  gsap.to(ring, { scale: 1, opacity: 1, duration: 1.35, ease: "sine.out" });
}

function clearFinalPhotoOrbit() {
  if (!finalOrbitRingEl) return;
  gsap.killTweensOf(finalOrbitRingEl);
  finalOrbitRingEl.remove();
  finalOrbitRingEl = null;
}

// ========= 烟花照片秀（高潮段）=========
const fireworkPhotoGroup = new THREE.Group();
fireworkPhotoGroup.visible = false;
scene.add(fireworkPhotoGroup);

const fireworkPalette = [0xffd27a, 0xff6b6b, 0x6bb6ff, 0xff9be8, 0xffe5a6];
const fireworkShow = {
  activeRockets: [],
  activeBursts: [],
  activePhotos: [],
  timers: [],
  running: false,
  startedAt: 0,
  config: {
    shotInterval: 520,
    shotCount: 8,
    rocketSpeedMul: 1,
    burstLifeMul: 1,
    photoHold: 1.05,
    endAfter: 6200,
    accentCount: 0
  }
};

function getPhotoTextureByIndex(index) {
  if (textures.length > 0 && textures[index % textures.length]) return textures[index % textures.length];
  return createFallbackTexture("回忆加载中");
}

function resolvePhotoTexture(tex, index = 0) {
  const candidate = tex || getPhotoTextureByIndex(index);
  if (candidate && candidate.image) return candidate;
  const fallbackText = quotes[index % quotes.length] || "回忆加载中";
  return createFallbackTexture(fallbackText);
}

function worldToScreenPosition(x, y, z) {
  const p = new THREE.Vector3(x, y, z);
  p.project(camera);
  return {
    x: (p.x * 0.5 + 0.5) * window.innerWidth,
    y: (-p.y * 0.5 + 0.5) * window.innerHeight
  };
}

function clampPhotoScreenPosition(screen) {
  // 与 CSS 中 .fw-photo-card 尺寸保持一致：width=min(28vw,132px), ratio=3/4
  const cardW = Math.min(window.innerWidth * 0.28, 132);
  const cardH = cardW * (4 / 3);
  const margin = 10;
  const halfW = cardW * 0.5;
  const halfH = cardH * 0.5;
  return {
    x: THREE.MathUtils.clamp(screen.x, halfW + margin, window.innerWidth - halfW - margin),
    y: THREE.MathUtils.clamp(screen.y, halfH + margin, window.innerHeight - halfH - margin)
  };
}

function createGlowingFrameTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 640;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  // 外发光
  ctx.shadowBlur = 26;
  ctx.shadowColor = "rgba(255, 196, 120, 0.95)";
  ctx.strokeStyle = "rgba(255, 215, 160, 0.98)";
  ctx.lineWidth = 16;
  ctx.strokeRect(38, 38, c.width - 76, c.height - 76);

  // 内亮边
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 241, 206, 0.9)";
  ctx.lineWidth = 5;
  ctx.strokeRect(44, 44, c.width - 88, c.height - 88);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function createFireworkBurst(x, y, z, opts = {}) {
  const count = opts.count || (window.innerWidth < 430 ? 120 : 180);
  const speed = opts.speed || 1.55;
  const life = (opts.life || 1.8) * fireworkShow.config.burstLifeMul;
  const size = opts.size || 0.06;

  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    pos[i3] = x;
    pos[i3 + 1] = y;
    pos[i3 + 2] = z;
    const colHex = fireworkPalette[(Math.random() * fireworkPalette.length) | 0];
    const c = new THREE.Color(colHex);
    col[i3] = c.r;
    col[i3 + 1] = c.g;
    col[i3 + 2] = c.b;

    const a = Math.random() * Math.PI * 2;
    const b = (Math.random() - 0.5) * Math.PI * 0.9;
    const s = speed * (0.5 + Math.random() * 0.9);
    vel[i3] = Math.cos(a) * Math.cos(b) * s;
    vel[i3 + 1] = Math.sin(b) * s + 0.2;
    vel[i3 + 2] = Math.sin(a) * Math.cos(b) * s * 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  fireworkPhotoGroup.add(points);

  fireworkShow.activeBursts.push({
    points,
    vel,
    t: 0,
    life,
    drag: 0.985,
    gravity: 0.85
  });
}

function createPhotoCardAt(x, y, z, tex, delay = 0, photoIndex = 0) {
  if (!ui.fireworkPhotoLayer) return;
  const screen = clampPhotoScreenPosition(worldToScreenPosition(x, y, z));
  const card = document.createElement("div");
  card.className = "fw-photo-card";
  const img = document.createElement("img");
  img.alt = quotes[photoIndex % quotes.length] || "回忆";
  img.loading = "eager";
  img.decoding = "async";
  img.src = new URL(images[photoIndex % images.length], window.location.href).href;
  card.appendChild(img);
  ui.fireworkPhotoLayer.appendChild(card);

  const baseRot = (Math.random() - 0.5) * 10;
  gsap.set(card, {
    x: screen.x,
    y: screen.y,
    xPercent: -50,
    yPercent: -50,
    scale: 0.22,
    opacity: 0,
    rotate: baseRot
  });

  gsap.to(card, {
    scale: 1,
    opacity: 1,
    delay,
    duration: 0.6,
    ease: "back.out(1.5)"
  });

  const shatterTimer = setTimeout(() => {
    createFireworkBurst(x, y, z + 0.05, { count: window.innerWidth < 430 ? 90 : 130, speed: 1.2, life: 1.2, size: 0.05 });
    gsap.to(card, {
      opacity: 0,
      scale: 1.22,
      duration: 1.15,
      ease: "power2.in",
      onComplete: () => {
        card.remove();
      }
    });
  }, (delay + fireworkShow.config.photoHold) * 1000);
  fireworkShow.timers.push(shatterTimer);

  fireworkShow.activePhotos.push(card);
}

function launchPhotoFirework(index, total) {
  const spread = window.innerWidth < 430 ? 1.35 : 2.1;
  const x = -spread + (index / Math.max(1, total - 1)) * spread * 2 + (Math.random() - 0.5) * 0.35;
  const startY = -3.15;
  // Y 轴错落分层：低 / 中低 / 中高 / 高
  const isMobile = window.innerWidth < 430;
  const yTiers = isMobile ? [0.48, 0.92, 1.36, 1.82] : [0.55, 1.08, 1.62, 2.18];
  const tier = yTiers[index % yTiers.length];
  const topY = tier + (Math.random() - 0.5) * (isMobile ? 0.16 : 0.22);
  const z = -0.4 + (Math.random() - 0.5) * 0.5;

  const rocket = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 10, 10),
    new THREE.MeshBasicMaterial({
      color: 0xfff0c2,
      transparent: true,
      opacity: 0.95
    })
  );
  rocket.position.set(x, startY, z);
  fireworkPhotoGroup.add(rocket);

  fireworkShow.activeRockets.push({
    mesh: rocket,
    vy: (4.2 + Math.random() * 0.9) * fireworkShow.config.rocketSpeedMul,
    topY,
    exploded: false,
    tex: getPhotoTextureByIndex(index),
    photoIndex: index,
    hasPhoto: true
  });
}

function launchAccentFirework(order = 0, total = 1) {
  const spread = window.innerWidth < 430 ? 2.05 : 2.95;
  const x = -spread + (order / Math.max(1, total - 1)) * spread * 2 + (Math.random() - 0.5) * 0.8;
  const startY = -3.15;
  const isMobile = window.innerWidth < 430;
  const yTiers = isMobile ? [0.62, 1.15, 1.88] : [0.75, 1.42, 2.35];
  const topY = yTiers[(order + 1) % yTiers.length] + (Math.random() - 0.5) * (isMobile ? 0.22 : 0.35);
  const z = -0.55 + (Math.random() - 0.5) * 0.8;

  const rocket = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0xffe3b0,
      transparent: true,
      opacity: 0.9
    })
  );
  rocket.position.set(x, startY, z);
  fireworkPhotoGroup.add(rocket);

  fireworkShow.activeRockets.push({
    mesh: rocket,
    vy: (4.35 + Math.random() * 0.95) * fireworkShow.config.rocketSpeedMul * 1.05,
    topY,
    exploded: false,
    tex: null,
    photoIndex: -1,
    hasPhoto: false
  });
}

function clearFireworkShow() {
  fireworkShow.timers.forEach((t) => clearTimeout(t));
  fireworkShow.timers.length = 0;
  fireworkShow.activeRockets.forEach((r) => {
    fireworkPhotoGroup.remove(r.mesh);
    r.mesh.geometry.dispose();
    r.mesh.material.dispose();
  });
  fireworkShow.activeRockets.length = 0;

  fireworkShow.activeBursts.forEach((b) => {
    fireworkPhotoGroup.remove(b.points);
    b.points.geometry.dispose();
    b.points.material.dispose();
  });
  fireworkShow.activeBursts.length = 0;

  fireworkShow.activePhotos.forEach((el) => {
    if (el && el.remove) el.remove();
  });
  fireworkShow.activePhotos.length = 0;
  if (ui.fireworkPhotoLayer) ui.fireworkPhotoLayer.innerHTML = "";
  fireworkPhotoGroup.visible = false;
  fireworkShow.running = false;
}

function startFireworkPhotoShow(options = {}) {
  clearFireworkShow();
  fireworkPhotoGroup.visible = true;
  fireworkShow.running = true;
  fireworkShow.startedAt = performance.now();
  fireworkShow.config = {
    shotInterval: options.shotInterval ?? 520,
    shotCount: options.shotCount ?? images.length,
    rocketSpeedMul: options.rocketSpeedMul ?? 1,
    burstLifeMul: options.burstLifeMul ?? 1,
    photoHold: options.photoHold ?? 2.4,
    endAfter: options.endAfter ?? Math.max(12000, images.length * (options.shotInterval ?? 520) + 5000),
    accentCount: options.accentCount ?? Math.max(3, Math.floor(images.length * 0.7))
  };

  const shotCount = Math.min(images.length, fireworkShow.config.shotCount);
  for (let i = 0; i < shotCount; i += 1) {
    const timer = setTimeout(() => launchPhotoFirework(i, shotCount), i * fireworkShow.config.shotInterval);
    fireworkShow.timers.push(timer);
  }
  for (let i = 0; i < fireworkShow.config.accentCount; i += 1) {
    const t = (i + 0.5) * fireworkShow.config.shotInterval + (Math.random() * 420 - 210);
    const timer = setTimeout(() => launchAccentFirework(i, fireworkShow.config.accentCount), Math.max(0, t));
    fireworkShow.timers.push(timer);
  }

  const endTimer = setTimeout(() => {
    if (app.phase === "book" || app.phase === "climax") startEnding();
  }, fireworkShow.config.endAfter);
  fireworkShow.timers.push(endTimer);
}

function updateFireworkPhotoShow(dt) {
  if (!fireworkShow.running) return;

  for (let i = fireworkShow.activeRockets.length - 1; i >= 0; i -= 1) {
    const r = fireworkShow.activeRockets[i];
    if (r.exploded) continue;
    r.mesh.position.y += r.vy * dt;
    r.mesh.position.x += Math.sin(app.t * 6 + i) * 0.002;
    r.mesh.material.opacity = Math.max(0.25, 1 - (r.mesh.position.y + 3.1) * 0.22);
    if (r.mesh.position.y >= r.topY) {
      r.exploded = true;
      const x = r.mesh.position.x;
      const y = r.mesh.position.y;
      const z = r.mesh.position.z;
      const isPhoto = r.hasPhoto !== false;
      createFireworkBurst(x, y, z, {
        count: isPhoto ? (window.innerWidth < 430 ? 130 : 190) : (window.innerWidth < 430 ? 90 : 140),
        speed: isPhoto ? 1.8 : 1.55,
        life: isPhoto ? 1.65 : 1.95,
        size: isPhoto ? 0.06 : 0.055
      });
      if (isPhoto) {
        createPhotoCardAt(x, y + 0.08, z + 0.05, r.tex, 0.08, r.photoIndex || 0);
      } else {
        // 纯烟花点缀：再补一层散开小爆点
        createFireworkBurst(x + (Math.random() - 0.5) * 0.22, y + (Math.random() - 0.5) * 0.16, z, {
          count: window.innerWidth < 430 ? 56 : 86,
          speed: 1.15,
          life: 1.5,
          size: 0.045
        });
      }
      fireworkPhotoGroup.remove(r.mesh);
      r.mesh.geometry.dispose();
      r.mesh.material.dispose();
      fireworkShow.activeRockets.splice(i, 1);
    }
  }

  for (let i = fireworkShow.activeBursts.length - 1; i >= 0; i -= 1) {
    const b = fireworkShow.activeBursts[i];
    b.t += dt;
    const p = b.points.geometry.attributes.position;
    for (let j = 0; j < p.count; j += 1) {
      const j3 = j * 3;
      b.vel[j3] *= b.drag;
      b.vel[j3 + 1] = b.vel[j3 + 1] * b.drag - b.gravity * dt * 0.52;
      b.vel[j3 + 2] *= b.drag;
      p.array[j3] += b.vel[j3] * dt;
      p.array[j3 + 1] += b.vel[j3 + 1] * dt;
      p.array[j3 + 2] += b.vel[j3 + 2] * dt;
    }
    p.needsUpdate = true;
    b.points.material.opacity = Math.max(0, 1 - b.t / b.life);
    if (b.t >= b.life) {
      fireworkPhotoGroup.remove(b.points);
      b.points.geometry.dispose();
      b.points.material.dispose();
      fireworkShow.activeBursts.splice(i, 1);
    }
  }
}

const photoCards = [];
function buildPhotoHeartCards() {
  photoHeartGroup.clear();
  photoCards.length = 0;
  for (let i = 0; i < images.length; i += 1) {
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(0.78, 1.04),
      new THREE.MeshStandardMaterial({
        map: textures[i],
        side: THREE.DoubleSide,
        transparent: true,
        roughness: 0.38,
        metalness: 0.08
      })
    );
    card.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
    card.rotation.set(Math.random() * 1.2, Math.random() * 1.2, Math.random() * 1.2);
    card.visible = false;
    photoHeartGroup.add(card);
    photoCards.push(card);
  }
}

function heartCardTargets(count) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.sin(t) * Math.sin(t) * Math.sin(t);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    out.push({
      x: x * 0.12,
      y: y * 0.085,
      z: (Math.random() - 0.5) * 0.45
    });
  }
  return out;
}

function createHeartPoints() {
  const count = window.innerWidth < 430 ? 5000 : 8200;
  const pos = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const t = (i / count) * Math.PI * 2 * 6;
    const y = ((Math.floor(i / 160) / (count / 160)) - 0.5) * 1.8;
    const x2 = 16 * Math.pow(Math.sin(t), 3);
    const z2 = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    target[i * 3] = x2 * 0.08;
    target[i * 3 + 1] = y;
    target[i * 3 + 2] = -z2 * 0.08;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("target", new THREE.BufferAttribute(target, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xff9adf,
    size: 0.042,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  heartPoints = new THREE.Points(geo, mat);
  heartPoints.visible = false;
  scene.add(heartPoints);
}

function buildNameTargets(text, count) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 300;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // 在保证不出屏的前提下，提高字形可辨识度
  ctx.font = "bold 118px 'Microsoft YaHei', 'PingFang SC', sans-serif";
  ctx.fillText(text, c.width / 2, c.height / 2 + 6);

  const img = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts = [];
  const step = 3;
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      const idx = (y * c.width + x) * 4 + 3;
      if (img[idx] > 120) {
        const px = (x - c.width * 0.5) / c.width;
        const py = (c.height * 0.5 - y) / c.height;
        // 压缩 Z 轴厚度，让名字更“平面清晰”
        // 往上抬一点，让名字进到照片爱心中间
        pts.push({ x: px * 1.75, y: (py * 1.02) + 0.28, z: (Math.random() - 0.5) * 0.04 });
      }
    }
  }

  if (pts.length === 0) {
    return new Float32Array(count * 3);
  }

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const p = pts[i % pts.length];
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
  return out;
}

function morphHeartToName(name) {
  if (!heartPoints) return;
  const posAttr = heartPoints.geometry.getAttribute("position");
  const count = posAttr.count;
  app.textTarget = buildNameTargets(name, count);
  gsap.killTweensOf(heartPoints.rotation);
  heartPoints.rotation.set(0, 0, 0);

  const progress = { v: 0 };
  gsap.to(progress, {
    v: 1,
    duration: 2.2,
    ease: "power2.out",
    onUpdate: () => {
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        posAttr.array[ix] += (app.textTarget[ix] - posAttr.array[ix]) * 0.22;
        posAttr.array[ix + 1] += (app.textTarget[ix + 1] - posAttr.array[ix + 1]) * 0.22;
        posAttr.array[ix + 2] += (app.textTarget[ix + 2] - posAttr.array[ix + 2]) * 0.22;
      }
      posAttr.needsUpdate = true;
    },
    onComplete: () => {
      // 结束时强制对齐目标点，保证字形不会发散
      posAttr.array.set(app.textTarget);
      posAttr.needsUpdate = true;
      heartPoints.rotation.set(0, 0, 0);
    }
  });
}

function startClimax() {
  if (app.phase !== "book") return;
  app.phase = "climax";
  gsap.to(ui.bookContainer, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" });
  disperseParticleText();
  gsap.to(camera.position, { z: 8.4, y: 0.7, duration: 1.4, ease: "power2.inOut" });
  gsap.to(ui.flash, { opacity: 0.5, duration: 0.18, yoyo: true, repeat: 1 });
  gsap.to(scene.fog, { density: 0.036, duration: 1.4 });
  gsap.to(meteorSystem.state, {
    opacity: 0,
    duration: 1.2,
    onUpdate: () => { meteorSystem.trailMat.uniforms.uOpacity.value = meteorSystem.state.opacity; },
    onComplete: () => { meteorSystem.group.visible = false; }
  });

  // 烟花照片秀替代原爱心卡片高潮
  setTimeout(() => {
    startFireworkPhotoShow();
  }, 560);
}

function startEnding() {
  clearFireworkShow();
  clearFinalPhotoOrbit();
  fireworkPhotoGroup.visible = false;
  photoHeartGroup.visible = false;
  finalOrbitGroup.visible = false;
  app.phase = "ending";
  const line = "I WANT TO BE WITH YOU FOREVER";
  ui.finalMessage.classList.remove("hidden");
  ui.finalMessage.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    ui.finalMessage.textContent = line.slice(0, i);
    i += 1;
    if (i > line.length) clearInterval(timer);
  }, 130);

  // 结尾名字改为 Canvas 粒子字（位于照片之上，不被遮挡）
  if (heartPoints) heartPoints.visible = false;
  hideParticleText(); // 避免底部 MY LOVE 与结尾文案重叠
  showMosaicName("清清");
  setTimeout(() => setupFinalPhotoOrbit(), 700);

  gsap.to(camera.position, { z: 4.2, duration: 4, ease: "power2.inOut" });
  gsap.to("#vignette", { opacity: 0.6, duration: 3.2 });
  gsap.to(ui.flash, { opacity: 0.12, duration: 3.4, delay: 3.5 });
  gsap.to("body", { backgroundColor: "#000", duration: 4.6, delay: 3.8 });
}

function onNext() {
  if (app.phase === "intro") {
    enterBookPhase();
    return;
  }
  // 书本展示已替换为自动烟花流程，这里不再手动翻页
}

function onPrev() {
  // 书本阶段已移除，保留空函数避免触摸/滚轮报错
}

window.addEventListener("wheel", (e) => {
  if (!gatePassed) return;
  startBgmIfAllowed();
  if (Math.abs(e.deltaY) < 12) return;
  if (e.deltaY > 0) onNext();
  else onPrev();
}, { passive: true });

window.addEventListener("click", () => {
  if (!gatePassed) return;
  startBgmIfAllowed();
  if (app.phase === "intro") onNext();
}, { passive: true });

window.addEventListener("touchstart", (e) => {
  if (!gatePassed) return;
  startBgmIfAllowed();
  app.touchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (!gatePassed) return;
  const dy = app.touchY - e.changedTouches[0].clientY;
  if (Math.abs(dy) < 22) return;
  if (dy > 0) onNext();
  else onPrev();
}, { passive: true });

function onResize() {
  const isMobile = window.innerWidth <= 768;
  camera.fov = isMobile ? 58 : 50;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  nebulaUniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  applyMobilePlanetLayout();
  layoutAlbumForDevice();
  resizeTextCanvas();
  resizeMeteorCanvas();
  resetMeteors2D();
}

window.addEventListener("resize", onResize);

function animate() {
  app.t += 0.01;
  drawParticleText(1 / 60);
  if (!app.introClosed) renderMeteors2D();
  meteorSystem.update(app.t);
  updateFireworkPhotoShow(1 / 60);
  nebulaUniforms.uTime.value = app.t;
  deepSpaceUniforms.uTime.value = app.t;
  starNear.material.uniforms.uTime.value = app.t;
  starMid.material.uniforms.uTime.value = app.t;
  starFar.material.uniforms.uTime.value = app.t;
  starFar.rotation.y += 0.00018;
  starMid.rotation.y += 0.00028;
  starNear.rotation.y += 0.00042;
  breatheStars.mat.uniforms.uTime.value = app.t;

  nebula.position.x = camera.position.x * 0.2;
  nebula.position.y = camera.position.y * 0.16;
  planetA.rotation.y += 0.0012;
  planetB.rotation.y -= 0.0018;
  ringA.rotation.z += 0.001;
  planetGroup.position.x = Math.sin(app.t * 0.18) * 0.25;
  planetGroup.position.y = Math.cos(app.t * 0.13) * 0.18;
  glowA.position.copy(planetA.position);
  glowB.position.copy(planetB.position);

  if (app.phase === "intro") {
    camera.position.x = Math.sin(app.t * 0.43) * 0.26;
    camera.position.y = 0.28 + Math.sin(app.t * 0.31) * 0.18;
    camera.position.z = 6 + Math.cos(app.t * 0.21) * 0.16;
  } else if (app.phase === "book") {
    camera.position.x = Math.sin(app.t * 0.5) * 0.14;
    camera.position.y = 0.18 + Math.sin(app.t * 0.36) * 0.12;
    camera.position.z = 6 + Math.cos(app.t * 0.22) * 0.12;
  } else if (app.phase === "ending") {
    // 结尾照片环改为 DOM 层旋转（更稳定可见）
  }
  camera.lookAt(0, 0, 0);

  keyLight.intensity = 1.06 + Math.sin(app.t * 1.4) * 0.18;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function boot() {
  initCinematicBackground();
  updateMusicButton();
  if (ui.musicToggle) ui.musicToggle.classList.add("hidden");
  if (ui.bgmAudio) {
    ui.bgmAudio.addEventListener("error", tryNextBgmSource);
  }
  if (ui.musicToggle) {
    ui.musicToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      bgmState.enabled = !bgmState.enabled;
      updateMusicButton();
      if (!ui.bgmAudio) return;
      if (bgmState.enabled) {
        startBgmIfAllowed();
      } else {
        ui.bgmAudio.pause();
      }
    });
  }
  applyMobilePlanetLayout();
  onResize();
  resizeMeteorCanvas();
  resetMeteors2D();
  resizeTextCanvas();
  createHeartPoints();
  // 开屏：满屏流星雨 + 3-2-1 倒计时 + 粒子爱心，再进入书本
  textFx.phase = "idle";
  textFx.targets = [];
  textFx.particles = [];
  setTimeout(() => {
    if (app.phase !== "intro") return;
    showMosaicCountdown("3", { fadeIn: 0.55, hold: 0.9, fadeOut: 0.55 });
    setTimeout(() => { if (app.phase === "intro") showMosaicCountdown("2", { fadeIn: 0.55, hold: 0.9, fadeOut: 0.55 }); }, 2000);
    setTimeout(() => { if (app.phase === "intro") showMosaicCountdown("1", { fadeIn: 0.55, hold: 0.9, fadeOut: 0.55 }); }, 4000);
    setTimeout(() => {
      if (app.phase !== "intro") return;
      // 321 后展示粉色大爱心（强制高密度，确保可见）
      showIntroHeart();
      playIntroHeartBeat();
      // 轻微白闪仪式感
      gsap.to(ui.flash, { opacity: 0.35, duration: 0.14, yoyo: true, repeat: 1 });
    }, 6500);
    setTimeout(() => {
      if (app.phase === "intro") enterBookPhase();
    }, 8900);
  }, 700);
  animate();
}

if (ui.entryStartBtn) {
  if (ui.musicToggle) ui.musicToggle.classList.add("hidden");
  ui.entryStartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    passEntryGate(true);
  }, { once: true });
} else {
  passEntryGate(true);
}
