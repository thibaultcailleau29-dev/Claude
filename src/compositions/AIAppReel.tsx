import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#A78BFA";
const BG = "#000000";
const FPS = 30;

// Courbe ease-out en JS pur (évite Easing.cubic absent selon les versions)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function fadeIn(frame: number, start: number, duration = 15): number {
  const t = Math.max(0, Math.min(1, (frame - start) / duration));
  return easeOut(t);
}

// Scène 1 — Hook (frames 0–90 : 3s)
function HookScene({ frame }: { frame: number }) {
  const opacity = fadeIn(frame, 0, 20);
  const scale = interpolate(frame, [0, 20], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Barre accent supérieure */}
      <div
        style={{
          width: interpolate(frame, [5, 35], [0, 320], { extrapolateRight: "clamp" }),
          height: 5,
          backgroundColor: ACCENT,
          borderRadius: 3,
        }}
      />

      {/* Texte principal */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 88,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "block",
          }}
        >
          L'IA qui
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 88,
            fontWeight: 900,
            color: ACCENT,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "block",
          }}
        >
          change tout.
        </span>
      </div>

      {/* Sous-ligne */}
      <div
        style={{
          opacity: fadeIn(frame, 25, 20),
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Ton app IA
      </div>
    </AbsoluteFill>
  );
}

// Scène 2 — Points clés (frames 90–360 : 9s)
const POINTS = [
  { emoji: "⚡", title: "Automatise", sub: "tes tâches répétitives" },
  { emoji: "🕐", title: "Gagne", sub: "10h par semaine" },
  { emoji: "🚀", title: "Booste", sub: "ta productivité x3" },
];

function PointItem({
  frame,
  startFrame,
  emoji,
  title,
  sub,
  index,
}: {
  frame: number;
  startFrame: number;
  emoji: string;
  title: string;
  sub: string;
  index: number;
}) {
  const delay = index * 50;
  const localFrame = frame - startFrame - delay;
  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateX = interpolate(localFrame, [0, 25], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 32,
        background: "rgba(167,139,250,0.08)",
        border: `1.5px solid rgba(167,139,250,0.25)`,
        borderRadius: 20,
        padding: "32px 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 56 }}>{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: ACCENT,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 32,
            color: "rgba(255,255,255,0.65)",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function BodyScene({ frame }: { frame: number }) {
  const relFrame = frame - 90;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "60px 50px",
        gap: 28,
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 34,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 20,
          opacity: fadeIn(relFrame, 0, 15),
        }}
      >
        Pourquoi choisir
      </div>

      {POINTS.map((p, i) => (
        <PointItem key={i} frame={frame} startFrame={90} {...p} index={i} />
      ))}
    </AbsoluteFill>
  );
}

// Scène 3 — CTA (frames 360–450 : 3s)
function CTAScene({ frame }: { frame: number }) {
  const relFrame = frame - 360;
  const opacity = fadeIn(relFrame, 0, 20);
  const pulseScale = 1 + 0.03 * Math.sin((relFrame / FPS) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Halo violet */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)`,
          opacity: fadeIn(relFrame, 0, 30),
        }}
      />

      <div style={{ opacity, textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 42,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Prêt à changer ?
        </div>
        <div
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Lance-toi
        </div>
        <div
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 96,
            fontWeight: 900,
            color: ACCENT,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          maintenant.
        </div>
      </div>

      {/* Bouton CTA animé */}
      <div
        style={{
          opacity: fadeIn(relFrame, 15, 20),
          transform: `scale(${pulseScale})`,
          background: ACCENT,
          borderRadius: 100,
          padding: "28px 80px",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 38,
            fontWeight: 800,
            color: "#000000",
            letterSpacing: 1,
          }}
        >
          Commencer gratuitement
        </span>
      </div>
    </AbsoluteFill>
  );
}

// Composition principale
export const AIAppReel: React.FC = () => {
  const frame = useCurrentFrame();

  // Transitions douces entre scènes
  const scene1Opacity = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene2Opacity = interpolate(frame, [75, 90, 345, 360], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene3Opacity = interpolate(frame, [345, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, opacity: scene1Opacity }}>
        <HookScene frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: scene2Opacity }}>
        <BodyScene frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: scene3Opacity }}>
        <CTAScene frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
