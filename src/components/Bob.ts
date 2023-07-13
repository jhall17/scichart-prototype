import {
  SciChartSurface,
  INumericAxisOptions,
  IDateTimeNumericAxisOptions,
  ICategoryAxisOptions,
  ILogarithmicAxisOptions,
  TSciChart,
  NumericAxis,
  DateTimeNumericAxis,
  CategoryAxis,
  LogarithmicAxis,
  IXyDataSeriesOptions,
  IFastLineRenderableSeriesOptions,
  XyDataSeries,
  FastLineRenderableSeries,
  IBoxAnnotationOptions,
  ILineAnnotationOptions,
  IHVLineAnnotationOptions,
  ITextAnnotationOptions,
  INativeTextAnnotationOptions,
  ICustomAnnotationOptions,
  IAxisMarkerAnnotationOptions,
  BoxAnnotation,
  LineAnnotation,
  HorizontalLineAnnotation,
  VerticalLineAnnotation,
  TextAnnotation,
  NativeTextAnnotation,
  CustomAnnotation,
  AxisMarkerAnnotation,
  IZoomPanModifierOptions,
  IMouseWheelZoomModifierOptions,
  IXAxisDragModifierOptions,
  IYAxisDragModifierOptions,
  IRubberBandXyZoomModifierOptions,
  IZoomExtentsModifierOptions,
  IRolloverModifierOptions,
  ICursorModifierOptions,
  ILegendModifierOptions,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  XAxisDragModifier,
  YAxisDragModifier,
  RubberBandXyZoomModifier,
  ZoomExtentsModifier,
  RolloverModifier,
  CursorModifier,
  LegendModifier,
} from "scichart";

// TODO: test - if we add to the builder, then rerender, does bob cleanup? e.g. add axis
export enum AxisDirection {
  X,
  Y,
}

export enum AxisType {
  Numeric,
  DateTimeNumeric,
  Category,
  LogarithmicAxis,
}

export type AxisOptions =
  | INumericAxisOptions
  | IDateTimeNumericAxisOptions
  | ICategoryAxisOptions
  | ILogarithmicAxisOptions;

const AxisMap = {
  [AxisType.Numeric]: NumericAxis,
  [AxisType.DateTimeNumeric]: DateTimeNumericAxis,
  [AxisType.Category]: CategoryAxis,
  [AxisType.LogarithmicAxis]: LogarithmicAxis,
};

export enum AnnotationType {
  Box,
  Line,
  HorizontalLine,
  VerticalLine,
  Text,
  NativeText,
  Custom,
  AxisMarker,
}

export type AnnotationOptions =
  | IBoxAnnotationOptions
  | ILineAnnotationOptions
  | IHVLineAnnotationOptions
  | ITextAnnotationOptions
  | INativeTextAnnotationOptions
  | ICustomAnnotationOptions
  | IAxisMarkerAnnotationOptions;

const AnnotationMap = {
  [AnnotationType.Box]: BoxAnnotation,
  [AnnotationType.Line]: LineAnnotation,
  [AnnotationType.HorizontalLine]: HorizontalLineAnnotation,
  [AnnotationType.VerticalLine]: VerticalLineAnnotation,
  [AnnotationType.Text]: TextAnnotation,
  [AnnotationType.NativeText]: NativeTextAnnotation,
  [AnnotationType.Custom]: CustomAnnotation,
  [AnnotationType.AxisMarker]: AxisMarkerAnnotation,
};

export enum ZoomPanModifierType {
  ZoomPan,
  MouseWheelZoomPan,
  XAxisDrag,
  YAxisDrag,
  RubberBandXyZoom,
  ZoomExtents,
}

export type ZoomPanModifierOptions =
  | IZoomPanModifierOptions
  | IMouseWheelZoomModifierOptions
  | IXAxisDragModifierOptions
  | IYAxisDragModifierOptions
  | IRubberBandXyZoomModifierOptions
  | IZoomExtentsModifierOptions;

const ZoomPanModifierMap = {
  [ZoomPanModifierType.ZoomPan]: ZoomPanModifier,
  [ZoomPanModifierType.MouseWheelZoomPan]: MouseWheelZoomModifier,
  [ZoomPanModifierType.XAxisDrag]: XAxisDragModifier,
  [ZoomPanModifierType.YAxisDrag]: YAxisDragModifier,
  [ZoomPanModifierType.RubberBandXyZoom]: RubberBandXyZoomModifier,
  [ZoomPanModifierType.ZoomExtents]: ZoomExtentsModifier,
};

export type DrawFunction = (
  surface: SciChartSurface,
  wasmContext: TSciChart
) => { surface: SciChartSurface; wasmContext: TSciChart };

export type BuildFunction<T> = (...x: any[]) => IBob<T>;

// interface for Bob the (chart) Builder
interface IBob<T> {
  build: () => DrawFunction;
  addAxis: BuildFunction<T>;
  addLine: BuildFunction<T>;
  addAnnotation: BuildFunction<T>;
  addZoomPanModifier: BuildFunction<T>;
  addRolloverModifier: BuildFunction<T>;
  addCursorModifier: BuildFunction<T>;
  addLegendModifier: BuildFunction<T>;
}

