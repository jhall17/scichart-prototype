import { useRef, useEffect, useState } from "react";
import { I2DSurfaceOptions, SciChartSurface } from "scichart";
import { DrawFunction } from "./Bob";

type BaseChartProps = {
  draw: DrawFunction;
  surfaceOptions?: I2DSurfaceOptions;
  divStyle?: React.HTMLProps<HTMLDivElement>;
};

const BaseChart = ({ draw, surfaceOptions, divStyle }: BaseChartProps) => {
  const [curSurface, setCurSurface] = useState<SciChartSurface>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // TODO: how do we handle this default
      const res = await SciChartSurface.create(
        ref?.current ?? "",
        surfaceOptions
      );
      const { surface } = draw(res.sciChartSurface, res.wasmContext);
      setCurSurface(surface);
    })();

    return () => curSurface?.delete();
  }, [draw, surfaceOptions]);

  return (
    <div ref={ref} style={{ height: "100%", width: "100%", ...divStyle }} />
  );
};

export default BaseChart;
