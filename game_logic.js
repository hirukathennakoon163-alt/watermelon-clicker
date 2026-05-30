// ══════════════════════════════════════════════
//  WATERMELON CLICKER - Optimized Game Logic
// ══════════════════════════════════════════════

// ── SAVE/LOAD ──
let gameLoaded = false; // guard: prevent save() from firing before load() completes

function save() {
  if (!gameLoaded) return; // don't overwrite save data with zeroes
  localStorage.setItem(
    "wmSave",
    JSON.stringify({
      melons: game.melons,
      totalMelons: game.totalMelons,
      clicks: game.clicks,
      goldenClicks: game.goldenClicks,
      buildings: game.buildings.map((b) => ({ owned: b.owned })),
      upgrades: game.upgrades.map((u) => ({ bought: u.bought })),
      achievements: game.achievements.map((a) => ({ earned: a.earned })),
    }),
  );
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem("wmSave"));
    if (!d) return;
    game.melons = d.melons || 0;
    game.totalMelons = d.totalMelons || 0;
    game.clicks = d.clicks || 0;
    game.goldenClicks = d.goldenClicks || 0;
    (d.buildings || []).forEach((b, i) => {
      if (game.buildings[i]) game.buildings[i].owned = b.owned || 0;
    });
    (d.upgrades || []).forEach((u, i) => {
      if (game.upgrades[i]) game.upgrades[i].bought = u.bought || false;
    });
    (d.achievements || []).forEach((a, i) => {
      if (game.achievements[i]) game.achievements[i].earned = a.earned || false;
    });
  } catch (e) {
    console.warn("Save load failed:", e);
  }
  gameLoaded = true; // safe to save from this point on
}

