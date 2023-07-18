import { useRef, useEffect, useState } from "react";
import {
  EAutoRange,
  I2DSurfaceOptions,
  IThemeProvider,
  NumberRange,
  SciChartJSDarkv2Theme,
  SciChartOverview,
  SciChartSurface,
} from "scichart";
import { DrawFunction } from "./Bob2d";
import { createCustomTheme } from "./chart.theme";
import { ThemeType, darkTheme, lightTheme } from "@flexgen/storybook";

type BaseChartProps = {
  draw: DrawFunction;
  surfaceOptions?: I2DSurfaceOptions;
  divStyle?: React.HTMLProps<HTMLDivElement>;
  overviewDiv?: HTMLDivElement;
};

const sept1 = new Date("2022-09-01T00:00:00.000Z");
const oct1 = new Date("2022-10-01T00:00:00.000Z");

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
      if (overviewDiv) {
        const overview = await SciChartOverview.create(surface, overviewDiv);
        overview.applyTheme(createCustomTheme(darkTheme));
      }

      setCurSurface(surface);
    })();

    return () => curSurface?.delete();
  }, [draw, overviewDiv]);

  return (
    <div ref={ref} style={{ height: "100%", width: "100%", ...divStyle }} />
  );
};

export default BaseChart;
