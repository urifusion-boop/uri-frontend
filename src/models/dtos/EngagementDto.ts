export interface BreakdownResult {
  dimension_values: string[];
  value: number;
}

export interface Breakdown {
  results: BreakdownResult[];
}

export interface BarChartData {
  breakdowns: Breakdown[];
}

export interface BarChartDataItem {
  name: string;
  total_value: BarChartData;
}
export interface EngagementStackedBarProps {
  data: BarChartDataItem[];
}
