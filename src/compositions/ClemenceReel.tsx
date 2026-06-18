import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const ClemenceReel: React.FC = () => {
  const frame = useCurrentFrame();

  // Scène 1 : 0–90, fondu sortant 75–90
  const opacity1 = interpolate(frame, [75, 90], [1, 0], clamp);

  // Scène 2 : 90–210, fondu entrant 90–105, sortant 195–210
  const opacity2 = Math.min(
    interpolate(frame, [90, 105], [0, 1], clamp),
    interpolate(frame, [195, 210], [1, 0], clamp)
  );

  // Scène 3 : 210–330, fondu entrant 210–225, sortant 315–330
  const opacity3 = Math.min(
    interpolate(frame, [210, 225], [0, 1], clamp),
    interpolate(frame, [315, 330], [1, 0], clamp)
  );

  // Scène 4 : 330–450, fondu entrant 330–345
  const opacity4 = interpolate(frame, [330, 345], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: opacity1 }}>
        <Scene1 />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: opacity2 }}>
        <Scene2 />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: opacity3 }}>
        <Scene3 />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: opacity4 }}>
        <Scene4 />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
