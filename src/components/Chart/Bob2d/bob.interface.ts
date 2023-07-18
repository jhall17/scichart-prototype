import {
  SciChartSurface,
  TSciChart,
} from "scichart/Charting/Visuals/SciChartSurface";

export type DrawFunction = (
  surface: SciChartSurface,
  wasmContext: TSciChart
) => { surface: SciChartSurface; wasmContext: TSciChart };

export type BuildFunction<T> = (...x: any[]) => IBob<T>;

// interface for Bob the (chart) Builder
export interface IBob<T> {
  build: () => DrawFunction;
  addAxis: BuildFunction<T>;
  addLine: BuildFunction<T>;
  addAnnotation: BuildFunction<T>;
  addZoomPanModifier: BuildFunction<T>;
  addRolloverModifier: BuildFunction<T>;
  addCursorModifier: BuildFunction<T>;
  addLegendModifier: BuildFunction<T>;
  addOverview: BuildFunction<T>;
}
