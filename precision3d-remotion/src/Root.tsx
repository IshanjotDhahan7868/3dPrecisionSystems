import React from "react";
import { Composition } from "remotion";
import { Precision3DCommercial } from "./Precision3DCommercial";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Precision3D"
      component={Precision3DCommercial}
      durationInFrames={3180}
      fps={60}
      width={1920}
      height={1080}
    />
  </>
);
