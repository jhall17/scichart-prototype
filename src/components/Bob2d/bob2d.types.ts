import { IMouseWheelZoomModifierOptions } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { IRubberBandXyZoomModifierOptions } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { IXAxisDragModifierOptions } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { IYAxisDragModifierOptions } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { IZoomExtentsModifierOptions } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { IZoomPanModifierOptions } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { IAxisMarkerAnnotationOptions } from "scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation";
import { IBoxAnnotationOptions } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { ICustomAnnotationOptions } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { IHVLineAnnotationOptions } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { ILineAnnotationOptions } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { INativeTextAnnotationOptions } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { ITextAnnotationOptions } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { ICategoryAxisOptions } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { IDateTimeNumericAxisOptions } from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import { ILogarithmicAxisOptions } from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import { INumericAxisOptions } from "scichart/Charting/Visuals/Axis/NumericAxis";

export type AxisOptions =
  | INumericAxisOptions
  | IDateTimeNumericAxisOptions
  | ICategoryAxisOptions
  | ILogarithmicAxisOptions;

export type AnnotationOptions =
  | IBoxAnnotationOptions
  | ILineAnnotationOptions
  | IHVLineAnnotationOptions
  | ITextAnnotationOptions
  | INativeTextAnnotationOptions
  | ICustomAnnotationOptions
  | IAxisMarkerAnnotationOptions;

export type ZoomPanModifierOptions =
  | IZoomPanModifierOptions
  | IMouseWheelZoomModifierOptions
  | IXAxisDragModifierOptions
  | IYAxisDragModifierOptions
  | IRubberBandXyZoomModifierOptions
  | IZoomExtentsModifierOptions;
