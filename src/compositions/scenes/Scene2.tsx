import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 90;

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - START;

  // Spring plus tendu et rapide
  const bottleSpring = spring({
    frame: local,
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 140, overshootClamping: false },
  });

  const bottleY = interpolate(bottleSpring, [0, 1], [300, 0]);
  const bottleRot = interpolate(bottleSpring, [0, 1], [-8, 0]);
  // Scale via spring direct (inclut l'overshoot naturel)
  const bottleScale = 0.85 + bottleSpring * 0.15;

  const titleOpacity = interpolate(local, [10, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(local, [10, 22], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOpacity = interpolate(local, [22, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(local, [50, 75], [0, 0.90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Shimmer doré sur le titre
  const shimmer = interpolate(local, [30, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(to bottom, #F5E6C8, #FDFAF4)',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '110px 60px 180px',
      }}
    >
      {/* Titre "CUVÉE CLÉMENCE" */}
      <div
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 700,
          color: '#B8860B',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 12,
        }}
      >
        CUVÉE CLÉMENCE
      </div>

      {/* Bouteille détourée — PNG transparent, pas de blend mode */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${bottleY}px) rotate(${bottleRot}deg) scale(${bottleScale})`,
          filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.20))',
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('clemence_neutre.png')}
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Sous-titre */}
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 400,
          color: '#2C2C2C',
          textAlign: 'center',
          fontVariantCaps: 'small-caps',
          opacity: subOpacity,
          marginTop: 16,
          letterSpacing: '0.08em',
        }}
      >
        Élevée en fûts de chêne · Entre-Deux-Mers
      </div>

      {/* Ligne décorative sous le sous-titre */}
      <div
        style={{
          width: interpolate(local, [35, 60], [0, 200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          backgroundColor: '#B8860B',
          marginTop: 20,
          borderRadius: 1,
        }}
      />

      {/* Logo */}
      <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)' }}>
        <Img
          src={staticFile('logo_cave_.png')}
          style={{ width: 260, mixBlendMode: 'multiply', opacity: logoOpacity }}
        />
      </div>
    </AbsoluteFill>
  );
};
