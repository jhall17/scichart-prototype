"use client";
import { useRef, useEffect, useState } from "react";
import { SciChartSurface } from "scichart";
import { DrawFunction } from "./Bob";

type BaseChartProps = {
  draw: DrawFunction;
  divStyle?: React.HTMLProps<HTMLDivElement>;
};

const BaseChart = ({ draw, divStyle }: BaseChartProps) => {
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

  return <div ref={ref} style={divStyle} />;
};

export default BaseChart;
