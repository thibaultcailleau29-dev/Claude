import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

// ─── Design tokens ───────────────────────────────────────────────
const C = {
  bg:        "#0D0500",
  bgMid:     "#1A0A00",
  crimson:   "#7B0D1E",
  crimsonLight: "#A01228",
  gold:      "#C4982A",
  goldLight: "#E8C96A",
  parchment: "#F0E6D3",
  chestnut:  "#2C1204",
  white:     "#FFF8F0",
} as const;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;600;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

function Leaf({ seed }: { seed: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const startX   = (seed * 137.508) % 95;
  const speed    = 0.55 + (seed % 5) * 0.22;
  const size     = 30 + (seed % 6) * 14;
  const swayAmp  = 3 + (seed % 5) * 2.5;
  const delay    = (seed * 37) % durationInFrames;
  const f        = (frame + delay) % durationInFrames;
  const progress = f / durationInFrames;
  const y        = interpolate(progress, [0, 1], [-8, 110]);
  const x        = startX + Math.sin(frame * 0.038 * speed + seed * 1.9) * swayAmp;
  const rot      = frame * speed * 2.8 + seed * 42;
  const opacity  = interpolate(progress, [0, 0.04, 0.88, 1], [0, 0.75, 0.75, 0]);
  const leafColors = ["#8B2000", "#B84A00", "#A04010", "#6B2A00", "#C45200", "#7A3800"];
  const fill = leafColors[seed % leafColors.length];

  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `rotate(${rot}deg)`, opacity, pointerEvents: "none" }}>
      <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
        <path fill={fill} d="M50 4 C50 4 38 16 24 20 C32 28 30 40 24 50 C34 46 44 52 50 64 C56 52 66 46 76 50 C70 40 68 28 76 20 C62 16 50 4 50 4Z" />
        <path fill={fill} opacity={0.55} d="M49 64 L44 110 L50 112 L56 110 L51 64Z" />
        <path fill={fill} opacity={0.35} d="M50 64 C50 64 30 90 26 100 M50 64 C50 64 70 90 74 100" stroke={fill} strokeWidth={3} strokeLinecap="round" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function Leaves() {
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => <Leaf key={i} seed={i} />)}
    </AbsoluteFill>
  );
}

function GoldLine({ delayFrames = 0, width = 260 }: { delayFrames?: number; width?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame: Math.max(0, frame - delayFrames), config: { damping: 22, stiffness: 90 } });
  return <div style={{ width: scale * width, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold} 30%, ${C.goldLight} 50%, ${C.gold} 70%, transparent)`, margin: "0 auto" }} />;
}

function Vignette() {
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72) 100%)", pointerEvents: "none", zIndex: 2 }} />;
}

function SceneIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoScale   = spring({ fps, frame, config: { damping: 26, stiffness: 55 } });
  const textOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const textY       = interpolate(frame, [30, 65], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.bgMid} 0%, ${C.bg} 100%)`, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Leaves />
      <Vignette />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 56 }}>
        <div style={{ width: 130, height: 130, borderRadius: "50%", border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", background: `radial-gradient(circle at 40% 40%, ${C.chestnut}, ${C.bg})`, boxShadow: `0 0 40px ${C.gold}44, inset 0 0 30px rgba(0,0,0,0.5)` }}>
          <svg viewBox="0 0 100 100" width={72} height={72}>
            <path fill={C.gold} d="M55 10 C60 12 70 20 72 30 C76 25 84 24 84 24 C84 24 80 32 76 34 C79 44 77 56 73 63 C70 69 64 73 62 82 L68 90 L60 90 L57 76 C54 82 52 87 49 90 L41 90 L45 74 C39 68 33 60 31 52 C28 42 31 30 39 23 C44 18 50 14 52 11 Z" />
            <circle cx="63" cy="36" r="4" fill={C.bg} />
            <circle cx="63" cy="36" r="2" fill={C.chestnut} />
          </svg>
        </div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: 7, color: C.gold, textTransform: "uppercase" }}>La Cave</div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 300, letterSpacing: 8, color: C.parchment, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Cheval Quancard</div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: 3, color: C.gold, opacity: 0.5, textTransform: "uppercase", marginTop: 8 }}>Dénicheur de grands vins · Depuis 1844</div>
      </div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", opacity: textOpacity, transform: `translateY(${textY}px)` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 46, color: C.parchment, letterSpacing: 2, marginBottom: 18 }}>Soirée d'Ouverture</div>
        <GoldLine width={340} delayFrames={35} />
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginTop: 14 }}>Découverte & Dégustation</div>
      </div>
    </AbsoluteFill>
  );
}

