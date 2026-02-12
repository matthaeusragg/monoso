import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Circle, DashPathEffect, LinearGradient, Line as SkiaLine, LineProps as SkiaLineProps, Text as SkiaText, matchFont, vec } from '@shopify/react-native-skia';
import React from 'react';
import { Text, View } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import {
  Area,
  CartesianChart,
  Line,
  useChartPressState,
  useChartTransformState
} from 'victory-native';

interface CustomLineChartProps {
  chartData: {
  x: string;
  y1: number;
  y2?: number;
}[];
  color1: string;
  color2?: string;
  yAxisLabelSymbol?: string;
}

export const CustomLineChart = ({
  chartData,
  color1,
  color2,
  yAxisLabelSymbol,
}: CustomLineChartProps) => {
  // font for skia texts/
  // @ts-ignore - matchFont works at runtime even if types are picky
  const font = matchFont({
    fontFamily: "Arial", // Platform.select({ ios: "Helvetica", android: "Roboto" }),
    fontSize: 12,
    fontWeight: "normal",
  });

  // guard clause
  if (!font || !chartData || chartData.length === 0) {
    return <Text>Loading chart...</Text>;
  }
  // Press state for interactions/tooltips
  const { state: pressState, isActive } = useChartPressState({ x: "", y: { y1: 0, y2: 0 } });
  // Pan & Zoom state for scrolling
  const { state: transformState } = useChartTransformState();

  // Use derived values to avoid triggering React renders
  const y1LabelText = useDerivedValue(() => {
    return `${pressState.y.y1.value.value.toFixed(2)}${yAxisLabelSymbol ? ' ' + yAxisLabelSymbol : ''}`;
  });
  const y2LabelText = useDerivedValue(() => {
    return `${pressState.y.y2.value.value.toFixed(2)}${yAxisLabelSymbol ? ' ' + yAxisLabelSymbol : ''}`;
  });
  const labelXPos = useDerivedValue(() => pressState.x.position.value + 5);
  const y1LabelYPos = useDerivedValue(() => pressState.y.y1.position.value - 5);
  const y2LabelYPos = useDerivedValue(() => pressState.y.y2.position.value - 5);
  const markerXPos = useDerivedValue(() => pressState.x.position.value);
  const y1MarkerYPos = useDerivedValue(() => pressState.y.y1.position.value);
  const y2MarkerYPos = useDerivedValue(() => pressState.y.y2.position.value);

  const colorSchemeKey = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
      <View style={{ width: '100%', height: 300 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["y1", "y2"]}
          chartPressState={pressState}
          chartPressConfig={{
            pan: {
              activateAfterLongPress: 200,
            }
          }}
          transformState={transformState}
          transformConfig={{
            pan: {
              dimensions: "x",
            },
            pinch: {
              dimensions: "x"
            }
          }}
          viewport={{ x: [Math.max(chartData.length-10,0), chartData.length] }}
          domain={{
            x: [0, chartData.length]
          }}
          xAxis={{
            font,
            lineColor: colors[colorSchemeKey].content.tertiary,
            labelRotate: -30,
            labelColor: colors[colorSchemeKey].content.secondary,
            labelOffset: 5,
            tickCount: Math.min(chartData.length,Math.max(chartData.length/2, 8)), // from some number of tickmarks onwards, only every other tick is shown
            formatXLabel: (v) => v ? `${v}` : "", // this prevents random "undefined" labels
          }}
          yAxis={[{
            font,
            lineColor: colors[colorSchemeKey].content.tertiary,
            linePathEffect: <DashPathEffect intervals={[
              5, // "on" intervals
              3 // "off" intervals
            ]}/>,
            labelColor: colors[colorSchemeKey].content.secondary,
            labelOffset: 10,
            formatYLabel: (v) => `${v}${yAxisLabelSymbol ? ' ' + yAxisLabelSymbol : ''}`,
          }]}
          padding={{bottom: 30}}
          domainPadding={{ top: 10, bottom: 1, left: 0, right: 0 }}
        >
          {({ points, chartBounds }) => {
            // bounds.value = chartBounds;
            return(
            <>
              {/* Dataset 1: Area with Gradient */}
              <Area
                points={points.y1}
                y0={chartBounds.bottom}
                curveType="linear"
                animate={{ type: "timing", duration: 300 }}
              >
                <LinearGradient
                  start={vec(0, chartBounds.top)}
                  end={vec(0, chartBounds.bottom)}
                  colors={[`${color1}dd`, `${color1}00`]} // Gradient from color to transparent
                />
              </Area>
              <Line
                points={points.y1}
                color={color1}
                strokeWidth={3}
                curveType="linear"
              />

              {/* Dataset 2: Optional Line */}
              {chartData[0].y2 && (
                <Line
                  points={points.y2}
                  color={color2 || 'red'}
                  strokeWidth={2}
                  curveType="linear"
                />
              )}
              {isActive && (
              <>
                {/* Vertical Indicator Line */}
                <CursorLine
                  xPosition={pressState.x.position}
                  top={chartBounds.top}
                  bottom={chartBounds.bottom}
                  color={colors[colorSchemeKey].content.accent}
                  strokeWidth={1}
                  style="stroke"
                />

                {/* Y1 Indicator Circle & Label */}
                <Circle
                  cx={markerXPos}
                  cy={y1MarkerYPos}
                  r={6}
                  color={color1}
                />
                <SkiaText 
                    font={font} 
                    x={labelXPos} 
                    y={y1LabelYPos} 
                    text={y1LabelText} 
                    color={colors[colorSchemeKey].content.primary}
                />

                {/* Y2 Indicator Circle & Label (only if y2 exists) */}
                {chartData[0].y2 !== undefined && (
                  <>
                    <Circle
                      cx={markerXPos}
                      cy={y2MarkerYPos}
                      r={6}
                      color={color2 || '#000'}
                    />
                    <SkiaText 
                        font={font} 
                        x={labelXPos} 
                        y={y2LabelYPos} 
                        text={y2LabelText} 
                        color={colors[colorSchemeKey].content.primary}
                    />
                  </>
                )}
              </>
            )}
            </>
          )}}
        </CartesianChart>
      </View>
  );
};


type CursorLineProps = Omit<SkiaLineProps, 'p1' | 'p2'> & {
  xPosition: SharedValue<number>;
  top: number;
  bottom: number;
}
// genius workaround to use derivedValue for pressState.x.position.value and local values for chartBounds
const CursorLine = ({ xPosition, top, bottom, ...props } : CursorLineProps) => {
  // can use useDerivedValue here because this is a standard component
  const p1 = useDerivedValue(() => vec(xPosition.value, top), [top]);
  const p2 = useDerivedValue(() => vec(xPosition.value, bottom), [bottom]);

  return <SkiaLine  
  p1={p1}
  p2={p2}
  {...props}
  />;
};