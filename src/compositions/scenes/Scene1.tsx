import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { fontFamily } from '../../fonts';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 90], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtextOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const chars = "L'ÉTÉ".split('');

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img
          src={staticFile('scene1_plage.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </AbsoluteFill>

      {/* White overlay 20% */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,0.20)' }} />

      {/* Centered content */}
      <AbsoluteFill
        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20 }}
      >
        {/* "L'ÉTÉ" lettre par lettre */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {chars.map((char, i) => {
            const opacity = interpolate(frame, [i * 5, i * 5 + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const translateY = interpolate(frame, [i * 5, i * 5 + 14], [40, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 120,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.1em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  opacity,
                  display: 'inline-block',
                  transform: `translateY(${translateY}px)`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* "commence ici" */}
        <div
          style={{
            fontFamily,
            fontSize: 50,
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#FFFFFF',
            opacity: subtextOpacity,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '0 60px',
          }}
        >
          commence ici
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