function SceneTitle() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foireScale     = spring({ fps, frame, config: { damping: 14, stiffness: 120, mass: 1.4 } });
  const auxVinsOpacity = interpolate(frame, [18, 38], [0, 1], { extrapolateRight: "clamp" });
  const auxVinsY       = interpolate(frame, [18, 48], [45, 0], { extrapolateRight: "clamp" });
  const subOpacity     = interpolate(frame, [42, 68], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.bgMid} 0%, ${C.bg} 80%)`, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Leaves />
      <Vignette />
      <div style={{ position: "absolute", width: 900, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.crimson}22 0%, transparent 70%)`, zIndex: 3 }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 40px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 176, fontWeight: 900, color: C.parchment, lineHeight: 0.88, letterSpacing: -6, transform: `scale(${foireScale})`, transformOrigin: "center", textShadow: `0 0 80px ${C.crimson}66` }}>FOIRE</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 86, fontWeight: 700, color: C.crimson, lineHeight: 1.05, letterSpacing: 10, opacity: auxVinsOpacity, transform: `translateY(${auxVinsY}px)` }}>AUX VINS</div>
        <div style={{ marginTop: 28, opacity: subOpacity }}>
          <GoldLine width={560} />
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 14, color: C.gold, textTransform: "uppercase", marginTop: 18 }}>D'Automne 2026</div>
          <GoldLine width={560} delayFrames={46} />
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, letterSpacing: 5, color: C.parchment, opacity: 0.55, textTransform: "uppercase", marginTop: 14 }}>Pessac-Léognan · Bordelais · Spiritueux · Sélections de saison</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function BenefitCard({ delay, value, label, sublabel }: { delay: number; value: string; label: string; sublabel?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 20, stiffness: 95 } });
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, transform: `scale(${s})`, background: `linear-gradient(135deg, ${C.chestnut} 0%, ${C.bgMid} 100%)`, border: `1px solid ${C.gold}55`, borderRadius: 24, padding: "38px 55px", textAlign: "center", width: 640, boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 ${C.gold}33` }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 84, fontWeight: 900, color: C.gold, lineHeight: 1, letterSpacing: -2, textShadow: `0 0 30px ${C.gold}88` }}>{value}</div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: C.parchment, letterSpacing: 5, textTransform: "uppercase", marginTop: 14 }}>{label}</div>
      {sublabel && <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 300, color: C.gold, opacity: 0.7, letterSpacing: 2, marginTop: 8 }}>{sublabel}</div>}
    </div>
  );
}

function SceneBenefits() {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32 }}>
      <Leaves />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.crimson}1A 0%, transparent 65%)`, pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", opacity: titleOpacity }}>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 7, color: C.gold, textTransform: "uppercase", marginBottom: 12 }}>Avantages exclusifs · Ce soir seulement</div>
        <GoldLine width={480} />
      </div>
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
        <BenefitCard delay={8}  value="-34%" label="De remise"        sublabel="Sur une sélection de bouteilles" />
        <BenefitCard delay={28} value="8%"   label="Fidélité doublée" sublabel="Au lieu de 4% — uniquement pendant la soirée" />
        <BenefitCard delay={48} value="10€"  label="Entrée déductible" sublabel="Remboursée dès 50 € TTC d'achats le soir même" />
      </div>
    </AbsoluteFill>
  );
}

