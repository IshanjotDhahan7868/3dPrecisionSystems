import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  Sequence,
  Video,
  staticFile,
} from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const GOLD        = "#c9a96e";
const GOLD_LIGHT  = "#e8d5a8";
const GOLD_DIM    = "rgba(201,169,110,0.28)";
const BLACK       = "#080808";
const DARK        = "#0b0f16";
const WHITE       = "#f4f1eb";
const DIM         = "rgba(244,241,235,0.52)";
const FAINT       = "rgba(244,241,235,0.18)";
const GREEN       = "#22c55e";
const GREEN_LIGHT = "#4ade80";
const RED_DIM     = "rgba(239,68,68,0.65)";
const MONO        = "'Courier New', monospace";
const SERIF       = "Georgia, serif";
const SANS        = "'Arial Black', Arial, sans-serif";
const SANS_B      = "Arial, sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// EASING + HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const EASE   = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_S = Easing.bezier(0.22, 1, 0.36, 1);

function lerp(f: number, a: number, b: number, x: number, y: number, e = EASE) {
  return interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e,
  });
}
const fade    = (f: number, s: number, d = 24) => lerp(f, s, s + d, 0, 1);
const fadeOut = (f: number, s: number, d = 20) => lerp(f, s, s + d, 1, 0);
const up      = (f: number, s: number, d = 28, amt = 46) => lerp(f, s, s + d, amt, 0);
const slideX  = (f: number, s: number, d = 28, amt = 60) => lerp(f, s, s + d, amt, 0);
const wipePct = (f: number, s: number, d = 40) => lerp(f, s, s + d, 0, 100);
const pulse   = (f: number, spd = 0.035) => Math.sin(f * spd);

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Grid: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <pattern id="g80" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M80 0L0 0 0 80" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="0.45" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#g80)" />
    </svg>
  </AbsoluteFill>
);

const Glow: React.FC<{ x?: number; y?: number; sz?: number; color?: string; alpha?: number }> = ({
  x = 50, y = 50, sz = 65, color = GOLD, alpha = 0.07,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse ${sz}% ${sz * 0.82}% at ${x}% ${y}%, ${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}, transparent 72%)`,
    }} />
  </AbsoluteFill>
);

const Scan: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", width: "100%", height: 2, opacity: 0.022,
        top: ((f * 2.8) % 1140) - 40,
        background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 40%,rgba(255,255,255,0.6) 60%,transparent 100%)",
      }} />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ n?: number; op?: number }> = ({ n = 32, op = 1 }) => {
  const f = useCurrentFrame();
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 139.5 + 17) % 100, y: (i * 93.7 + 11) % 100,
    sz: 0.8 + (i % 4) * 0.6, spd: 0.0045 + (i % 6) * 0.003,
    phi: i * 8.1, gold: i % 5 === 0,
  })), [n]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x + Math.sin(f * 0.018 + p.phi) * 0.55}%`,
          top:  `${((p.y + f * p.spd * 100) % 102) - 1}%`,
          width: p.sz, height: p.sz, borderRadius: "50%",
          background: p.gold ? GOLD : WHITE,
          opacity: 0.055 + Math.sin(f * 0.028 + p.phi) * 0.022,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Corners: React.FC<{ ins?: number; sz?: number; op?: number }> = ({ ins = 52, sz = 44, op = 1 }) => (
  <>
    {([
      { top: ins, left: ins, borderTop: `1px solid ${GOLD_DIM}`, borderLeft: `1px solid ${GOLD_DIM}` },
      { top: ins, right: ins, borderTop: `1px solid ${GOLD_DIM}`, borderRight: `1px solid ${GOLD_DIM}` },
      { bottom: ins, left: ins, borderBottom: `1px solid ${GOLD_DIM}`, borderLeft: `1px solid ${GOLD_DIM}` },
      { bottom: ins, right: ins, borderBottom: `1px solid ${GOLD_DIM}`, borderRight: `1px solid ${GOLD_DIM}` },
    ] as React.CSSProperties[]).map((s, i) => (
      <div key={i} style={{ position: "absolute", width: sz, height: sz, opacity: op, ...s }} />
    ))}
  </>
);

const EyebrowLabel: React.FC<{ children: React.ReactNode; s?: number; color?: string }> = ({
  children, s = 0, color = GOLD,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      fontFamily: MONO, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
      color, display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
      opacity: fade(f, s, 22), transform: `translateY(${up(f, s, 24, 28)}px)`,
    }}>
      <div style={{ width: 28, height: 1, background: color, flexShrink: 0 }} />
      {children}
    </div>
  );
};

const VideoBg: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 0.1 }) => (
  <Video src={staticFile(src)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }}
    startFrom={0} muted loop />
);

// ─────────────────────────────────────────────────────────────────────────────
// MONEY RAIN
// ─────────────────────────────────────────────────────────────────────────────
const DOLLAR_DATA = Array.from({ length: 32 }, (_, i) => ({
  x: 3 + (i * 97.3 % 94), delay: (i * 13) % 90,
  size: 20 + (i % 6) * 9, drift: -8 + (i % 5) * 4,
}));

