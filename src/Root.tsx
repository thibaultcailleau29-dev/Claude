import React from 'react';
import { Composition } from 'remotion';
import { AIAppReel } from './compositions/AIAppReel';
import { ClemenceReel } from './compositions/ClemenceReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIAppReel"
        component={AIAppReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClemenceReel"
        component={ClemenceReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
