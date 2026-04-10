/**
 * 图表组件
 */

import { chartStore } from '../modules/store.js';

// 创建柱状图
function createBarChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return null;
    
    // 销毁已存在的图表
    chartStore.destroy(canvasId);
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: options.label || '数据',
                data: data,
                backgroundColor: options.backgroundColor || 'rgba(102, 126, 234, 0.8)',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: options.showLegend !== false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: options.maxY
                }
            }
        }
    });
    
    chartStore.set(canvasId, chart);
    return chart;
}

// 创建折线图
function createLineChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return null;
    
    // 销毁已存在的图表
    chartStore.destroy(canvasId);
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets.map(ds => ({
                ...ds,
                tension: ds.tension || 0.4,
                pointRadius: ds.pointRadius || 4
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: options.legendPosition || 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: options.beginAtZero !== false,
                    min: options.minY,
                    max: options.maxY
                }
            }
        }
    });
    
    chartStore.set(canvasId, chart);
    return chart;
}

// 创建饼图
function createPieChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return null;
    
    // 销毁已存在的图表
    chartStore.destroy(canvasId);
    
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: options.backgroundColor || [
                    '#667eea', '#48bb78', '#ed8936', '#4299e1', '#9f7aea',
                    '#f56565', '#38b2ac', '#ecc94b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: options.legendPosition || 'bottom'
                }
            }
        }
    });
    
    chartStore.set(canvasId, chart);
    return chart;
}

// 创建环形图
function createDoughnutChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return null;
    
    // 销毁已存在的图表
    chartStore.destroy(canvasId);
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: options.backgroundColor || [
                    '#667eea', '#48bb78', '#ed8936', '#4299e1', '#9f7aea'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: options.legendPosition || 'bottom'
                }
            }
        }
    });
    
    chartStore.set(canvasId, chart);
    return chart;
}

// 销毁图表
function destroyChart(canvasId) {
    chartStore.destroy(canvasId);
}

// 销毁所有图表
function destroyAllCharts() {
    chartStore.destroyAll();
}

export {
    createBarChart,
    createLineChart,
    createPieChart,
    createDoughnutChart,
    destroyChart,
    destroyAllCharts
};
