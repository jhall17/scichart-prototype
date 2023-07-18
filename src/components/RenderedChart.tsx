"use client";
import BaseChart, {
  Bob2d,
  AnnotationType,
  AxisDirection,
  AxisType,
  DrawFunction,
  ZoomPanModifierType,
} from "./Chart";
// import rawData from "../data/alvinDay4Signals.json";
// import rawData from "../data/alvinMonth4Signals.json";
// import rawData from "../data/alvinDayDemo.json";
import rawData from "../data/alvinMonthDemo.json";
import {
  AUTO_COLOR,
  EAutoRange,
  ELegendPlacement,
  IXyDataSeriesOptions,
  NumberRange,
  NumberRangeAnimator,
  SciChartJSDarkv2Theme,
  SciChartSurface,
  TSciChart,
  WaveAnimation,
  easing,
} from "scichart";
import { useEffect, useRef, useState } from "react";
import { createCustomTheme } from "./Chart/chart.theme";
import { darkTheme, lightTheme } from "@flexgen/storybook";
import { uid } from "uid";

let hasUpdated = false;

const RenderedChart = () => {
  const [bob, setBob] = useState<Bob2d>();
  const [draw, setDraw] = useState<DrawFunction>(
    () => (surface: SciChartSurface, wasmContext: TSciChart) => ({
      surface,
      wasmContext,
    })
  );
  const overviewRef = useRef<HTMLDivElement>(null);

  const theme = createCustomTheme(darkTheme);

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

  const sept1 = new Date("2022-09-01T00:00:00.000Z");
  const oct1 = new Date("2022-10-01T00:00:00.000Z");

  useEffect(() => {
    const newBob = Bob2d.new()
      .addAxis(AxisDirection.X, AxisType.DateTimeNumeric, {
        visibleRange: new NumberRange(
          sept1.getTime() / 1000,
          oct1.getTime() / 1000
        ),
        visibleRangeLimit: new NumberRange(
          sept1.getTime() / 1000,
          oct1.getTime() / 1000
        ),
        axisBorder: {
          borderTop: 1,
          border: 10,
          color: theme.axisBorder,
        },
        axisTitle: "Time",
        drawMajorGridLines: false,
      })
      .addAxis(AxisDirection.Y, AxisType.Numeric, {
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
          animateInitialRanging: false,
          animateSubsequentRanging: true,
          duration: 200,
          easing: easing.linear,
        },
      })
      .addLine(dataSeries, {
        stroke: AUTO_COLOR,
      })
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
      // .addCursorModifier({ showTooltip: false, hitTestRadius: 2 })
      .addRolloverModifier()
      .addLegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        showLegend: true,
        placement: ELegendPlacement.TopRight,
      });
    // .addOverview(overviewRef.current!);

    const firstDraw = newBob.build();

    setBob(newBob);
    setDraw(() => firstDraw);
  }, []);

  !hasUpdated &&
    bob &&
    (() => {
      hasUpdated = true;
      setTimeout(() => {
        bob
          ?.addAnnotation(AnnotationType.Text, {
            text: "Hello World",
            x1: new Date("2022-09-01T06:00:00.000Z").getTime() / 1000,
            y1: 20,
          })
          .update();
      }, 5000);
    })();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <BaseChart
        divStyle={{ height: "90%" }}
        draw={draw}
        surfaceOptions={{ theme, title: "Test Chart" }}
        overviewDiv={overviewRef?.current ?? undefined}
      />
      {/* I don't know why but we need any arbitrary ID for overview to render */}
      <div ref={overviewRef} style={{ height: "10%" }} id={uid()} />
    </div>
  );
};

export default RenderedChart;