// ── GAME DATA ──
const game = {
  melons: 0,
  totalMelons: 0,
  clicks: 0,
  goldenClicks: 0,
  mpc: 1, // melons per click
  mps: 0, // melons per second

  buildings: [
    {
      name: "Melon Seed",
      icon: "🌱",
      baseCost: 15,
      baseCps: 0.1,
      owned: 0,
      desc: "Tiny seeds sprouting tiny melons.",
    },
    {
      name: "Melon Patch",
      icon: "🪴",
      baseCost: 100,
      baseCps: 0.5,
      owned: 0,
      desc: "A small patch of happy melons.",
    },
    {
      name: "Melon Farm",
      icon: "🌿",
      baseCost: 500,
      baseCps: 4,
      owned: 0,
      desc: "An actual farm. Progress!",
    },
    {
      name: "Melon Truck",
      icon: "🚚",
      baseCost: 2000,
      baseCps: 10,
      owned: 0,
      desc: "Delivers melons 24/7.",
    },
    {
      name: "Melon Factory",
      icon: "🏭",
      baseCost: 8000,
      baseCps: 40,
      owned: 0,
      desc: "Industrial-scale melon production.",
    },
    {
      name: "Melon Lab",
      icon: "🔬",
      baseCost: 30000,
      baseCps: 100,
      owned: 0,
      desc: "Scientists engineer super melons.",
    },
    {
      name: "Melon Drone",
      icon: "🚁",
      baseCost: 100000,
      baseCps: 400,
      owned: 0,
      desc: "Aerial melon extraction squadrons.",
    },
    {
      name: "Melon Portal",
      icon: "🌀",
      baseCost: 400000,
      baseCps: 1600,
      owned: 0,
      desc: "Pulls melons from alternate realities.",
    },
    {
      name: "Melon Planet",
      icon: "🪐",
      baseCost: 1500000,
      baseCps: 6000,
      owned: 0,
      desc: "An entire planet made of watermelon.",
    },
    {
      name: "Melon Singularity",
      icon: "⚛️",
      baseCost: 10000000,
      baseCps: 50000,
      owned: 0,
      desc: "The universe itself becomes melon.",
    },
  ],

  upgrades: [
    // Click upgrades
    {
      name: "Better Slicing",
      icon: "🔪",
      cost: 100,
      bought: false,
      desc: "Sharper knives = more melon per click.",
      type: "click",
      mult: 2,
    },
    {
      name: "Power Grip",
      icon: "💪",
      cost: 500,
      bought: false,
      desc: "You squeeze harder. +2x click power.",
      type: "click",
      mult: 2,
    },
    {
      name: "Golden Knife",
      icon: "🗡️",
      cost: 2000,
      bought: false,
      desc: "A legendary blade. Triple click power.",
      type: "click",
      mult: 3,
    },
    {
      name: "Cyber Hands",
      icon: "🦾",
      cost: 10000,
      bought: false,
      desc: "Robot hands click so fast.",
      type: "click",
      mult: 2,
    },
    {
      name: "Quantum Clicks",
      icon: "⚡",
      cost: 100000,
      bought: false,
      desc: "Clicks exist in multiple states at once.",
      type: "click",
      mult: 5,
    },
    // Seed upgrades
    {
      name: "Fertilizer",
      icon: "💩",
      cost: 200,
      bought: false,
      desc: "Seeds grow 2x faster.",
      type: "building",
      idx: 0,
      mult: 2,
    },
    {
      name: "Super Seeds",
      icon: "🌟",
      cost: 2000,
      bought: false,
      desc: "Genetically enhanced seeds. 2x output.",
      type: "building",
      idx: 0,
      mult: 2,
    },
    // Farm upgrades
    {
      name: "Irrigation",
      icon: "💧",
      cost: 1000,
      bought: false,
      desc: "Water your melons! 2x farm output.",
      type: "building",
      idx: 2,
      mult: 2,
    },
    {
      name: "Auto-Harvest",
      icon: "🤖",
      cost: 8000,
      bought: false,
      desc: "Robots harvest farms. 2x output.",
      type: "building",
      idx: 2,
      mult: 2,
    },
    // Factory upgrades
    {
      name: "Assembly Line",
      icon: "⚙️",
      cost: 50000,
      bought: false,
      desc: "Streamlined production. 2x factories.",
      type: "building",
      idx: 4,
      mult: 2,
    },
    {
      name: "AI Optimization",
      icon: "🧠",
      cost: 300000,
      bought: false,
      desc: "AI runs the factory. 3x output.",
      type: "building",
      idx: 4,
      mult: 3,
    },
    // Global upgrades
    {
      name: "Melon Hype",
      icon: "📣",
      cost: 5000,
      bought: false,
      desc: "All producers work 1.5x harder.",
      type: "global",
      mult: 1.5,
    },
    {
      name: "Melon Religion",
      icon: "🙏",
      cost: 50000,
      bought: false,
      desc: "Everyone worships melons. 2x everything.",
      type: "global",
      mult: 2,
    },
    {
      name: "Melon Dimension",
      icon: "🌈",
      cost: 500000,
      bought: false,
      desc: "A whole dimension of melons. 3x all.",
      type: "global",
      mult: 3,
    },
    {
      name: "Infinite Melon",
      icon: "♾️",
      cost: 5000000,
      bought: false,
      desc: "Melons that create melons. 5x all.",
      type: "global",
      mult: 5,
    },
    // Lab
    {
      name: "DNA Splicing",
      icon: "🧬",
      cost: 200000,
      bought: false,
      desc: "Labs produce 3x as many melons.",
      type: "building",
      idx: 5,
      mult: 3,
    },
    // Portal
    {
      name: "Dimensional Rip",
      icon: "🕳️",
      cost: 2000000,
      bought: false,
      desc: "Portals pull 3x more melons through.",
      type: "building",
      idx: 7,
      mult: 3,
    },
  ],

  achievements: [
    {
      name: "First Slice",
      icon: "🍉",
      desc: "Click your first watermelon.",
      check: (g) => g.clicks >= 1,
    },
    {
      name: "Melon Farmer",
      icon: "👨‍🌾",
      desc: "Own 10 producers total.",
      check: (g) => totalOwned(g) >= 10,
    },
    {
      name: "100 Club",
      icon: "💯",
      desc: "Harvest 100 watermelons.",
      check: (g) => g.totalMelons >= 100,
    },
    {
      name: "Thousand",
      icon: "🌿",
      desc: "Harvest 1,000 watermelons.",
      check: (g) => g.totalMelons >= 1000,
    },
    {
      name: "Million",
      icon: "💎",
      desc: "Harvest 1,000,000 watermelons.",
      check: (g) => g.totalMelons >= 1e6,
    },
    {
      name: "Billion",
      icon: "🌟",
      desc: "Harvest 1 billion watermelons.",
      check: (g) => g.totalMelons >= 1e9,
    },
    {
      name: "Trillion",
      icon: "🚀",
      desc: "Harvest 1 trillion watermelons.",
      check: (g) => g.totalMelons >= 1e12,
    },
    {
      name: "Click Addict",
      icon: "🖱️",
      desc: "Click 1,000 times.",
      check: (g) => g.clicks >= 1000,
    },
    {
      name: "Click Maniac",
      icon: "⚡",
      desc: "Click 10,000 times.",
      check: (g) => g.clicks >= 10000,
    },
    {
      name: "All Seeds",
      icon: "🌱",
      desc: "Own 50 Melon Seeds.",
      check: (g) => g.buildings[0].owned >= 50,
    },
    {
      name: "Melon Mogul",
      icon: "🏭",
      desc: "Own 25 Melon Factories.",
      check: (g) => g.buildings[4].owned >= 25,
    },
    {
      name: "Golden Touch",
      icon: "✨",
      desc: "Click a golden watermelon.",
      check: (g) => g.goldenClicks >= 1,
    },
    {
      name: "Upgrade Hoarder",
      icon: "🗄️",
      desc: "Buy 10 upgrades.",
      check: (g) => g.upgrades.filter((u) => u.bought).length >= 10,
    },
    {
      name: "Melon Lord",
      icon: "👑",
      desc: "Own every type of producer.",
      check: (g) => g.buildings.every((b) => b.owned >= 1),
    },
    {
      name: "Quadrillion",
      icon: "🌌",
      desc: "Harvest 1 quadrillion watermelons.",
      check: (g) => g.totalMelons >= 1e15,
    },
    {
      name: "Obsessed",
      icon: "🍉",
      desc: "Harvest 1 quintillion watermelons.",
      check: (g) => g.totalMelons >= 1e18,
    },
  ],
};

