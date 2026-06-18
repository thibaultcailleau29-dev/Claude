import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 330;
const BOTTLE_HEIGHT = 1920 * 0.45;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - START;

  // Bouteille — spring tendu depuis la droite
  const bottleSpring = spring({
    frame: local,
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 160 },
  });
  const bottleX = interpolate(bottleSpring, [0, 1], [120, 0]);
  const bottleOpacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash d'entrée
  const flashOpacity = interpolate(local, [0, 5], [0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "DISPONIBLE" — slide + fade rapide
  const text1X = interpolate(local, [8, 22], [-80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const text1Opacity = interpolate(local, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "À LA CAVE" — spring
  const caveSpring = spring({ frame: local - 14, fps, config: { mass: 0.9, damping: 14, stiffness: 130 } });
  const text2X = interpolate(caveSpring, [0, 1], [-100, 0]);
  const text2Opacity = interpolate(local, [14, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Cheval Quancard..."
  const text3Opacity = interpolate(local, [30, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulsation légère sur "À LA CAVE"
  const pulse = 1 + 0.012 * Math.sin((local / 30) * Math.PI * 2 * 0.6);

  const logoOpacity = interpolate(local, [25, 50], [0, 0.90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, #F5E6C8, #FDFAF4)' }}>
      {/* Flash d'entrée */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flashOpacity})` }} />

      {/* Bloc texte gauche */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 0,
          bottom: 0,
          width: '52%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 30,
            color: '#2C2C2C',
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            opacity: text1Opacity,
            transform: `translateX(${text1X}px)`,
          }}
        >
          DISPONIBLE
        </div>

        <div
          style={{
            fontFamily,
            fontSize: 96,
            fontWeight: 700,
            color: '#B8860B',
            lineHeight: 0.95,
            opacity: text2Opacity,
            transform: `translateX(${text2X}px) scale(${pulse})`,
            transformOrigin: 'left center',
          }}
        >
          À LA<br />CAVE
        </div>

        {/* Ligne décorative */}
        <div
          style={{
            width: interpolate(local, [28, 50], [0, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            height: 3,
            backgroundColor: '#B8860B',
            borderRadius: 2,
            marginTop: 12,
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontStyle: 'italic',
            color: '#2C2C2C',
            opacity: text3Opacity * 0.75,
            marginTop: 12,
          }}
        >
          Cheval Quancard
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 28,
            color: '#B8860B',
            opacity: text3Opacity * 0.75,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Sainte-Eulalie
        </div>
      </div>

      {/* Bouteille détourée droite */}
      <div
        style={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: `translateY(-50%) translateX(${bottleX}px)`,
          opacity: bottleOpacity,
          filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.15))',
        }}
      >
        <Img
          src={staticFile('clemence_neutre.png')}
          style={{ height: BOTTLE_HEIGHT, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Logo bas gauche */}
      <div style={{ position: 'absolute', bottom: 60, left: 60 }}>
        <Img
          src={staticFile('logo_cave_.png')}
          style={{ width: 220, mixBlendMode: 'multiply', opacity: logoOpacity }}
        />
      </div>
    </AbsoluteFill>
  );
};
