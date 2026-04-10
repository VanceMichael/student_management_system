class ChartComponent {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas #${canvasId} not found`);
      return;
    }
    this.chartInstance = null;
    this.chartType = options.type || 'bar';
    this.options = options;
  }

  render(chartData, chartOptions = {}) {
    if (!this.canvas) return null;
    
    if (typeof window.Chart === 'undefined') {
      console.warn('Chart.js library not loaded');
      return null;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } }
    };

    this.chartInstance = new window.Chart(this.canvas, {
      type: chartOptions.type || this.chartType,
      data: chartData,
      options: { ...defaultOptions, ...chartOptions }
    });

    return this.chartInstance;
  }

  bar(labels, datasets, options = {}) {
    const chartData = {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label || `数据集 ${i + 1}`,
        data: ds.data,
        backgroundColor: ds.backgroundColor || this.getRandomColor(),
        borderColor: ds.borderColor,
        borderWidth: ds.borderWidth || 1
      }))
    };
    return this.render(chartData, { ...options, type: 'bar' });
  }

  line(labels, datasets, options = {}) {
    const chartData = {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label || `数据集 ${i + 1}`,
        data: ds.data,
        borderColor: ds.borderColor || this.getRandomColor(),
        backgroundColor: ds.backgroundColor || 'rgba(0,0,0,0.1)',
        fill: ds.fill ?? false,
        tension: ds.tension || 0.3
      }))
    };
    return this.render(chartData, { ...options, type: 'line' });
  }

  pie(labels, data, options = {}) {
    const chartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || this.getRandomColors(data.length),
        borderWidth: options.borderWidth || 2
      }]
    };
    return this.render(chartData, { ...options, type: 'pie' });
  }

  doughnut(labels, data, options = {}) {
    const chartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || this.getRandomColors(data.length),
        borderWidth: options.borderWidth || 2
      }]
    };
    return this.render(chartData, { ...options, type: 'doughnut' });
  }

  update(newData) {
    if (!this.chartInstance) return;
    Object.assign(this.chartInstance.data, newData);
    this.chartInstance.update();
  }

  destroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  getRandomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getRandomColors(count, alpha = 1) {
    const colors = [
      `rgba(52, 152, 219, ${alpha})`,
      `rgba(39, 174, 96, ${alpha})`,
      `rgba(241, 196, 15, ${alpha})`,
      `rgba(231, 76, 60, ${alpha})`,
      `rgba(155, 89, 182, ${alpha})`,
      `rgba(26, 188, 156, ${alpha})`,
      `rgba(243, 156, 18, ${alpha})`
    ];
    while (colors.length < count) {
      colors.push(this.getRandomColor(alpha));
    }
    return colors.slice(0, count);
  }
}

export default ChartComponent;