const MoneyRain: React.FC<{ frame: number; density?: number }> = ({ frame, density = 1 }) => {
  const count = Math.round(DOLLAR_DATA.length * density);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {DOLLAR_DATA.slice(0, count).map((d, i) => {
        const lf = frame - d.delay;
        const cy = 110;
        const cf = ((lf % cy) + cy) % cy;
        const op = lerp(cf, 0, 18, 0, 1) * lerp(cf, 75, 105, 1, 0);
        const y  = lerp(cf, 0, cy, 108, -12);
        const rot = lerp(cf, 0, cy, d.drift - 10, d.drift + 10);
        if (lf < 0) return null;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${d.x + Math.sin(lf * 0.04) * 1.8}%`,
            top: `${y}%`,
            opacity: op,
            transform: `rotate(${rot}deg)`,
            fontFamily: SERIF, fontSize: d.size, color: GREEN,
            textShadow: `0 0 ${14 + d.size * 0.15}px ${GREEN}88`,
            filter: `drop-shadow(0 3px 10px ${GREEN}44)`,
            userSelect: "none", lineHeight: 1,
          }}>$</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COUNT-UP
// ─────────────────────────────────────────────────────────────────────────────
const CountUp: React.FC<{
  target: number; prefix?: string; suffix?: string;
  frame: number; start: number; dur?: number;
  size?: number; color?: string;
}> = ({ target, prefix = "", suffix = "", frame, start, dur = 100, size = 96, color = WHITE }) => {
  const v = Math.round(lerp(frame, start + 15, start + 15 + dur, 0, target, EASE_S));
  return (
    <span style={{ fontFamily: SERIF, fontSize: size, fontWeight: 300, color, lineHeight: 1 }}>
      {prefix}<span>{v.toLocaleString()}</span>
      <span style={{ color: GOLD, fontSize: size * 0.52, verticalAlign: "middle", marginLeft: 2 }}>{suffix}</span>
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 01 — BRAND SLAM  (0-210)
// ═══════════════════════════════════════════════════════════════════════════
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const flashW = lerp(f, 0, 9, 1, 0);
  const flashG = lerp(f, 5, 13, 0.5, 0);
  const logoOp = fade(f, 14, 38);
  const logoSc = lerp(f, 14, 55, 1.22, 1, EASE);
  const subOp  = fade(f, 66, 28);
  const tagOp  = fade(f, 88, 25);
  const cornOp = fade(f, 48, 28);
  const exitOp = fadeOut(f, 188, 22);
  const cpOp   = lerp(f, 14, 80, 0, 0.4);
  const cpSc   = lerp(f, 14, 80, 0.4, 1, EASE_S);
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: exitOp }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flashW, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: GOLD, opacity: flashG, pointerEvents: "none" }} />
      <VideoBg src="Precision3D.mp4" opacity={0.09} />
      <Grid opacity={0.05} />
      <Particles n={44} op={0.85} />
      <Glow x={50} y={48} sz={60} alpha={0.15} />
      <Scan />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: cpOp, transform: `scale(${cpSc})` }}>
          <line x1="960" y1="0"    x2="960" y2="420"  stroke={GOLD} strokeWidth="0.6" opacity="0.3" />
          <line x1="960" y1="660"  x2="960" y2="1080" stroke={GOLD} strokeWidth="0.6" opacity="0.3" />
          <line x1="0"   y1="540"  x2="840" y2="540"  stroke={GOLD} strokeWidth="0.6" opacity="0.3" />
          <line x1="1080" y1="540" x2="1920" y2="540" stroke={GOLD} strokeWidth="0.6" opacity="0.3" />
          <circle cx="960" cy="540" r="122" stroke={GOLD} strokeWidth="0.7" fill="none" opacity="0.22" />
          <circle cx="960" cy="540" r="200" stroke={GOLD} strokeWidth="0.4" fill="none" opacity="0.12" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, textAlign: "center" }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 22px" }}>
            <circle cx="40" cy="40" r="36" stroke={GOLD} strokeWidth="0.8" opacity="0.3" />
            <circle cx="40" cy="40" r="22" stroke={GOLD} strokeWidth="1" opacity="0.6" />
            <circle cx="40" cy="40" r="6" fill={GOLD} />
            {[0,90,180,270].map(deg => {
              const r = deg * Math.PI / 180;
              return <line key={deg}
                x1={40+Math.cos(r)*24} y1={40+Math.sin(r)*24}
                x2={40+Math.cos(r)*38} y2={40+Math.sin(r)*38}
                stroke={GOLD} strokeWidth="1.1" opacity="0.55" />;
            })}
          </svg>
          <div style={{ fontFamily: SANS, fontSize: 82, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: WHITE, lineHeight: 1 }}>
            PRECISION <span style={{ color: GOLD }}>3D</span>
          </div>
          <div style={{ fontFamily: SANS_B, fontSize: 28, letterSpacing: "0.3em", textTransform: "uppercase", color: FAINT, marginTop: 8 }}>
            TECHNOLOGIES
          </div>
        </div>
        <div style={{ opacity: subOp, marginTop: 30, fontFamily: MONO, fontSize: 13, letterSpacing: "0.28em", textTransform: "uppercase", color: DIM, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 1, background: GOLD_DIM }} />
          Custom 3D Product Configurators
          <div style={{ width: 44, height: 1, background: GOLD_DIM }} />
        </div>
        <div style={{ opacity: tagOp, marginTop: 12, fontFamily: SERIF, fontSize: 19, fontStyle: "italic", color: GOLD }}>
          Turn viewers into buyers.
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: cornOp }}>
        <Corners ins={48} sz={52} />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 02 — THE PAIN  (200-450)
// ═══════════════════════════════════════════════════════════════════════════
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 215, 22));
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: op }}>
      <Grid />
      <Glow x={10} y={50} sz={40} color="#ef4444" alpha={0.04} />
      <Scan />
      <div style={{ position: "absolute", left: 110, top: "50%", transform: "translateY(-50%)", maxWidth: 720 }}>
        <EyebrowLabel s={4}>The Problem</EyebrowLabel>
        {[
          { text: "Your customers",        color: WHITE, delay: 8 },
          { text: "can't touch it.",       color: WHITE, delay: 26 },
          { text: "So they don't buy it.", color: GOLD,  delay: 46, italic: true },
        ].map((l, i) => (
          <div key={i} style={{
            fontFamily: SERIF, fontSize: 80, fontWeight: 300, lineHeight: 1.0,
            color: l.color, fontStyle: (l as any).italic ? "italic" : "normal",
            opacity: fade(f, l.delay, 26), transform: `translateY(${up(f, l.delay, 28)}px)`,
          }}>{l.text}</div>
        ))}
        <div style={{
          opacity: fade(f, 80, 28), transform: `translateY(${up(f, 80, 30)}px)`,
          fontFamily: SANS_B, fontSize: 19, color: DIM, lineHeight: 1.9, maxWidth: 580, marginTop: 28,
        }}>
          67% of buyers want to see a product from multiple angles before purchasing.
          Static photos create doubt. Doubt kills conversions. Every day without 3D
          is measurable revenue left on the table.
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, top: "50%", transform: "translateY(-50%)", opacity: fade(f, 40, 30) }}>
        <div style={{ width: 340, background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.85)" }}>
          <div style={{ height: 32, background: "#1a1a1a", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", paddingLeft: 12, gap: 5 }}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
              <div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}} />
            ))}
          </div>
          <div style={{ height: 200, background: "linear-gradient(135deg,#1c1c1c,#242424)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
              <rect x="8" y="6" width="84" height="68" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="rgba(255,255,255,0.02)" rx="2" />
              <line x1="8" y1="6" x2="92" y2="74" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="92" y1="6" x2="8" y2="74" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: fade(f, 95, 26) }}>
              <div style={{ transform: "rotate(-16deg)", border: "2px solid rgba(239,68,68,0.6)", padding: "6px 20px", fontFamily: MONO, fontSize: 13, letterSpacing: "0.22em", color: "rgba(239,68,68,0.6)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Can't Interact
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <div style={{ fontFamily: SANS_B, fontSize: 13, color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>Product XR-400 · Multiple options available</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", opacity: fade(f, 102, 24) }}>
              {["Colour?","Size?","Finish?","Material?"].map(q=>(
                <div key={q} style={{ fontFamily: MONO, fontSize: 9, padding: "3px 9px", border: "1px solid rgba(239,68,68,0.32)", color: "rgba(239,68,68,0.45)", letterSpacing: "0.1em" }}>{q}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, textAlign: "center", opacity: fade(f, 110, 24), fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: "rgba(239,68,68,0.55)", textTransform: "uppercase" }}>
          ↑ 73% abandon before checkout
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 03 — THE SOLUTION  (440-650)
// ═══════════════════════════════════════════════════════════════════════════
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 20), fadeOut(f, 185, 20));
  return (
    <AbsoluteFill style={{ background: DARK, opacity: op }}>
      <Grid opacity={0.045} />
      <Glow x={75} y={45} sz={65} alpha={0.12} />
      <Particles n={26} op={0.7} />
      <Scan />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 130px" }}>
        <EyebrowLabel s={6}>The Solution</EyebrowLabel>
        <div style={{ textAlign: "center", maxWidth: 1140 }}>
          {[
            { text: "What if they could spin it,",  color: WHITE, delay: 10 },
            { text: "configure it live,",           color: GOLD,  delay: 30, italic: true },
            { text: "and buy it — right now?",      color: WHITE, delay: 50 },
          ].map((l, i) => (
            <div key={i} style={{
              fontFamily: SERIF, fontSize: 88, fontWeight: 300, lineHeight: 1.0,
              color: l.color, fontStyle: (l as any).italic ? "italic" : "normal",
              opacity: fade(f, l.delay, 26), transform: `translateY(${up(f, l.delay, 28)}px)`,
            }}>{l.text}</div>
          ))}
        </div>
        <div style={{ opacity: fade(f, 82, 28), transform: `translateY(${up(f, 82, 30)}px)`, fontFamily: SANS_B, fontSize: 20, color: DIM, lineHeight: 1.88, textAlign: "center", maxWidth: 720, marginTop: 32 }}>
          A custom 3D configurator built specifically for your product — embedded on your website. Every material, colour, and option updates live. No app. No plugin. Zero friction.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 04 — PRODUCT SHOWCASE  (640-1090)
// ═══════════════════════════════════════════════════════════════════════════
const PRODS = [
  { v: "houseconfig.mp4",           label: "Custom Home Builder",    client: "Forma Homes — Toronto",        stat: "↓80% design revisions" },
  { v: "boatconfig.mp4",            label: "Luxury Boat Dealer",     client: "NautiCraft Marine — Vancouver", stat: "+55% showroom conv." },
  { v: "jewelryconfig.mp4",         label: "Fine Jewellery",         client: "Lumière Jewellery — Toronto",  stat: "+40% avg order value" },
  { v: "pcconfig.mp4",              label: "Custom PC Builder",      client: "NovaBuild PC — Mississauga",   stat: "61% add-on attach" },
  { v: "warehousemachineconfig.mp4", label: "Industrial Machinery",   client: "Vortex Industrial — Calgary",  stat: "6wk → 10d sales cycle" },
];

const S04: React.FC = () => {
  const f = useCurrentFrame();
  const exitOp = fadeOut(f, 415, 30);
  const idx    = Math.floor(f / 90) % PRODS.length;
  const lf     = f % 90;
  const swOp   = fade(lf, 0, 18) * fadeOut(lf, 76, 14);
  const prod   = PRODS[idx];

  const dotPulse = 6 + pulse(f, 0.12) * 5;

  return (
    <AbsoluteFill style={{ background: "#07090f", opacity: exitOp }}>
      <Grid opacity={0.042} />
      <Glow x={50} y={20} sz={55} alpha={0.08} />
      <Scan />
      <Particles n={18} op={0.45} />

      <div style={{ position: "absolute", top: 48, left: 0, right: 0, textAlign: "center", opacity: fade(f, 0, 28), transform: `translateY(${up(f, 0, 32)}px)` }}>
        <EyebrowLabel s={0}>Live Configurators — Built &amp; Deployed</EyebrowLabel>
      </div>

      <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%, -50%) translateY(${up(f, 18, 42, 55)}px)`, opacity: fade(f, 18, 36) }}>
        <div style={{ width: 860, height: 524, position: "relative", borderRadius: 14, overflow: "hidden", boxShadow: "0 52px 130px rgba(0,0,0,0.92),0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "#13181f", zIndex: 10, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
                <div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>
              ))}
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "3px 12px", fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.26)", letterSpacing: "0.05em", margin: "0 12px" }}>
              yourstore.com/3d-configurator
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, boxShadow: `0 0 ${dotPulse}px ${GREEN}` }} />
              <span style={{ fontFamily: MONO, fontSize: 8, color: "rgba(76,175,80,0.7)", letterSpacing: "0.15em" }}>LIVE 3D</span>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, top: 40, opacity: swOp }}>
            <Video src={staticFile(prod.v)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop startFrom={0} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,8,8,0.82) 0%,transparent 52%)" }} />
            <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", marginBottom: 5 }}>{prod.client}</div>
                <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: WHITE }}>{prod.label} Configurator</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em", color: GREEN_LIGHT, textTransform: "uppercase", background: "rgba(8,8,8,0.82)", padding: "7px 14px", border: "1px solid rgba(74,222,128,0.28)" }}>
                {prod.stat}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, opacity: fade(f, 60, 20) }}>
        {PRODS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 4, background: i === idx ? GOLD : "rgba(255,255,255,0.18)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 05 — MONEY / ROI  (1080-1360)
// ═══════════════════════════════════════════════════════════════════════════
const ROI = [
  { pre: "+", tgt: 40, suf: "%", label: "More Conversions",  sub: "vs. static product pages",  delay: 38,  col: GREEN_LIGHT },
  { pre: "",  tgt: 3,  suf: "×", label: "Time on Page",      sub: "average session length",    delay: 68,  col: GOLD        },
  { pre: "-", tgt: 72, suf: "%", label: "Fewer Returns",     sub: "buyer confidence restored", delay: 98,  col: GREEN_LIGHT },
  { pre: "+", tgt: 55, suf: "%", label: "Higher Close Rate", sub: "pre-qualified leads only",  delay: 128, col: GOLD        },
];

const S05: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 240, 26));
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: op }}>
      <VideoBg src="backgroundblueprintcity.mp4" opacity={0.07} />
      <Grid />
      <Glow x={50} y={50} sz={70} color={GREEN} alpha={0.06} />
      <Glow x={50} y={50} sz={50} alpha={0.07} />
      <Scan />
      <MoneyRain frame={f} density={0.8} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: fade(f, 10, 26), transform: `translateY(${up(f, 10, 30)}px)`, textAlign: "center", marginBottom: 52 }}>
          <EyebrowLabel s={8}>The ROI — What Clients Actually See</EyebrowLabel>
          <div style={{ fontFamily: SERIF, fontSize: 66, fontWeight: 300, color: WHITE, lineHeight: 1.05 }}>
            Your product page becomes a <em style={{ color: GOLD, fontStyle: "italic" }}>revenue engine.</em>
          </div>
        </div>
        <div style={{ display: "flex", width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {ROI.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "44px 32px", textAlign: "center", borderRight: i<3?"1px solid rgba(255,255,255,0.06)":"none", opacity: fade(f, s.delay, 28), transform: `translateY(${up(f, s.delay, 30)}px)`, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg,transparent,${s.col},transparent)`, opacity: fade(f, s.delay, 26) }} />
              <CountUp target={s.tgt} prefix={s.pre} suffix={s.suf} frame={f} start={s.delay} dur={95} size={90} color={s.col} />
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: DIM, marginTop: 14 }}>{s.label}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: FAINT, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 06 — TESTIMONIALS  (1350-1870)
// ═══════════════════════════════════════════════════════════════════════════
const TESTI = [
  { company: "MyPergolas",         person: "James R. — Owner",              industry: "Outdoor Structures · Ontario",   video: "poolfloatingshot.mp4",       stat: "3×",      statLabel: "Close Rate",          before: "20% close rate",     after: "60%+ close rate",     color: "#b87333", quote: "Customers arrive with their exact configuration already chosen. Close rate went from 20% to over 60% — by the time they call, they've already sold themselves." },
  { company: "DeckCraft Ontario",  person: "Mike T. — Co-Founder",          industry: "Custom Decks · Ontario",         video: "basketballcourt.mp4",        stat: "0",       statLabel: "Manual Quotes",       before: "15 hrs/wk quoting",  after: "Zero manual quotes",  color: "#2563eb", quote: "We were spending 12–15 hours a week on quoting. Now customers configure it themselves and submit everything locked in. We haven't sent a manual quote in two months." },
  { company: "Lumière Jewellery",  person: "Sophie D. — Creative Director", industry: "Fine Jewellery · Toronto",        video: "jewelryconfig.mp4",          stat: "+40%",    statLabel: "Avg Order Value",     before: "High return rate",   after: "+40% avg order value", color: "#7c3aed", quote: "Clients design their ring in 3D — choose the setting, metal, and stone — and submit ready to purchase. Returns dropped. Average order value is up 40%." },
  { company: "NautiCraft Marine",  person: "Derek W. — Sales Director",     industry: "Luxury Boats · Vancouver",       video: "boatconfig.mp4",             stat: "+55%",    statLabel: "Showroom Conv.",      before: "Unprepared buyers",  after: "+55% showroom conv.", color: "#0891b2", quote: "Boat buyers configure hull colour, upholstery, engine package, and accessories themselves — and arrive at the dealership with a printed spec sheet." },
  { company: "Vortex Industrial",  person: "Alan C. — VP Sales",            industry: "Warehouse Machinery · Calgary",  video: "warehousemachineconfig.mp4", stat: "6wk→10d", statLabel: "Sales Cycle",         before: "6-week sales cycle", after: "10-day sales cycle",  color: "#64748b", quote: "Our machines have 200+ configuration variables. Now clients spec the exact conveyor layout, motor ratings, and dimensions online. Sales cycle dropped from 6 weeks to 10 days." },
  { company: "NovaBuild PC",       person: "Kevin L. — Founder",            industry: "Custom PCs · Mississauga",       video: "pcconfig.mp4",               stat: "61%",     statLabel: "Add-on Attach Rate",  before: "18% attach rate",    after: "61% attach rate",     color: "#2563eb", quote: "PC buyers swap GPU, case, lighting, and cooling in real time — and the price updates live. Our add-on attach rate went from 18% to 61%." },
];

const S06: React.FC = () => {
  const f = useCurrentFrame();
  const PER = 86;
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      {TESTI.map((t, i) => {
        const st = i * PER;
        const cf = f - st;
        const op = fade(cf, 0, 20) * fadeOut(cf, PER - 18, 16);
        if (op <= 0.001) return null;
        const hex = t.color.replace("#","");
        const cr = parseInt(hex.slice(0,2),16), cg = parseInt(hex.slice(2,4),16), cb = parseInt(hex.slice(4,6),16);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>
            <Video src={staticFile(t.video)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16 }} muted loop startFrom={0} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,rgba(8,8,8,0.97) 0%,rgba(8,8,8,0.91) 52%,rgba(${cr},${cg},${cb},0.09) 100%)` }} />
            <Grid opacity={0.035} />
            <Scan />
            <div style={{ position: "absolute", top: 52, left: 120, opacity: fade(cf, 6, 22) }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: t.color, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 28, height: 1, background: t.color }} />
                Real Clients · Real Results · {t.industry}
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 120px", gap: 80, marginTop: 30 }}>
              <div style={{ flex: 2.2, opacity: fade(cf, 20, 28), transform: `translateY(${up(cf, 20, 32)}px)` }}>
                <div style={{ fontFamily: SERIF, fontSize: 180, fontWeight: 300, color: t.color, opacity: 0.22, lineHeight: 0.65, marginBottom: -20, userSelect: "none" }}>"</div>
                <div style={{ fontFamily: SERIF, fontSize: 26, fontStyle: "italic", fontWeight: 300, color: "rgba(244,241,235,0.92)", lineHeight: 1.78, marginBottom: 30, maxWidth: 760 }}>
                  {t.quote}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em" }}>
                  <span style={{ color: RED_DIM, padding: "5px 14px", border: "1px solid rgba(239,68,68,0.28)" }}>{t.before}</span>
                  <span style={{ color: GOLD, fontSize: 16 }}>→</span>
                  <span style={{ color: GREEN_LIGHT, padding: "5px 14px", border: "1px solid rgba(74,222,128,0.28)" }}>{t.after}</span>
                </div>
                <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 12, color: FAINT, letterSpacing: "0.16em" }}>— {t.person}</div>
              </div>
              <div style={{ flex: 1, opacity: fade(cf, 48, 28), textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 64 }}>
                <div style={{ fontFamily: SERIF, fontSize: 74, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{t.stat}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: DIM, marginTop: 12 }}>{t.statLabel}</div>
                <div style={{ marginTop: 28, fontFamily: SERIF, fontSize: 24, fontWeight: 300, color: WHITE }}>{t.company}</div>
                <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 10 }}>
                  {Array(5).fill("★").map((_,j)=>(<span key={j} style={{ color: "#f59e0b", fontSize: 17 }}>★</span>))}
                </div>
                <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN }} />
                  Verified Client
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 07 — BENEFITS  (1860-2110)
// ═══════════════════════════════════════════════════════════════════════════
const BENS = [
  [
    { icon: "💰", title: "Higher Average Order Value",  body: "When buyers configure in 3D, they naturally upgrade. Premium options feel justified — they can see the result live.",               accent: GREEN,    delay: 18 },
    { icon: "⚡", title: "Eliminate Manual Quoting",    body: "Customers spec everything themselves. You receive a fully configured, priced order — zero back-and-forth.",                        accent: GOLD,     delay: 46 },
    { icon: "🎯", title: "Pre-Qualified Leads Only",    body: "Someone who spends 8 minutes configuring their order is not a browser. They're a buyer. Only hot leads reach you.",               accent: "#8b5cf6", delay: 74 },
    { icon: "📉", title: "Slash Return Rates",          body: "When buyers see exactly what they're getting in 3D, expectation matches reality. Returns drop dramatically.",                      accent: "#06b6d4", delay: 102 },
  ],
  [
    { icon: "🏆", title: "Outclass Every Competitor",  body: "99% of your industry still uses static photos. You'll be the only business with live 3D. It's not even close.",                   accent: GOLD,     delay: 30 },
    { icon: "🔗", title: "CRM & Shopify Integration",  body: "Quotes flow into HubSpot, Salesforce, Zoho, or Shopify — pre-populated, pre-priced, ready to close.",                             accent: GREEN,    delay: 58 },
    { icon: "📱", title: "Mobile-First, No Plugins",   body: "Works on any device, any browser. No download, no install. Pure conversion wherever your buyers are.",                            accent: "#f59e0b", delay: 86 },
    { icon: "🔄", title: "Live Forever on $150/mo",    body: "Hosting, updates, performance reviews, priority support. Your tool compounds in value every single month.",                        accent: "#ec4899", delay: 114 },
  ],
];

