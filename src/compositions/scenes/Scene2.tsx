import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 90;

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - START;

  const bottleSpring = spring({ frame: local, fps, config: { mass: 1, damping: 18, stiffness: 80 } });
  const bottleY = interpolate(bottleSpring, [0, 1], [200, 0]);
  const bottleRot = interpolate(bottleSpring, [0, 1], [-3, 0]);

  const titleOpacity = interpolate(local, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subOpacity = interpolate(local, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoOpacity = interpolate(local, [70, 100], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(to bottom, #F5E6C8, #FDFAF4)',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 60px 180px',
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
          marginBottom: 12,
        }}
      >
        CUVÉE CLÉMENCE
      </div>

      {/* Bouteille */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${bottleY}px) rotate(${bottleRot}deg)`,
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.15))',
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('clemence_neutre.jpg')}
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
        }}
      >
        Élevée en fûts de chêne · Entre-Deux-Mers
      </div>

      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Img
          src={staticFile('logo_cave_.png')}
          style={{
            width: 280,
            mixBlendMode: 'multiply',
            opacity: logoOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
