import { useRef, useEffect, useState } from "react";
import {
  I2DSurfaceOptions,
  IThemeProvider,
  SciChartJSDarkv2Theme,
  SciChartOverview,
  SciChartSurface,
} from "scichart";
import { DrawFunction } from "./Bob2d";
import { createCustomTheme } from "./chart.theme";

type BaseChartProps = {
  draw: DrawFunction;
  surfaceOptions?: I2DSurfaceOptions;
  divStyle?: React.HTMLProps<HTMLDivElement>;
  overviewDiv?: React.RefObject<HTMLDivElement>;
};

const BaseChart = ({
  draw,
  surfaceOptions = {},
  divStyle = {},
  overviewDiv,
}: BaseChartProps) => {
  const [curSurface, setCurSurface] = useState<SciChartSurface>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // TODO: how do we handle this default
      const res = await SciChartSurface.create(ref?.current ?? "", {
        ...surfaceOptions,
      });
      const { surface } = draw(res.sciChartSurface, res.wasmContext);
      setCurSurface(surface);
    })();

    overviewDiv &&
      curSurface &&
      SciChartOverview.create(curSurface, overviewDiv.current ?? "");

    return () => curSurface?.delete();
  }, [draw]);

  return (
    <div ref={ref} style={{ height: "100%", width: "100%", ...divStyle }} />
  );
};

export default BaseChart;
