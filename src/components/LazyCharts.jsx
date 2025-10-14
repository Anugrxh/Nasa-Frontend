import { lazy, Suspense } from 'react';

// Lazy load recharts only when charts are actually needed
const RechartsComponents = lazy(() => 
  import('recharts').then(module => ({
    default: {
      BarChart: module.BarChart,
      Bar: module.Bar,
      PieChart: module.PieChart,
      Pie: module.Pie,
      Cell: module.Cell,
      RadarChart: module.RadarChart,
      Radar: module.Radar,
      PolarGrid: module.PolarGrid,
      PolarAngleAxis: module.PolarAngleAxis,
      PolarRadiusAxis: module.PolarRadiusAxis,
      XAxis: module.XAxis,
      YAxis: module.YAxis,
      CartesianGrid: module.CartesianGrid,
      Tooltip: module.Tooltip,
      Legend: module.Legend,
      ResponsiveContainer: module.ResponsiveContainer,
      LabelList: module.LabelList
    }
  }))
);

const ChartFallback = () => (
  <div style={{
    width: '100%',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    color: '#888'
  }}>
    Loading chart...
  </div>
);

export const LazyBarChart = ({ children, ...props }) => (
  <Suspense fallback={<ChartFallback />}>
    <RechartsComponents>
      {(charts) => (
        <charts.ResponsiveContainer {...props}>
          <charts.BarChart {...props}>
            {children}
          </charts.BarChart>
        </charts.ResponsiveContainer>
      )}
    </RechartsComponents>
  </Suspense>
);

export const LazyPieChart = ({ children, ...props }) => (
  <Suspense fallback={<ChartFallback />}>
    <RechartsComponents>
      {(charts) => (
        <charts.ResponsiveContainer {...props}>
          <charts.PieChart {...props}>
            {children}
          </charts.PieChart>
        </charts.ResponsiveContainer>
      )}
    </RechartsComponents>
  </Suspense>
);

export const LazyRadarChart = ({ children, ...props }) => (
  <Suspense fallback={<ChartFallback />}>
    <RechartsComponents>
      {(charts) => (
        <charts.ResponsiveContainer {...props}>
          <charts.RadarChart {...props}>
            {children}
          </charts.RadarChart>
        </charts.ResponsiveContainer>
      )}
    </RechartsComponents>
  </Suspense>
);

export default RechartsComponents;