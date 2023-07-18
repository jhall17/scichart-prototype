import { useRef, useEffect, useState } from "react";
import { I2DSurfaceOptions, SciChartSurface } from "scichart";
import { DrawFunction } from "./Bob2d";

type BaseChartProps = {
  draw: DrawFunction;
  surfaceOptions?: I2DSurfaceOptions;
  divStyle?: React.HTMLProps<HTMLDivElement>;
};

const BaseChart = ({
  draw,
  surfaceOptions = {},
  divStyle = {},
}: BaseChartProps) => {
  const [curSurface, setCurSurface] = useState<SciChartSurface>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await SciChartSurface.create(ref?.current ?? "", {
        ...surfaceOptions,
      });
      const { surface } = draw(res.sciChartSurface, res.wasmContext);

      setCurSurface(surface);
    })();

    return () => curSurface?.delete();
  }, [draw]);

  return (
    <div ref={ref} style={{ height: "100%", width: "100%", ...divStyle }} />
  );
};

export default BaseChart;
