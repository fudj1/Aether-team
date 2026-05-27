import TableRenderer from './TableRenderer';
import ChartRenderer from './ChartRenderer';

export const componentRegistry = {
    table: TableRenderer,
    histogram: ChartRenderer,
    'line-chart': ChartRenderer,
    'pie-chart': ChartRenderer,
};