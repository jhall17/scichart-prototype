import { AnnotationType, AxisType, ZoomPanModifierType } from "./bob2d.enums";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { DateTimeNumericAxis } from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { LogarithmicAxis } from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { HorizontalLineAnnotation } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { VerticalLineAnnotation } from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { NativeTextAnnotation } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { AxisMarkerAnnotation } from "scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";

export const AxisMap = {
  [AxisType.Numeric]: NumericAxis,
  [AxisType.DateTimeNumeric]: DateTimeNumericAxis,
  [AxisType.Category]: CategoryAxis,
  [AxisType.LogarithmicAxis]: LogarithmicAxis,
};

export const AnnotationMap = {
  [AnnotationType.Box]: BoxAnnotation,
  [AnnotationType.Line]: LineAnnotation,
  [AnnotationType.HorizontalLine]: HorizontalLineAnnotation,
  [AnnotationType.VerticalLine]: VerticalLineAnnotation,
  [AnnotationType.Text]: TextAnnotation,
  [AnnotationType.NativeText]: NativeTextAnnotation,
  [AnnotationType.Custom]: CustomAnnotation,
  [AnnotationType.AxisMarker]: AxisMarkerAnnotation,
};

export const ZoomPanModifierMap = {
  [ZoomPanModifierType.ZoomPan]: ZoomPanModifier,
  [ZoomPanModifierType.MouseWheelZoomPan]: MouseWheelZoomModifier,
  [ZoomPanModifierType.XAxisDrag]: XAxisDragModifier,
  [ZoomPanModifierType.YAxisDrag]: YAxisDragModifier,
  [ZoomPanModifierType.RubberBandXyZoom]: RubberBandXyZoomModifier,
  [ZoomPanModifierType.ZoomExtents]: ZoomExtentsModifier,
};
