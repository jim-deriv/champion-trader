# Chart Component

The Chart component displays market data using a SSE connection and visualizes it using the lightweight-charts library. It is responsible for:

- **Real-Time Price Updates:** Receiving and displaying live market prices.
- **Error Handling:** Using an error boundary to gracefully handle chart-related errors.
- **Data Management:** Ensuring proper sorting and deduplication of price data.
- **Customization:** Accepting an optional `className` prop for styling.

## Folder Structure

```
Chart/
├── Components/               # Reusable chart UI components
│   ├── ToolbarWidgets.tsx    # Chart toolbar with controls
│   └── index.ts              # Exports for Components
├── Helpers/                  # Utility functions for chart operations
│   ├── chartUtils.ts         # Chart-specific utility functions
│   └── index.ts              # Exports for Helpers
├── __tests__/                # Unit tests
│   ├── Chart.test.tsx        # Tests for Chart component
│   ├── ChartErrorBoundary.test.tsx  # Tests for error boundary
│   ├── ToolbarWidgets.test.tsx      # Tests for toolbar
│   └── chartUtils.test.ts    # Tests for utility functions
├── Chart.tsx                 # Main Chart component
├── ChartErrorBoundary.tsx    # Error handling wrapper
├── SmartChart.ts             # Chart configuration and types
├── index.tsx                 # Public exports
├── chart-styles.css          # Core chart styles
```

## Usage

```tsx
import { Chart } from "@/components/Chart";

function App() {
  return (
    <div>
      <Chart className="custom-chart-class" />
    </div>
  );
}
```

## Props

| Prop      | Type   | Description                           |
|-----------|--------|---------------------------------------|
| className | string | Optional CSS class for the component. |

## Implementation Details

### Chart Visualization
- Implements the lightweight-charts library for dynamic price visualization.
- Uses a baseline series to display price movements above and below the baseline.
- Supports real-time updates with smooth transitions.

### Data Management
- Ensures data integrity by filtering out duplicate timestamps.
- Maintains strictly ascending order of price data points.
- Handles edge cases where data might arrive out of order.

### Error Handling
- Implements a `ChartErrorBoundary` component to catch and handle chart-related errors.
- Provides a user-friendly error message with a retry option.
- Prevents the entire application from crashing due to chart errors.

## Components

### ToolbarWidgets
The ToolbarWidgets component provides chart controls including:
- Chart type selection (line, candles, hollow)
- Time interval selection
- Drawing tools
- Technical indicators
- Sharing options

### Helpers

The Helpers directory contains utility functions for chart operations:

- `sortAndDeduplicate`: Ensures data points are in ascending order by timestamp
- `formatPrice`: Formats price values for display
- `calculatePercentageChange`: Calculates percentage change between prices
- `shouldAutoScroll`: Determines if chart should auto-scroll based on user interaction

## Error Boundary Usage

The Chart component is automatically wrapped with an error boundary that will catch and handle any errors that occur during rendering or data updates. If an error occurs:

1. A user-friendly error message is displayed
2. A "Try Again" button is provided to attempt recovery
3. The error is logged to the console for debugging

The error boundary helps maintain application stability while providing a good user experience even when errors occur.

## Example Error Recovery

```tsx
// The error boundary will catch errors and display a retry button
<Chart className="h-[500px]" />

// If you need access to the error boundary directly
import { Chart, ChartErrorBoundary } from "@/components/Chart";

// Custom error boundary usage
<ChartErrorBoundary>
  <Chart className="h-[500px]" />
</ChartErrorBoundary>
```
