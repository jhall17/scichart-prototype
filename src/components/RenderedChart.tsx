"use client";
import BaseChart from "./BaseChart";
import Bob2d, { AxisDirection, AxisType } from "./Bob";
import rawData from "../data/alvinDay4Signals.json";
import { IXyDataSeriesOptions } from "scichart";

const RenderedChart = () => {
  const dataSeries: IXyDataSeriesOptions[] = Object.entries(rawData.lines).map(
    ([name, yVals]) => ({
      xValues: rawData.x.map((x) => new Date(x).getTime()),
      yValues: yVals.map((y) => Number(y)),
      dataSeriesName: name,
      dataIsSortedInX: true,
      dataEvenlySpacedInX: true,
      containsNaN: false,
    })
  );

  const draw = Bob2d.new()
    .addAxis(AxisDirection.X, AxisType.DateTimeNumeric)
    .addAxis(AxisDirection.Y, AxisType.Numeric)
    .addLine(dataSeries)
    .build();

  return <BaseChart divStyle={{ height: "100%", width: "100%" }} draw={draw} />;
};

export default RenderedChart;