// ── HELPERS ──
function totalOwned(g) {
  return g.buildings.reduce((s, b) => s + b.owned, 0);
}

// ── NUMBER FORMAT ──
const FMT_SUFFIXES = [
  "",
  "thousand",
  "million",
  "billion",
  "trillion",
  "quadrillion",
  "quintillion",
  "sextillion",
];
const FMT_SUFFIXES_SHORT = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx"];

function fmt(n) {
  if (n < 1000) return Math.floor(n).toLocaleString();
  const tier = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    FMT_SUFFIXES.length - 1,
  );
  return (
    (n / Math.pow(1000, tier)).toFixed(tier > 1 ? 2 : 1) +
    " " +
    (FMT_SUFFIXES[tier] || "∞")
  );
}

function fmtShort(n) {
  if (n < 1000) return Math.floor(n).toString();
  const tier = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    FMT_SUFFIXES_SHORT.length - 1,
  );
  return (
    (n / Math.pow(1000, tier)).toFixed(1) + (FMT_SUFFIXES_SHORT[tier] || "?")
  );
}

// ── COMPUTE STATS ──
// Cache upgrade mults to avoid re-scanning the full upgrades array repeatedly
let _cachedMults = null;

function invalidateMults() {
  _cachedMults = null;
}

function getUpgradeMults() {
  if (_cachedMults) return _cachedMults;
  let clickMult = 1,
    globalMult = 1;
  const buildingMult = new Array(game.buildings.length).fill(1);
  for (const u of game.upgrades) {
    if (!u.bought) continue;
    if (u.type === "click") clickMult *= u.mult;
    if (u.type === "global") globalMult *= u.mult;
    if (u.type === "building") buildingMult[u.idx] *= u.mult;
  }
  _cachedMults = { clickMult, globalMult, buildingMult };
  return _cachedMults;
}

function computeStats() {
  const { clickMult, globalMult, buildingMult } = getUpgradeMults();
  game.mpc = clickMult;
  let mps = 0;
  for (let i = 0; i < game.buildings.length; i++) {
    const b = game.buildings[i];
    mps += b.owned * b.baseCps * buildingMult[i];
  }
  game.mps = mps * globalMult;
}

