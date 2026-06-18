import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { fontFamily } from '../../fonts';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Ken Burns plus agressif
  const scale = interpolate(frame, [0, 90], [1.0, 1.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Légère dérive horizontale
  const panX = interpolate(frame, [0, 90], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash d'entrée
  const flashOpacity = interpolate(frame, [0, 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "L'ÉTÉ" : 2 frames de délai par lettre, 8 frames d'animation
  const chars = "L'ÉTÉ".split('');
  const subtextOpacity = interpolate(frame, [14, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Légère pulsation sur le texte
  const pulse = 1 + 0.015 * Math.sin((frame / 30) * Math.PI * 2 * 0.8);

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
          src={staticFile('scene1_plage.webp')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </AbsoluteFill>

      {/* Overlay blanc léger */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Flash d'entrée */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flashOpacity})` }} />

      {/* Contenu centré */}
      <AbsoluteFill
        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 18 }}
      >
        {/* Barre accent slide-in */}
        <div
          style={{
            width: interpolate(frame, [4, 22], [0, 280], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            height: 4,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            marginBottom: 8,
          }}
        />

        {/* "L'ÉTÉ" lettre par lettre — rapide */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            transform: `scale(${pulse})`,
          }}
        >
          {chars.map((char, i) => {
            const opacity = interpolate(frame, [i * 2, i * 2 + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const translateY = interpolate(frame, [i * 2, i * 2 + 10], [50, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 128,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.12em',
                  textShadow: '0 6px 30px rgba(0,0,0,0.4)',
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
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#FFFFFF',
            opacity: subtextOpacity,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            letterSpacing: '0.08em',
          }}
        >
          commence ici
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
