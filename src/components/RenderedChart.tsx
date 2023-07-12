"use client";
import BaseChart from "./BaseChart";
import Bob2d, {
  AnnotationType,
  AxisDirection,
  AxisType,
  ZoomPanModifierType,
} from "./Bob";
import rawData from "../data/alvinDay4Signals.json";
// import rawData from "../data/alvinMonth4Signals.json";
import { AUTO_COLOR, IXyDataSeriesOptions, NumberRange, SciChartJSDarkv2Theme } from "scichart";

const RenderedChart = () => {
  const theme = new SciChartJSDarkv2Theme()
  theme.strokePalette = ["red", "yellow", "green", "blue"];
  theme.fillPalette = ["blue", "green", "yellow", "red"];

  const dataSeries: IXyDataSeriesOptions[] = Object.entries(rawData.lines).map(
    ([name, yVals]) => ({
      xValues: rawData.x.map((x) => new Date(x).getTime() / 1000),
      yValues: yVals.map((y) => Number(y)),
      dataSeriesName: name,
      dataIsSortedInX: true,
      dataEvenlySpacedInX: true,
      containsNaN: false,
    })
  );

  const minDate = new Date("2022-09-01T00:00:00.000Z");
  const maxDate = new Date("2022-09-02T00:00:00.000Z");
  const draw = Bob2d.new()
    .addAxis(AxisDirection.X, AxisType.DateTimeNumeric, {
      visibleRange: new NumberRange(
        minDate.getTime() / 1000,
        maxDate.getTime() / 1000
      ),
    })
    .addAxis(AxisDirection.Y, AxisType.Numeric)
    .addLine(dataSeries, { stroke: AUTO_COLOR })
    .addAnnotation(AnnotationType.Box, {
      fill: "rgba(255, 0, 0, 0.3)",
      stroke: "rgba(255, 0, 0, 0.3)",
      strokeThickness: 1,
      x1: new Date("2022-09-01T05:00:00.000Z").getTime() / 1000,
      x2: new Date("2022-09-01T08:00:00.000Z").getTime() / 1000,
      y1: 10,
      y2: 25,
    })
    .addZoomPanModifier(ZoomPanModifierType.MouseWheelZoomPan)
    .addZoomPanModifier(ZoomPanModifierType.ZoomPan)
    .addCursorModifier({ showTooltip: true, hitTestRadius: 2 })
    .addLegendModifier({
      showCheckboxes: true,
      showSeriesMarkers: true,
      showLegend: true,
    })
    .build();

  return <BaseChart draw={draw} surfaceOptions={{ theme }} />;
};

export default RenderedChart;
