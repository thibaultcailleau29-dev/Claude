import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 210;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - START;

  // Ken Burns plus dynamique + pan opposé
  const scale = interpolate(local, [0, 120], [1.05, 1.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const panX = interpolate(local, [0, 120], [20, -20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash d'entrée
  const flashOpacity = interpolate(local, [0, 5], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = ['Huîtres.', 'Mer.', 'Clémence.'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Ken Burns + pan */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${panX}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile('scene3_huitres.webp')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </AbsoluteFill>

      {/* Gradient overlay — tiers bas */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Flash */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flashOpacity})` }} />

      {/* Mots un par un — rapide */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160 }}>
        <div style={{ textAlign: 'center', padding: '0 60px' }}>
          {words.map((word, i) => {
            const delay = i * 8;
            const opacity = interpolate(local, [delay, delay + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(local, [delay, delay + 10], [0.8, 1.0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 76,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.15em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  opacity,
                  marginRight: i < words.length - 1 ? '0.3em' : 0,
                  display: 'inline-block',
                  transform: `scale(${scale})`,
                  transformOrigin: 'bottom center',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