const S07: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 220, 26));
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: op }}>
      <VideoBg src="backgroundblueprinthouse.mp4" opacity={0.06} />
      <Grid />
      <Glow x={50} y={30} sz={55} alpha={0.07} />
      <Scan />
      <Particles n={20} op={0.45} />
      <div style={{ position: "absolute", top: 60, left: 110, opacity: fade(f, 8, 26), transform: `translateY(${up(f, 8, 28)}px)` }}>
        <EyebrowLabel s={8}>Why Companies Choose Precision 3D</EyebrowLabel>
        <div style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 300, color: WHITE, lineHeight: 1.05 }}>
          8 reasons this pays for itself.<br />
          <em style={{ color: GOLD, fontStyle: "italic" }}>Every. Single. Month.</em>
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 240, display: "flex", gap: 80 }}>
        {BENS.map((col, ci) => (
          <div key={ci} style={{ flex: 1 }}>
            {col.map((b, bi) => (
              <div key={bi} style={{ display: "flex", alignItems: "flex-start", gap: 18, opacity: fade(f, b.delay, 26), transform: `translateX(${slideX(f, b.delay, 30, ci === 0 ? -40 : 40)}px)`, marginBottom: 30 }}>
                <div style={{ width: 44, height: 44, flexShrink: 0, background: `${b.accent}18`, border: `1px solid ${b.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{b.icon}</div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: WHITE, marginBottom: 5 }}>{b.title}</div>
                  <div style={{ fontFamily: SANS_B, fontSize: 14, color: DIM, lineHeight: 1.72 }}>{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 08 — INDUSTRIES  (2100-2290)
// ═══════════════════════════════════════════════════════════════════════════
const INDS = [
  { name: "Outdoor Structures",       ex: "Pergolas, Decks, Pools, Sheds",   v: "poolfloatingshot.mp4",        d: 18 },
  { name: "Custom Manufacturing",     ex: "Industrial machinery, metal fab",  v: "warehousemachineconfig.mp4",  d: 36 },
  { name: "Luxury & Lifestyle",       ex: "Jewellery, Furniture, Marine",     v: "boatconfig.mp4",              d: 54 },
  { name: "Tech & Electronics",       ex: "PCs, devices, components",         v: "pcconfig.mp4",                d: 72 },
  { name: "Real Estate & Homes",      ex: "Custom homes, fit-outs",           v: "houseconfig.mp4",             d: 90 },
  { name: "Any Configurable Product", ex: "If it has options — we 3D it",    v: "weirdmetalthingconfig.mp4",   d: 108 },
];

const S08: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 165, 22));
  return (
    <AbsoluteFill style={{ background: DARK, opacity: op }}>
      <Grid opacity={0.04} />
      <Glow x={50} y={50} sz={55} alpha={0.08} />
      <Scan />
      <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center", opacity: fade(f, 6, 24), transform: `translateY(${up(f, 6, 26)}px)` }}>
        <EyebrowLabel s={6}>Industries We Serve</EyebrowLabel>
        <div style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 300, color: WHITE }}>
          If it has options, <em style={{ color: GOLD, fontStyle: "italic" }}>we 3D it.</em>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 210, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {INDS.map((ind, i) => (
          <div key={i} style={{ flex: "1 1 calc(33.33% - 13px)", height: 168, position: "relative", overflow: "hidden", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", opacity: fade(f, ind.d, 26), transform: `translateY(${up(f, ind.d, 28)}px)` }}>
            <Video src={staticFile(ind.v)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }} muted loop startFrom={0} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,8,8,0.94) 0%,rgba(8,8,8,0.46) 100%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <div style={{ fontFamily: SANS_B, fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 5 }}>{ind.name}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" }}>{ind.ex}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 09 — PROCESS  (2280-2540)
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = [
  { n: "01", title: "Free Mockup",    icon: "🎁", body: "We build a fully-working 3D prototype of your actual product. You see it live — zero cost, zero commitment.",                                    d: 42  },
  { n: "02", title: "You Review",      icon: "🔍", body: "Try every material, colour, and variant. We iterate until it perfectly matches how your customers will experience it.",                          d: 88  },
  { n: "03", title: "We Deploy",       icon: "🚀", body: "Embedded on your website and live within days. Hosted on our infrastructure with analytics, uptime monitoring, and support.",                  d: 134 },
  { n: "04", title: "Revenue Grows",   icon: "📈", body: "Buyers configure, price, and purchase with total confidence. Higher AOV. Fewer returns. Shorter sales cycles. More deals closed.",             d: 180 },
];

const S09: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 230, 25));
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: op }}>
      <Grid opacity={0.05} />
      <Glow x={50} y={100} sz={55} alpha={0.07} />
      <Scan />
      <MoneyRain frame={f} density={0.28} />
      <div style={{ position: "absolute", top: 80, left: 110, opacity: fade(f, 0, 26), transform: `translateY(${up(f, 0, 30)}px)` }}>
        <EyebrowLabel s={0}>How It Works — Start to Revenue</EyebrowLabel>
        <div style={{ fontFamily: SERIF, fontSize: 62, fontWeight: 300, color: WHITE, lineHeight: 1.0 }}>
          From mockup to <em style={{ color: GOLD, fontStyle: "italic" }}>revenue</em> in weeks.
        </div>
        <div style={{ fontFamily: SANS_B, fontSize: 17, color: DIM, marginTop: 10 }}>We handle everything. You focus on selling.</div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "0 40px", borderRight: i<3?"1px solid rgba(255,255,255,0.05)":"none", opacity: fade(f, s.d, 32), transform: `translateY(${up(f, s.d, 36)}px)` }}>
            <div style={{ fontSize: 30, marginBottom: 14 }}>{s.icon}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>{s.n}</div>
            <div style={{ width: `${wipePct(f, s.d + 38, 80)}%`, height: 1, background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, marginBottom: 16 }} />
            <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: WHITE, marginBottom: 12, lineHeight: 1.1 }}>{s.title}</div>
            <div style={{ fontFamily: SANS_B, fontSize: 14, color: DIM, lineHeight: 1.85 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 10 — PRICING  (2530-2770)
// ═══════════════════════════════════════════════════════════════════════════
const PLANS = [
  { label: "Starter Build",       price: "$2,500",  period: "one-time build",         featured: false, delay: 22, features: ["Single product type","Up to 8 options","Real-time pricing","Lead capture form","2 rounds of revisions","Embed code for your site"] },
  { label: "Professional Build",  price: "$5,000",  period: "one-time + $150/mo",      featured: true,  delay: 50, features: ["1–3 product types","Unlimited options","Custom pricing logic","CRM integration","Analytics dashboard","Quote PDF generation","Unlimited revisions","Priority support"] },
  { label: "Enterprise Build",    price: "$10K+",   period: "project-based pricing",  featured: false, delay: 78, features: ["Unlimited products","Custom features & APIs","Multi-location support","Inventory integration","White-label platform","Dedicated support","Monthly strategy calls"] },
];

const S10: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 220, 26));
  return (
    <AbsoluteFill style={{ background: DARK, opacity: op }}>
      <Grid opacity={0.04} />
      <Glow x={50} y={50} sz={55} alpha={0.08} />
      <Scan />
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: fade(f, 8, 25), transform: `translateY(${up(f, 8, 28)}px)` }}>
        <EyebrowLabel s={8}>Transparent Pricing</EyebrowLabel>
        <div style={{ fontFamily: SERIF, fontSize: 54, fontWeight: 300, color: WHITE }}>
          Custom-built. <em style={{ color: GOLD, fontStyle: "italic" }}>Fair pricing.</em>
        </div>
        <div style={{ fontFamily: SANS_B, fontSize: 17, color: DIM, marginTop: 8 }}>Your ROI typically starts within the first month.</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 210, display: "flex", gap: 20 }}>
        {PLANS.map((p, i) => (
          <div key={i} style={{ flex: 1, opacity: fade(f, p.delay, 28), transform: `translateY(${up(f, p.delay, 32)}px)`, background: p.featured ? "rgba(201,169,110,0.05)" : "rgba(255,255,255,0.018)", border: p.featured ? `1px solid ${GOLD_DIM}` : "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 32, position: "relative" }}>
            {p.featured && (
              <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: GOLD, color: BLACK, fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", padding: "4px 16px" }}>Most Common</div>
            )}
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", color: p.featured ? GOLD : FAINT, textTransform: "uppercase", marginBottom: 12 }}>{p.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 50, fontWeight: 300, color: WHITE, lineHeight: 1 }}>{p.price}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: FAINT, marginTop: 5, marginBottom: 20 }}>{p.period}</div>
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 18 }} />
            {p.features.map((feat, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 3L9 1" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: SANS_B, fontSize: 12, color: DIM }}>{feat}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 11 — FOUNDER  (2760-2950)
// ═══════════════════════════════════════════════════════════════════════════
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const op = Math.min(fade(f, 0, 18), fadeOut(f, 166, 22));
  const dotP = 6 + pulse(f, 0.18) * 5;
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: op }}>
      <VideoBg src="backgroundblueprintplane.mp4" opacity={0.08} />
      <Grid opacity={0.04} />
      <Glow x={50} y={50} sz={60} alpha={0.1} />
      <Scan />
      <Particles n={28} op={0.55} />
      <div style={{ position: "absolute", inset: 0, opacity: fade(f, 48, 26) }}><Corners ins={50} sz={48} /></div>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ opacity: fade(f, 8, 28), marginBottom: 32 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: SANS, fontSize: 30, fontWeight: 900, color: BLACK }}>ID</div>
          <div style={{ fontFamily: SANS_B, fontSize: 22, fontWeight: 700, color: WHITE, letterSpacing: "0.04em" }}>Ishanjot Dhahan</div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginTop: 6 }}>Developer · Toronto, Ontario · 12 Configurators Shipped</div>
        </div>
        <div style={{ opacity: fade(f, 36, 28), transform: `translateY(${up(f, 36, 32)}px)`, maxWidth: 880 }}>
          <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 300, color: WHITE, lineHeight: 1.28, fontStyle: "italic" }}>
            "I've built 12 configurators for 8 businesses across Canada. Every single one has paid for itself within 3 months. The technology is proven. Now it's your turn."
          </div>
        </div>
        <div style={{ opacity: fade(f, 105, 26), marginTop: 32, fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: FAINT, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 ${dotP}px ${GREEN}` }} />
          Currently accepting 1–2 new clients · Brampton, Ontario, Canada
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 12 — CTA FINALE  (2940-3180)
// ═══════════════════════════════════════════════════════════════════════════
const S12: React.FC = () => {
  const f = useCurrentFrame();
  const flashW  = lerp(f, 0, 11, 1, 0);
  const flashG  = lerp(f, 4, 14, 0.6, 0);
  const flashGr = lerp(f, 7, 14, 0.3, 0);
  const dotP    = 7 + pulse(f, 0.22) * 5;
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff",  opacity: flashW,  pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: GOLD,    opacity: flashG,  pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: GREEN,   opacity: flashGr, pointerEvents: "none" }} />
      <Grid opacity={0.052} />
      <Glow x={50} y={50} sz={75} alpha={0.22} />
      <Particles n={56} op={1} />
      <Scan />
      <MoneyRain frame={f} density={0.6} />
      <div style={{ position: "absolute", inset: 0, opacity: fade(f, 14, 26) }}><Corners ins={50} sz={54} /></div>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ opacity: fade(f, 14, 22), marginBottom: 22, fontFamily: MONO, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 48, height: 1, background: GOLD_DIM }} />
          Zero Commitment · Free Mockup · Start Today
          <div style={{ width: 48, height: 1, background: GOLD_DIM }} />
        </div>
        <div style={{ opacity: fade(f, 18, 32), transform: `translateY(${up(f, 18, 36)}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 112, fontWeight: 300, color: WHITE, lineHeight: 0.9 }}>Get your</div>
          <div style={{ fontFamily: SERIF, fontSize: 112, fontWeight: 300, color: GOLD, fontStyle: "italic", lineHeight: 1.05 }}>free mockup.</div>
        </div>
        <div style={{ opacity: fade(f, 62, 28), transform: `translateY(${up(f, 62, 32)}px)`, fontFamily: SANS_B, fontSize: 20, color: DIM, lineHeight: 1.88, maxWidth: 580, marginTop: 28 }}>
          We build your 3D configurator — free — before you spend a cent.<br />
          If you don't love it, walk away. No invoice. No pressure.
        </div>
        <div style={{ opacity: fade(f, 98, 28), transform: `translateY(${up(f, 98, 32)}px)`, marginTop: 52, display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ background: GOLD, color: BLACK, fontFamily: MONO, fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", padding: "22px 56px", display: "flex", alignItems: "center", gap: 12 }}>
            Start Your Free Mockup
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke={BLACK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ border: `1px solid ${GOLD_DIM}`, color: DIM, fontFamily: MONO, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", padding: "22px 36px" }}>
            Book a 30-Min Call
          </div>
        </div>
        <div style={{ opacity: fade(f, 128, 26), marginTop: 38, fontFamily: MONO, fontSize: 18, letterSpacing: "0.26em", color: GOLD }}>
          precision3dtechnologies.com
        </div>
        <div style={{ opacity: fade(f, 98, 28), marginTop: 20, fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: FAINT, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 ${dotP}px ${GREEN}` }} />
          Currently accepting 1–2 new clients
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "16px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: fade(f, 108, 24) }}>
        <div>
          <div style={{ fontFamily: SANS_B, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: FAINT }}>Precision 3D Technologies</div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.15em", color: "rgba(244,241,235,0.14)", textTransform: "uppercase", marginTop: 3 }}>Ishanjot Dhahan · Brampton, Ontario, Canada · © 2026</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" }}>Custom 3D Product Configurators</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT COMPOSITION  —  3180 frames @ 60fps = 53 seconds
// ═══════════════════════════════════════════════════════════════════════════
export const Precision3DCommercial: React.FC = () => (
  <AbsoluteFill style={{ background: BLACK }}>
    <Sequence from={0}    durationInFrames={210}><S01 /></Sequence>
    <Sequence from={200}  durationInFrames={250}><S02 /></Sequence>
    <Sequence from={440}  durationInFrames={210}><S03 /></Sequence>
    <Sequence from={640}  durationInFrames={450}><S04 /></Sequence>
    <Sequence from={1080} durationInFrames={280}><S05 /></Sequence>
    <Sequence from={1350} durationInFrames={520}><S06 /></Sequence>
    <Sequence from={1860} durationInFrames={250}><S07 /></Sequence>
    <Sequence from={2100} durationInFrames={190}><S08 /></Sequence>
    <Sequence from={2280} durationInFrames={260}><S09 /></Sequence>
    <Sequence from={2530} durationInFrames={240}><S10 /></Sequence>
    <Sequence from={2760} durationInFrames={190}><S11 /></Sequence>
    <Sequence from={2940} durationInFrames={240}><S12 /></Sequence>
  </AbsoluteFill>
);
