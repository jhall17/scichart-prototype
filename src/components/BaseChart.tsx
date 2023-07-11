"use client";
import { useRef, useEffect, useState } from "react";
import { SciChartSurface } from "scichart";
import { DrawFunction } from "./Bob";

type BaseChartProps = {
  draw: DrawFunction;
};

const BaseChart = ({ draw }: BaseChartProps) => {
  const [curSurface, setCurSurface] = useState<SciChartSurface>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // TODO: how do we handle this default
      const res = await SciChartSurface.create(ref?.current ?? "");
      const { surface } = draw(res.sciChartSurface, res.wasmContext);
      setCurSurface(surface);
    })();

    return () => curSurface?.delete();
  }, []);

  return <div ref={ref} />;
};

export default BaseChart;
