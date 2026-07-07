// ============================================================
// AI/ML-THEMED BACKGROUND ANIMATIONS — One per section
// Performance: IntersectionObserver pauses off-screen canvases
// ============================================================

// --- 1. NEURAL NETWORK (Hero) ---
class NeuralNetworkAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.mouse = { x: null, y: null };
    this.raf = null;
    this.resize();
    this.init();
    this.bindMouse();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    this.init();
  }
  init() {
    const w = this.canvas.width, h = this.canvas.height;
    const isMobile = w < 768;
    const count = isMobile ? 35 : 70;
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        r: 2 + Math.random() * 2.5,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  bindMouse() {
    const set = e => { const r = this.canvas.getBoundingClientRect(); this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top; };
    const clr = () => { this.mouse.x = null; this.mouse.y = null; };
    this.canvas.parentElement.addEventListener('mousemove', set);
    this.canvas.parentElement.addEventListener('mouseleave', clr);
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    const connDist = w < 768 ? 100 : 150;
    const now = performance.now() * 0.001;
    // Update nodes
    for (const n of this.nodes) {
      n.x += n.vx; n.y += n.vy;
      n.pulse += 0.02;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // Mouse repulsion
      if (this.mouse.x !== null) {
        const dx = n.x - this.mouse.x, dy = n.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { n.vx += (dx / d) * 0.15; n.vy += (dy / d) * 0.15; }
      }
      // Clamp speed
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > 1.2) { n.vx *= 1.2 / spd; n.vy *= 1.2 / spd; }
    }
    // Draw connections
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < connDist) {
          const alpha = (1 - d / connDist) * 0.25;
          // Pulse effect on the connection
          const pulseAlpha = alpha * (0.5 + 0.5 * Math.sin(now * 2 + i * 0.3));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(245,166,35,${pulseAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          // Data signal traveling along connection
          if (d < connDist * 0.6 && Math.sin(now * 3 + i + j) > 0.7) {
            const t = (Math.sin(now * 4 + i) + 1) / 2;
            const sx = a.x + (b.x - a.x) * t, sy = a.y + (b.y - a.y) * t;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(110,231,201,${0.6 + 0.4 * Math.sin(now * 5)})`;
            ctx.fill();
          }
        }
      }
    }
    // Draw nodes
    for (const n of this.nodes) {
      const glow = 0.4 + 0.3 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,166,35,${glow})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,166,35,${glow * 0.15})`;
      ctx.fill();
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 2. DATA HELIX (About) ---
class DataHelixAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.offset = 0;
    this.resize();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.offset += 0.008;
    const isMobile = w < 768;
    const cx = w * 0.85, amp = isMobile ? 40 : 80;
    const pointCount = isMobile ? 50 : 80;
    const spacing = h / pointCount;

    for (let i = 0; i < pointCount; i++) {
      const y = i * spacing;
      const angle = (i * 0.15) + this.offset;
      const x1 = cx + Math.sin(angle) * amp;
      const x2 = cx + Math.sin(angle + Math.PI) * amp;
      const depth1 = (Math.cos(angle) + 1) / 2;
      const depth2 = (Math.cos(angle + Math.PI) + 1) / 2;

      // Cross-connection
      if (i % 4 === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y); ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(125,211,252,${0.08 + depth1 * 0.06})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      // Strand 1
      ctx.beginPath();
      ctx.arc(x1, y, 2 + depth1 * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,166,35,${0.15 + depth1 * 0.35})`;
      ctx.fill();
      // Strand 2
      ctx.beginPath();
      ctx.arc(x2, y, 2 + depth2 * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110,231,201,${0.15 + depth2 * 0.35})`;
      ctx.fill();
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 3. CIRCUIT BOARD (Skills) ---
class CircuitBoardAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.traces = [];
    this.resize();
    this.initTraces();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    this.initTraces();
  }
  initTraces() {
    this.traces = [];
    const w = this.canvas.width, h = this.canvas.height;
    const isMobile = w < 768;
    const count = isMobile ? 8 : 15;
    const gridSize = isMobile ? 30 : 50;
    for (let i = 0; i < count; i++) {
      const pts = [];
      let x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
      let y = Math.floor(Math.random() * (h / gridSize)) * gridSize;
      pts.push({ x, y });
      const segs = 4 + Math.floor(Math.random() * 6);
      for (let s = 0; s < segs; s++) {
        const dir = Math.random() > 0.5;
        const len = (1 + Math.floor(Math.random() * 4)) * gridSize;
        if (dir) x += (Math.random() > 0.5 ? 1 : -1) * len;
        else y += (Math.random() > 0.5 ? 1 : -1) * len;
        x = Math.max(0, Math.min(w, x));
        y = Math.max(0, Math.min(h, y));
        pts.push({ x, y });
      }
      this.traces.push({ pts, progress: Math.random(), speed: 0.001 + Math.random() * 0.002, color: Math.random() > 0.5 ? 'amber' : 'mint' });
    }
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    // Draw grid dots
    const gridSize = w < 768 ? 30 : 50;
    for (let x = 0; x < w; x += gridSize) {
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52,56,65,0.4)';
        ctx.fill();
      }
    }
    // Draw traces
    for (const trace of this.traces) {
      trace.progress += trace.speed;
      if (trace.progress > 1) trace.progress = 0;
      const pts = trace.pts;
      // Calculate total length
      let totalLen = 0;
      for (let i = 1; i < pts.length; i++) totalLen += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
      // Draw base trace
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = trace.color === 'amber' ? 'rgba(245,166,35,0.08)' : 'rgba(110,231,201,0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Draw nodes
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = trace.color === 'amber' ? 'rgba(245,166,35,0.15)' : 'rgba(110,231,201,0.15)';
        ctx.fill();
      }
      // Animated signal dot
      let traveled = trace.progress * totalLen, signalX = pts[0].x, signalY = pts[0].y;
      for (let i = 1; i < pts.length; i++) {
        const segLen = Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
        if (traveled <= segLen) {
          const t = traveled / segLen;
          signalX = pts[i-1].x + (pts[i].x - pts[i-1].x) * t;
          signalY = pts[i-1].y + (pts[i].y - pts[i-1].y) * t;
          break;
        }
        traveled -= segLen;
      }
      const glowColor = trace.color === 'amber' ? '245,166,35' : '110,231,201';
      ctx.beginPath();
      ctx.arc(signalX, signalY, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${glowColor},0.15)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${glowColor},0.6)`;
      ctx.fill();
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 4. MATRIX RAIN (Projects) ---
class MatrixRainAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.columns = [];
    this.chars = '{}[]();=>const let var function return import export class async await 01'.split('');
    this.resize();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    const colW = this.canvas.width < 768 ? 28 : 22;
    const numCols = Math.ceil(this.canvas.width / colW);
    this.columns = [];
    for (let i = 0; i < numCols; i++) {
      this.columns.push({ x: i * colW, y: -Math.random() * this.canvas.height, speed: 0.3 + Math.random() * 0.8, chars: [] });
      const numChars = Math.floor(this.canvas.height / 18) + 5;
      for (let j = 0; j < numChars; j++) {
        this.columns[i].chars.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
      }
    }
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.font = '13px "JetBrains Mono", monospace';
    for (const col of this.columns) {
      col.y += col.speed;
      if (col.y > h + 200) { col.y = -Math.random() * 300 - 200; col.speed = 0.3 + Math.random() * 0.8; }
      for (let j = 0; j < col.chars.length; j++) {
        const cy = col.y + j * 18;
        if (cy < -20 || cy > h + 20) continue;
        const fade = j === 0 ? 0.3 : Math.max(0.02, 0.15 - j * 0.008);
        ctx.fillStyle = j === 0 ? `rgba(110,231,201,${fade})` : `rgba(110,231,201,${fade})`;
        ctx.fillText(col.chars[j], col.x, cy);
      }
      // Randomly swap chars
      if (Math.random() > 0.97) {
        const idx = Math.floor(Math.random() * col.chars.length);
        col.chars[idx] = this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 5. PARTICLE WAVE (Experience) ---
class ParticleWaveAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.particles = [];
    this.time = 0;
    this.resize();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    this.initParticles();
  }
  initParticles() {
    this.particles = [];
    const w = this.canvas.width, h = this.canvas.height;
    const isMobile = w < 768;
    const count = isMobile ? 60 : 120;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseY: Math.random() * h,
        speed: 0.3 + Math.random() * 0.7,
        amp: 15 + Math.random() * 30,
        freq: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        r: 1 + Math.random() * 2,
        color: Math.random() > 0.6 ? 'amber' : 'mint'
      });
    }
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.time += 0.01;
    for (const p of this.particles) {
      p.x += p.speed;
      if (p.x > w + 10) { p.x = -10; p.baseY = Math.random() * h; }
      p.y = p.baseY + Math.sin(p.x * p.freq + p.phase + this.time) * p.amp;
      const alpha = 0.15 + 0.2 * Math.sin(this.time * 2 + p.phase);
      if (p.color === 'amber') {
        ctx.fillStyle = `rgba(245,166,35,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(110,231,201,${alpha})`;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Draw subtle wave lines
    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      const waveY = h * (0.3 + wave * 0.2);
      for (let x = 0; x < w; x += 4) {
        const y = waveY + Math.sin(x * 0.008 + this.time * (1 + wave * 0.5) + wave) * (20 + wave * 10);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(245,166,35,${0.03 + wave * 0.01})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 6. FLOATING EQUATIONS (Education) ---
class FloatingEquationsAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.symbols = [];
    this.glyphs = ['∑', '∫', 'θ', 'λ', '∇', 'π', 'σ', 'μ', 'Δ', '∂', 'α', 'β', '∞', 'ε', '⊕', 'ℝ', 'f(x)', 'P(A|B)', 'O(n)', '∈', '∀', '∃'];
    this.resize();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    this.initSymbols();
  }
  initSymbols() {
    this.symbols = [];
    const w = this.canvas.width, h = this.canvas.height;
    const count = w < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      this.symbols.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: -0.1 - Math.random() * 0.3,
        glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
        size: 12 + Math.random() * 18,
        opacity: 0.06 + Math.random() * 0.14,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005
      });
    }
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (const s of this.symbols) {
      s.x += s.vx; s.y += s.vy;
      s.rotation += s.rotSpeed;
      if (s.y < -40) { s.y = h + 40; s.x = Math.random() * w; }
      if (s.x < -40) s.x = w + 40;
      if (s.x > w + 40) s.x = -40;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.font = `${s.size}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(125,211,252,${s.opacity})`;
      ctx.fillText(s.glyph, 0, 0);
      ctx.restore();
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// --- 7. SIGNAL WAVES (Contact) ---
class SignalWaveAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.ripples = [];
    this.time = 0;
    this.resize();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
  }
  animate() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.time += 0.015;
    const cx = w / 2, cy = h / 2;
    // Concentric ripples
    const maxR = Math.hypot(w, h) * 0.6;
    for (let i = 0; i < 8; i++) {
      const r = ((this.time * 40 + i * (maxR / 8)) % maxR);
      const alpha = Math.max(0, 0.12 * (1 - r / maxR));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245,166,35,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Secondary ripples (mint)
    for (let i = 0; i < 5; i++) {
      const r = ((this.time * 25 + i * (maxR / 5) + maxR / 10) % maxR);
      const alpha = Math.max(0, 0.07 * (1 - r / maxR));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(110,231,201,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Center pulsing dot
    const pulseR = 4 + 2 * Math.sin(this.time * 3);
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,166,35,${0.3 + 0.2 * Math.sin(this.time * 3)})`;
    ctx.fill();
    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR + 10, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,166,35,0.05)`;
    ctx.fill();
    this.raf = requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.raf) this.animate(); }
  stop() { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
}

// ============================================================
// INITIALIZATION — Attach animations with IntersectionObserver
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const animMap = [
    { id: 'hero', Cls: NeuralNetworkAnimation },
    { id: 'about', Cls: DataHelixAnimation },
    { id: 'skills', Cls: CircuitBoardAnimation },
    { id: 'projects', Cls: MatrixRainAnimation },
    { id: 'experience', Cls: ParticleWaveAnimation },
    { id: 'education', Cls: FloatingEquationsAnimation },
    { id: 'contact', Cls: SignalWaveAnimation }
  ];

  const instances = [];

  animMap.forEach(({ id, Cls }) => {
    const section = document.getElementById(id);
    if (!section) return;
    const canvas = section.querySelector('.section-bg-canvas');
    if (!canvas) return;
    const anim = new Cls(canvas);
    instances.push({ anim, section });
  });

  // IntersectionObserver — only animate visible sections
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const match = instances.find(i => i.section === entry.target);
      if (!match) return;
      if (entry.isIntersecting) match.anim.start();
      else match.anim.stop();
    });
  }, { threshold: 0.05 });

  instances.forEach(i => obs.observe(i.section));

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      instances.forEach(i => i.anim.resize());
    }, 200);
  });
});