function buildingCost(b) {
  return Math.floor(b.baseCost * Math.pow(1.15, b.owned));
}

// ── GOLDEN MELON ──
let goldenTimer = 0,
  goldenEl = null;

// Inject golden pulse animation once
const _goldenStyle = document.createElement("style");
_goldenStyle.textContent =
  "@keyframes goldenPulse{0%{transform:scale(1) rotate(-5deg)}100%{transform:scale(1.15) rotate(5deg)}}";
document.head.appendChild(_goldenStyle);

function spawnGolden() {
  if (goldenEl) return;
  const center = document.getElementById("center");
  const r = center.getBoundingClientRect();
  goldenEl = document.createElement("div");
  goldenEl.style.cssText = `position:fixed;font-size:2.8rem;cursor:pointer;z-index:200;
    left:${r.left + 40 + Math.random() * (r.width - 100)}px;
    top:${r.top + 60 + Math.random() * (r.height - 120)}px;
    animation:goldenPulse 0.8s ease-in-out infinite alternate;
    filter:drop-shadow(0 0 12px gold);user-select:none;`;
  goldenEl.textContent = "✨🍉✨";
  goldenEl.title = "GOLDEN MELON! Click it!";
  goldenTimer = 30;
  goldenEl.addEventListener("click", () => {
    const bonus = Math.max(1, game.mps) * 13 + 777;
    game.melons += bonus;
    game.totalMelons += bonus;
    game.goldenClicks++;
    showToast(`✨ Golden Melon! +${fmt(bonus)} watermelons!`);
    spawnParticlesBurst(
      parseInt(goldenEl.style.left) + 30,
      parseInt(goldenEl.style.top) + 30,
      "#ffd700",
      20,
    );
    goldenEl.remove();
    goldenEl = null;
    checkAchievements();
  });
  document.body.appendChild(goldenEl);
}

// ── CLICK HANDLER ──
document.getElementById("melon").addEventListener("click", (e) => {
  game.melons += game.mpc;
  game.totalMelons += game.mpc;
  game.clicks++;
  spawnFloatText(e.clientX, e.clientY, "+" + fmtShort(game.mpc));
  const m = document.getElementById("melon");
  m.classList.add("clicked");
  setTimeout(() => m.classList.remove("clicked"), 80);
  spawnMiniMelon(e.clientX, e.clientY);
  checkAchievements();
  updateUI();
});

// ── FLOAT TEXT ──
function spawnFloatText(x, y, txt) {
  const el = document.createElement("div");
  el.className = "float-text";
  el.textContent = txt;
  el.style.left = x - 20 + "px";
  el.style.top = y - 10 + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ── MINI MELON CANVAS ──
const mc = document.getElementById("melon-canvas");
mc.width = window.innerWidth;
mc.height = window.innerHeight;
window.addEventListener("resize", () => {
  mc.width = window.innerWidth;
  mc.height = window.innerHeight;
});
const mctx = mc.getContext("2d");
let miniMelons = [];

function spawnMiniMelon(x, y) {
  for (let i = 0; i < 3; i++) {
    miniMelons.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: -3 - Math.random() * 4,
      life: 1,
      r: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.3,
    });
  }
}

function spawnParticlesBurst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 5;
    miniMelons.push({
      x,
      y,
      vx: Math.cos(a) * spd,
      vy: Math.sin(a) * spd - 2,
      life: 1,
      r: 4,
      rot: 0,
      rotV: 0,
      color,
    });
  }
}

function animateCanvas() {
  mctx.clearRect(0, 0, mc.width, mc.height);
  const alive = [];
  for (const m of miniMelons) {
    m.x += m.vx;
    m.y += m.vy;
    m.vy += 0.18;
    m.life -= 0.025;
    m.rot += m.rotV;
    if (m.life <= 0) continue;
    alive.push(m);
    mctx.save();
    mctx.globalAlpha = m.life;
    mctx.translate(m.x, m.y);
    mctx.rotate(m.rot);
    if (m.color) {
      mctx.fillStyle = m.color;
      mctx.beginPath();
      mctx.arc(0, 0, m.r, 0, Math.PI * 2);
      mctx.fill();
    } else {
      mctx.fillStyle = "#2d7a2d";
      mctx.beginPath();
      mctx.arc(0, 0, m.r, 0, Math.PI * 2);
      mctx.fill();
      mctx.fillStyle = "#e8453c";
      mctx.beginPath();
      mctx.arc(0, 0, m.r * 0.75, 0, Math.PI * 2);
      mctx.fill();
      mctx.fillStyle = "#1a1a0a";
      mctx.fillRect(-1, -2, 2, 4);
    }
    mctx.restore();
  }
  miniMelons = alive; // avoid .filter() allocation every frame
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(t._tm);
  t._tm = setTimeout(() => (t.style.opacity = "0"), 2800);
}

