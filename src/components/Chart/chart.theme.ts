import { ThemeType } from "@flexgen/storybook";
import { IThemeProvider, SciChartJsNavyTheme } from "scichart";

// Commented out values are currently unused and therefore undecided, but
// I want to have all options visible in this file. They can be added as
// needed.
export function createCustomTheme(
  theme: ThemeType,
  overrides: Partial<IThemeProvider> = {}
): IThemeProvider {
  const customTheme: IThemeProvider = {
    ...new SciChartJsNavyTheme(),
    axisBorder: theme.fgd.text.primary,
    axisTitleColor: theme.fgd.text.primary,
    // annotationsGripsBackroundBrush: "white",
    // annotationsGripsBorderBrush: "white",
    // axis3DBandsFill: "#1F3D6833",
    axisBandsFill: "Transparent",
    axisPlaneBackgroundFill: "Transparent",
    chartTitleColor: theme.fgd.text.primary,
    // columnFillBrush: "white",
    // columnLineColor: "white",
    // cursorLineBrush: "#6495ED99",
    defaultColorMapBrush: [
      { offset: 0, color: theme.fgd.other.dischargeable_power },
      { offset: 1, color: theme.fgd.other.chargeable_energy },
    ],
    // downBandSeriesFillColor: "#52CC5490",
    // downBandSeriesLineColor: "#E26565FF",
    // downBodyBrush: "white",
    // downWickColor: "white",
    fillPalette: [
      theme.fgd.other.dischargeable_power,
      theme.fgd.other.chargeable_energy,
    ],
    // gridBackgroundBrush: "#EEEEEE",
    // gridBorderBrush: "#EEEEEE",
    // labelBackgroundBrush: "#EEEEEE",
    // labelBorderBrush: "#6495ED",
    labelForegroundBrush: theme.fgd.text.primary,
    legendBackgroundBrush: theme.fgd.background.paper,
    lineSeriesColor: theme.fgd.other.dischargeable_power,
    loadingAnimationBackground: theme.fgd.background.paper,
    loadingAnimationForeground: theme.fgd.other.dischargeable_power,
    // majorGridLineBrush: theme.fgd.brand.main,
    majorGridLineBrush: theme.fgd.primary.main_30p,
    minorGridLineBrush: "Transparent",
    // mountainAreaBrush: "white",
    // mountainLineColor: "white",
    // overviewFillBrush: "purple",
    // planeBorderColor: "green",
    // rolloverLineBrush: "Transparent",
    // rubberBandFillBrush: "#99999933",
    // rubberBandStrokeBrush: "#99999977",
    sciChartBackground: theme.fgd.background.paper,
    // scrollbarBackgroundBrush: theme.fgd.brand.light,
    // scrollbarBorderBrush: theme.fgd.brand.light,
    // scrollbarGripsBackgroundBrush: "white",
    // scrollbarViewportBackgroundBrush: "white",
    // scrollbarViewportBorderBrush: "white",
    strokePalette: [
      theme.fgd.other.chargeable_energy,
      theme.fgd.other.dischargeable_power,
    ],
    // shadowEffectColor: "black",
    // textAnnotationBackground: "#6495EDAA",
    textAnnotationForeground: theme.fgd.text.primary,
    tickTextBrush: theme.fgd.text.primary,
    // upBandSeriesFillColor: "white",
    // upBandSeriesLineColor: "white",
    // upBodyBrush: "#6495EDA0",
    // upWickColor: "#6495ED",
    ...overrides,
  };

  return customTheme;
}
