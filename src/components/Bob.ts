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

export type DrawFunction = (
  surface: SciChartSurface,
  wasmContext: TSciChart
) => { surface: SciChartSurface; wasmContext: TSciChart };

interface IBob {
  build: () => DrawFunction;
  addAxis: (
    direction: AxisDirection,
    type: AxisType,
    options?: AxisOptions
  ) => IBob;
  addLine: (
    data: IXyDataSeriesOptions[],
    line?: IFastLineRenderableSeriesOptions
  ) => IBob;
}

class Bob2d implements IBob {
  private draw: DrawFunction[] = [];

  public static new(): IBob {
    return new Bob2d();
  }

  public build(): DrawFunction {
    return (surface: SciChartSurface, wasmContext: TSciChart) => {
      return this.draw.reduce(
        (acc, buildFunction) => {
          return buildFunction(acc.surface, acc.wasmContext);
        },
        { surface, wasmContext }
      );
    };
  }

  // TODO: compare removeAxis vs fresh generation
  public addAxis(
    direction: AxisDirection,
    valueType: AxisType,
    options: AxisOptions = {}
  ): Bob2d {
    this.draw.push((surface, wasmContext) => {
      let newAxis;
      switch (valueType) {
        case AxisType.Numeric:
          newAxis = new NumericAxis(wasmContext, options);
          break;
        case AxisType.DateTimeNumeric:
          newAxis = new DateTimeNumericAxis(wasmContext, options);
          break;
        case AxisType.Category:
          newAxis = new CategoryAxis(wasmContext, options);
          break;
        case AxisType.LogarithmicAxis:
          newAxis = new LogarithmicAxis(wasmContext, options);
          break;
        default:
          throw new Error("Unknown axis type");
      }
      switch (direction) {
        case AxisDirection.X:
          surface.xAxes.add(newAxis);
          break;
        case AxisDirection.Y:
          surface.yAxes.add(newAxis);
          break;
      }

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
}

export default Bob2d;
