import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// Flash blanc bref sur chaque coupe
function flashAt(frame: number, cutFrame: number): number {
  return interpolate(frame, [cutFrame - 2, cutFrame, cutFrame + 4], [0, 1, 0], clamp);
}

export const ClemenceReel: React.FC = () => {
  const frame = useCurrentFrame();

  // Cross-fades réduits à 8 frames (plus punchy)
  const opacity1 = interpolate(frame, [82, 90], [1, 0], clamp);

  const opacity2 = Math.min(
    interpolate(frame, [90, 98], [0, 1], clamp),
    interpolate(frame, [202, 210], [1, 0], clamp)
  );

  const opacity3 = Math.min(
    interpolate(frame, [210, 218], [0, 1], clamp),
    interpolate(frame, [322, 330], [1, 0], clamp)
  );

  const opacity4 = interpolate(frame, [330, 338], [0, 1], clamp);

  // Flash blancs aux coupes (90, 210, 330)
  const flash = Math.max(
    flashAt(frame, 90),
    flashAt(frame, 210),
    flashAt(frame, 330)
  );

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

      {/* Flash blanc aux transitions */}
      {flash > 0 && (
        <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      )}
    </AbsoluteFill>
  );
};
