import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { fontFamily } from '../../fonts';

const START = 210;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - START;

  const scale = interpolate(local, [0, 120], [1.0, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = ['Huîtres.', 'Mer.', 'Clémence.'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img
          src={staticFile('scene3_huitres.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </AbsoluteFill>

      {/* Gradient overlay — tiers bas */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, transparent 58%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Texte mot par mot */}
      <AbsoluteFill
        style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 180 }}
      >
        <div style={{ textAlign: 'center', padding: '0 60px' }}>
          {words.map((word, i) => {
            const delay = i * 12;
            const opacity = interpolate(local, [delay, delay + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 68,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  opacity,
                  marginRight: i < words.length - 1 ? '0.35em' : 0,
                  display: 'inline',
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