// ── BUILD UI ──
function buildUpgradesUI() {
  const grid = document.getElementById("upgrades-grid");
  grid.innerHTML = "";
  for (let i = 0; i < game.upgrades.length; i++) {
    const u = game.upgrades[i];
    if (u.bought) continue;
    const btn = document.createElement("div");
    btn.className =
      "upgrade-btn" + (game.melons >= u.cost ? " affordable" : "");
    btn.innerHTML = `${u.icon}<div class="tooltip"><b>${u.name}</b><br>${u.desc}<br><span style="color:var(--gold)">Cost: ${fmt(u.cost)} 🍉</span></div>`;
    btn.addEventListener("click", () => {
      if (game.melons >= u.cost && !u.bought) {
        game.melons -= u.cost;
        u.bought = true;
        invalidateMults(); // bust cache when upgrades change
        showToast(`🌟 Bought: ${u.name}!`);
        computeStats();
        buildUpgradesUI();
        buildBuildingsUI();
        updateUI();
        checkAchievements();
      }
    });
    grid.appendChild(btn);
  }
}

function buildBuildingsUI() {
  const list = document.getElementById("buildings-list");
  list.innerHTML = "";
  const { globalMult, buildingMult } = getUpgradeMults();

  for (let i = 0; i < game.buildings.length; i++) {
    const b = game.buildings[i];
    const cost = buildingCost(b);
    const can = game.melons >= cost;
    const bMult = buildingMult[i];
    const cps = (b.baseCps * bMult * globalMult * b.owned).toFixed(1);

    const el = document.createElement("div");
    el.className = "building" + (can ? " affordable" : " cant-afford");
    el.innerHTML = `
      <div class="b-icon">${b.icon}</div>
      <div class="b-info">
        <div class="b-name">${b.name}</div>
        <div class="b-desc">${b.desc}</div>
        <div class="b-cost">🍉 ${fmt(cost)}</div>
        <div class="b-cps">${cps}/sec total</div>
      </div>
      <div class="b-owned">${b.owned}</div>
      <div class="b-tooltip">
        <b>${b.icon} ${b.name}</b><br>
        Owned: <b>${b.owned}</b><br>
        Each produces: <b>${(b.baseCps * bMult * globalMult).toFixed(2)}/sec</b><br>
        Total: <b>${cps}/sec</b><br>
        <span style="color:var(--gold)">Cost: ${fmt(cost)} 🍉</span>
      </div>
    `;
    el.addEventListener("click", () => {
      const c = buildingCost(b);
      if (game.melons >= c) {
        game.melons -= c;
        b.owned++;
        computeStats();
        buildBuildingsUI();
        buildUpgradesUI();
        updateUI();
        checkAchievements();
      }
    });
    list.appendChild(el);
  }

  // Achievements bar at bottom
  let achBar = document.getElementById("achievements-bar");
  if (!achBar) {
    achBar = document.createElement("div");
    achBar.id = "achievements-bar";
    list.appendChild(achBar);
  }
}

function buildAchievementsUI() {
  const bar = document.getElementById("achievements-bar");
  if (!bar) return;
  bar.innerHTML = "";
  for (const a of game.achievements) {
    const el = document.createElement("div");
    el.className = "ach" + (a.earned ? " earned" : "");
    el.innerHTML = `${a.icon}<div class="ach-tip"><b>${a.name}</b><br>${a.desc}</div>`;
    bar.appendChild(el);
  }
}

