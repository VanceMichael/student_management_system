import { AppState, MockData } from '../store/store.js';

export function destroyCharts() {
    Object.values(AppState.chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    AppState.chartInstances = {};
}

export function createBarChart(ctx, { labels, data, label }) {
    return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label, data }] }
    });
}

export function createPieChart(ctx, { labels, data }) {
    return new Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data }] }
    });
}

export function createLineChart(ctx, { labels, datasets }) {
    return new Chart(ctx, {
        type: 'line',
        data: { labels, datasets }
    });
}