// implementation of Bob the (chart) Builder
class Bob2d implements IBob<Bob2d> {
  private draw: DrawFunction[] = [];
  private drawPointer: number = -1;
  private surfaceCtx?: { surface: SciChartSurface; wasmContext: TSciChart };

  // creates a new bob, "new Bob2d()" should not be called directly by consumer
  public static new(): Bob2d {
    return new Bob2d();
  }

  // creates a draw function that can be passed to BaseChart to render the
  // chart Bob has built
  public build(): DrawFunction {
    return (surface: SciChartSurface, wasmContext: TSciChart) => {
      this.drawPointer = -1;
      this.surfaceCtx = { surface, wasmContext };
      return this.draw.reduce(
        (acc, buildFunction, curIndex) => {
          this.drawPointer = curIndex;
          if (acc.surface === undefined) {
            console.warn("Bob2d: failed to draw, surface is undefined");
            return { surface, wasmContext };
          }
          return buildFunction(acc.surface, acc.wasmContext);
        },
        { surface, wasmContext }
      );
    };
  }

  // if the chart has been built previously and is already on the page,
  // calling update() instead of build() will apply changes directly to your
  // current chart without rerender
  public update(): undefined {
    if (this.surfaceCtx === undefined) {
      console.warn(
        "Bob2d: surfaceCtx is undefined, was update called before build?"
      );
      return;
    }
    if (this.draw.length <= this.drawPointer + 1) {
      console.warn(
        "Bob2d: drawPointer already at end of array - did you add more functions since the last update?"
      );
      return;
    }
    this.draw.forEach((buildFunction, curIndex) => {
      if (curIndex <= this.drawPointer) {
        return;
      }

      this.drawPointer = curIndex;

      this.surfaceCtx &&
        buildFunction(this.surfaceCtx.surface, this.surfaceCtx.wasmContext);
      return;
    });
  }

  // TODO: compare removeAxis vs fresh generation
  public addAxis(
    direction: AxisDirection,
    valueType: AxisType,
    options: AxisOptions = {}
  ): Bob2d {
    this.draw.push((surface, wasmContext) => {
      const newAxis = new AxisMap[valueType](wasmContext, options);
      direction === AxisDirection.X
        ? surface.xAxes.add(newAxis)
        : surface.yAxes.add(newAxis);

      return { surface, wasmContext };
    });

    return this;
  }

  public addLine(
    data: IXyDataSeriesOptions[],
    line: IFastLineRenderableSeriesOptions = {}
  ): Bob2d {
    // check each line for 'containsNan', 'dataEvenlySpacedInX', 'dataIsSortedInX',
    // warn if not present
    data.forEach((dataOptions, i) => {
      !("containsNaN" in dataOptions) &&
        console.warn(
          `data[${i}]: Help this chart perform faster, add 'containsNaN' to the data options!`
        );
      !("dataEvenlySpacedInX" in dataOptions) &&
        console.warn(
          `data[${i}]: Help this chart perform faster, add 'dataEvenlySpacedInX' to the data options!`
        );
      !("dataIsSortedInX" in dataOptions) &&
        console.warn(
          `data[${i}]: Help this chart perform faster, add 'dataIsSortedInX' to the data options!`
        );
    });

    this.draw.push((surface, wasmContext) => {
      data.forEach((dataOptions) => {
        const dataSeries = new XyDataSeries(wasmContext, dataOptions);
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
          dataSeries,
          ...line,
        });
        surface.renderableSeries.add(lineSeries);
      });
      return { surface, wasmContext };
    });

    return this;
  }

  public addAnnotation(
    annotationType: AnnotationType,
    options: AnnotationOptions = {}
  ): Bob2d {
    this.draw.push((surface, wasmContext) => {
      surface.annotations.add(new AnnotationMap[annotationType](options));
      return { surface, wasmContext };
    });

    return this;
  }

  public addZoomPanModifier(
    modifierType: ZoomPanModifierType,
    options: ZoomPanModifierOptions = {}
  ): Bob2d {
    this.draw.push((surface, wasmContext) => {
      surface.chartModifiers.add(new ZoomPanModifierMap[modifierType](options));
      return { surface, wasmContext };
    });

    return this;
  }

  public addRolloverModifier(options: IRolloverModifierOptions = {}): Bob2d {
    this.draw.push((surface, wasmContext) => {
      surface.chartModifiers.add(new RolloverModifier(options));
      return { surface, wasmContext };
    });
    return this;
  }

  public addCursorModifier(options: ICursorModifierOptions = {}): Bob2d {
    this.draw.push((surface, wasmContext) => {
      surface.chartModifiers.add(new CursorModifier(options));
      return { surface, wasmContext };
    });
    return this;
  }

  public addLegendModifier(options: ILegendModifierOptions = {}): Bob2d {
    this.draw.push((surface, wasmContext) => {
      surface.chartModifiers.add(new LegendModifier(options));
      return { surface, wasmContext };
    });
    return this;
  }
}

export default Bob2d;
