import TableRenderer from './TableRenderer';
import ChartRenderer from './ChartRenderer';
import KpiCardRenderer from './KpiCardRenderer';

export const componentRegistry = {
    table: TableRenderer,
    histogram: ChartRenderer,
    'line-chart': ChartRenderer,
    'pie-chart': ChartRenderer,
    'kpi-card': KpiCardRenderer,
};