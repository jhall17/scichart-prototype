import {
  SciChartSurface,
  TSciChart,
  IXyDataSeriesOptions,
  IFastLineRenderableSeriesOptions,
  XyDataSeries,
  FastLineRenderableSeries,
  IRolloverModifierOptions,
  ICursorModifierOptions,
  ILegendModifierOptions,
  RolloverModifier,
  CursorModifier,
  LegendModifier,
  SciChartOverview,
} from "scichart";
import { DrawFunction, IBob } from "./bob.interface";
import {
  AnnotationType,
  AxisDirection,
  AxisType,
  ZoomPanModifierType,
} from "./bob2d.enums";
import {
  AnnotationOptions,
  AxisOptions,
  ZoomPanModifierOptions,
} from "./bob2d.types";
import { AnnotationMap, AxisMap, ZoomPanModifierMap } from "./bob2d.maps";

// TODO: test - if we add to the builder, then rerender, does bob cleanup? e.g. add axis

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

  public addOverview(ref: HTMLDivElement): Bob2d {
    this.draw.push((surface, wasmContext) => {
      SciChartOverview.create(surface, ref);
      return { surface, wasmContext };
    });
    return this;
  }
}

export default Bob2d;
