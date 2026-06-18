import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 330;
const BOTTLE_HEIGHT = 1920 * 0.40;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - START;

  const bottleSpring = spring({ frame: local, fps, config: { mass: 1, damping: 20, stiffness: 100 } });
  const bottleX = interpolate(bottleSpring, [0, 1], [60, 0]);
  const bottleOpacity = interpolate(local, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "DISPONIBLE" slide depuis la gauche (frame 345 → local 15)
  const text1X = interpolate(local, [15, 35], [-50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const text1Opacity = interpolate(local, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "À LA CAVE" décalé de 10 frames
  const text2X = interpolate(local, [25, 45], [-50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const text2Opacity = interpolate(local, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Cheval Quancard · Sainte-Eulalie" (frame 380 → local 50)
  const text3Opacity = interpolate(local, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(local, [40, 70], [0, 0.90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, #F5E6C8, #FDFAF4)' }}>
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
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 32,
            color: '#2C2C2C',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            opacity: text1Opacity,
            transform: `translateX(${text1X}px)`,
          }}
        >
          DISPONIBLE
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 90,
            fontWeight: 700,
            color: '#B8860B',
            lineHeight: 1,
            opacity: text2Opacity,
            transform: `translateX(${text2X}px)`,
          }}
        >
          À LA CAVE
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 34,
            fontStyle: 'italic',
            color: '#2C2C2C',
            opacity: text3Opacity * 0.7,
            marginTop: 12,
          }}
        >
          Cheval Quancard · Sainte-Eulalie
        </div>
      </div>

      {/* Bouteille droite */}
      <div
        style={{
          position: 'absolute',
          right: -40,
          top: '50%',
          transform: `translateY(-50%) translateX(${bottleX}px)`,
          opacity: bottleOpacity,
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.10))',
        }}
      >
        <Img
          src={staticFile('clemence_neutre.jpg')}
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
