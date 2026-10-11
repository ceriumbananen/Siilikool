/* Konfetti, snö och kronblad på en canvas över hela skärmen - porterat från burst()/petals()/
   snow()/tick() i public/legacy/app.js (rad 4078-4248). Canvasen ritas av UiConfettiLayer
   (monteras i AppShell); den här filen håller partiklarna, så att vilken komponent som helst
   kan fira utan att känna till canvasen. Respekterar "minska rörelse". */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  c: string;
  a: number;
  r: number;
  w?: number;
  snow?: boolean;
  petal?: boolean;
};

const CONF = ["#F6B93B", "#C8305A", "#3B6CD4", "#2E6B45", "#FFFFFF", "#8A5A3B"];
const parts: Particle[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let raf: number | null = null;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function tick() {
  if (!ctx) {
    raf = null;
    return;
  }
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]!;
    if (p.snow) {
      p.w = (p.w || 0) + 0.03;
      p.y += p.vy;
      p.x += Math.sin(p.w) * (p.petal ? 1.6 : 0.9);
      if (p.y > innerHeight + 20) {
        parts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.petal ? 0.85 : 0.9;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      if (p.petal) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.w);
        ctx.ellipse(0, 0, p.s / 2, p.s / 3.4, 0, 0, 6.284);
      } else ctx.arc(p.x, p.y, p.s / 2, 0, 6.284);
      ctx.fill();
      ctx.restore();
      continue;
    }
    p.vy += 0.42;
    p.x += p.vx;
    p.y += p.vy;
    p.r += 0.18;
    p.a -= 0.011;
    if (p.a <= 0 || p.y > innerHeight + 40) {
      parts.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(p.a, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  }
  if (parts.length) raf = requestAnimationFrame(tick);
  else {
    raf = null;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

function start() {
  if (ctx && !raf) raf = requestAnimationFrame(tick);
}

/** Canvasen som partiklarna ritas på (UiConfettiLayer), eller null när den försvinner. */
export function setConfettiCanvas(c: CanvasRenderingContext2D | null) {
  ctx = c;
  if (!c) parts.length = 0;
  else start();
}

export function useConfetti() {
  /** Konfetti som sprutar upp från mitten av skärmen. */
  function burst(n = 70) {
    if (!ctx || reducedMotion()) return;
    const cx = innerWidth / 2,
      cy = innerHeight * 0.42;
    for (let i = 0; i < n; i++)
      parts.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -11 - 3,
        s: 5 + Math.random() * 7,
        c: CONF[(Math.random() * CONF.length) | 0]!,
        a: 1,
        r: Math.random() * 6,
      });
    start();
  }

  /** Kronblad i de givna färgerna som singlar ner. */
  function petals(n = 40, cols: string[]) {
    if (!ctx || reducedMotion()) return;
    for (let i = 0; i < n; i++)
      parts.push({
        snow: true,
        petal: true,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight,
        vx: 0,
        vy: 0.5 + Math.random() * 0.9,
        s: 5 + Math.random() * 7,
        c: cols[(Math.random() * cols.length) | 0]!,
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * 6.28,
      });
    start();
  }

  /** Snöflingor som faller från ovankanten. */
  function snow(n = 120) {
    if (!ctx || reducedMotion()) return;
    for (let i = 0; i < n; i++)
      parts.push({
        snow: true,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 1.2,
        vx: 0,
        vy: 0.7 + Math.random() * 1.1,
        s: 3 + Math.random() * 6,
        c: "#FFFFFF",
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * Math.PI * 2,
      });
    start();
  }

  return { burst, petals, snow };
}