function SceneDate() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bandScale   = spring({ fps, frame, config: { damping: 22, stiffness: 80 } });
  const dateOpacity = interpolate(frame, [10, 32], [0, 1], { extrapolateRight: "clamp" });
  const timeOpacity = interpolate(frame, [32, 56], [0, 1], { extrapolateRight: "clamp" });
  const timeY       = interpolate(frame, [32, 58], [35, 0], { extrapolateRight: "clamp" });
  const subOpacity  = interpolate(frame, [55, 78], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgMid} 50%, ${C.bg} 100%)`, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Leaves />
      <div style={{ position: "absolute", width: `${bandScale * 100}%`, height: 340, background: `linear-gradient(90deg, ${C.crimson}, ${C.crimsonLight}, ${C.crimson})`, zIndex: 3, boxShadow: `0 0 80px ${C.crimson}66` }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", opacity: dateOpacity }}>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: 9, color: C.goldLight, textTransform: "uppercase", marginBottom: 14 }}>Vendredi</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 130, fontWeight: 900, color: C.white, lineHeight: 0.9, letterSpacing: -5 }}>11</div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: 5, color: C.white, textTransform: "uppercase", marginTop: 10 }}>Septembre 2026</div>
      </div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 52, opacity: timeOpacity, transform: `translateY(${timeY}px)` }}>
        <GoldLine width={380} />
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 58, color: C.parchment, marginTop: 22, letterSpacing: 4 }}>18h30 – 21h30</div>
      </div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 52, opacity: subOpacity }}>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, letterSpacing: 3, color: C.gold, lineHeight: 1.9 }}>
          Zone Commerciale Leclerc · Entre Intersport et Blackstore<br />
          36 Avenue de l'Aquitaine · 33560 Sainte-Eulalie<br />
          <span style={{ color: C.parchment, opacity: 0.5 }}>Parking gratuit sur place</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const limitedScale = spring({ fps, frame, config: { damping: 16, stiffness: 95, mass: 1.2 } });
  const phoneOpacity = interpolate(frame, [22, 44], [0, 1], { extrapolateRight: "clamp" });
  const phoneScale   = spring({ fps, frame: Math.max(0, frame - 22), config: { damping: 22, stiffness: 100 } });
  const subOpacity   = interpolate(frame, [44, 70], [0, 1], { extrapolateRight: "clamp" });
  const logoOpacity  = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut      = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.bgMid} 0%, ${C.bg} 100%)`, justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: fadeOut }}>
      <Leaves />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.crimson}2A 0%, transparent 60%)`, pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 80px" }}>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 54, fontWeight: 900, color: C.crimson, textTransform: "uppercase", letterSpacing: 3, lineHeight: 1.08, transform: `scale(${limitedScale})`, transformOrigin: "center", textShadow: `0 0 60px ${C.crimson}66` }}>Places très<br />limitées !</div>
        <div style={{ margin: "22px 0 36px" }}><GoldLine width={460} /></div>
        <div style={{ opacity: phoneOpacity, transform: `scale(${phoneScale})` }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 68, fontWeight: 900, color: C.gold, letterSpacing: 3, textShadow: `0 0 30px ${C.gold}66` }}>05 56 77 58 11</div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 7, color: C.parchment, textTransform: "uppercase", opacity: 0.65, marginTop: 14 }}>Réservation obligatoire</div>
        </div>
        <div style={{ opacity: subOpacity, marginTop: 52 }}>
          <GoldLine width={300} />
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 300, letterSpacing: 2, color: C.parchment, opacity: 0.55, marginTop: 22, lineHeight: 1.9 }}>La Cave Cheval Quancard<br />36 Avenue de l'Aquitaine · 33560 Sainte-Eulalie<br />Parking gratuit sur place</div>
        </div>
        <div style={{ opacity: logoOpacity, marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${C.gold}88`, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle, ${C.chestnut}, ${C.bg})` }}>
            <svg viewBox="0 0 100 100" width={36} height={36}>
              <path fill={C.gold} d="M55 10 C60 12 70 20 72 30 C76 25 84 24 84 24 C84 24 80 32 76 34 C79 44 77 56 73 63 C70 69 64 73 62 82 L68 90 L60 90 L57 76 C54 82 52 87 49 90 L41 90 L45 74 C39 68 33 60 31 52 C28 42 31 30 39 23 C44 18 50 14 52 11 Z" />
              <circle cx="63" cy="36" r="4" fill={C.bg} />
              <circle cx="63" cy="36" r="2" fill={C.chestnut} />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 4, color: C.gold, textTransform: "uppercase" }}>La Cave</div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: 5, color: C.parchment, opacity: 0.6, textTransform: "uppercase" }}>Cheval Quancard</div>
          </div>
        </div>
        <div style={{ marginTop: 36, fontFamily: "Montserrat, sans-serif", fontSize: 9, letterSpacing: 1, color: C.parchment, opacity: 0.3 }}>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</div>
      </div>
    </AbsoluteFill>
  );
}

export function Reel() {
  return (
    <AbsoluteFill>
      <style dangerouslySetInnerHTML={{ __html: FONTS }} />
      <Sequence from={0}   durationInFrames={90}><SceneIntro /></Sequence>
      <Sequence from={90}  durationInFrames={120}><SceneTitle /></Sequence>
      <Sequence from={210} durationInFrames={120}><SceneBenefits /></Sequence>
      <Sequence from={330} durationInFrames={120}><SceneDate /></Sequence>
      <Sequence from={450} durationInFrames={150}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
}