// Pre-defined milestones (static, no need to recreate each call)
const MILESTONES = [
  { n: 1, icon: "🍉", label: "1st melon" },
  { n: 1000, icon: "🌿", label: "1K melons" },
  { n: 1e6, icon: "💎", label: "1M melons" },
  { n: 1e9, icon: "🌟", label: "1B melons" },
  { n: 1e12, icon: "🚀", label: "1T melons" },
  { n: 1e15, icon: "🌌", label: "1Qa melons" },
];

function buildMilestonesUI() {
  const ms = document.getElementById("milestones");
  if (!ms) return;
  while (ms.children.length > 1) ms.removeChild(ms.lastChild);
  for (const m of MILESTONES) {
    const el = document.createElement("div");
    el.className = "milestone" + (game.totalMelons >= m.n ? " unlocked" : "");
    el.innerHTML = `<span class="mi-icon">${m.icon}</span>${m.label}`;
    ms.appendChild(el);
  }
}

// ── ACHIEVEMENTS ──
function checkAchievements() {
  let newEarned = false;
  for (const a of game.achievements) {
    if (!a.earned && a.check(game)) {
      a.earned = true;
      newEarned = true;
      showToast(`🏆 Achievement: ${a.name}!`);
    }
  }
  if (newEarned) buildAchievementsUI();
}

// ── UPDATE UI ──
// Cache DOM references — getElementById on every tick is wasteful
const UI = {};
function getUI(id) {
  return UI[id] || (UI[id] = document.getElementById(id));
}

function setText(id, val) {
  const el = getUI(id);
  if (el) el.textContent = val;
  // Silently skips if element doesn't exist yet — prevents the TypeError crash
}

function updateUI() {
  setText("wm-count", fmt(game.melons));
  setText("wm-per-sec", fmt(game.mps) + " per second");
  setText("wm-per-click-label", fmt(game.mpc) + " per click");
  setText("stat-total", fmt(game.totalMelons));
  setText("stat-clicks", game.clicks.toLocaleString());
  setText("stat-run", fmt(game.melons));
  setText("stat-golden", game.goldenClicks);
  setText("sb-best", fmt(game.totalMelons));
  buildMilestonesUI();
  // Re-evaluate affordability without full rebuild
  document.querySelectorAll(".building").forEach((el, i) => {
    if (!game.buildings[i]) return;
    const can = game.melons >= buildingCost(game.buildings[i]);
    el.classList.toggle("affordable", can);
    el.classList.toggle("cant-afford", !can);
  });
}

// ── GAME TICK ──
let lastTick = Date.now();
let goldenCooldown = 0;

function tick() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;

  const gain = game.mps * dt;
  game.melons += gain;
  game.totalMelons += gain;

  goldenCooldown -= dt;
  if (goldenCooldown <= 0) {
    goldenCooldown = 60 + Math.random() * 120;
    if (Math.random() < 0.4) spawnGolden();
  }
  if (goldenEl) {
    goldenTimer -= dt;
    if (goldenTimer <= 0) {
      goldenEl.remove();
      goldenEl = null;
    }
  }

  updateUI();
  save();
}

// Slower UI refresh for buildings/upgrades
let buildRefresh = 0;
function slowRefresh() {
  buildRefresh++;
  if (buildRefresh % 4 === 0) buildBuildingsUI();
  if (buildRefresh % 8 === 0) buildUpgradesUI();
}

// ── INIT — wait for DOM to be ready before touching any elements ──
document.addEventListener("DOMContentLoaded", () => {
  load();
  computeStats();
  buildUpgradesUI();
  buildBuildingsUI();
  buildAchievementsUI();
  buildMilestonesUI();
  updateUI();

  setInterval(tick, 100);
  setInterval(slowRefresh, 250);
  setInterval(checkAchievements, 2000);

  const headlines = [
    "🍉 Watermelon market hits record highs · Farmers report infinite yields · Scientists confirm melons are sentient · Local man clicks watermelon 1 million times · Watermelon replaces Bitcoin as global currency · You are the chosen one · The melons thank you for your service",
  ];
  const newsEl = document.getElementById("news-text");
  if (newsEl) newsEl.textContent = headlines[0];

  showToast("🍉 Welcome to Watermelon Clicker! Click the melon to begin!");
});
